import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  MapPin,
  ShieldCheck,
  BellRing,
  CalendarClock,
  BarChart3,
  MessageCircle,
  Radar,
  ArrowUpRight,
  Menu,
  X,
  Quote,
  Sun,
  Moon,
} from "lucide-react";

/* ---------- Design tokens ----------
  Ink        #12241A  (near-black forest, text)
  Paper      #FBF8F2  (warm paper, not stark white)
  Emerald    #16A34A  (brand primary, required)
  Deep Green #0B4A2B  (depth / gradients)
  Dawn Amber #F59E0B  (warmth)
  Coral CTA  #F1652A  (soft orange, required — pushed toward coral for warmth)
  Line Gray  #E4E1D8  (hairlines on paper)
  Display face: Fraunces (warm serif, human, not corporate)
  Body face:   Inter
------------------------------------ */

function useCountUp(target, active, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start;
    let raf;
    const step = (t) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(18px)",
        transition: `opacity 0.7s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Stat({ value, suffix, label, active, delay }) {
  const n = useCountUp(value, active, 1800 + delay);
  return (
    <div className="stat">
      <div className="stat-value">
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Stories", href: "#stories" },
  { label: "About", href: "#about" },
];

const FEATURES = [
  { icon: BellRing, title: "Real-time alerts", copy: "The moment surplus goes up, every nearby orphanage is notified — no refreshing, no missed windows." },
  { icon: Radar, title: "Live availability", copy: "See what's on offer right now, not what was posted yesterday. Listings expire the moment food does." },
  { icon: MapPin, title: "GPS matching", copy: "Requests are ranked by real distance and drive time, so pickups go to whoever can actually get there." },
  { icon: ShieldCheck, title: "Verified organizations", copy: "Every kitchen and every orphanage is checked before they can post or accept — trust, built in." },
  { icon: CalendarClock, title: "Pickup scheduling", copy: "Set a window, not a scramble. Volunteers see exact pickup and expiry times before they commit." },
  { icon: BarChart3, title: "Dashboard analytics", copy: "Meals saved, waste diverted, response time — tracked automatically for every kitchen and shelter." },
  { icon: MessageCircle, title: "Instant coordination", copy: "A direct line between kitchen and shelter for the five minutes that actually matter." },
  { icon: UtensilsCrossed, title: "Secure accounts", copy: "Role-based access for hotels, orphanages, volunteers and admins, each seeing only what they need." },
];

const STEPS = [
  { title: "Surplus is listed", copy: "A hotel kitchen logs what's left — meals, freshness window, pickup time — in under a minute.", node: "Kitchen" },
  { title: "Nearby shelters are notified", copy: "Orphanages within range see the listing instantly, ranked by distance and how soon it expires.", node: "Radius" },
  { title: "A shelter accepts", copy: "One tap claims the donation and locks in a pickup window before anything spoils.", node: "Match" },
  { title: "Pickup, before it's too late", copy: "A volunteer or driver completes the handoff — and a meal that would've been binned reaches a child instead.", node: "Table" },
];

const TESTIMONIALS = [
  { name: "Rina Kapoor", role: "F&B Manager, The Meridian Hotel", quote: "We used to throw away trays of banquet food every weekend. Now it's claimed before our staff finish clearing the hall." },
  { name: "David Owusu", role: "Volunteer Driver", quote: "The pickup windows are exact. I know what I'm collecting and where it's going before I even start the car." },
  { name: "Sister Miriam", role: "Administrator, Hope House Orphanage", quote: "We see real listings with real times. No more calling around at 8pm hoping someone has extra food." },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statsRef, statsInView] = useInView(0.4);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`page ${dark ? "dark" : ""}`}>
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
        }
        .page.dark {
          --ink: #F2F1EA;
          --paper: #0E1712;
          --paper-dim: #142019;
          --line: #263229;
          --ink-soft: rgba(242,241,234,0.6);
        }
        .page.dark .feature-card, .page.dark .testi-card, .page.dark .art-card.art-float-1, .page.dark .art-card.art-float-2 { background: #16221C; }
        .page.dark .nav { background: ${"var(--paper)"}; }
        * { box-sizing: border-box; }
        .page {
          background: var(--paper);
          transition: background 0.3s ease, color 0.3s ease;
          color: var(--ink);
          font-family: 'Inter', -apple-system, sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .page h1, .page h2, .page h3, .page .display {
          font-family: 'Fraunces', Georgia, serif;
          letter-spacing: -0.01em;
        }
        .wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
        }
        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; cursor: pointer; }
        :focus-visible { outline: 2px solid var(--emerald-deep); outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }

        /* ---------- NAV ---------- */
        .nav {
          position: sticky; top: 0; z-index: 50;
          background: ${scrolled ? "rgba(251,248,242,0.86)" : "transparent"};
          backdrop-filter: ${scrolled ? "blur(14px)" : "none"};
          border-bottom: 1px solid ${scrolled ? "var(--line)" : "transparent"};
          transition: background 0.4s ease, border-color 0.4s ease;
        }
        .nav-inner {
          max-width: 1180px; margin: 0 auto; padding: 16px 28px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 18px; }
        .brand-mark {
          width: 30px; height: 30px; border-radius: 9px;
          background: linear-gradient(135deg, var(--emerald), var(--emerald-deep));
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .nav-links { display: flex; gap: 30px; align-items: center; }
        .nav-links a { font-size: 14.5px; font-weight: 500; color: var(--ink-soft); transition: color 0.2s; }
        .nav-links a:hover { color: var(--ink); }
        .nav-cta { display: flex; gap: 10px; align-items: center; }
        .nav-toggle { display: none; background: none; border: none; }
        @media (max-width: 860px) {
          .nav-links, .nav-cta .btn-ghost { display: none; }
          .nav-toggle { display: block; }
        }

        .btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 20px; border-radius: 12px; font-size: 14.5px; font-weight: 600;
          border: 1px solid transparent; transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .btn:active { transform: scale(0.97); }
        .btn-primary {
          background: linear-gradient(135deg, var(--coral), #E24A15);
          color: white;
          box-shadow: 0 8px 20px -8px rgba(241,101,42,0.55);
        }
        .btn-primary:hover { box-shadow: 0 10px 26px -8px rgba(241,101,42,0.7); transform: translateY(-1px); }
        .btn-secondary {
          background: var(--ink);
          color: var(--paper);
        }
        .btn-secondary:hover { background: var(--emerald-deep); }
        .btn-ghost {
          background: rgba(18,36,26,0.05);
          color: var(--ink);
          border-color: var(--line);
        }
        .btn-ghost:hover { background: rgba(18,36,26,0.09); }

        /* ---------- HERO ---------- */
        .hero {
          position: relative;
          padding: 92px 0 70px;
        }
        .hero-glow {
          position: absolute; top: -180px; right: -160px; width: 620px; height: 620px;
          background: radial-gradient(circle, rgba(245,158,11,0.22), rgba(241,101,42,0.08) 55%, transparent 72%);
          filter: blur(10px); pointer-events: none;
        }
        .hero-grid {
          display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center;
        }
        @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600; color: var(--emerald-deep);
          background: rgba(22,163,74,0.09); border: 1px solid rgba(22,163,74,0.22);
          padding: 6px 13px; border-radius: 999px; margin-bottom: 22px;
        }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--emerald); animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .hero h1 {
          font-size: clamp(38px, 5.2vw, 60px);
          line-height: 1.05;
          font-weight: 600;
          margin: 0 0 22px;
        }
        .hero h1 em {
          font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--emerald-deep), var(--emerald) 60%, var(--amber));
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .hero p.lede {
          font-size: 18px; line-height: 1.65; color: var(--ink-soft); max-width: 480px; margin-bottom: 34px;
        }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }
        .hero-trust { display: flex; gap: 22px; flex-wrap: wrap; align-items: center; }
        .trust-item { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink-soft); font-weight: 500; }
        .trust-item svg { color: var(--emerald-deep); }

        /* hero illustration: kitchen-to-child handoff, built from shapes not stock art */
        .hero-art {
          position: relative; aspect-ratio: 1/1; max-width: 480px; margin: 0 auto;
        }
        .art-card {
          position: absolute; border-radius: 20px;
          box-shadow: 0 20px 50px -20px rgba(18,36,26,0.28);
          background: white; border: 1px solid var(--line);
        }
        .art-main {
          inset: 6% 8% 6% 8%;
          background: linear-gradient(160deg, var(--emerald-deep), #0a3a22 65%, #08301c);
          border-radius: 28px; overflow: hidden;
        }
        .art-main::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(245,158,11,0.35), transparent 55%);
        }
        .art-row { position: absolute; left: 9%; right: 9%; top: 14%; display: flex; justify-content: space-between; align-items: center; }
        .art-node {
          width: 54px; height: 54px; border-radius: 16px; background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center;
          color: #FBF8F2; backdrop-filter: blur(6px);
        }
        .art-path { position: absolute; left: 16%; right: 16%; top: 24%; height: 2px; background: rgba(255,255,255,0.18); }
        .art-pulse {
          position: absolute; top: -3px; width: 8px; height: 8px; border-radius: 999px;
          background: var(--amber); box-shadow: 0 0 14px 3px rgba(245,158,11,0.7);
          animation: travel 3.2s ease-in-out infinite;
        }
        @keyframes travel { 0% { left: 0%; opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { left: 96%; opacity: 0; } }
        .art-meal-card {
          position: absolute; left: 9%; right: 9%; bottom: 10%;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px; padding: 16px; color: #FBF8F2; backdrop-filter: blur(8px);
        }
        .art-meal-title { font-size: 13px; font-weight: 600; opacity: 0.9; margin-bottom: 10px; }
        .art-bar-track { height: 6px; border-radius: 999px; background: rgba(255,255,255,0.15); overflow: hidden; margin-bottom: 8px; }
        .art-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--amber), var(--coral)); width: 72%; }
        .art-meal-meta { display: flex; justify-content: space-between; font-size: 12px; opacity: 0.72; }
        .art-float-1 {
          top: -4%; left: -6%; width: 128px; padding: 14px; display: flex; gap: 10px; align-items: center;
        }
        .art-float-1 .ico { width: 34px; height: 34px; border-radius: 10px; background: rgba(22,163,74,0.12); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .art-float-1 .txt { font-size: 12px; font-weight: 600; line-height: 1.3; }
        .art-float-2 {
          bottom: -3%; right: -8%; width: 150px; padding: 14px;
        }
        .art-float-2 .txt-top { font-size: 11px; color: var(--ink-soft); margin-bottom: 3px; }
        .art-float-2 .txt-big { font-size: 20px; font-weight: 700; font-family: 'Fraunces', serif; color: var(--emerald-deep); }

        /* ---------- STATS ---------- */
        .stats-section { padding: 50px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media (max-width: 760px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        .stat-value { font-family: 'Fraunces', serif; font-size: clamp(28px, 3.4vw, 40px); font-weight: 600; color: var(--emerald-deep); }
        .stat-label { font-size: 13.5px; color: var(--ink-soft); margin-top: 4px; font-weight: 500; }

        /* ---------- SECTION HEADERS ---------- */
        .section { padding: 108px 0; }
        .section-head { max-width: 620px; margin-bottom: 56px; }
        .section-kicker { font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--coral); margin-bottom: 12px; }
        .section-head h2 { font-size: clamp(28px, 3.6vw, 40px); font-weight: 600; line-height: 1.15; margin: 0 0 14px; }
        .section-head p { font-size: 16.5px; color: var(--ink-soft); line-height: 1.6; }

        /* ---------- HOW IT WORKS: route timeline ---------- */
        .route-wrap { position: relative; padding-top: 10px; }
        .route-line {
          position: absolute; left: 0; right: 0; top: 46px; height: 3px;
          background: var(--line); border-radius: 999px; overflow: hidden;
        }
        .route-line-fill {
          position: absolute; inset: 0; width: 0%;
          background: linear-gradient(90deg, var(--emerald-deep), var(--emerald), var(--amber));
          transition: width 1.6s cubic-bezier(.22,.61,.36,1) 0.2s;
        }
        .route-line-fill.on { width: 100%; }
        .route-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; position: relative; }
        @media (max-width: 860px) { .route-grid { grid-template-columns: 1fr; } .route-line { display: none; } }
        .route-node {
          width: 92px; height: 92px; border-radius: 999px; margin-bottom: 22px;
          background: white; border: 2px solid var(--line);
          display: flex; align-items: center; justify-content: center; position: relative; z-index: 2;
          font-family: 'Fraunces', serif; font-size: 13px; font-weight: 600; color: var(--emerald-deep);
          text-align: center; line-height: 1.15; padding: 6px;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .route-step.on .route-node { border-color: var(--emerald); box-shadow: 0 8px 24px -10px rgba(22,163,74,0.4); }
        .route-step h3 { font-size: 18px; font-weight: 600; margin: 0 0 8px; }
        .route-step p { font-size: 14.5px; color: var(--ink-soft); line-height: 1.55; max-width: 250px; }

        /* ---------- IMPACT ---------- */
        .impact-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 860px) { .impact-strip { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 520px) { .impact-strip { grid-template-columns: 1fr; } }
        .impact-card {
          border-radius: 18px; padding: 26px 22px; height: 100%;
          background: linear-gradient(165deg, var(--emerald-deep), #0a3a22 75%);
          color: var(--paper); position: relative; overflow: hidden;
        }
        .impact-card:nth-child(4) { background: linear-gradient(165deg, var(--coral), #c94314 75%); }
        .impact-num { font-family: 'Fraunces', serif; font-size: 34px; font-weight: 600; opacity: 0.5; margin-bottom: 10px; }
        .impact-card h3 { font-size: 16px; font-weight: 600; margin: 0 0 8px; color: var(--paper); }
        .impact-card p { font-size: 13px; line-height: 1.55; color: rgba(251,248,242,0.75); margin: 0; }

        /* ---------- FEATURES ---------- */
        .feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        @media (max-width: 980px) { .feature-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .feature-grid { grid-template-columns: 1fr; } }
        .feature-card {
          background: white; border: 1px solid var(--line); border-radius: 18px; padding: 26px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px -22px rgba(18,36,26,0.25);
          border-color: rgba(22,163,74,0.35);
        }
        .feature-ico {
          width: 42px; height: 42px; border-radius: 12px; margin-bottom: 16px;
          background: linear-gradient(135deg, rgba(22,163,74,0.14), rgba(245,158,11,0.14));
          color: var(--emerald-deep); display: flex; align-items: center; justify-content: center;
        }
        .feature-card h3 { font-size: 16px; font-weight: 600; margin: 0 0 8px; font-family: 'Inter'; }
        .feature-card p { font-size: 13.8px; color: var(--ink-soft); line-height: 1.55; margin: 0; }

        /* ---------- TESTIMONIALS ---------- */
        .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        @media (max-width: 900px) { .testi-grid { grid-template-columns: 1fr; } }
        .testi-card {
          background: var(--paper-dim); border: 1px solid var(--line); border-radius: 20px; padding: 30px;
          position: relative;
        }
        .testi-quote-ico { color: var(--emerald); opacity: 0.5; margin-bottom: 14px; }
        .testi-card p.quote { font-size: 15.5px; line-height: 1.65; margin: 0 0 22px; color: var(--ink); }
        .testi-person { display: flex; align-items: center; gap: 12px; }
        .testi-avatar {
          width: 40px; height: 40px; border-radius: 999px;
          background: linear-gradient(135deg, var(--emerald), var(--emerald-deep));
          color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;
          font-family: 'Fraunces', serif;
        }
        .testi-name { font-size: 14px; font-weight: 700; }
        .testi-role { font-size: 12.5px; color: var(--ink-soft); }

        /* ---------- CTA ---------- */
        .cta-section {
          margin: 0 28px 108px; border-radius: 28px; padding: 72px 48px;
          background: linear-gradient(135deg, var(--emerald-deep), #0a3a22 55%, #1a1206);
          position: relative; overflow: hidden; text-align: center;
        }
        .cta-section::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(245,158,11,0.25), transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(22,163,74,0.3), transparent 50%);
        }
        .cta-inner { position: relative; max-width: 560px; margin: 0 auto; }
        .cta-inner h2 { color: var(--paper); font-size: clamp(26px, 3.4vw, 36px); margin: 0 0 14px; font-weight: 600; }
        .cta-inner p { color: rgba(251,248,242,0.72); font-size: 16px; margin-bottom: 30px; line-height: 1.6; }
        .cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* ---------- FOOTER ---------- */
        footer { border-top: 1px solid var(--line); padding: 56px 0 32px; }
        .footer-grid { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 32px; margin-bottom: 40px; }
        @media (max-width: 780px) { .footer-grid { grid-template-columns: repeat(2, 1fr); } }
        .footer-brand p { font-size: 13.5px; color: var(--ink-soft); line-height: 1.6; margin-top: 12px; max-width: 260px; }
        .footer-col h4 { font-size: 13px; font-weight: 700; margin: 0 0 14px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-soft); }
        .footer-col a { display: block; font-size: 14px; color: var(--ink); margin-bottom: 10px; opacity: 0.82; transition: opacity 0.2s; }
        .footer-col a:hover { opacity: 1; color: var(--emerald-deep); }
        .footer-bottom {
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
          padding-top: 24px; border-top: 1px solid var(--line); font-size: 13px; color: var(--ink-soft);
        }
        .social-row { display: flex; gap: 14px; }
        .social-row a { width: 34px; height: 34px; border-radius: 10px; background: var(--paper-dim); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; }

        /* ---------- MOBILE MENU ---------- */
        .mobile-menu {
          position: fixed; inset: 0; z-index: 100; background: var(--paper);
          padding: 20px 28px; display: flex; flex-direction: column;
        }
        .mobile-menu a { font-size: 22px; font-weight: 600; padding: 16px 0; border-bottom: 1px solid var(--line); font-family: 'Fraunces', serif; }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand">
            <span className="brand-mark"><UtensilsCrossed size={16} /></span>
            Foodward
          </div>
          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>
          <div className="nav-cta">
            <button className="btn btn-ghost" onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode">
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/signup" className="btn btn-primary">Donate food</Link>
          </div>
          <button className="nav-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none" }}>
              <X size={26} />
            </button>
          </div>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Link to="/login" className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Log in</Link>
            <Link to="/signup" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>Donate food</Link>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="wrap hero-grid">
          <Reveal>
            <div>
              <span className="eyebrow"><span className="eyebrow-dot" /> Live in 40+ cities</span>
              <h1>
                Good food shouldn't <em>go to waste</em> —<br />
                it should go to someone hungry.
              </h1>
              <p className="lede">
                Foodward connects hotels, restaurants, and event kitchens with nearby orphanages,
                so surplus meals reach a child before they ever reach a bin.
              </p>
              <div className="hero-actions">
                <Link to="/signup" className="btn btn-primary">Donate food <ArrowUpRight size={16} /></Link>
                <Link to="/signup" className="btn btn-secondary">Find donations</Link>
              </div>
              <div className="hero-trust">
                <span className="trust-item"><ShieldCheck size={16} /> Verified kitchens & shelters</span>
                <span className="trust-item"><CalendarClock size={16} /> Avg. 34 min to pickup</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="hero-art">
              <div className="art-card art-main">
                <div className="art-row">
                  <div className="art-node"><UtensilsCrossed size={22} /></div>
                  <div className="art-node"><Radar size={22} /></div>
                </div>
                <div className="art-path">
                  <div className="art-pulse" />
                </div>
                <div className="art-meal-card">
                  <div className="art-meal-title">Banquet surplus · expires in 42 min</div>
                  <div className="art-bar-track"><div className="art-bar-fill" /></div>
                  <div className="art-meal-meta"><span>3 shelters notified</span><span>1.2 km away</span></div>
                </div>
              </div>
              <div className="art-card art-float-1">
                <div className="ico"><ShieldCheck size={17} /></div>
                <div className="txt">Verified<br />pickup</div>
              </div>
              <div className="art-card art-float-2">
                <div className="txt-top">Meals rescued today</div>
                <div className="txt-big">1,842</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <div className="wrap stats-grid">
          <Stat value={182400} suffix="+" label="Meals saved" active={statsInView} delay={0} />
          <Stat value={640} suffix="+" label="Hotels & restaurants registered" active={statsInView} delay={120} />
          <Stat value={310} suffix="+" label="Orphanages connected" active={statsInView} delay={240} />
          <Stat value={68} suffix="%" label="Reduction in kitchen food waste" active={statsInView} delay={360} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div className="section-kicker">The route a meal takes</div>
              <h2>From surplus to a shared table, in one afternoon.</h2>
              <p>Every donation follows the same short path — timed against the one thing that matters: freshness.</p>
            </div>
          </Reveal>
          <RouteTimeline />
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features" style={{ background: "var(--paper-dim)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div className="section-kicker">Built for urgency</div>
              <h2>Everything a kitchen or a shelter needs, nothing they don't.</h2>
            </div>
          </Reveal>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className="feature-card">
                  <div className="feature-ico"><f.icon size={20} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section" id="impact">
        <div className="wrap">
          <Reveal>
            <div className="section-head" style={{ margin: "0 auto 56px", textAlign: "center" }}>
              <div className="section-kicker" style={{ margin: "0 auto 12px" }}>The bigger picture</div>
              <h2>What one saved tray actually becomes.</h2>
              <p style={{ margin: "0 auto" }}>Follow a single donation from a kitchen counter to a shared table.</p>
            </div>
          </Reveal>
          <div className="impact-strip">
            {[
              { n: "01", label: "Food saved", copy: "A tray that would've been scraped into a bin at closing." },
              { n: "02", label: "Donation listed", copy: "Logged with freshness and pickup window in under a minute." },
              { n: "03", label: "Pickup completed", copy: "Claimed, collected, and delivered before it ever cools." },
              { n: "04", label: "Happy children", copy: "A shelter serves a real meal it didn't have to stretch for." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="impact-card">
                  <div className="impact-num">{s.n}</div>
                  <h3>{s.label}</h3>
                  <p>{s.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="stories">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div className="section-kicker">In their words</div>
              <h2>Real kitchens, real shelters, real meals.</h2>
            </div>
          </Reveal>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="testi-card">
                  <Quote size={26} className="testi-quote-ico" />
                  <p className="quote">"{t.quote}"</p>
                  <div className="testi-person">
                    <div className="testi-avatar">{t.name.split(" ").map((n) => n[0]).join("")}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about">
        <div className="cta-section">
          <div className="cta-inner">
            <h2>Join the mission — one surplus meal at a time.</h2>
            <p>Whether you run a kitchen, manage a shelter, or just want to drive a pickup, there's a place for you in the chain.</p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary">Register your kitchen</Link>
              <Link to="/signup" className="btn btn-ghost" style={{ background: "rgba(251,248,242,0.12)", color: "var(--paper)", borderColor: "rgba(251,248,242,0.25)" }}>Register your shelter</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <span className="brand-mark"><UtensilsCrossed size={16} /></span>
                Foodward
              </div>
              <p>A quiet piece of infrastructure between kitchens that have too much and shelters that don't have enough.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#stories">Stories</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/about">About us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/faq">FAQs</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy policy</Link>
              <Link to="/terms">Terms & conditions</Link>
            </div>
            <div className="footer-col">
              <h4>Follow</h4>
              <div className="social-row">
                <a href="#" aria-label="Twitter">𝕏</a>
                <a href="#" aria-label="Instagram">◎</a>
                <a href="#" aria-label="LinkedIn">in</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Foodward. All rights reserved.</span>
            <span>Made for kitchens and shelters everywhere.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RouteTimeline() {
  const [ref, inView] = useInView(0.25);
  return (
    <div className="route-wrap" ref={ref}>
      <div className="route-line"><div className={`route-line-fill ${inView ? "on" : ""}`} /></div>
      <div className="route-grid">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 140}>
            <div className={`route-step ${inView ? "on" : ""}`}>
              <div className="route-node">{s.node}</div>
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
