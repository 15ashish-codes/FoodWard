import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Sun, Moon } from "lucide-react";

const PRIVACY_SECTIONS = [
  { h: "What we collect", body: "Account details (name, email, phone), organization or verification documents, donation listings, pickup locations, and general usage data to keep the platform running smoothly." },
  { h: "How we use it", body: "To match surplus food with nearby shelters, verify organizations before they can post or accept donations, coordinate pickups, and improve the reliability of the service over time." },
  { h: "Location data", body: "GPS location is used only to rank nearby listings and pickups by distance. We don't sell or share precise location data with third parties." },
  { h: "Who can see your information", body: "Kitchens see the shelter accepting their donation and vice versa. Volunteers see pickup and drop-off details for routes they've claimed. Admins can view verification documents for approval." },
  { h: "Data retention", body: "Donation and pickup records are kept for reporting and impact tracking. You can request deletion of your account and associated personal data at any time." },
  { h: "Your choices", body: "You can update, export, or delete your account information from your profile settings, or by contacting privacy@foodward.org." },
];

const TERMS_SECTIONS = [
  { h: "Accepting these terms", body: "By creating an account, you agree to use Foodward only for coordinating legitimate surplus food donations and pickups between verified organizations and individuals." },
  { h: "Account verification", body: "Hotels, restaurants, and orphanages must provide accurate registration or nonprofit documentation. Foodward reserves the right to suspend accounts that provide false information." },
  { h: "Food safety responsibility", body: "Donating kitchens are responsible for the accuracy of freshness and expiry information they list. Receiving shelters are responsible for inspecting food on pickup before accepting it." },
  { h: "Volunteer conduct", body: "Volunteers agree to complete claimed pickups in good faith and communicate promptly if a route can no longer be completed, so it can be reassigned." },
  { h: "Platform availability", body: "Foodward is provided as-is. While we aim for high reliability, we don't guarantee uninterrupted access and aren't liable for spoilage caused by delays outside a party's control." },
  { h: "Changes to these terms", body: "We may update these terms as the platform evolves. Continued use after an update means you accept the revised terms." },
];

export default function LegalPages({ initialTab = "privacy" }) {
  const [tab, setTab] = useState(initialTab);
  const [dark, setDark] = useState(false);
  const sections = tab === "privacy" ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  return (
    <div className={`page ${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
          --ink: #12241A; --paper: #FBF8F2; --paper-dim: #F4F0E6;
          --emerald: #16A34A; --emerald-deep: #0B4A2B; --coral: #F1652A; --line: #E4E1D8; --ink-soft: rgba(18,36,26,0.62);
        }
        .page.dark { --ink: #F2F1EA; --paper: #0E1712; --paper-dim: #142019; --line: #263229; --ink-soft: rgba(242,241,234,0.6); }
        * { box-sizing: border-box; }
        .page { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); min-height: 100vh; -webkit-font-smoothing: antialiased; transition: background 0.3s ease, color 0.3s ease; }
        .page h1 { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
        button { font-family: inherit; cursor: pointer; }
        .wrap { max-width: 760px; margin: 0 auto; padding: 0 28px; }
        .top-strip { border-bottom: 1px solid var(--line); padding: 18px 0; }
        .brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 17px; }
        .brand-mark { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; }

        .tabs { display: flex; gap: 6px; margin: 40px 0 8px; border-bottom: 1px solid var(--line); }
        .tabs button { padding: 12px 4px; margin-right: 26px; background: none; border: none; font-size: 15px; font-weight: 600; color: var(--ink-soft); border-bottom: 2px solid transparent; }
        .tabs button.active { color: var(--emerald-deep); border-color: var(--emerald); }

        h1.page-title { font-size: clamp(26px, 3.2vw, 32px); font-weight: 600; margin: 32px 0 6px; }
        .updated { font-size: 13px; color: var(--ink-soft); margin-bottom: 36px; }
        .legal-section { padding: 22px 0; border-bottom: 1px solid var(--line); }
        .legal-section:last-child { border-bottom: none; }
        .legal-section h2 { font-family: 'Inter'; font-size: 15px; font-weight: 700; margin: 0 0 8px; }
        .legal-section p { font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin: 0; max-width: 620px; }
        footer.pg-footer { border-top: 1px solid var(--line); padding: 30px 0 40px; margin-top: 20px; font-size: 13px; color: var(--ink-soft); text-align: center; }
      `}</style>

      <div className="top-strip"><div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}><span className="brand-mark"><UtensilsCrossed size={15} /></span>Foodward</Link><button onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode" style={{ background: "var(--paper-dim)", border: "1px solid var(--line)", borderRadius: 9, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button></div></div>

      <div className="wrap">
        <div className="tabs">
          <button className={tab === "privacy" ? "active" : ""} onClick={() => setTab("privacy")}>Privacy policy</button>
          <button className={tab === "terms" ? "active" : ""} onClick={() => setTab("terms")}>Terms & conditions</button>
        </div>
        <h1 className="page-title">{tab === "privacy" ? "Privacy policy" : "Terms & conditions"}</h1>
        <div className="updated">Last updated July 1, 2026</div>
        {sections.map((s) => (
          <div className="legal-section" key={s.h}><h2>{s.h}</h2><p>{s.body}</p></div>
        ))}
      </div>

      <footer className="pg-footer">© 2026 Foodward. All rights reserved.</footer>
    </div>
  );
}
