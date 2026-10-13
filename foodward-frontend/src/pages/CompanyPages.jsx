import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed, Mail, Phone, MapPin, ChevronDown, Users, Target, Heart, ArrowUpRight, Sun, Moon,
} from "lucide-react";

const TABS = [
  { id: "about", label: "About us" },
  { id: "contact", label: "Contact" },
  { id: "faq", label: "FAQ" },
];

const FAQS = [
  { q: "How quickly does food need to be picked up?", a: "Every listing includes an expiry window set by the kitchen. Most pickups happen within 30–60 minutes of a shelter accepting, and the app never lets a listing outlive its stated freshness window." },
  { q: "Who verifies hotels and orphanages?", a: "Our admin team checks business registration or nonprofit documentation before any account can post or accept donations. You'll see a verified badge once approved." },
  { q: "Is there a cost to use Foodward?", a: "No. Foodward is free for hotels, restaurants, orphanages, and volunteers. We're funded by grants and corporate partners, not by fees on donations." },
  { q: "What if no volunteer is available for pickup?", a: "Shelters can arrange their own pickup, or a hotel's own staff can deliver directly. The volunteer network is there to help, not to gate the donation." },
  { q: "Can restaurants and event caterers join, not just hotels?", a: "Yes — any commercial kitchen with surplus food, including caterers and banquet halls, can register as a donor." },
];

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }} />
      </button>
      <div className="faq-a-wrap" style={{ maxHeight: open ? 200 : 0 }}>
        <p className="faq-a">{a}</p>
      </div>
    </div>
  );
}

export default function CompanyPages({ initialTab = "about" }) {
  const [tab, setTab] = useState(initialTab);
  const [sent, setSent] = useState(false);
  const [dark, setDark] = useState(false);

  return (
    <div className={`page ${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
          --ink: #12241A; --paper: #FBF8F2; --paper-dim: #F4F0E6;
          --emerald: #16A34A; --emerald-deep: #0B4A2B; --amber: #F59E0B; --coral: #F1652A;
          --line: #E4E1D8; --ink-soft: rgba(18,36,26,0.62);
        }
        .page.dark { --ink: #F2F1EA; --paper: #0E1712; --paper-dim: #142019; --line: #263229; --ink-soft: rgba(242,241,234,0.6); }
        .page.dark .value-card, .page.dark .contact-form input, .page.dark .contact-form textarea { background: #16221C; }
        * { box-sizing: border-box; }
        .page { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); min-height: 100vh; -webkit-font-smoothing: antialiased; transition: background 0.3s ease, color 0.3s ease; }
        .page h1, .page h2 { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
        button { font-family: inherit; cursor: pointer; }
        a { color: inherit; }
        :focus-visible { outline: 2px solid var(--emerald-deep); outline-offset: 2px; }
        .wrap { max-width: 880px; margin: 0 auto; padding: 0 28px; }

        .top-strip { border-bottom: 1px solid var(--line); padding: 18px 0; }
        .brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 17px; }
        .brand-mark { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; }

        .tabs { display: flex; gap: 6px; margin: 40px 0 44px; border-bottom: 1px solid var(--line); }
        .tabs button { padding: 12px 4px; margin-right: 26px; background: none; border: none; font-size: 15px; font-weight: 600; color: var(--ink-soft); border-bottom: 2px solid transparent; }
        .tabs button.active { color: var(--emerald-deep); border-color: var(--emerald); }

        .hero-kicker { font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--coral); margin-bottom: 12px; }
        h1.page-title { font-size: clamp(28px, 3.6vw, 38px); font-weight: 600; margin: 0 0 16px; line-height: 1.15; }
        .lede { font-size: 16.5px; color: var(--ink-soft); line-height: 1.65; max-width: 620px; margin-bottom: 40px; }

        .value-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 48px; }
        @media (max-width: 700px) { .value-grid { grid-template-columns: 1fr; } }
        .value-card { border: 1px solid var(--line); border-radius: 16px; padding: 22px; background: white; }
        .value-ico { width: 38px; height: 38px; border-radius: 11px; background: rgba(22,163,74,0.1); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .value-card h3 { font-family: 'Inter'; font-size: 15px; font-weight: 700; margin: 0 0 6px; }
        .value-card p { font-size: 13.5px; color: var(--ink-soft); line-height: 1.55; margin: 0; }

        .story-block { border-left: 3px solid var(--emerald); padding-left: 22px; margin-bottom: 48px; }
        .story-block p { font-size: 15.5px; line-height: 1.75; color: var(--ink); margin: 0 0 14px; }

        .contact-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px; margin-bottom: 40px; }
        @media (max-width: 760px) { .contact-grid { grid-template-columns: 1fr; } }
        .contact-item { display: flex; gap: 14px; margin-bottom: 22px; }
        .contact-ico { width: 40px; height: 40px; border-radius: 11px; background: rgba(22,163,74,0.1); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .contact-item h4 { font-size: 14px; font-weight: 700; margin: 0 0 3px; }
        .contact-item p { font-size: 13.8px; color: var(--ink-soft); margin: 0; }

        form.contact-form { display: flex; flex-direction: column; gap: 14px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
        .contact-form label { font-size: 13px; font-weight: 600; margin-bottom: 6px; display: block; }
        .contact-form input, .contact-form textarea {
          width: 100%; border: 1.5px solid var(--line); border-radius: 11px; padding: 11px 13px; font-size: 13.8px;
          background: white; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .contact-form input:focus, .contact-form textarea:focus { border-color: var(--emerald); box-shadow: 0 0 0 4px rgba(22,163,74,0.1); }
        .contact-form textarea { min-height: 110px; resize: vertical; }
        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 12px 20px;
          border-radius: 11px; font-size: 14px; font-weight: 600; border: none; color: white;
          background: linear-gradient(135deg, var(--coral), #E24A15); box-shadow: 0 8px 18px -8px rgba(241,101,42,0.5);
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover { box-shadow: 0 10px 24px -8px rgba(241,101,42,0.65); }
        .btn-primary:active { transform: scale(0.98); }
        .sent-note { font-size: 13.5px; color: var(--emerald-deep); font-weight: 600; margin-top: 6px; }

        .faq-item { border-bottom: 1px solid var(--line); }
        .faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 18px 2px; background: none; border: none; font-size: 15px; font-weight: 600; text-align: left; color: var(--ink); }
        .faq-a-wrap { overflow: hidden; transition: max-height 0.3s ease; }
        .faq-a { font-size: 14px; color: var(--ink-soft); line-height: 1.65; padding: 0 2px 18px; margin: 0; max-width: 640px; }

        footer.pg-footer { border-top: 1px solid var(--line); padding: 30px 0 40px; margin-top: 40px; font-size: 13px; color: var(--ink-soft); text-align: center; }
      `}</style>

      <div className="top-strip">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}><span className="brand-mark"><UtensilsCrossed size={15} /></span>Foodward</Link>
          <button onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode" style={{ background: "var(--paper-dim)", border: "1px solid var(--line)", borderRadius: 9, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      <div className="wrap">
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {tab === "about" && (
          <>
            <div className="hero-kicker">Our mission</div>
            <h1 className="page-title">A quiet piece of infrastructure between kitchens that have too much and shelters that don't have enough.</h1>
            <p className="lede">Foodward started with one banquet hall's Sunday leftovers and a question: why does this end up in a bin when there's a shelter ten minutes away? Today we connect hundreds of kitchens to hundreds of shelters, every single day.</p>

            <div className="value-grid">
              <div className="value-card"><div className="value-ico"><Target size={18} /></div><h3>Focused on speed</h3><p>Food spoils fast. Every part of Foodward is built around minutes, not days.</p></div>
              <div className="value-card"><div className="value-ico"><Users size={18} /></div><h3>Built with the community</h3><p>Shelter administrators and hotel kitchen staff shaped this product from day one.</p></div>
              <div className="value-card"><div className="value-ico"><Heart size={18} /></div><h3>No cost, ever</h3><p>Grant and partner funded — never a transaction fee between a kitchen and a shelter.</p></div>
            </div>

            <div className="story-block">
              <p>We're a small team of engineers, former shelter volunteers, and one very persistent hotel operations manager who got tired of throwing away perfectly good food. Foodward is the tool we wished existed.</p>
              <p>Every meal saved is tracked, every kitchen and shelter verified, and every pickup timed against the one thing that actually matters: freshness.</p>
            </div>
          </>
        )}

        {tab === "contact" && (
          <>
            <div className="hero-kicker">Get in touch</div>
            <h1 className="page-title">We'd like to hear from you.</h1>
            <p className="lede">Whether you're a kitchen, a shelter, a volunteer, or just curious — reach out.</p>
            <div className="contact-grid">
              <div>
                <div className="contact-item"><div className="contact-ico"><Mail size={17} /></div><div><h4>Email</h4><p>hello@foodward.org</p></div></div>
                <div className="contact-item"><div className="contact-ico"><Phone size={17} /></div><div><h4>Phone</h4><p>+1 (555) 010-3344</p></div></div>
                <div className="contact-item"><div className="contact-ico"><MapPin size={17} /></div><div><h4>Office</h4><p>220 Harbor Avenue, Suite 12</p></div></div>
              </div>
              <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="form-row">
                  <div><label>Name</label><input placeholder="Your name" required /></div>
                  <div><label>Email</label><input type="email" placeholder="you@example.com" required /></div>
                </div>
                <div><label>Message</label><textarea placeholder="How can we help?" required /></div>
                <button className="btn-primary" type="submit">Send message <ArrowUpRight size={15} /></button>
                {sent && <div className="sent-note">Thanks — we'll get back to you within a day.</div>}
              </form>
            </div>
          </>
        )}

        {tab === "faq" && (
          <>
            <div className="hero-kicker">Common questions</div>
            <h1 className="page-title">Frequently asked questions.</h1>
            <p className="lede">Can't find what you're looking for? Reach out on the Contact tab.</p>
            <div>
              {FAQS.map((f) => <AccordionItem key={f.q} {...f} />)}
            </div>
          </>
        )}
      </div>

      <footer className="pg-footer">© 2026 Foodward. All rights reserved.</footer>
    </div>
  );
}
