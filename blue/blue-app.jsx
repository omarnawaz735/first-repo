// ============================================================
// blue-app.jsx — root component: state, routing, send/respond
// ============================================================

// respond() is the ONE place the app talks to your AI.
// - If WEBHOOK_URL is set (blue/blue-data.jsx) it POSTs to n8n.
// - If it's empty, it falls back to fakeReply() so the demo still works.
async function respond(message, history, model) {
  if (isWebhookConfigured()) {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, history: history, model: model }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const ct = res.headers.get("content-type") || "";
    const data = ct.indexOf("application/json") !== -1 ? await res.json() : await res.text();
    const reply = extractReply(data);
    if (!reply) throw new Error("Could not find a reply field in the n8n response");
    return reply;
  }
  // demo mode
  await delay(500 + Math.random() * 500);
  return fakeReply(message);
}

function App() {
  const { useState, useEffect } = React;
  const [user, setUser]           = useState(function () { return loadUser(); });
  const [chats, setChats]         = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [draft, setDraft]         = useState("");
  const [model, setModel]         = useState(MODELS[0].id);
  const [typing, setTyping]       = useState(false);

  // load this user's saved chats whenever they log in / out
  useEffect(function () {
    if (user) { setChats(loadChats(user.email)); }
    else { setChats([]); }
    setCurrentId(null);
    setDraft("");
  }, [user]);

  // persist chats to localStorage whenever they change
  useEffect(function () {
    if (user) saveChats(user.email, chats);
  }, [chats, user]);

  const current = chats.find(function (c) { return c.id === currentId; }) || null;

  function handleAuth(u)   { saveUser(u); setUser(u); }
  function handleLogout()  { saveUser(null); setUser(null); }
  function newChat()       { setCurrentId(null); setDraft(""); }
  function selectChat(id)  { setCurrentId(id); setDraft(""); }
  function deleteChat(id) {
    setChats(function (prev) { return prev.filter(function (c) { return c.id !== id; }); });
    if (id === currentId) setCurrentId(null);
  }

  async function send(text) {
    const clean = (text || "").trim();
    if (!clean || typing) return;
    setDraft("");

    // make sure a chat exists, then append the user's message
    let chatId = currentId;
    let baseChats = chats;
    if (!chatId) {
      chatId = uid();
      const title = clean.slice(0, 40) + (clean.length > 40 ? "…" : "");
      baseChats = [{ id: chatId, title: title, messages: [], createdAt: nowTs(), updatedAt: nowTs() }].concat(chats);
      setCurrentId(chatId);
    }
    const userMsg = { id: uid(), role: "user", content: clean, ts: nowTs() };
    const withUser = baseChats.map(function (c) {
      return c.id === chatId
        ? Object.assign({}, c, { messages: c.messages.concat([userMsg]), updatedAt: nowTs() })
        : c;
    });
    setChats(withUser);

    // recent conversation context for n8n (prior turns, excluding the new message)
    const thread = withUser.find(function (c) { return c.id === chatId; });
    const history = thread.messages.slice(0, -1).slice(-20).map(function (m) {
      return { role: m.role, content: m.content };
    });

    setTyping(true);
    try {
      const reply = await respond(clean, history, model);
      appendMessage(chatId, { id: uid(), role: "assistant", content: reply, ts: nowTs() });
    } catch (err) {
      console.error("Blue: respond() failed —", err);
      appendMessage(chatId, {
        id: uid(), role: "assistant", ts: nowTs(),
        content: "⚠️ Sorry — I couldn't reach the AI service. Check that your n8n webhook is running and that CORS is allowed, then try again.",
      });
    } finally {
      setTyping(false);
    }
  }

  function appendMessage(chatId, msg) {
    setChats(function (prev) {
      return prev.map(function (c) {
        return c.id === chatId
          ? Object.assign({}, c, { messages: c.messages.concat([msg]), updatedAt: nowTs() })
          : c;
      });
    });
  }

  if (!user) {
    return <Login onAuth={handleAuth} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        user={user} chats={chats} currentId={currentId}
        onNew={newChat} onSelect={selectChat} onDelete={deleteChat}
        onLogout={handleLogout} connected={isWebhookConfigured()} />
      <main className="main">
        {current
          ? <Chat chat={current} typing={typing} draft={draft} setDraft={setDraft}
              onSend={send} model={model} setModel={setModel} />
          : <Home user={user} draft={draft} setDraft={setDraft}
              onSend={send} model={model} setModel={setModel} />}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
