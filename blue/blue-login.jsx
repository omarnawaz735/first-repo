// ============================================================
// blue-login.jsx — login / sign-up screen (fake auth for the demo)
// ============================================================
function Login(props) {
  const { useState } = React;
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    const em = email.trim();
    if (!em || !password.trim()) { setError("Please enter an email and password."); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { setError("That doesn't look like a valid email."); return; }
    props.onAuth({ email: em }); // fake auth: any valid-looking credentials are accepted
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <div className="brand brand-lg">
          <span className="brand-dot" />
          <span className="brand-name">Blue</span>
        </div>
        <h1 className="auth-title">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="auth-sub">
          {mode === "login" ? "Log in to continue your chats." : "Sign up to start chatting with Blue."}
        </p>

        <form onSubmit={submit} className="auth-form">
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} placeholder="you@example.com"
              onChange={function (e) { setEmail(e.target.value); setError(""); }} />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} placeholder="••••••••"
              onChange={function (e) { setPassword(e.target.value); setError(""); }} />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit">{mode === "login" ? "Log in" : "Sign up"}</button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button type="button" className="link"
            onClick={function () { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
        <p className="auth-note">Demo login — any email &amp; password works.</p>
      </div>
    </div>
  );
}
