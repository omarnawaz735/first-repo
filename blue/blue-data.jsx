// ============================================================
// blue-data.jsx — config, models, persistence + helpers
// ============================================================

// 🔵🔵🔵  PASTE YOUR n8n WEBHOOK URL BETWEEN THE QUOTES BELOW.  🔵🔵🔵
// Leave it as "" to run in local "demo mode" (canned replies, no network).
// Use your n8n *Production* URL, e.g. https://you.app.n8n.cloud/webhook/blue
const WEBHOOK_URL = "";

// Models shown in the composer's picker. The selected `id` is sent to n8n
// as `model`, so your workflow can branch behaviour on it if you want.
const MODELS = [
  { id: "blue-fast",  name: "Blue Fast",  hint: "Quick everyday answers" },
  { id: "blue-smart", name: "Blue Smart", hint: "Deeper reasoning" },
  { id: "blue-pro",   name: "Blue Pro",   hint: "Most capable" },
];

// ---- tiny helpers ----
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function nowTs() { return Date.now(); }
function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function isWebhookConfigured() {
  return typeof WEBHOOK_URL === "string" && WEBHOOK_URL.trim().length > 0;
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
// Handles: plain strings, { reply | output | text | message | answer | content | response },
// nested { data:{...} } / { json:{...} } / { result:{...} }, and arrays like [{ output: "..." }].
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
