import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, Home, ArrowLeft, Search, Sun, Moon } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  return (
    <div className={`nf-page ${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
          --ink: #12241A; --paper: #FBF8F2; --emerald: #16A34A; --emerald-deep: #0B4A2B;
          --amber: #F59E0B; --coral: #F1652A; --line: #E4E1D8; --ink-soft: rgba(18,36,26,0.62);
        }
        .nf-page.dark { --ink: #F2F1EA; --paper: #0E1712; --line: #263229; --ink-soft: rgba(242,241,234,0.6); }
        .nf-page.dark .btn-ghost, .nf-page.dark .nf-search { background: #16221C; }
        * { box-sizing: border-box; }
        .nf-page {
          font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper);
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 40px 24px; position: relative; overflow: hidden; transition: background 0.3s ease, color 0.3s ease;
        }
        .nf-page h1 { font-family: 'Fraunces', Georgia, serif; }
        button, a.btn { font-family: inherit; cursor: pointer; }
        .nf-glow { position: absolute; top: -220px; left: 50%; transform: translateX(-50%); width: 720px; height: 720px;
          background: radial-gradient(circle, rgba(245,158,11,0.16), rgba(241,101,42,0.06) 55%, transparent 72%); pointer-events: none; }

        .brand { position: relative; display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 17px; margin-bottom: 60px; }
        .brand-mark { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; }

        .nf-visual { position: relative; margin-bottom: 8px; }
        .nf-num { font-size: clamp(90px, 16vw, 150px); font-weight: 600; line-height: 1; color: var(--emerald-deep); position: relative; letter-spacing: -0.02em; }
        .nf-num .zero-plate { display: inline-block; position: relative; }
        .nf-num .zero-plate svg { position: absolute; inset: 0; margin: auto; }
        .nf-crumb { position: absolute; border-radius: 999px; background: var(--amber); opacity: 0.7; }

        .nf-title { font-size: clamp(22px, 3vw, 28px); font-weight: 600; margin: 20px 0 10px; position: relative; }
        .nf-copy { font-size: 15px; color: var(--ink-soft); max-width: 420px; line-height: 1.6; margin-bottom: 34px; position: relative; }

        .nf-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; }
        .btn { display: inline-flex; align-items: center; gap: 7px; padding: 12px 20px; border-radius: 12px; font-size: 14.5px; font-weight: 600; border: 1px solid transparent; text-decoration: none; transition: all 0.2s ease; }
        .btn-primary { background: linear-gradient(135deg, var(--coral), #E24A15); color: white; box-shadow: 0 8px 18px -8px rgba(241,101,42,0.5); }
        .btn-primary:hover { box-shadow: 0 10px 24px -8px rgba(241,101,42,0.65); }
        .btn-ghost { background: white; color: var(--ink); border-color: var(--line); }
        .btn-ghost:hover { background: rgba(18,36,26,0.04); }

        .nf-search { position: relative; margin-top: 34px; display: flex; align-items: center; gap: 9px; background: white; border: 1px solid var(--line); border-radius: 12px; padding: 11px 16px; width: 320px; max-width: 80vw; }
        .nf-search input { border: none; outline: none; background: transparent; font-size: 13.8px; width: 100%; color: var(--ink); }
        .nf-search svg { color: var(--ink-soft); flex-shrink: 0; }
      `}</style>

      <div className="nf-glow" />
      <div className="brand" style={{ gap: 14 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9 }}><span className="brand-mark"><UtensilsCrossed size={15} /></span>Foodward</span>
        <button onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode" style={{ background: "white", border: "1px solid var(--line)", borderRadius: 9, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      <div className="nf-visual">
        <div className="nf-num">
          4<span className="zero-plate">0</span>4
        </div>
        <div className="nf-crumb" style={{ width: 10, height: 10, top: -6, left: "38%" }} />
        <div className="nf-crumb" style={{ width: 7, height: 7, top: 14, right: "32%" }} />
        <div className="nf-crumb" style={{ width: 6, height: 6, bottom: 6, left: "44%" }} />
      </div>

      <h2 className="nf-title">This page has already been picked up.</h2>
      <p className="nf-copy">The page you're looking for doesn't exist, or the listing has expired. Let's get you back to something fresh.</p>

      <div className="nf-actions">
        <Link to="/" className="btn btn-primary"><Home size={16} /> Back to home</Link>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Go back</button>
      </div>

      <div className="nf-search">
        <Search size={15} />
        <input placeholder="Search Foodward…" />
      </div>
    </div>
  );
}
