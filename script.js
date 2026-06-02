// ========================================
// KISHAN KRISHI KENDRA - DEPLOY READY SCRIPT
// Static ecommerce + WhatsApp order + POS
// ========================================
"use strict";

const WHATSAPP_NUMBER = "9779851036309";

const PRODUCTS = [
  { id: 1, name: "Premium Rice Seed", nameNp: "प्रिमियम धान बीउ", category: "seeds", price: 250, unit: "packet", emoji: "🌾", badge: "Seeds", desc: "Quality rice seed for seasonal farming." },
  { id: 2, name: "Tomato Farming Starter Seed", nameNp: "टमाटर बीउ", category: "seeds", price: 180, unit: "packet", emoji: "🍅", badge: "Seeds", desc: "Starter seed option for tomato farming." },
  { id: 3, name: "Organic Compost Fertilizer", nameNp: "अर्गानिक कम्पोस्ट मल", category: "fertilizer", price: 650, unit: "bag", emoji: "🌿", badge: "Organic", desc: "Soil-friendly compost for healthier crops." },
  { id: 4, name: "Liquid Organic Fertilizer", nameNp: "तरल अर्गानिक मल", category: "fertilizer", price: 420, unit: "liter", emoji: "🍃", badge: "Organic", desc: "Liquid organic input for plant growth." },
  { id: 5, name: "Spray Pump", nameNp: "स्प्रे पम्प", category: "tools", price: 1850, unit: "piece", emoji: "🚿", badge: "Tools", desc: "Useful for crop care and plant protection." },
  { id: 6, name: "Nursery Tray", nameNp: "नर्सरी ट्रे", category: "nursery", price: 160, unit: "piece", emoji: "🪴", badge: "Nursery", desc: "For seedling and nursery preparation." },
  { id: 7, name: "Drip Irrigation Pipe", nameNp: "ड्रिप सिँचाइ पाइप", category: "irrigation", price: 950, unit: "roll", emoji: "💧", badge: "Irrigation", desc: "Water-saving irrigation support." },
  { id: 8, name: "Organic Vegetables Basket", nameNp: "अर्गानिक तरकारी बास्केट", category: "organic", price: 999, unit: "basket", emoji: "🥬", badge: "Organic", desc: "Fresh organic vegetables basket." },
  { id: 9, name: "Local Organic Honey", nameNp: "स्थानीय अर्गानिक मह", category: "organic", price: 850, unit: "jar", emoji: "🍯", badge: "Organic", desc: "Nepali local honey for homes and gifting." },
  { id: 10, name: "Organic Pulses / Dal", nameNp: "अर्गानिक दाल", category: "organic", price: 220, unit: "kg", emoji: "🫘", badge: "Organic", desc: "Quality pulses for household and bulk buyers." },
  { id: 11, name: "Crop Support Rope", nameNp: "बाली सपोर्ट डोरी", category: "support", price: 320, unit: "roll", emoji: "🧵", badge: "Support", desc: "Support rope for vegetable farming." },
  { id: 12, name: "Organic Spice Pack", nameNp: "अर्गानिक मसला प्याक", category: "organic", price: 300, unit: "pack", emoji: "🌶️", badge: "Organic", desc: "Local Nepali organic spice pack." }
];

const CROP_RECS = {
  tomato: { title: "Tomato Farming Package", desc: "Recommended items for tomato farming.", items: [2, 6, 3, 7, 11, 5] },
  rice: { title: "Rice Farming Package", desc: "Recommended items for rice farming.", items: [1, 3, 7] },
  potato: { title: "Potato Farming Package", desc: "Recommended items for potato farming.", items: [3, 5, 11] },
  maize: { title: "Maize Farming Package", desc: "Recommended items for maize farming.", items: [3, 5] },
  cucumber: { title: "Cucumber Farming Package", desc: "Recommended items for cucumber farming.", items: [6, 3, 7, 11, 5] },
  cauliflower: { title: "Cauliflower Farming Package", desc: "Recommended items for cauliflower farming.", items: [6, 3, 5] },
  onion: { title: "Onion Farming Package", desc: "Recommended items for onion farming.", items: [3, 5, 7] },
  garlic: { title: "Garlic Farming Package", desc: "Recommended items for garlic farming.", items: [3, 5] },
  terrace: { title: "Terrace Farming Package", desc: "Recommended items for terrace farming.", items: [6, 3, 5, 7] }
};

let cart = JSON.parse(localStorage.getItem("kkk_cart") || "[]");
let posBill = [];
let salesHistory = JSON.parse(localStorage.getItem("kkk_sales") || "[]");
let currentFilter = "all";
let currentLang = localStorage.getItem("kkk_lang") || "en";

const $ = (id) => document.getElementById(id);
const money = (n) => `NPR ${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const productById = (id) => PRODUCTS.find(p => p.id === Number(id));

function showToast(message, type = "success") {
  const toast = $("toast");
  if (!toast) return alert(message);
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.className = "toast", 2600);
}

function encodeLines(lines) {
  return encodeURIComponent(lines.filter(Boolean).join("\n"));
}
function openWhatsApp(lines) {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeLines(lines)}`, "_blank");
}

function initLoading() {
  setTimeout(() => $("loadingScreen")?.classList.add("hidden"), 100);
}
function initHeader() {
  const mobileBtn = $("mobileMenuBtn"), nav = $("mainNav"), header = $("mainHeader");
  mobileBtn?.addEventListener("click", () => {
    nav?.classList.toggle("active");
    mobileBtn.classList.toggle("active");
  });
  document.querySelectorAll(".nav-link").forEach(a => a.addEventListener("click", () => {
    nav?.classList.remove("active"); mobileBtn?.classList.remove("active");
  }));
  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 40);
    $("backToTop")?.classList.toggle("show", window.scrollY > 500);
  });
}
function applyLanguage() {
  const isNp = currentLang === "np";
  document.querySelectorAll(".en-text").forEach(el => el.style.display = isNp ? "none" : "");
  document.querySelectorAll(".np-text").forEach(el => el.style.display = isNp ? "" : "none");
  if ($("langLabel")) $("langLabel").textContent = isNp ? "EN" : "NP";
  localStorage.setItem("kkk_lang", currentLang);
}
function initLanguage() {
  applyLanguage();
  $("langToggle")?.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "np" : "en";
    applyLanguage();
  });
}

function renderProducts(list = PRODUCTS) {
  const grid = $("productsGrid");
  if (!grid) return;
  const query = ((currentLang === "np" ? $("productSearchNp")?.value : $("productSearch")?.value) || "").toLowerCase();
  const filtered = list.filter(p => {
    const matchCat = currentFilter === "all" || p.category === currentFilter;
    const matchText = [p.name, p.nameNp, p.desc, p.category].join(" ").toLowerCase().includes(query);
    return matchCat && matchText;
  });
  $("noProducts").style.display = filtered.length ? "none" : "block";
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-category="${p.category}">
      <div class="product-image"><span class="product-badge ${p.category === 'organic' || p.category === 'fertilizer' ? 'organic' : ''}">${p.badge}</span>${p.emoji}</div>
      <div class="product-info">
        <div class="product-cat">${p.category}</div>
        <h3 class="product-name">${currentLang === "np" ? p.nameNp : p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer"><div><div class="product-price">${money(p.price)}</div><div class="product-unit">per ${p.unit}</div></div>
        <button class="add-to-cart-btn" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Add</button></div>
      </div>
    </div>`).join("");
}
function initShop() {
  $("productSearch")?.addEventListener("input", () => renderProducts());
  $("productSearchNp")?.addEventListener("input", () => renderProducts());
  document.querySelectorAll(".filter-btn,.cat-card").forEach(btn => btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter || btn.dataset.cat || "all";
    document.querySelectorAll(".filter-btn,.cat-card").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(`[data-filter="${currentFilter}"],[data-cat="${currentFilter}"]`).forEach(b => b.classList.add("active"));
    renderProducts();
  }));
}

function saveCart(){ localStorage.setItem("kkk_cart", JSON.stringify(cart)); renderCart(); }
function addToCart(id){ const item = cart.find(i => i.id === id); item ? item.qty++ : cart.push({id, qty:1}); saveCart(); showToast("Product added to cart"); }
function changeCartQty(id, delta){ const item = cart.find(i => i.id === id); if(!item) return; item.qty += delta; if(item.qty <= 0) cart = cart.filter(i => i.id !== id); saveCart(); }
function renderCart(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const subtotal = cart.reduce((s,i)=>s+(productById(i.id)?.price||0)*i.qty,0);
  if ($("cartBadge")) $("cartBadge").textContent = count;
  if ($("cartSubtotal")) $("cartSubtotal").textContent = money(subtotal);
  if ($("cartTotal")) $("cartTotal").textContent = money(subtotal);
  if ($("cartFooter")) $("cartFooter").style.display = cart.length ? "block" : "none";
  const box = $("cartItems"); if(!box) return;
  if (!cart.length) { box.innerHTML = `<div class="cart-empty"><div class="empty-icon">🛒</div><p>Your cart is empty</p><a href="#shop" class="btn-primary-sm">Start Shopping</a></div>`; return; }
  box.innerHTML = cart.map(i => { const p = productById(i.id); return `
    <div class="cart-item"><div class="cart-item-emoji">${p.emoji}</div><div class="cart-item-info"><div class="cart-item-name">${p.name}</div><div class="cart-item-unit">${p.unit}</div><div class="cart-item-price">${money(p.price*i.qty)}</div></div>
    <div class="cart-item-controls"><button class="qty-btn" onclick="changeCartQty(${i.id},-1)">−</button><span class="qty-display">${i.qty}</span><button class="qty-btn" onclick="changeCartQty(${i.id},1)">+</button><button class="remove-btn" onclick="changeCartQty(${i.id},-${i.qty})"><i class="fas fa-trash"></i></button></div></div>`; }).join("");
}
function toggleCart(open) { $("cartSidebar")?.classList.toggle("open", open); $("cartOverlay")?.classList.toggle("active", open); }
function cartLines(prefix="Online Order"){
  const subtotal = cart.reduce((s,i)=>s+(productById(i.id)?.price||0)*i.qty,0);
  return [prefix, "", ...cart.map(i=>{const p=productById(i.id); return `${p.name} x ${i.qty} = NPR ${p.price*i.qty}`}), "", `Subtotal: NPR ${subtotal}`, "Delivery: All Nepal Delivery"];
}
function initCart(){
  renderCart();
  $("cartToggle")?.addEventListener("click", () => toggleCart(true));
  $("cartClose")?.addEventListener("click", () => toggleCart(false));
  $("cartOverlay")?.addEventListener("click", () => toggleCart(false));
  $("whatsappOrder")?.addEventListener("click", () => { if(!cart.length) return showToast("Cart is empty", "error"); openWhatsApp(cartLines("Kishan Krishi Kendra Cart Order")); });
  $("proceedCheckout")?.addEventListener("click", () => { if(!cart.length) return showToast("Cart is empty", "error"); renderCheckoutSummary(); $("checkoutModal").style.display="flex"; });
  $("closeCheckout")?.addEventListener("click", () => $("checkoutModal").style.display="none");
}
function renderCheckoutSummary(){
  const subtotal = cart.reduce((s,i)=>s+(productById(i.id)?.price||0)*i.qty,0);
  if ($("checkoutSummary")) $("checkoutSummary").innerHTML = `<h4>Order Summary</h4>${cart.map(i=>{const p=productById(i.id);return `<div class="summary-row"><span>${p.name} × ${i.qty}</span><span>${money(p.price*i.qty)}</span></div>`}).join("")}<div class="summary-row total"><span>Total</span><span>${money(subtotal)}</span></div>`;
}
function initCheckout(){
  document.querySelectorAll(".pm-option").forEach(opt => opt.addEventListener("click", () => { document.querySelectorAll(".pm-option").forEach(o=>o.classList.remove("active")); opt.classList.add("active"); }));
  $("checkoutForm")?.addEventListener("submit", e => {
    e.preventDefault(); if(!cart.length) return showToast("Cart is empty", "error");
    const pay = document.querySelector('input[name="payMethod"]:checked')?.value || "cod";
    openWhatsApp(["Kishan Krishi Kendra Online Order", "", `Customer: ${$("chkName").value}`, `Phone: ${$("chkPhone").value}`, `Address: ${$("chkAddress").value}`, `Delivery: ${$("chkDelivery").value}`, `Payment: ${pay}`, `Note: ${$("chkNote").value}`, "", ...cartLines("Items:").slice(2)]);
  });
}

function initCropAdvisor(){
  document.querySelectorAll(".crop-card").forEach(card => card.addEventListener("click", () => {
    document.querySelectorAll(".crop-card").forEach(c=>c.classList.remove("active")); card.classList.add("active");
    const rec = CROP_RECS[card.dataset.crop]; if(!rec) return;
    $("cropRecommendations").style.display = "block"; $("recTitle").textContent = rec.title; $("recDesc").textContent = rec.desc;
    $("recProducts").innerHTML = rec.items.map(id=>{const p=productById(id); return `<div class="rec-product-card"><div class="rec-product-emoji">${p.emoji}</div><h4>${p.name}</h4><p>${money(p.price)} / ${p.unit}</p><button class="add-to-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button></div>`}).join("");
    $("cropRecommendations").scrollIntoView({behavior:"smooth", block:"nearest"});
  }));
}

function field(id){ return $(id)?.value || ""; }
function initForms(){
  $("farmerForm")?.addEventListener("submit", e => { e.preventDefault(); openWhatsApp(["Farmer Product Submission", "", `Name: ${field('farmerName')}`, `Phone: ${field('farmerPhone')}`, `District: ${field('farmerDistrict')}`, `Product: ${field('farmerProduct')}`, `Quantity: ${field('farmerQuantity')}`, `Expected Price: ${field('farmerPrice')}`, `Harvest Date: ${field('farmerHarvest')}`, `Method: ${field('farmerMethod')}`, `Pickup: ${field('farmerPickup')}`, `Message: ${field('farmerMessage')}`]); });
  $("dealerForm")?.addEventListener("submit", e => { e.preventDefault(); openWhatsApp(["Sub-Dealer Registration", "", `Business: ${field('dealerBusiness')}`, `Owner: ${field('dealerOwner')}`, `Phone: ${field('dealerPhone')}`, `District: ${field('dealerDistrict')}`, `PAN/VAT: ${field('dealerPan')}`, `Shop Type: ${field('dealerShopType')}`, `Monthly Capacity: ${field('dealerCapacity')}`, `Products: ${field('dealerProducts')}`, `Message: ${field('dealerMessage')}`]); });
  $("bulkForm")?.addEventListener("submit", e => { e.preventDefault(); openWhatsApp(["Bulk / Corporate Inquiry", "", `Company: ${field('bulkCompany')}`, `Contact: ${field('bulkContact')}`, `Phone: ${field('bulkPhone')}`, `Email: ${field('bulkEmail')}`, `Product: ${field('bulkProduct')}`, `Quantity: ${field('bulkQuantity')}`, `Delivery: ${field('bulkDelivery')}`, `Message: ${field('bulkMessage')}`]); });
  $("contactForm")?.addEventListener("submit", e => { e.preventDefault(); openWhatsApp(["General Inquiry", "", `Name: ${field('contactName')}`, `Phone: ${field('contactPhone')}`, `Email: ${field('contactEmail')}`, `Subject: ${field('contactSubject')}`, `Message: ${field('contactMessage')}`]); });
}

function setPOSDateTime(){ if($("posDateTime")) $("posDateTime").textContent = new Date().toLocaleString(); }
function renderPOSProducts(){
  const q = ($("posSearch")?.value || "").toLowerCase();
  const list = PRODUCTS.filter(p => [p.name,p.nameNp,p.category].join(" ").toLowerCase().includes(q));
  if($("posProductList")) $("posProductList").innerHTML = list.map(p=>`<div class="pos-product-card"><div class="pos-product-emoji">${p.emoji}</div><div class="pos-product-info"><div class="pos-product-name">${p.name}</div><div class="pos-product-price">${money(p.price)} / ${p.unit}</div></div><button class="pos-add-btn" onclick="addToPOS(${p.id})">Add</button></div>`).join("");
}
function addToPOS(id){ const item = posBill.find(i=>i.id===id); item ? item.qty++ : posBill.push({id, qty:1}); renderPOSBill(); }
function changePOSQty(id, delta){ const item = posBill.find(i=>i.id===id); if(!item) return; item.qty += delta; if(item.qty<=0) posBill = posBill.filter(i=>i.id!==id); renderPOSBill(); }
function posTotals(){ const subtotal = posBill.reduce((s,i)=>s+(productById(i.id)?.price||0)*i.qty,0); const d=Number($("posDiscount")?.value||0); const type=$("posDiscountType")?.value||"flat"; const discount = type==="percent" ? subtotal*d/100 : d; const total=Math.max(0, subtotal-discount); const paid=Number($("posPaid")?.value||0); return {subtotal, discount, total, paid, change: paid-total}; }
function renderPOSBill(){
  const box=$("posBillItems"); const t=posTotals();
  if($("posSubtotal")) $("posSubtotal").textContent=money(t.subtotal); if($("posTotal")) $("posTotal").textContent=money(t.total); if($("posChange")) $("posChange").textContent=money(t.change); if($("changeDueLabel")) $("changeDueLabel").textContent=t.change>=0?"Change":"Due";
  if(!box) return; if(!posBill.length){ box.innerHTML=`<div class="pos-empty-bill"><div class="pos-empty-icon">🧾</div><p>Search and add products to bill</p></div>`; return; }
  box.innerHTML=posBill.map(i=>{const p=productById(i.id); return `<div class="pos-bill-item"><div class="pos-bi-emoji">${p.emoji}</div><div class="pos-bi-info"><div class="pos-bi-name">${p.name}</div><div class="pos-bi-price">${money(p.price)} × ${i.qty}</div></div><div class="pos-bi-controls"><button class="qty-btn" onclick="changePOSQty(${i.id},-1)">−</button><span>${i.qty}</span><button class="qty-btn" onclick="changePOSQty(${i.id},1)">+</button></div><div class="pos-bi-total">${money(p.price*i.qty)}</div></div>`}).join("");
}
function createInvoiceHTML(sale){
  return `<div class="invoice-container"><div class="invoice-header"><div class="invoice-logo">🌿</div><div class="invoice-company">Kishan Krishi Kendra</div><div class="invoice-pvt">Pvt. Ltd.</div><div class="invoice-address">CTC Mall, Sundhara, Kathmandu | +977-9851036309</div></div><div class="invoice-meta"><div><strong>Invoice:</strong> ${sale.id}</div><div><strong>Date:</strong> ${sale.date}</div></div><div><strong>Customer:</strong> ${sale.customer || 'Walk-in Customer'}</div><div class="invoice-items"><table><thead><tr><th>Product</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead><tbody>${sale.items.map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>${money(i.price)}</td><td>${money(i.price*i.qty)}</td></tr>`).join("")}</tbody></table></div><div class="invoice-totals"><div class="invoice-total-row"><span>Subtotal</span><span>${money(sale.subtotal)}</span></div><div class="invoice-total-row"><span>Discount</span><span>${money(sale.discount)}</span></div><div class="invoice-total-row grand"><span>Total</span><span>${money(sale.total)}</span></div><div class="invoice-total-row"><span>Paid</span><span>${money(sale.paid)}</span></div><div class="invoice-total-row"><span>Change/Due</span><span>${money(sale.change)}</span></div><div class="invoice-total-row"><span>Payment</span><span>${sale.payment}</span></div></div><div class="invoice-footer">Thank you for shopping with Kishan Krishi Kendra.</div></div>`;
}
function currentSale(){ const t=posTotals(); return { id:`KKK-${Date.now()}`, date:new Date().toLocaleString(), customer: field('posCustomer') || 'Walk-in Customer', payment: document.querySelector('input[name="posPayment"]:checked')?.value || 'cash', subtotal:t.subtotal, discount:t.discount, total:t.total, paid:t.paid, change:t.change, items: posBill.map(i=>{const p=productById(i.id); return {id:i.id, name:p.name, qty:i.qty, price:p.price};}) }; }
function initPOS(){
  renderPOSProducts(); renderPOSBill(); setPOSDateTime(); setInterval(setPOSDateTime,1000);
  $("posSearch")?.addEventListener("input", renderPOSProducts); $("posDiscount")?.addEventListener("input", renderPOSBill); $("posDiscountType")?.addEventListener("change", renderPOSBill); $("posPaid")?.addEventListener("input", renderPOSBill);
  document.querySelectorAll(".pos-pay-opt").forEach(opt=>opt.addEventListener("click",()=>{document.querySelectorAll(".pos-pay-opt").forEach(o=>o.classList.remove("active")); opt.classList.add("active");}));
  $("clearPOS")?.addEventListener("click",()=>{posBill=[]; if($("posDiscount")) $("posDiscount").value=""; if($("posPaid")) $("posPaid").value=""; if($("posCustomer")) $("posCustomer").value=""; renderPOSBill();});
  $("saveSale")?.addEventListener("click",()=>{ if(!posBill.length) return showToast("POS bill is empty", "error"); const sale=currentSale(); salesHistory.unshift(sale); localStorage.setItem("kkk_sales", JSON.stringify(salesHistory.slice(0,100))); showToast("Sale saved"); $("invoiceContent").innerHTML=createInvoiceHTML(sale); $("invoiceModal").style.display="flex"; });
  $("printInvoice")?.addEventListener("click",()=>{ if(!posBill.length) return showToast("POS bill is empty", "error"); $("invoiceContent").innerHTML=createInvoiceHTML(currentSale()); $("invoiceModal").style.display="flex"; setTimeout(()=>window.print(),300); });
  $("closeInvoice")?.addEventListener("click",()=>$("invoiceModal").style.display="none");
  $("viewSalesHistory")?.addEventListener("click",()=>{ renderSalesHistory(); $("salesHistoryModal").style.display="flex"; });
  $("closeSalesHistory")?.addEventListener("click",()=>$("salesHistoryModal").style.display="none");
}
function renderSalesHistory(){
  const box=$("salesHistoryContent"); if(!box) return; if(!salesHistory.length){ box.innerHTML="<p>No sales saved yet.</p>"; return; }
  box.innerHTML = salesHistory.map(s=>`<div class="sales-row"><div><strong>${s.customer}</strong><br><small>${s.date} | ${s.payment}</small></div><strong>${money(s.total)}</strong><button class="pos-btn-sm" onclick="document.getElementById('invoiceContent').innerHTML=createInvoiceHTML(salesHistory.find(x=>x.id==='${s.id}'));document.getElementById('invoiceModal').style.display='flex'">View</button></div>`).join("");
}
function initMisc(){
  $("backToTop")?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  document.querySelectorAll(".modal-overlay").forEach(m=>m.addEventListener("click",e=>{ if(e.target===m) m.style.display="none"; }));
}

document.addEventListener("DOMContentLoaded", () => {
  initLoading(); initHeader(); initLanguage(); initCart(); renderProducts(); initShop(); initCropAdvisor(); initForms(); initCheckout(); initPOS(); initMisc();
});
