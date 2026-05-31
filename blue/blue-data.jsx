// ============================================================
// blue-data.jsx — config, models, seed data, persistence + helpers
// ============================================================

// 🔵🔵🔵  PASTE YOUR n8n WEBHOOK URL BETWEEN THE QUOTES BELOW.  🔵🔵🔵
// Leave it as "" to run in local "demo mode" (canned replies, no network).
// Use your n8n *Production* URL, e.g. https://you.app.n8n.cloud/webhook/blue
const WEBHOOK_URL = "";

// Model picker options (the selected `id` is sent to n8n as `model`).
const MODELS = [
  { id: "blue-fast",  name: "Blue Fast",  hint: "Quick everyday answers" },
  { id: "blue-smart", name: "Blue Smart", hint: "Balanced reasoning" },
  { id: "blue-pro",   name: "Blue Pro",   hint: "Most capable" },
];

// Effort / thinking picker (sent to n8n as `effort`).
const EFFORTS = [
  { id: "low",    name: "Low",    hint: "Fast, lighter answers" },
  { id: "medium", name: "Medium", hint: "Balanced" },
  { id: "high",   name: "High",   hint: "Most thorough" },
];

// ---- tiny helpers ----
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function nowTs() { return Date.now(); }
function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function isWebhookConfigured() {
  return typeof WEBHOOK_URL === "string" && WEBHOOK_URL.trim().length > 0;
}
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
function displayName(user) {
  const lp = ((user && user.email) || "there").split("@")[0];
  return lp.charAt(0).toUpperCase() + lp.slice(1);
}

// ---- localStorage persistence (chat history is saved per user email) ----
const LS_USER  = "blue.user.v1";
const LS_CHATS = "blue.chats.v1";

function loadUser() {
  try { return JSON.parse(localStorage.getItem(LS_USER) || "null"); }
  catch (e) { return null; }
}
function saveUser(user) {
  if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
  else localStorage.removeItem(LS_USER);
}
function loadChats(email) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_CHATS) || "{}");
    return all[email] || [];
  } catch (e) { return []; }
}
function saveChats(email, chats) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem(LS_CHATS) || "{}"); } catch (e) {}
  all[email] = chats;
  localStorage.setItem(LS_CHATS, JSON.stringify(all));
}

// ---- seed "Recents" so a fresh account looks alive in the demo ----
function seedChat(title, u, a) {
  const t = nowTs();
  return {
    id: uid(), title: title, createdAt: t, updatedAt: t,
    messages: [
      { id: uid(), role: "user", content: u, ts: t },
      { id: uid(), role: "assistant", content: a, ts: t },
    ],
  };
}
function seedChats() {
  return [
    seedChat("Weekend trip to Lisbon",
      "Plan a relaxed 3-day weekend trip to Lisbon.",
      "Sounds great! Day 1: Alfama + a sunset at Miradouro de Santa Luzia. Day 2: Belém (pastéis!) and the Tower. Day 3: a day trip to Sintra. Want me to add restaurants?"),
    seedChat("Rewrite my cover letter",
      "Can you make my cover letter sound more confident?",
      "Absolutely — paste your current draft and I'll tighten the tone, lead with your strongest achievement, and cut filler."),
    seedChat("Explain attention mechanisms",
      "Explain attention in transformers simply.",
      "Think of attention as the model deciding which words to 'look at' when understanding each word — it weighs every other word by relevance, then blends them."),
    seedChat("Dinner from what's in my fridge",
      "I have eggs, spinach and feta. Dinner idea?",
      "A quick spinach & feta frittata: whisk the eggs, wilt the spinach, crumble the feta, pour in, and finish under the grill. 15 minutes."),
    seedChat("Q3 OKR draft",
      "Help me draft Q3 OKRs for a small product team.",
      "Here's a starting frame — 1 ambitious Objective with 3 measurable Key Results. Tell me your focus area and I'll fill it in."),
  ];
}

// ---- demo fallback reply (used ONLY when WEBHOOK_URL is empty) ----
function fakeReply(userText) {
  const t = (userText || "").trim();
  const canned = [
    'You said: "' + t + '". I\'m Blue running in demo mode — paste your n8n webhook URL in blue/blue-data.jsx to get real answers.',
    "Good question! (Demo-mode reply.) Once your n8n webhook is connected, this becomes a real AI response.",
    "I hear you. This is a placeholder answer so you can see the UI working before n8n is wired up.",
  ];
  return canned[Math.floor(Math.random() * canned.length)];
}

// ---- pull the reply text out of whatever shape n8n returns ----
function extractReply(data) {
  if (data == null) return "";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const r = extractReply(data[i]);
      if (r) return r;
    }
    return "";
  }
  if (typeof data === "object") {
    const keys = ["reply", "output", "text", "message", "answer", "content", "response"];
    for (let i = 0; i < keys.length; i++) {
      const v = data[keys[i]];
      if (typeof v === "string" && v.trim()) return v;
    }
    if (data.data)   { const r = extractReply(data.data);   if (r) return r; }
    if (data.json)   { const r = extractReply(data.json);   if (r) return r; }
    if (data.result) { const r = extractReply(data.result); if (r) return r; }
  }
  return "";
}
