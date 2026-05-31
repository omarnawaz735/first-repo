// ============================================================
// blue-sidebar.jsx — left nav + Recents + user
// ============================================================
function Sidebar(props) {
  const chats = props.chats, currentId = props.currentId;
  const navItems = [
    { key: "new",       Icon: IconNew,      label: "New chat" },
    { key: "chats",     Icon: IconChat,     label: "Chats" },
    { key: "projects",  Icon: IconProjects, label: "Projects" },
    { key: "artifacts", Icon: IconSparkle,  label: "Artifacts" },
  ];

  function onNav(key) {
    if (key === "new" || key === "chats") props.onNew();
    // "projects" / "artifacts" are visual in this demo
  }

  return (
    <aside className="sidebar">
      <div className="sb-head">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">Blue</span>
        </div>
        <div className="sb-head-actions">
          <button className="icon-btn" title="Search"><IconSearch size={18} /></button>
          <button className="icon-btn" title="Hide sidebar" onClick={props.onClose}><IconSidebar size={18} /></button>
        </div>
      </div>

      <nav className="sb-nav">
        {navItems.map(function (it) {
          const active = it.key === "new" && !currentId;
          const ItIcon = it.Icon;
          return (
            <button key={it.key} className={"nav-item" + (active ? " is-active" : "")}
              onClick={function () { onNav(it.key); }}>
              <ItIcon size={18} /><span>{it.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sb-recents">
        <div className="sb-label">Recents</div>
        <div className="recent-list">
          {chats.map(function (c) {
            return (
              <button key={c.id} className={"recent" + (c.id === currentId ? " is-active" : "")}
                onClick={function () { props.onSelect(c.id); }}>
                <span className="recent-title">{c.title || "New chat"}</span>
                <span className="recent-del" title="Delete chat"
                  onClick={function (e) { e.stopPropagation(); props.onDelete(c.id); }}>
                  <IconTrash size={14} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sb-foot">
        <div className="conn">
          <span className={"conn-dot" + (props.connected ? " is-on" : "")} />
          {props.connected ? "n8n connected" : "Demo mode"}
        </div>
        <div className="sb-user">
          <div className="avatar">{(props.name[0] || "U").toUpperCase()}</div>
          <div className="sb-user-meta">
            <span className="sb-user-name">{props.name}</span>
            <span className="sb-user-plan">Free plan</span>
          </div>
          <button className="icon-btn" title="Log out" onClick={props.onLogout}><IconLogout size={18} /></button>
        </div>
      </div>
    </aside>
  );
}
