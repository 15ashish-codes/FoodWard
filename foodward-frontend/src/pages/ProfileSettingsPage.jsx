import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  UtensilsCrossed, ArrowLeft, User, Bell, Shield, Trash2, Eye, EyeOff, Check, Sun, Moon,
} from "lucide-react";

const SECTIONS = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "danger", label: "Danger zone", icon: Trash2 },
];

function Toggle({ checked, onChange }) {
  return (
    <button className={`toggle ${checked ? "on" : ""}`} onClick={onChange} role="switch" aria-checked={checked}>
      <span className="toggle-knob" />
    </button>
  );
}

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [section, setSection] = useState("account");
  const [dark, setDark] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    newDonations: true, pickupUpdates: true, weeklySummary: true, marketing: false,
  });

  function togglePref(k) {
    setPrefs((p) => ({ ...p, [k]: !p[k] }));
  }
  function fireSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className={`ps-page ${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
          --ink: #12241A; --paper: #FBF8F2; --paper-dim: #F4F0E6; --card: #FFFFFF;
          --emerald: #16A34A; --emerald-deep: #0B4A2B; --coral: #F1652A; --line: #E4E1D8; --ink-soft: rgba(18,36,26,0.62);
          --danger: #D6432E; --danger-bg: rgba(214,67,46,0.08);
        }
        .ps-page.dark {
          --ink: #F2F1EA; --paper: #101A14; --paper-dim: #16221A; --card: #16221C;
          --line: #26362B; --ink-soft: rgba(242,241,234,0.6); --danger-bg: rgba(214,67,46,0.14);
        }
        * { box-sizing: border-box; }
        .ps-page { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); min-height: 100vh; -webkit-font-smoothing: antialiased; transition: background 0.3s ease, color 0.3s ease; }
        .ps-page h1, .ps-page h2 { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
        button { font-family: inherit; cursor: pointer; }
        .wrap { max-width: 900px; margin: 0 auto; padding: 0 24px; }

        .top-strip { border-bottom: 1px solid var(--line); padding: 16px 0; }
        .top-inner { display: flex; align-items: center; justify-content: space-between; }
        .brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 17px; }
        .brand-mark { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; }
        .top-right { display: flex; align-items: center; gap: 10px; }
        .back-btn, .theme-btn { display: flex; align-items: center; gap: 6px; background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 8px 12px; font-size: 13px; font-weight: 600; color: var(--ink); }

        h1.page-title { font-size: 26px; font-weight: 600; margin: 32px 0 4px; }
        .page-sub { font-size: 13.8px; color: var(--ink-soft); margin-bottom: 28px; }

        .ps-grid { display: grid; grid-template-columns: 210px 1fr; gap: 28px; padding-bottom: 60px; }
        @media (max-width: 760px) { .ps-grid { grid-template-columns: 1fr; } }

        .ps-nav { display: flex; flex-direction: column; gap: 3px; }
        .ps-nav button { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 10px; border: none; background: transparent; color: var(--ink-soft); font-size: 14px; font-weight: 500; text-align: left; }
        .ps-nav button:hover { background: var(--paper-dim); }
        .ps-nav button.active { background: var(--paper-dim); color: var(--emerald-deep); font-weight: 700; }
        .ps-nav button.danger-nav.active { color: var(--danger); }

        .panel { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 26px; }
        .panel h2 { font-size: 18px; font-weight: 600; margin: 0 0 4px; }
        .panel-sub { font-size: 13.2px; color: var(--ink-soft); margin-bottom: 22px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 560px) { .form-grid { grid-template-columns: 1fr; } }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full { grid-column: 1 / -1; }
        .form-field label { font-size: 13px; font-weight: 600; }
        .form-field input {
          border: 1.5px solid var(--line); border-radius: 11px; padding: 11px 13px; font-size: 13.8px;
          background: var(--paper); color: var(--ink); outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-field input:focus { border-color: var(--emerald); box-shadow: 0 0 0 4px rgba(22,163,74,0.12); }
        .pw-shell { position: relative; }
        .pw-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--ink-soft); display: flex; }

        .avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .avatar-big { width: 64px; height: 64px; border-radius: 999px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; font-family: 'Fraunces', serif; }

        .pref-row { display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid var(--line); gap: 16px; }
        .pref-row:last-child { border-bottom: none; }
        .pref-title { font-size: 14px; font-weight: 600; }
        .pref-copy { font-size: 12.8px; color: var(--ink-soft); margin-top: 2px; }

        .toggle { width: 42px; height: 24px; border-radius: 999px; background: var(--line); border: none; position: relative; flex-shrink: 0; transition: background 0.2s ease; }
        .toggle.on { background: var(--emerald); }
        .toggle-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 999px; background: white; transition: transform 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .toggle.on .toggle-knob { transform: translateX(18px); }

        .btn-primary { display: inline-flex; align-items: center; gap: 7px; padding: 12px 20px; border-radius: 11px; font-size: 14px; font-weight: 600; border: none; color: white; background: linear-gradient(135deg, var(--coral), #E24A15); box-shadow: 0 8px 18px -8px rgba(241,101,42,0.5); }
        .save-row { display: flex; align-items: center; gap: 14px; margin-top: 22px; }
        .saved-note { font-size: 13px; color: var(--emerald-deep); font-weight: 600; display: flex; align-items: center; gap: 5px; }

        .danger-box { border: 1.5px solid rgba(214,67,46,0.3); background: var(--danger-bg); border-radius: 14px; padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }
        .danger-box h3 { font-size: 14px; font-weight: 700; margin: 0 0 3px; color: var(--danger); }
        .danger-box p { font-size: 12.8px; color: var(--ink-soft); margin: 0; max-width: 380px; }
        .btn-danger { background: var(--danger); color: white; border: none; padding: 10px 16px; border-radius: 10px; font-size: 13.5px; font-weight: 600; }
      `}</style>

      <div className="top-strip">
        <div className="wrap top-inner">
          <div className="brand"><span className="brand-mark"><UtensilsCrossed size={15} /></span>Foodward</div>
          <div className="top-right">
            <button className="theme-btn" onClick={() => setDark((d) => !d)}>{dark ? <Sun size={14} /> : <Moon size={14} />} {dark ? "Light" : "Dark"}</button>
            <button className="back-btn" onClick={() => navigate(auth.user ? `/dashboard/${auth.user.role}` : "/")}><ArrowLeft size={14} /> Back to dashboard</button>
          </div>
        </div>
      </div>

      <div className="wrap">
        <h1 className="page-title">Profile settings</h1>
        <div className="page-sub">Manage your account, notification preferences, and security.</div>

        <div className="ps-grid">
          <nav className="ps-nav">
            {SECTIONS.map((s) => (
              <button key={s.id} className={`${section === s.id ? "active" : ""} ${s.id === "danger" ? "danger-nav" : ""}`} onClick={() => setSection(s.id)}>
                <s.icon size={16} /> {s.label}
              </button>
            ))}
          </nav>

          <div>
            {section === "account" && (
              <div className="panel">
                <h2>Account details</h2>
                <div className="panel-sub">Update your name, contact info, and photo.</div>
                <div className="avatar-row">
                  <div className="avatar-big">TM</div>
                  <button className="btn-primary" style={{ background: "var(--card)", color: "var(--ink)", border: "1px solid var(--line)", boxShadow: "none" }}>Change photo</button>
                </div>
                <div className="form-grid">
                  <div className="form-field"><label>Full name</label><input defaultValue="The Meridian Hotel" /></div>
                  <div className="form-field"><label>Email</label><input defaultValue="kitchen@meridianhotel.com" /></div>
                  <div className="form-field"><label>Phone</label><input defaultValue="+1 (555) 019-2201" /></div>
                  <div className="form-field"><label>Role</label><input defaultValue="Hotel / Restaurant" disabled /></div>
                  <div className="form-field full"><label>Address</label><input defaultValue="220 Harbor Ave, Suite 4" /></div>
                </div>
                <div className="save-row">
                  <button className="btn-primary" onClick={fireSave}>Save changes</button>
                  {saved && <span className="saved-note"><Check size={15} /> Saved</span>}
                </div>
              </div>
            )}

            {section === "notifications" && (
              <div className="panel">
                <h2>Notification preferences</h2>
                <div className="panel-sub">Choose what you want to hear about, and how.</div>
                <div className="pref-row"><div><div className="pref-title">New donations nearby</div><div className="pref-copy">Get notified when a matching listing appears.</div></div><Toggle checked={prefs.newDonations} onChange={() => togglePref("newDonations")} /></div>
                <div className="pref-row"><div><div className="pref-title">Pickup updates</div><div className="pref-copy">Status changes for donations you're tracking.</div></div><Toggle checked={prefs.pickupUpdates} onChange={() => togglePref("pickupUpdates")} /></div>
                <div className="pref-row"><div><div className="pref-title">Weekly summary</div><div className="pref-copy">A recap of meals saved and activity each week.</div></div><Toggle checked={prefs.weeklySummary} onChange={() => togglePref("weeklySummary")} /></div>
                <div className="pref-row"><div><div className="pref-title">Product updates & offers</div><div className="pref-copy">Occasional news about new Foodward features.</div></div><Toggle checked={prefs.marketing} onChange={() => togglePref("marketing")} /></div>
                <div className="save-row">
                  <button className="btn-primary" onClick={fireSave}>Save preferences</button>
                  {saved && <span className="saved-note"><Check size={15} /> Saved</span>}
                </div>
              </div>
            )}

            {section === "security" && (
              <div className="panel">
                <h2>Security</h2>
                <div className="panel-sub">Manage your password and account protection.</div>
                <div className="form-grid">
                  <div className="form-field full pw-shell">
                    <label>Current password</label>
                    <input type={showPw ? "text" : "password"} defaultValue="••••••••••" />
                    <button className="pw-toggle" style={{ top: 34 }} onClick={() => setShowPw((s) => !s)}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <div className="form-field"><label>New password</label><input type="password" placeholder="New password" /></div>
                  <div className="form-field"><label>Confirm new password</label><input type="password" placeholder="Confirm password" /></div>
                </div>
                <div className="pref-row" style={{ marginTop: 6 }}>
                  <div><div className="pref-title">Two-factor authentication</div><div className="pref-copy">Add an extra layer of security to your account.</div></div>
                  <Toggle checked={false} onChange={() => {}} />
                </div>
                <div className="save-row">
                  <button className="btn-primary" onClick={fireSave}>Update security settings</button>
                  {saved && <span className="saved-note"><Check size={15} /> Saved</span>}
                </div>
              </div>
            )}

            {section === "danger" && (
              <div className="panel">
                <h2>Danger zone</h2>
                <div className="panel-sub">These actions are permanent — proceed carefully.</div>
                <div className="danger-box">
                  <div><h3>Deactivate account</h3><p>Temporarily hide your listing history and pause notifications. You can reactivate anytime.</p></div>
                  <button className="btn-danger">Deactivate</button>
                </div>
                <div className="danger-box">
                  <div><h3>Delete account</h3><p>Permanently remove your account and personal data. Donation records may be retained for reporting.</p></div>
                  <button className="btn-danger">Delete account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
