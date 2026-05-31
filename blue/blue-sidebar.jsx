// ============================================================
// blue-sidebar.jsx — left nav + saved chat history list
// ============================================================
function Sidebar(props) {
  const user = props.user, chats = props.chats, currentId = props.currentId;
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">Blue</span>
        </div>
        <button className="new-chat" onClick={props.onNew}>
          <IconPlus size={16} /> New chat
        </button>
      </div>

      <div className="chat-list">
        {chats.length === 0 && <p className="chat-list-empty">No chats yet</p>}
        {chats.map(function (c) {
          return (
            <div key={c.id}
              className={"chat-item" + (c.id === currentId ? " is-active" : "")}
              onClick={function () { props.onSelect(c.id); }}>
              <span className="chat-item-title">{c.title || "New chat"}</span>
              <button className="chat-item-del" title="Delete chat"
                onClick={function (e) { e.stopPropagation(); props.onDelete(c.id); }}>
                <IconTrash size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="sidebar-bottom">
        <div className="conn-status">
          <span className={"conn-dot" + (props.connected ? " is-on" : "")} />
          {props.connected ? "n8n connected" : "Demo mode (no webhook)"}
        </div>
        <div className="user-row">
          <div className="avatar">{(user.email[0] || "u").toUpperCase()}</div>
          <span className="user-email">{user.email}</span>
          <button className="icon-btn" title="Log out" onClick={props.onLogout}>
            <IconLogout size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
