// ========================================
// KISHAN KRISHI KENDRA - DEPLOY READY SCRIPT
// Static ecommerce + WhatsApp order + POS
// ========================================
"use strict";

const WHATSAPP_NUMBER = "9779851036309";

const PRODUCTS = [
  { id: 1, name: "Premium Rice Seed", nameNp: "प्रिमियम धान बीउ", category: "seeds", price: 250, unit: "packet", emoji: "🌾", badge: "Seeds", desc: "Quality rice seed for seasonal farming." },
  { id: 2, name: "Tomato Farming Starter Seed", nameNp: "टमाटर बीउ", category: "seeds", price: 180, unit: "packet", emoji: "🍅", badge: "Seeds", desc: "Starter seed option for tomato farming." },
  { id: 3, name: "Organic Compost Fertilizer", nameNp: "अर्गानिक कम्पोस्ट मल", category: "fertilizer", price: 650, unit: "bag", emoji: "🌿", badge: "Organic", desc: "Soil-friendly compost for Healthier crops." },
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