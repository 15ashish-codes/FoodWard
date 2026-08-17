import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  UtensilsCrossed,
  Building2,
  HeartHandshake,
  Bike,
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";

/* Same token system as the landing page, kept self-contained so this
   artifact can be dropped in standalone. */

const ROLES = [
  { id: "hotel", label: "Hotel / Restaurant", icon: Building2, blurb: "List surplus food for pickup" },
  { id: "orphanage", label: "Orphanage", icon: HeartHandshake, blurb: "Accept donations nearby" },
  { id: "volunteer", label: "Volunteer", icon: Bike, blurb: "Handle pickups & deliveries" },
  { id: "admin", label: "Admin", icon: ShieldCheck, blurb: "Verify & oversee the network" },
];

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function Field({ icon: Icon, error, children }) {
  return (
    <div className="field">
      <div className={`field-shell ${error ? "err" : ""}`}>
        <Icon size={17} className="field-ico" />
        {children}
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

function PasswordField({ value, onChange, placeholder, error, id }) {
  const [show, setShow] = useState(false);
  return (
    <Field icon={Lock} error={error}>
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
      />
      <button
        type="button"
        className="field-toggle"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </Field>
  );
}

function SocialRow() {
  return (
    <div className="social-row">
      <button type="button" className="social-btn">
        <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.46a5.52 5.52 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.57-5.17 3.57-8.81z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.87-3c-1.08.72-2.46 1.15-4.08 1.15-3.13 0-5.78-2.12-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.27a12 12 0 0 0 0 10.74z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.63l4 3.1C6.22 6.87 8.87 4.75 12 4.75z"/></svg>
        Google
      </button>
      <button type="button" className="social-btn">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/></svg>
        Facebook
      </button>
    </div>
  );
}

export default function AuthPage({ mode: initialMode = "login" }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const [mode, setMode] = useState(initialMode); // login | signup | forgot
  const [dark, setDark] = useState(false);
  const [role, setRole] = useState("hotel");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Enter your full name";
    if (!form.email.trim()) e.email = "Enter your email";
    else if (!validateEmail(form.email)) e.email = "Enter a valid email address";
    if (mode !== "forgot") {
      if (!form.password) e.password = "Enter a password";
      else if (mode === "signup" && form.password.length < 8) e.password = "Use at least 8 characters";
    }
    if (mode === "signup" && form.confirm !== form.password) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    if (mode === "forgot") {
      setResetSent(true);
      return;
    }
    setSubmitted(true);
  }

  function switchMode(next) {
    setMode(next);
    setErrors({});
    setSubmitted(false);
    setResetSent(false);
  }

  return (
    <div className={`auth-page ${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700;800&display=swap');

        :root {
          --ink: #12241A;
          --paper: #FBF8F2;
          --paper-dim: #F4F0E6;
          --emerald: #16A34A;
          --emerald-deep: #0B4A2B;
          --amber: #F59E0B;
          --coral: #F1652A;
          --line: #E4E1D8;
          --ink-soft: rgba(18,36,26,0.62);
          --danger: #D6432E;
        }
        .auth-page.dark {
          --ink: #F2F1EA; --paper: #0E1712; --paper-dim: #142019; --line: #263229; --ink-soft: rgba(242,241,234,0.6);
        }
        .auth-page.dark .auth-main { background: var(--paper); }
        .auth-page.dark .field-shell, .auth-page.dark .social-btn, .auth-page.dark .role-card, .auth-page.dark .btn-back { background: #16221C; }
        * { box-sizing: border-box; }
        .auth-page {
          font-family: 'Inter', -apple-system, sans-serif;
          color: var(--ink);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .auth-page h1, .auth-page h2, .auth-page .display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
        button { font-family: inherit; cursor: pointer; }
        :focus-visible { outline: 2px solid var(--emerald-deep); outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }

        .auth-shell {
          min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 900px) { .auth-shell { grid-template-columns: 1fr; } }

        /* ---- Left: brand / route panel ---- */
        .auth-side {
          position: relative; background: linear-gradient(160deg, var(--emerald-deep), #0a3a22 60%, #12240f);
          padding: 48px; display: flex; flex-direction: column; justify-content: space-between;
          color: var(--paper); overflow: hidden;
        }
        @media (max-width: 900px) { .auth-side { display: none; } }
        .auth-side::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 15% 15%, rgba(245,158,11,0.28), transparent 55%),
                      radial-gradient(circle at 85% 85%, rgba(22,163,74,0.3), transparent 50%);
        }
        .side-brand { position: relative; display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 18px; }
        .brand-mark {
          width: 30px; height: 30px; border-radius: 9px;
          background: rgba(251,248,242,0.14); border: 1px solid rgba(251,248,242,0.25);
          display: flex; align-items: center; justify-content: center;
        }
        .side-quote { position: relative; }
        .side-quote h2 { font-size: clamp(24px, 2.6vw, 32px); line-height: 1.28; font-weight: 500; margin: 0 0 18px; max-width: 420px; }
        .side-quote p { font-size: 14.5px; color: rgba(251,248,242,0.68); max-width: 380px; line-height: 1.6; }
        .side-stats { position: relative; display: flex; gap: 32px; }
        .side-stat b { display: block; font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; }
        .side-stat span { font-size: 12.5px; color: rgba(251,248,242,0.6); }

        /* ---- Right: form panel ---- */
        .auth-main { display: flex; align-items: center; justify-content: center; padding: 40px 24px; background: var(--paper); }
        .auth-card { width: 100%; max-width: 440px; }
        .auth-mode-tabs {
          display: flex; background: var(--paper-dim); border: 1px solid var(--line); border-radius: 12px;
          padding: 4px; margin-bottom: 32px;
        }
        .auth-mode-tabs button {
          flex: 1; padding: 9px; border: none; background: transparent; border-radius: 9px;
          font-size: 14px; font-weight: 600; color: var(--ink-soft); transition: all 0.25s ease;
        }
        .auth-mode-tabs button.active { background: white; color: var(--ink); box-shadow: 0 2px 8px -2px rgba(18,36,26,0.15); }

        .auth-card h1 { font-size: 26px; font-weight: 600; margin: 0 0 8px; }
        .auth-sub { font-size: 14.5px; color: var(--ink-soft); margin-bottom: 28px; }

        .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
        .role-card {
          border: 1.5px solid var(--line); border-radius: 14px; padding: 14px; text-align: left;
          background: white; transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
        }
        .role-card:hover { transform: translateY(-1px); }
        .role-card.active { border-color: var(--emerald); box-shadow: 0 6px 18px -10px rgba(22,163,74,0.4); background: rgba(22,163,74,0.05); }
        .role-card .r-ico { width: 30px; height: 30px; border-radius: 9px; background: rgba(22,163,74,0.1); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
        .role-card .r-label { font-size: 13.5px; font-weight: 600; margin-bottom: 2px; }
        .role-card .r-blurb { font-size: 11.5px; color: var(--ink-soft); line-height: 1.35; }

        form { display: flex; flex-direction: column; gap: 16px; }
        .field-shell {
          display: flex; align-items: center; gap: 10px;
          border: 1.5px solid var(--line); border-radius: 12px; padding: 0 14px;
          background: white; transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .field-shell:focus-within { border-color: var(--emerald); box-shadow: 0 0 0 4px rgba(22,163,74,0.1); }
        .field-shell.err { border-color: var(--danger); }
        .field-shell.err:focus-within { box-shadow: 0 0 0 4px rgba(214,67,46,0.1); }
        .field-ico { color: var(--ink-soft); flex-shrink: 0; }
        .field-shell input {
          flex: 1; border: none; outline: none; background: transparent;
          padding: 13px 0; font-size: 14.5px; color: var(--ink); font-family: inherit;
        }
        .field-shell input::placeholder { color: rgba(18,36,26,0.38); }
        .field-toggle { background: none; border: none; color: var(--ink-soft); display: flex; padding: 4px; }
        .field-error { font-size: 12.5px; color: var(--danger); margin-top: 6px; margin-left: 2px; }

        .row-between { display: flex; justify-content: space-between; align-items: center; font-size: 13.5px; }
        .link-btn { background: none; border: none; color: var(--emerald-deep); font-weight: 600; font-size: 13.5px; padding: 0; }
        .link-btn:hover { text-decoration: underline; }
        .remember { display: flex; align-items: center; gap: 7px; color: var(--ink-soft); }

        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          padding: 13px 20px; border-radius: 12px; font-size: 14.5px; font-weight: 600;
          border: 1px solid transparent; transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          width: 100%;
        }
        .btn:active { transform: scale(0.98); }
        .btn-primary { background: linear-gradient(135deg, var(--coral), #E24A15); color: white; box-shadow: 0 8px 20px -8px rgba(241,101,42,0.5); }
        .btn-primary:hover { box-shadow: 0 10px 26px -8px rgba(241,101,42,0.65); }
        .btn-back { background: var(--paper-dim); color: var(--ink); border-color: var(--line); }

        .divider { display: flex; align-items: center; gap: 12px; color: var(--ink-soft); font-size: 12.5px; margin: 6px 0; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: var(--line); }

        .social-row { display: flex; gap: 10px; }
        .social-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px; border: 1.5px solid var(--line); border-radius: 12px; background: white;
          font-size: 13.5px; font-weight: 600; color: var(--ink); transition: background 0.2s ease, border-color 0.2s ease;
        }
        .social-btn:hover { background: var(--paper-dim); border-color: rgba(22,163,74,0.3); }

        .switch-line { text-align: center; font-size: 13.5px; color: var(--ink-soft); margin-top: 24px; }

        .success-panel { text-align: center; padding: 24px 0; }
        .success-ico {
          width: 60px; height: 60px; border-radius: 999px; background: rgba(22,163,74,0.12);
          color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
          animation: pop 0.5s cubic-bezier(.22,.61,.36,1);
        }
        @keyframes pop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .success-panel h1 { font-size: 22px; margin-bottom: 10px; }
        .success-panel p { font-size: 14.5px; color: var(--ink-soft); margin-bottom: 26px; line-height: 1.6; }

        .form-fade { animation: fadeSlide 0.4s cubic-bezier(.22,.61,.36,1); }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="auth-shell">
        {/* LEFT PANEL */}
        <aside className="auth-side">
          <div className="side-brand" style={{ justifyContent: "space-between" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, color: "inherit", textDecoration: "none" }}>
              <span className="brand-mark"><UtensilsCrossed size={16} /></span>
              Foodward
            </Link>
            <button onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode" style={{ background: "rgba(251,248,242,0.12)", border: "1px solid rgba(251,248,242,0.25)", borderRadius: 9, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--paper)" }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
          <div className="side-quote">
            <h2>"We used to throw away trays of banquet food every weekend. Now it's claimed before our staff finish clearing the hall."</h2>
            <p>Rina Kapoor, F&B Manager — The Meridian Hotel</p>
          </div>
          <div className="side-stats">
            <div className="side-stat"><b>182,400+</b><span>Meals saved</span></div>
            <div className="side-stat"><b>640+</b><span>Kitchens onboard</span></div>
            <div className="side-stat"><b>34 min</b><span>Avg. pickup time</span></div>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="auth-main">
          <div className="auth-card">
            {mode !== "forgot" && (
              <div className="auth-mode-tabs">
                <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Log in</button>
                <button className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Sign up</button>
              </div>
            )}

            {mode === "forgot" ? (
              resetSent ? (
                <div className="success-panel form-fade">
                  <div className="success-ico"><CheckCircle2 size={28} /></div>
                  <h1>Check your inbox</h1>
                  <p>We've sent a password reset link to {form.email || "your email"}. It expires in 15 minutes.</p>
                  <button className="btn btn-back" onClick={() => switchMode("login")}>
                    <ArrowLeft size={16} /> Back to log in
                  </button>
                </div>
              ) : (
                <div className="form-fade">
                  <button className="link-btn" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }} onClick={() => switchMode("login")}>
                    <ArrowLeft size={15} /> Back
                  </button>
                  <h1>Reset your password</h1>
                  <p className="auth-sub">Enter the email on your account and we'll send you a reset link.</p>
                  <form onSubmit={handleSubmit}>
                    <Field icon={Mail} error={errors.email}>
                      <input type="email" placeholder="you@hotel.com" value={form.email} onChange={update("email")} autoComplete="email" />
                    </Field>
                    <button type="submit" className="btn btn-primary">Send reset link</button>
                  </form>
                </div>
              )
            ) : submitted ? (
              <div className="success-panel form-fade">
                <div className="success-ico"><CheckCircle2 size={28} /></div>
                <h1>{mode === "signup" ? "Account created" : "Welcome back"}</h1>
                <p>
                  {mode === "signup"
                    ? `Your ${ROLES.find((r) => r.id === role).label.toLowerCase()} account is ready. Verification usually takes under a day.`
                    : "You're signed in. Redirecting you to your dashboard."}
                </p>
                <button className="btn btn-primary" onClick={() => { auth.login(role, form.name); navigate(`/dashboard/${role}`); }}>Continue to dashboard</button>
              </div>
            ) : (
              <div className="form-fade" key={mode}>
                <h1>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
                <p className="auth-sub">
                  {mode === "signup" ? "Tell us who you are and let's get you verified." : "Log in to manage donations and pickups."}
                </p>

                {mode === "login" && (
                  <Field icon={User}>
                    <select value={role} onChange={(e) => setRole(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", padding: "13px 0", fontSize: "14.5px", color: "var(--ink)", width: "100%" }}>
                      {ROLES.map((r) => <option key={r.id} value={r.id}>Log in as {r.label}</option>)}
                    </select>
                  </Field>
                )}

                {mode === "signup" && (
                  <div className="role-grid">
                    {ROLES.map((r) => (
                      <button
                        type="button"
                        key={r.id}
                        className={`role-card ${role === r.id ? "active" : ""}`}
                        onClick={() => setRole(r.id)}
                      >
                        <div className="r-ico"><r.icon size={16} /></div>
                        <div className="r-label">{r.label}</div>
                        <div className="r-blurb">{r.blurb}</div>
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {mode === "signup" && (
                    <Field icon={User} error={errors.name}>
                      <input type="text" placeholder="Full name" value={form.name} onChange={update("name")} autoComplete="name" />
                    </Field>
                  )}
                  <Field icon={Mail} error={errors.email}>
                    <input type="email" placeholder="you@example.com" value={form.email} onChange={update("email")} autoComplete="email" />
                  </Field>
                  {mode === "signup" && (
                    <Field icon={Phone} error={errors.phone}>
                      <input type="tel" placeholder="Phone number" value={form.phone} onChange={update("phone")} autoComplete="tel" />
                    </Field>
                  )}
                  <PasswordField
                    id="password"
                    value={form.password}
                    onChange={update("password")}
                    placeholder="Password"
                    error={errors.password}
                  />
                  {mode === "signup" && (
                    <PasswordField
                      id="confirm"
                      value={form.confirm}
                      onChange={update("confirm")}
                      placeholder="Confirm password"
                      error={errors.confirm}
                    />
                  )}

                  {mode === "login" && (
                    <div className="row-between">
                      <label className="remember">
                        <input type="checkbox" /> Remember me
                      </label>
                      <button type="button" className="link-btn" onClick={() => switchMode("forgot")}>
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary">
                    {mode === "signup" ? "Create account" : "Log in"} <ArrowRight size={16} />
                  </button>
                </form>

                <div className="divider">or continue with</div>
                <SocialRow />

                <div className="switch-line">
                  {mode === "signup" ? (
                    <>Already have an account? <button className="link-btn" onClick={() => switchMode("login")}>Log in</button></>
                  ) : (
                    <>New to Foodward? <button className="link-btn" onClick={() => switchMode("signup")}>Create an account</button></>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
