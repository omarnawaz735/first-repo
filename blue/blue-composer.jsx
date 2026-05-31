// ============================================================
// blue-composer.jsx — chat input (+, effort, model, send)
// ============================================================
function Composer(props) {
  const { useState, useRef, useEffect } = React;
  const draft = props.draft, setDraft = props.setDraft, onSend = props.onSend;
  const model = props.model, setModel = props.setModel;
  const effort = props.effort, setEffort = props.setEffort;

  const [openMenu, setOpenMenu] = useState(null); // "effort" | "model" | null
  const taRef = useRef(null);
  const curModel = MODELS.find(function (m) { return m.id === model; }) || MODELS[MODELS.length - 1];
  const curEffort = EFFORTS.find(function (e) { return e.id === effort; }) || EFFORTS[EFFORTS.length - 1];
  const has = !!(draft || "").trim();

  useEffect(function () {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [draft]);

  useEffect(function () {
    if (props.autoFocus && taRef.current) taRef.current.focus();
  }, [props.autoFocus]);

  function submit() {
    const text = (draft || "").trim();
    if (!text || props.disabled) return;
    onSend(text);
  }
  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  function Menu(kind, list, currentId, choose) {
    return (
      <div className={"menu" + (kind === "model" ? " menu-right" : "")} onMouseLeave={function () { setOpenMenu(null); }}>
        {list.map(function (o) {
          return (
            <button key={o.id} type="button"
              className={"menu-opt" + (o.id === currentId ? " is-active" : "")}
              onClick={function () { choose(o.id); setOpenMenu(null); }}>
              <span className="menu-opt-name">{o.name}</span>
              <span className="menu-opt-hint">{o.hint}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="composer">
      <div className="composer-box">
        <textarea ref={taRef} className="composer-input" rows={1}
          placeholder="How can Blue help today?" value={draft}
          onChange={function (e) { setDraft(e.target.value); }} onKeyDown={onKey} />

        <div className="composer-bar">
          <button type="button" className="round-btn" title="Attach (coming soon)">
            <IconPlus size={18} />
          </button>

          <div className="composer-tools">
            <div className="picker">
              <button type="button" className="picker-btn ghost"
                onClick={function () { setOpenMenu(openMenu === "effort" ? null : "effort"); }}>
                {curEffort.name} <IconChevron size={14} />
              </button>
              {openMenu === "effort" && Menu("effort", EFFORTS, effort, setEffort)}
            </div>

            <div className="picker">
              <button type="button" className="picker-btn pill"
                onClick={function () { setOpenMenu(openMenu === "model" ? null : "model"); }}>
                {curModel.name} <IconChevron size={14} />
              </button>
              {openMenu === "model" && Menu("model", MODELS, model, setModel)}
            </div>

            <button type="button" className={"send-round" + (has ? " is-ready" : "")}
              onClick={submit} disabled={props.disabled || !has} title="Send">
              <IconArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
