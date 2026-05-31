// ============================================================
// blue-composer.jsx — the chat input box (model picker + send)
// ============================================================
function Composer(props) {
  const { useState, useRef, useEffect } = React;
  const draft = props.draft, setDraft = props.setDraft, onSend = props.onSend;
  const model = props.model, setModel = props.setModel, disabled = props.disabled;

  const [menuOpen, setMenuOpen] = useState(false);
  const taRef = useRef(null);
  const current = MODELS.find(function (m) { return m.id === model; }) || MODELS[0];

  // auto-grow the textarea
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
    if (!text || disabled) return;
    onSend(text);
  }
  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  return (
    <div className="composer">
      <div className="composer-box">
        <textarea
          ref={taRef}
          className="composer-input"
          placeholder="Message Blue…"
          rows={1}
          value={draft}
          onChange={function (e) { setDraft(e.target.value); }}
          onKeyDown={handleKey}
        />
        <div className="composer-actions">
          <div className="model-picker">
            <button type="button" className="model-btn" onClick={function () { setMenuOpen(function (o) { return !o; }); }}>
              <IconSpark size={15} />
              <span>{current.name}</span>
              <IconChevron size={14} />
            </button>
            {menuOpen && (
              <div className="model-menu" onMouseLeave={function () { setMenuOpen(false); }}>
                {MODELS.map(function (m) {
                  return (
                    <button key={m.id} type="button"
                      className={"model-option" + (m.id === model ? " is-active" : "")}
                      onClick={function () { setModel(m.id); setMenuOpen(false); }}>
                      <span className="model-option-name">{m.name}</span>
                      <span className="model-option-hint">{m.hint}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="composer-right">
            <button type="button" className="icon-btn" title="Attach (coming soon)" disabled>
              <IconAttach size={18} />
            </button>
            <button type="button" className="send-btn" onClick={submit}
              disabled={disabled || !(draft || "").trim()} title="Send">
              <IconSend size={18} />
            </button>
          </div>
        </div>
      </div>
      <p className="composer-hint">Blue can make mistakes. Enter to send · Shift+Enter for a new line.</p>
    </div>
  );
}
