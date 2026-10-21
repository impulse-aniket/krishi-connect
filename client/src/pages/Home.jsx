
import { useState } from "react";
import { Link } from "react-router-dom";

const services = [
  {
    number: "01",
    icon: "🌾",
    title: "Crop Marketplace",
    description:
      "Help farmers showcase their harvest and connect directly with potential buyers.",
    link: "/browse-crops",
    linkText: "Explore crops",
  },
  {
    number: "02",
    icon: "🏬",
    title: "Cold Storage",
    description:
      "Discover storage facilities that help protect produce and reduce post-harvest losses.",
    link: "/browse-cold-storage",
    linkText: "Find storage",
  },
  {
    number: "03",
    icon: "🚚",
    title: "Transportation",
    description:
      "Connect agricultural orders with transport providers for convenient deliveries.",
    link: "/login",
    linkText: "Find transport",
  },
  {
    number: "04",
    icon: "☀️",
    title: "Weather Updates",
    description:
      "Check weather forecasts to make more informed day-to-day farming decisions.",
    link: "/weather",
    linkText: "Check weather",
  },
  {
    number: "05",
    icon: "📈",
    title: "Market Information",
    description:
      "Explore available market price information and make better-informed decisions.",
    link: "/market-prices",
    linkText: "View market prices",
  },
  {
    number: "06",
    icon: "📋",
    title: "Government Schemes",
    description:
      "Find information about agricultural schemes and support available to farmers.",
    link: "/government-schemes",
    linkText: "Explore schemes",
  },
];

const steps = [
  {
    number: "01",
    title: "Create an account",
    description:
      "Register as a farmer, buyer, storage owner, or transport provider.",
  },
  {
    number: "02",
    title: "Discover opportunities",
    description:
      "Explore crops, storage facilities, agricultural information, and services.",
  },
  {
    number: "03",
    title: "Connect and grow",
    description:
      "Manage requests, coordinate orders, and build useful agricultural connections.",
  },
];

function Brand({ footer = false }) {
  return (
    <Link
      to="/"
      className={`kc-brand ${footer ? "kc-brand-footer" : ""}`}
      aria-label="Krishi-Connect home"
    >
      <span className="kc-brand-icon" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <path
            d="M20 33V18"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M20 22C10 22 6 16 6 8C15 8 22 12 20 22Z"
            fill="currentColor"
          />
          <path
            d="M20 17C20 9 26 5 34 6C34 15 29 20 20 22"
            fill="currentColor"
          />
          <path
            d="M11 33H29"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="kc-brand-name">
        Krishi<span>-Connect</span>
        <small>GROW TOGETHER</small>
      </span>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="kc-arrow"
    >
      <path
        d="M4 10H16M10 4L16 10L10 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="kc-home">
      {/* Navigation */}
      <header className="kc-header">
        <div className="kc-container kc-nav">
          <Brand />

          <button
            type="button"
            className="kc-menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            className={`kc-nav-links ${menuOpen ? "kc-nav-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="#home" onClick={closeMenu}>
              Home
            </a>
            <a href="#services" onClick={closeMenu}>
              Services
            </a>
            <a href="#how-it-works" onClick={closeMenu}>
              How it works
            </a>
            <a href="#about" onClick={closeMenu}>
              About us
            </a>

            <div className="kc-mobile-actions">
              <Link to="/login" className="kc-button kc-button-outline" onClick={closeMenu}>
                Log in
              </Link>
              <Link to="/register" className="kc-button kc-button-primary" onClick={closeMenu}>
                Get started
              </Link>
            </div>
          </nav>

          <div className="kc-nav-actions">
            <Link to="/login" className="kc-login-link">
              Log in
            </Link>
            <Link to="/register" className="kc-button kc-button-primary kc-nav-cta">
              Get started <ArrowIcon />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="kc-hero" id="home">
          <div className="kc-container kc-hero-grid">
            <div className="kc-hero-copy">
              <div className="kc-eyebrow">
                <span className="kc-eyebrow-dot" />
                A better-connected agricultural community
              </div>

              <h1>
                Growing together.
                <br />
                <span>Harvesting better.</span>
              </h1>

              <p className="kc-hero-description">
                Connecting farmers, buyers, storage owners, and transport
                providers on one simple platform. Better connections can
                create better opportunities for everyone.
              </p>

              <div className="kc-hero-actions">
                <Link to="/register" className="kc-button kc-button-primary kc-button-large">
                  Join Krishi-Connect <ArrowIcon />
                </Link>
                <a href="#services" className="kc-button kc-button-light kc-button-large">
                  Explore services
                </a>
              </div>

              <div className="kc-trust-note">
                <span className="kc-trust-icon" aria-hidden="true">✓</span>
                <span>One platform. Multiple agricultural services.</span>
              </div>
            </div>

            <div className="kc-hero-visual">
              <div className="kc-image-frame">
                <img
                  className="kc-hero-image"
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1100&q=85"
                  alt="Green agricultural fields stretching across the countryside"
                  fetchPriority="high"
                />
                <div className="kc-image-overlay" />

                <div className="kc-image-caption">
                  <span className="kc-caption-icon" aria-hidden="true">✳</span>
                  <div>
                    <strong>Rooted in agriculture</strong>
                    <span>Built for a connected farming community</span>
                  </div>
                </div>
              </div>

              <div className="kc-floating-card kc-floating-top">
                <span className="kc-floating-icon">🌱</span>
                <div>
                  <strong>Grow with confidence</strong>
                  <span>Discover new opportunities</span>
                </div>
              </div>

              <div className="kc-floating-card kc-floating-bottom">
                <span className="kc-floating-check">✓</span>
                <div>
                  <strong>All in one place</strong>
                  <span>From harvest to delivery</span>
                </div>
              </div>

              <div className="kc-hero-decoration" aria-hidden="true" />
            </div>
          </div>

          <div className="kc-hero-bottom-line" />
        </section>

        {/* Audience strip */}
        <section className="kc-audience">
          <div className="kc-container kc-audience-inner">
            <p>Supporting every step of the agricultural journey</p>
            <div className="kc-audience-list">
              <span><span>♧</span> Farmers</span>
              <span><span>▤</span> Buyers</span>
              <span><span>▦</span> Storage owners</span>
              <span><span>↗</span> Transport providers</span>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="kc-section kc-services" id="services">
          <div className="kc-container">
            <div className="kc-section-heading">
              <div>
                <span className="kc-section-label">WHAT WE OFFER</span>
                <h2>
                  Everything agriculture needs,
                  <br />
                  <span>connected in one place.</span>
                </h2>
              </div>
              <p>
                Find practical tools and services that help make agricultural
                trade and coordination simpler.
              </p>
            </div>

            <div className="kc-service-grid">
              {services.map((service) => (
                <article className="kc-service-card" key={service.number}>
                  <div className="kc-service-card-top">
                    <span className="kc-service-icon" aria-hidden="true">
                      {service.icon}
                    </span>
                    <span className="kc-service-number">{service.number}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link to={service.link} className="kc-service-link">
                    {service.linkText} <ArrowIcon />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* About / benefits */}
        <section className="kc-section kc-about" id="about">
          <div className="kc-container kc-about-grid">
            <div className="kc-about-visual">
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=85"
                alt="Freshly harvested vegetables arranged in a basket"
                loading="lazy"
              />
              <div className="kc-about-stamp">
                <span>GROW</span>
                <strong>LOCAL</strong>
                <span>GROW TOGETHER</span>
              </div>
            </div>

            <div className="kc-about-copy">
              <span className="kc-section-label">WHY KRISHI-CONNECT?</span>
              <h2>
                Making agricultural connections
                <span> a little simpler.</span>
              </h2>
              <p>
                Agricultural work involves more than growing crops. Finding
                buyers, arranging storage, coordinating transport, and
                accessing useful information all matter.
              </p>
              <p>
                Krishi-Connect brings these services together in one place
                so different members of the agricultural community can
                discover opportunities and coordinate their work.
              </p>

              <div className="kc-benefit-list">
                <div>
                  <span className="kc-benefit-check">✓</span>
                  <div>
                    <strong>Useful connections</strong>
                    <p>Bring agricultural service providers and users together.</p>
                  </div>
                </div>
                <div>
                  <span className="kc-benefit-check">✓</span>
                  <div>
                    <strong>Information in one place</strong>
                    <p>Access available services and helpful agricultural updates.</p>
                  </div>
                </div>
                <div>
                  <span className="kc-benefit-check">✓</span>
                  <div>
                    <strong>Simple digital workflows</strong>
                    <p>Manage listings, requests, and orders through your account.</p>
                  </div>
                </div>
              </div>

              <Link to="/register" className="kc-button kc-button-primary kc-button-large">
                Become a member <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="kc-section kc-how" id="how-it-works">
          <div className="kc-container">
            <div className="kc-centered-heading">
              <span className="kc-section-label">GET STARTED</span>
              <h2>Three simple steps to get connected.</h2>
              <p>
                Start with an account and explore the services that fit your role.
              </p>
            </div>

            <div className="kc-steps-grid">
              {steps.map((step) => (
                <article className="kc-step-card" key={step.number}>
                  <span className="kc-step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="kc-cta-section">
          <div className="kc-container">
            <div className="kc-cta">
              <div className="kc-cta-decoration" aria-hidden="true">✳</div>
              <div className="kc-cta-copy">
                <span className="kc-cta-label">YOUR NEXT STEP STARTS HERE</span>
                <h2>Let's grow a stronger agricultural community.</h2>
                <p>
                  Join Krishi-Connect and discover a simpler way to connect
                  with agricultural opportunities.
                </p>
              </div>
              <div className="kc-cta-actions">
                <Link to="/register" className="kc-button kc-button-white kc-button-large">
                  Create an account <ArrowIcon />
                </Link>
                <Link to="/login" className="kc-cta-login">
                  Already a member? Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="kc-footer">
        <div className="kc-container">
          <div className="kc-footer-main">
            <div className="kc-footer-brand">
              <Brand footer />
              <p>
                Connecting the people, services, and opportunities that help
                agriculture move forward.
              </p>
            </div>

            <div className="kc-footer-column">
              <h3>Explore</h3>
              <a href="#home">Home</a>
              <a href="#services">Our services</a>
              <a href="#about">About us</a>
              <a href="#how-it-works">How it works</a>
            </div>

            <div className="kc-footer-column">
              <h3>Services</h3>
              <Link to="/browse-crops">Crop marketplace</Link>
              <Link to="/browse-cold-storage">Cold storage</Link>
              <Link to="/weather">Weather updates</Link>
              <Link to="/government-schemes">Government schemes</Link>
            </div>

            <div className="kc-footer-column">
              <h3>Your account</h3>
              <Link to="/login">Log in</Link>
              <Link to="/register">Create an account</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>

          <div className="kc-footer-bottom">
            <p>© {new Date().getFullYear()} Krishi-Connect. All rights reserved.</p>
            <p>Connecting agriculture, growing opportunities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
