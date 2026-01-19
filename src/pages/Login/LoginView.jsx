function LoginView({
  username,
  password,
  status,
  onSubmit,
  onReset,
  onChangeUsername,
  onChangePassword,
}) {
  return (
    <section className="login-card">
      <div className="login-brand">
        <img
          className="brand-logo"
          src="/logo.png"
          alt="Energy Portal logo"
          width="44"
          height="44"
        />
        <div>
          <p className="brand-kicker">Access Portal</p>
          <h1>Sign in</h1>
        </div>
      </div>

      <p className="login-subtitle">Enter your credentials.</p>

      <form className="login-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Username</span>
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => onChangeUsername(event.target.value)}
            placeholder="user1"
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => onChangePassword(event.target.value)}
            placeholder="user1"
            required
          />
        </label>

        <div className="actions">
          <button type="submit" className="btn-primary">
            Sign in
          </button> 
        </div>
      </form>
    </section>
  );
}

export default LoginView;
