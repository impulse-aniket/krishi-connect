
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to log in. Check your details.");
        return;
      }

      if (!data.user || !data.token) {
        setError("The server response was incomplete. Please try again.");
        return;
      }

      login(data.user, data.token);
      setMessage("Login successful. Opening your dashboard...");
      navigate("/dashboard");
    } catch {
      setError(
        "Unable to connect to the server. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="kc-auth-page">
      <section className="kc-auth-layout">
        <aside className="kc-auth-showcase">
          <Link to="/" className="kc-auth-back-home">
            <span aria-hidden="true">←</span> Back to home
          </Link>

          <div className="kc-auth-showcase-content">
            <div className="kc-auth-mini-brand">
              <span className="kc-auth-leaf" aria-hidden="true">✳</span>
              KRISHI-CONNECT
            </div>

            <h1>
              Good to see you
              <br />
              <span>growing with us.</span>
            </h1>

            <p>
              Your agricultural community is just a step away. Sign in to
              manage your activities and explore new opportunities.
            </p>

            <div className="kc-auth-showcase-image">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1100&q=85"
                alt="Green agricultural fields"
              />
              <div className="kc-auth-image-shade" />
              <div className="kc-auth-image-caption">
                <span className="kc-auth-caption-icon" aria-hidden="true">✓</span>
                <div>
                  <strong>One connected community</strong>
                  <span>From growing crops to getting them to market.</span>
                </div>
              </div>
            </div>
          </div>

          <p className="kc-auth-showcase-footer">
            Connecting agriculture. Growing opportunities.
          </p>
        </aside>

        <section className="kc-auth-form-panel">
          <div className="kc-auth-form-wrap">
            <Link to="/" className="kc-auth-mobile-brand">
              <span className="kc-auth-leaf" aria-hidden="true">✳</span>
              Krishi-Connect
            </Link>

            <div className="kc-auth-heading">
              <span className="kc-auth-kicker">WELCOME BACK</span>
              <h2>Sign in to your account</h2>
              <p>Enter your details to continue to Krishi-Connect.</p>
            </div>

            {error && (
              <div className="kc-auth-alert kc-auth-alert-error" role="alert">
                <span aria-hidden="true">!</span>
                <p>{error}</p>
              </div>
            )}

            {message && (
              <div className="kc-auth-alert kc-auth-alert-success" role="status">
                <span aria-hidden="true">✓</span>
                <p>{message}</p>
              </div>
            )}

            <form className="kc-auth-form" onSubmit={handleLogin}>
              <div className="kc-auth-field">
                <label htmlFor="login-email">Email address</label>
                <div className="kc-auth-input-wrap">
                  <span className="kc-auth-input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="3" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="kc-auth-field">
                <div className="kc-auth-label-row">
                  <label htmlFor="login-password">Password</label>
                </div>

                <div className="kc-auth-input-wrap">
                  <span className="kc-auth-input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="10" width="16" height="11" rx="2.5" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      <path d="M12 14v3" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="kc-auth-password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="kc-auth-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <div className="kc-auth-divider">
              <span>NEW TO KRISHI-CONNECT?</span>
            </div>

            <Link to="/register" className="kc-auth-secondary-button">
              Create an account
            </Link>

            <p className="kc-auth-terms">
              By continuing, you agree to use Krishi-Connect responsibly.
            </p>

            <Link to="/" className="kc-auth-home-link">
              ← Return to homepage
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
