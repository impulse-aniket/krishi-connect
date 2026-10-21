
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "farmer",
  location: "",
};

const roles = [
  { value: "farmer", label: "Farmer", description: "List and manage crops" },
  { value: "buyer", label: "Buyer", description: "Discover and reserve crops" },
  {
    value: "coldStorageOwner",
    label: "Cold Storage Owner",
    description: "Manage storage facilities",
  },
  {
    value: "transportProvider",
    label: "Transport Provider",
    description: "Provide delivery services",
  },
];

export default function Register() {
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      setMessage("Your account has been created. You can now sign in.");
      setFormData({ ...initialForm });

      window.setTimeout(() => {
        navigate("/login", {
          state: { registered: true },
        });
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        "Unable to connect to the server. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="kc-auth-page kc-register-page">
      <section className="kc-auth-layout kc-register-layout">
        <aside className="kc-auth-showcase kc-register-showcase">
          <Link to="/" className="kc-auth-back-home">
            <span aria-hidden="true">←</span> Back to home
          </Link>

          <div className="kc-auth-showcase-content">
            <div className="kc-auth-mini-brand">
              <span className="kc-auth-leaf" aria-hidden="true">✳</span>
              KRISHI-CONNECT
            </div>

            <h1>
              Every great harvest
              <br />
              <span>starts with a connection.</span>
            </h1>

            <p>
              Join a growing agricultural community and discover services
              designed to bring farmers, buyers, storage owners, and transport
              providers together.
            </p>

            <div className="kc-register-benefits">
              <div>
                <span>01</span>
                <p>
                  <strong>Choose your role</strong>
                  <small>Set up an account for your work.</small>
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  <strong>Discover services</strong>
                  <small>Find tools relevant to your needs.</small>
                </p>
              </div>
              <div>
                <span>03</span>
                <p>
                  <strong>Start connecting</strong>
                  <small>Manage your agricultural activities.</small>
                </p>
              </div>
            </div>
          </div>

          <p className="kc-auth-showcase-footer">
            Connecting agriculture. Growing opportunities.
          </p>
        </aside>

        <section className="kc-auth-form-panel kc-register-form-panel">
          <div className="kc-auth-form-wrap kc-register-form-wrap">
            <Link to="/" className="kc-auth-mobile-brand">
              <span className="kc-auth-leaf" aria-hidden="true">✳</span>
              Krishi-Connect
            </Link>

            <div className="kc-auth-heading">
              <span className="kc-auth-kicker">JOIN OUR COMMUNITY</span>
              <h2>Create your account</h2>
              <p>Enter your details to get started.</p>
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

            <form className="kc-auth-form" onSubmit={handleSubmit}>
              <div className="kc-auth-field">
                <label htmlFor="register-name">Full name</label>
                <input
                  className="kc-auth-plain-input"
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="kc-auth-field">
                <label htmlFor="register-email">Email address</label>
                <input
                  className="kc-auth-plain-input"
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="kc-auth-field">
                <label htmlFor="register-phone">Phone number</label>
                <input
                  className="kc-auth-plain-input"
                  id="register-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="kc-auth-field">
                <label htmlFor="register-location">Location</label>
                <input
                  className="kc-auth-plain-input"
                  id="register-location"
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City, district, or village"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="kc-auth-field">
                <label htmlFor="register-role">I want to join as a</label>
                <select
                  className="kc-auth-plain-input kc-auth-role-select"
                  id="register-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <p className="kc-auth-field-hint">
                  {roles.find((role) => role.value === formData.role)?.description}
                </p>
              </div>

              <div className="kc-auth-field">
                <label htmlFor="register-password">Password</label>
                <div className="kc-auth-input-wrap">
                  <input
                    className="kc-auth-password-input"
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
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
                <p className="kc-auth-field-hint">
                  Use at least 6 characters.
                </p>
              </div>

              <button
                type="submit"
                className="kc-auth-submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="kc-auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
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
