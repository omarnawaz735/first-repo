// ============================================================
// blue-home.jsx — home / empty-state screen (greeting + composer)
// ============================================================
function Home(props) {
  const user = props.user;
  const name = (user.email || "there").split("@")[0];
  const suggestions = [
    "Explain my FYP idea in simple terms",
    "Help me write a professional email",
    "Give me 5 ideas to impress my supervisor",
    "Summarize this paragraph for me",
  ];

  return (
    <div className="home">
      <div className="home-inner">
        <h1 className="home-greeting">Hello, {name} 👋</h1>
        <p className="home-tagline">How can Blue help you today?</p>

        <Composer
          draft={props.draft} setDraft={props.setDraft} onSend={props.onSend}
          model={props.model} setModel={props.setModel} autoFocus={true} />

        <div className="suggestions">
          {suggestions.map(function (s) {
            return (
              <button key={s} className="suggestion" onClick={function () { props.onSend(s); }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
