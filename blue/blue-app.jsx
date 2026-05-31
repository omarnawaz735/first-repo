// ============================================================
// blue-app.jsx — root component: state, routing, send/respond
// ============================================================

// respond() is the ONE place the app talks to your AI.
// - If WEBHOOK_URL is set (blue/blue-data.jsx) it POSTs to n8n.
// - If it's empty, it falls back to fakeReply() so the demo still works.
async function respond(message, history, model, effort) {
  if (isWebhookConfigured()) {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, history: history, model: model, effort: effort }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const ct = res.headers.get("content-type") || "";
    const data = ct.indexOf("application/json") !== -1 ? await res.json() : await res.text();
    const reply = extractReply(data);
    if (!reply) throw new Error("Could not find a reply field in the n8n response");
    return reply;
  }
  await delay(500 + Math.random() * 500);
  return fakeReply(message);
}

function App() {
  const { useState, useEffect } = React;
  const [user, setUser]           = useState(function () { return loadUser(); });
  const [chats, setChats]         = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [draft, setDraft]         = useState("");
  const [model, setModel]         = useState("blue-pro");
  const [effort, setEffort]       = useState("high");
  const [typing, setTyping]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(function () { return window.innerWidth > 900; });

  // load (or seed) this user's chats on login
  useEffect(function () {
    if (user) {
      let cs = loadChats(user.email);
      if (!cs || cs.length === 0) { cs = seedChats(); saveChats(user.email, cs); }
      setChats(cs);
    } else {
      setChats([]);
    }
    setCurrentId(null);
    setDraft("");
  }, [user]);

  // persist chats whenever they change
  useEffect(function () {
    if (user) saveChats(user.email, chats);
  }, [chats, user]);

  // keep sidebar sensible across screen sizes
  useEffect(function () {
    function onResize() { setSidebarOpen(window.innerWidth > 900); }
    window.addEventListener("resize", onResize);
    return function () { window.removeEventListener("resize", onResize); };
  }, []);

  const current = chats.find(function (c) { return c.id === currentId; }) || null;
  const name = user ? displayName(user) : "";

  function closeOnMobile() { if (window.innerWidth <= 900) setSidebarOpen(false); }
  function handleAuth(u)  { saveUser(u); setUser(u); }
  function handleLogout() { saveUser(null); setUser(null); }
  function newChat()      { setCurrentId(null); setDraft(""); closeOnMobile(); }
  function selectChat(id) { setCurrentId(id); setDraft(""); closeOnMobile(); }
  function onChip(prompt) { setDraft(prompt); }
  function deleteChat(id) {
    setChats(function (prev) { return prev.filter(function (c) { return c.id !== id; }); });
    if (id === currentId) setCurrentId(null);
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

  async function send(text) {
    const clean = (text || "").trim();
    if (!clean || typing) return;
    setDraft("");

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

    const thread = withUser.find(function (c) { return c.id === chatId; });
    const history = thread.messages.slice(0, -1).slice(-20).map(function (m) {
      return { role: m.role, content: m.content };
    });

    setTyping(true);
    try {
      const reply = await respond(clean, history, model, effort);
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

  if (!user) {
    return <Login onAuth={handleAuth} />;
  }

  return (
    <div className={"app-shell " + (sidebarOpen ? "sb-open" : "sb-closed")}>
      <Sidebar
        name={name} chats={chats} currentId={currentId}
        onNew={newChat} onSelect={selectChat} onDelete={deleteChat}
        onLogout={handleLogout} onClose={function () { setSidebarOpen(false); }}
        connected={isWebhookConfigured()} />

      <div className="scrim" onClick={function () { setSidebarOpen(false); }} />

      <main className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" title="Menu" onClick={function () { setSidebarOpen(true); }}>
            <IconMenu size={20} />
          </button>
          <div className="topbar-brand">
            <span className="brand-dot" /><span className="brand-name">Blue</span>
          </div>
          <div className="topbar-spacer" />
          <button className="new-btn" onClick={newChat}><IconNew size={15} /><span>New</span></button>
        </header>

        {current
          ? <Chat chat={current} typing={typing} draft={draft} setDraft={setDraft} onSend={send}
              model={model} setModel={setModel} effort={effort} setEffort={setEffort} />
          : <Home name={name} draft={draft} setDraft={setDraft} onSend={send} onChip={onChip}
              model={model} setModel={setModel} effort={effort} setEffort={setEffort} />}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
