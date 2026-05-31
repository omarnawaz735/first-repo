// ============================================================
// blue-chat.jsx — active conversation view (messages + typing)
// ============================================================
function Message(props) {
  const isUser = props.role === "user";
  return (
    <div className={"msg " + (isUser ? "msg-user" : "msg-bot")}>
      {!isUser && <div className="msg-avatar"><IconSpark size={16} /></div>}
      <div className="msg-bubble">{props.content}</div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="msg msg-bot">
      <div className="msg-avatar"><IconSpark size={16} /></div>
      <div className="msg-bubble typing"><span></span><span></span><span></span></div>
    </div>
  );
}

function Chat(props) {
  const { useRef, useEffect } = React;
  const chat = props.chat, typing = props.typing;
  const endRef = useRef(null);

  useEffect(function () {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages.length, typing]);

  return (
    <div className="chat">
      <div className="chat-scroll">
        <div className="chat-thread">
          {chat.messages.map(function (m) {
            return <Message key={m.id} role={m.role} content={m.content} />;
          })}
          {typing && <TypingIndicator />}
          <div ref={endRef} />
        </div>
      </div>
      <div className="chat-composer-wrap">
        <Composer
          draft={props.draft} setDraft={props.setDraft} onSend={props.onSend}
          model={props.model} setModel={props.setModel} autoFocus={true} />
      </div>
    </div>
  );
}
