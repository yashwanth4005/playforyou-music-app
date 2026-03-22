import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { extractErrorMessage } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";
import { useToast } from "../providers/ToastProvider";

const authHighlights = [
  {
    title: "Curated listening",
    description: "A calmer discovery flow with search, playlists, likes, and fast playback controls.",
  },
  {
    title: "Admin ready",
    description: "Upload tracks, manage the catalog, and keep the whole product on one shared API contract.",
  },
];

const authStats = [
  {
    title: "Queue-first control",
    description: "Move from browse to playback without interface friction.",
  },
  {
    title: "Clean visual system",
    description: "Soft surfaces, stronger hierarchy, and less noise on every screen.",
  },
  {
    title: "Single workspace",
    description: "Listeners and admins stay inside the same polished product language.",
  },
];

function initialForm(mode) {
  return mode === "login"
    ? { email: "", password: "" }
    : { name: "", email: "", password: "" };
}

export default function AuthView() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm("login"));
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const panelTitle = isLogin ? "Welcome back to your listening room" : "Create your PlayForYou account";
  const panelDescription = isLogin
    ? "Sign in to continue with your playlists, saved tracks, and the studio-grade experience you left waiting."
    : "Set up your account in one step and jump straight into a cleaner music workflow.";

  function switchMode(nextMode) {
    setMode(nextMode);
    setForm(initialForm(nextMode));
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const response = await signIn(form);
        showToast("Welcome back. Your listening space is ready.", "success");
        navigate(response.user.role === "ADMIN" ? "/admin" : "/home", { replace: true });
      } else {
        const response = await signUp(form);
        showToast("Account created. Your library starts now.", "success");
        navigate(response.user.role === "ADMIN" ? "/admin" : "/home", { replace: true });
      }
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-glow auth-glow-left" aria-hidden="true" />
      <div className="auth-glow auth-glow-right" aria-hidden="true" />

      <motion.section
        className="auth-copy"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-copy-top">
          <div className="auth-copy-main">
            <p className="eyebrow">Independent music platform</p>
            <h1>Music discovery shaped like a premium studio desk.</h1>
            <p>
              PlayForYou keeps the interface calm, the playback fast, and the admin workflow structured so the product
              feels intentional from the first click.
            </p>
          </div>
          <span className="auth-copy-chip">Built for listeners and admins</span>
        </div>

        <div className="auth-showcase">
          <div className="auth-showcase-header">
            <div>
              <span className="auth-showcase-kicker">Now spinning</span>
              <strong>Midnight Session Mix</strong>
            </div>
            <span className="auth-showcase-badge">Live queue</span>
          </div>

          <div className="auth-wave" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="auth-showcase-grid">
            <article>
              <span>Discovery</span>
              <strong>Search, playlists, and likes arranged for quick flow.</strong>
            </article>
            <article>
              <span>Studio</span>
              <strong>Upload and manage songs with a cleaner admin workspace.</strong>
            </article>
          </div>
        </div>

        <div className="feature-stack">
          {authHighlights.map((highlight) => (
            <div key={highlight.title}>
              <strong>{highlight.title}</strong>
              <span>{highlight.description}</span>
            </div>
          ))}
        </div>

        <div className="auth-stats">
          {authStats.map((stat) => (
            <article key={stat.title}>
              <strong>{stat.title}</strong>
              <span>{stat.description}</span>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="auth-panel"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
      >
        <div className="auth-panel-header">
          <p className="eyebrow">Access your space</p>
          <h2>{panelTitle}</h2>
          <p>{panelDescription}</p>
        </div>

        <div className="auth-tabs">
          <button type="button" className={isLogin ? "active" : ""} onClick={() => switchMode("login")}>
            Sign in
          </button>
          <button type="button" className={!isLogin ? "active" : ""} onClick={() => switchMode("register")}>
            Create account
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            className="auth-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
          >
            <div className="field-grid">
              {!isLogin ? (
                <label>
                  <span>Name</span>
                  <input name="name" value={form.name} onChange={updateField} placeholder="Aarav Sen" required />
                </label>
              ) : null}
              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="Minimum 8 characters"
                  required
                />
              </label>
            </div>

            <button type="submit" className="primary-button large" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Enter PlayForYou" : "Create account"}
            </button>

            <div className="auth-panel-footer">
              <div className="form-hint">
                <span>Admin demo</span>
                <strong>admin@playforyou.com</strong>
                <strong>Admin@123</strong>
              </div>

              <div className="auth-assurance">
                <span>No cluttered ads</span>
                <span>Fast playback</span>
                <span>Shared API foundation</span>
              </div>
            </div>
          </motion.form>
        </AnimatePresence>
      </motion.section>
    </div>
  );
}
