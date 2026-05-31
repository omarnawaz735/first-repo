// ============================================================
// blue-home.jsx — greeting + composer + action chips
// ============================================================
const HOME_CHIPS = [
  { label: "Write",   Icon: IconWrite,   prompt: "Help me write " },
  { label: "Learn",   Icon: IconLearn,   prompt: "Explain " },
  { label: "Plan",    Icon: IconPlan,    prompt: "Help me plan " },
  { label: "Code",    Icon: IconCode,    prompt: "Write code that " },
  { label: "Analyze", Icon: IconAnalyze, prompt: "Analyze " },
];

function Home(props) {
  return (
    <div className="home">
      <div className="home-inner">
        <h1 className="greet">
          <span className="greet-spark"><IconSparkle size={26} /></span>
          {getGreeting()}, <span className="greet-name">{props.name}</span>
        </h1>

        <Composer
          draft={props.draft} setDraft={props.setDraft} onSend={props.onSend}
          model={props.model} setModel={props.setModel}
          effort={props.effort} setEffort={props.setEffort} autoFocus={true} />

        <div className="chips">
          {HOME_CHIPS.map(function (c) {
            const ChipIcon = c.Icon;
            return (
              <button key={c.label} className="chip" onClick={function () { props.onChip(c.prompt); }}>
                <ChipIcon size={16} /><span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
