import React, { useState } from "react";
import {
  UtensilsCrossed,
  Bike,
  MapPin,
  Route,
  History,
  UserCircle,
  Bell,
  Search,
  Clock,
  Package,
  LogOut,
  Settings,
  LayoutGrid,
  Navigation,
  Check,
  Phone,
  MessageCircle,
  Sun,
  Moon,
  Plus,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV = [
  { id: "available", label: "Available pickups", icon: Package },
  { id: "assigned", label: "Assigned deliveries", icon: Bike },
  { id: "route", label: "Route map", icon: Route },
  { id: "completed", label: "Completed", icon: History },
  { id: "profile", label: "Profile", icon: UserCircle },
];

const AVAILABLE = [
  { id: 1, food: "Banquet rice & curry trays", from: "The Meridian Hotel", to: "Hope House Orphanage", distance: "1.2 km", meals: 48, expires: "38 min" },
  { id: 2, food: "Vegetable biryani (event)", from: "Grand Palace Banquets", to: "Sunrise Shelter", distance: "0.9 km", meals: 60, expires: "22 min" },
  { id: 3, food: "Bread & pastry surplus", from: "Corner Bakery Co.", to: "St. Anne's Home", distance: "2.8 km", meals: 22, expires: "1h 10m" },
];

const ASSIGNED = [
  { food: "Paneer & dal trays", from: "The Meridian Hotel", to: "Hope House Orphanage", stage: 1, contact: "Kitchen manager · Rina" },
];

const COMPLETED = [
  { date: "Jul 4, 2026", food: "Sandwich platters", from: "The Oak Room", to: "St. Anne's Home", meals: 30 },
  { date: "Jul 2, 2026", food: "Fruit & dessert trays", from: "Sunrise Catering", to: "Sunrise Shelter", meals: 25 },
  { date: "Jun 29, 2026", food: "Rice & curry trays", from: "The Meridian Hotel", to: "New Hope Center", meals: 55 },
  { date: "Jun 24, 2026", food: "Bakery surplus", from: "Corner Bakery Co.", to: "Hope House Orphanage", meals: 18 },
];

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [tab, setTab] = useState("available");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [available, setAvailable] = useState(AVAILABLE);
  const [assigned, setAssigned] = useState(ASSIGNED);
  const [dark, setDark] = useState(false);

  function fireToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  function claim(item) {
    setAvailable((a) => a.filter((i) => i.id !== item.id));
    setAssigned((a) => [...a, { food: item.food, from: item.from, to: item.to, stage: 0, contact: "Kitchen manager" }]);
    fireToast(`Claimed "${item.food}" — head to ${item.from}.`);
  }

  return (
    <div className={`dash ${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
          --ink: #12241A; --paper: #FBF8F2; --paper-dim: #F4F0E6; --card: #FFFFFF;
          --emerald: #16A34A; --emerald-deep: #0B4A2B; --amber: #F59E0B; --coral: #F1652A;
          --line: #E4E1D8; --ink-soft: rgba(18,36,26,0.6); --danger: #D6432E;
        }
        .dash.dark {
          --ink: #F2F1EA; --paper: #0E1712; --paper-dim: #142019; --card: #16221C; --line: #263229; --ink-soft: rgba(242,241,234,0.6);
        }
        .dash.dark .stat-card, .dash.dark .panel, .dash.dark .pickup-card, .dash.dark .track-card, .dash.dark .map-card,
        .dash.dark .profile-avatar-card, .dash.dark .icon-btn, .dash.dark .search-shell, .dash.dark .btn-ghost { background: var(--card); }
        .dash.dark .form-field input { background: var(--paper); color: var(--ink); }
        * { box-sizing: border-box; }
        .dash { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); min-height: 100vh; -webkit-font-smoothing: antialiased; transition: background 0.3s ease, color 0.3s ease; }
        .dash h1, .dash h2 { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }

        .fab { position: fixed; bottom: 26px; right: 26px; width: 56px; height: 56px; border-radius: 999px; border: none;
          background: linear-gradient(135deg, var(--coral), #E24A15); color: white; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 14px 30px -10px rgba(241,101,42,0.6); z-index: 90; transition: transform 0.2s ease; }
        .fab:hover { transform: scale(1.06); }
        .fab:active { transform: scale(0.95); }
        @media (min-width: 941px) { .fab { display: none; } }
        button { font-family: inherit; cursor: pointer; }
        :focus-visible { outline: 2px solid var(--emerald-deep); outline-offset: 2px; }

        .shell { display: grid; grid-template-columns: 258px 1fr; min-height: 100vh; }
        @media (max-width: 940px) { .shell { grid-template-columns: 1fr; } }
        .sidebar { background: linear-gradient(180deg, var(--emerald-deep), #0a3a22 70%, #0d2f1c); color: var(--paper); padding: 24px 18px; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
        @media (max-width: 940px) { .sidebar { position: fixed; inset: 0 20% 0 0; z-index: 60; transform: translateX(-100%); transition: transform 0.3s ease; } .sidebar.open { transform: translateX(0); } }
        .side-brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 17px; margin-bottom: 30px; padding: 0 6px; }
        .brand-mark { width: 28px; height: 28px; border-radius: 8px; background: rgba(251,248,242,0.14); border: 1px solid rgba(251,248,242,0.25); display: flex; align-items: center; justify-content: center; }
        .side-nav { display: flex; flex-direction: column; gap: 3px; flex: 1; }
        .side-nav button { display: flex; align-items: center; gap: 11px; padding: 11px 12px; border-radius: 10px; border: none; background: transparent; color: rgba(251,248,242,0.72); font-size: 14px; font-weight: 500; text-align: left; transition: background 0.2s ease, color 0.2s ease; position: relative; }
        .side-nav button:hover { background: rgba(251,248,242,0.08); color: var(--paper); }
        .side-nav button.active { background: rgba(251,248,242,0.14); color: var(--paper); font-weight: 600; }
        .nav-badge { position: absolute; right: 12px; background: var(--coral); color: white; font-size: 10.5px; font-weight: 700; padding: 1px 6px; border-radius: 999px; }
        .side-foot { border-top: 1px solid rgba(251,248,242,0.15); padding-top: 14px; margin-top: 14px; }
        .side-foot button { display: flex; align-items: center; gap: 10px; color: rgba(251,248,242,0.6); font-size: 13.5px; padding: 9px 12px; background: none; border: none; width: 100%; text-align: left; border-radius: 9px; }
        .side-foot button:hover { background: rgba(251,248,242,0.08); color: var(--paper); }

        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 28px; border-bottom: 1px solid var(--line); background: rgba(251,248,242,0.9); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 20; }
        .search-shell { display: flex; align-items: center; gap: 9px; background: white; border: 1px solid var(--line); border-radius: 11px; padding: 9px 14px; width: 320px; max-width: 40vw; color: var(--ink-soft); }
        @media (max-width: 640px) { .search-shell { display: none; } }
        .search-shell input { border: none; outline: none; background: transparent; font-size: 13.5px; width: 100%; }
        .top-actions { display: flex; align-items: center; gap: 14px; }
        .icon-btn { position: relative; background: white; border: 1px solid var(--line); border-radius: 10px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; color: var(--ink); }
        .icon-btn .dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; border-radius: 999px; background: var(--coral); }
        .mobile-nav-toggle { display: none; }
        @media (max-width: 940px) { .mobile-nav-toggle { display: flex; } }
        .avatar { width: 34px; height: 34px; border-radius: 999px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; font-family: 'Fraunces', serif; }

        .content { padding: 28px; }
        .page-head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 14px; margin-bottom: 24px; }
        .page-head h2 { font-size: 24px; font-weight: 600; margin: 0 0 4px; }
        .page-head p { font-size: 13.8px; color: var(--ink-soft); margin: 0; }

        .btn { display: inline-flex; align-items: center; gap: 7px; padding: 11px 18px; border-radius: 11px; font-size: 13.8px; font-weight: 600; border: 1px solid transparent; transition: all 0.2s ease; }
        .btn:active { transform: scale(0.97); }
        .btn-primary { background: linear-gradient(135deg, var(--coral), #E24A15); color: white; box-shadow: 0 8px 18px -8px rgba(241,101,42,0.5); }
        .btn-primary:hover { box-shadow: 0 10px 24px -8px rgba(241,101,42,0.65); }
        .btn-ghost { background: white; color: var(--ink); border-color: var(--line); }
        .btn-ghost:hover { background: var(--paper-dim); }
        .btn-sm { padding: 8px 14px; font-size: 13px; }

        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        @media (max-width: 700px) { .stat-grid { grid-template-columns: 1fr; } }
        .stat-card { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; }
        .stat-ico { width: 40px; height: 40px; border-radius: 11px; background: rgba(22,163,74,0.1); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-value { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; }
        .stat-label { font-size: 12.5px; color: var(--ink-soft); }

        .card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 780px) { .card-grid { grid-template-columns: 1fr; } }
        .pickup-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 20px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .pickup-card:hover { transform: translateY(-3px); box-shadow: 0 16px 34px -20px rgba(18,36,26,0.25); }
        .pickup-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .pickup-ico { width: 42px; height: 42px; border-radius: 12px; background: var(--paper-dim); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; }
        .expiry-badge { font-size: 12px; font-weight: 700; color: var(--coral); background: rgba(241,101,42,0.1); padding: 4px 10px; border-radius: 999px; }
        .pickup-title { font-size: 15.5px; font-weight: 700; margin-bottom: 10px; }
        .route-line-mini { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-soft); margin-bottom: 6px; }
        .route-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--emerald); flex-shrink: 0; }
        .route-dot.end { background: var(--coral); }
        .route-connector { width: 1.5px; height: 16px; background: var(--line); margin-left: 3.25px; }
        .pickup-meta { display: flex; gap: 14px; font-size: 12.5px; color: var(--ink-soft); margin: 12px 0 16px; flex-wrap: wrap; }
        .pickup-meta span { display: flex; align-items: center; gap: 4px; }

        .track-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 22px; margin-bottom: 18px; }
        .track-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; flex-wrap: wrap; gap: 12px; }
        .track-food { font-size: 15.5px; font-weight: 700; }
        .track-vol { font-size: 12.8px; color: var(--ink-soft); margin-top: 2px; }
        .track-actions { display: flex; gap: 8px; }
        .track-steps { display: flex; align-items: center; }
        .track-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
        .track-node { width: 30px; height: 30px; border-radius: 999px; background: var(--paper-dim); border: 2px solid var(--line); display: flex; align-items: center; justify-content: center; z-index: 2; color: var(--ink-soft); font-size: 12px; font-weight: 700; }
        .track-node.done { background: var(--emerald); border-color: var(--emerald); color: white; }
        .track-node.current { border-color: var(--coral); color: var(--coral); background: white; }
        .track-line { position: absolute; top: 15px; left: 50%; right: -50%; height: 2px; background: var(--line); z-index: 1; }
        .track-line.done { background: var(--emerald); }
        .track-label { font-size: 11px; color: var(--ink-soft); margin-top: 8px; text-align: center; }

        /* map placeholder */
        .map-card { background: white; border: 1px solid var(--line); border-radius: 20px; overflow: hidden; }
        .map-visual { position: relative; height: 320px; background: linear-gradient(160deg, var(--emerald-deep), #0a3a22 70%, #12240f); }
        .map-visual::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 25% 30%, rgba(245,158,11,0.25), transparent 55%), radial-gradient(circle at 75% 70%, rgba(22,163,74,0.28), transparent 50%); }
        .map-route { position: absolute; left: 12%; right: 12%; top: 50%; height: 2px; background: rgba(255,255,255,0.25); }
        .map-pin { position: absolute; width: 40px; height: 40px; border-radius: 999px; background: rgba(255,255,255,0.14); border: 1.5px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; color: white; transform: translate(-50%, -50%); backdrop-filter: blur(6px); }
        .map-pin.start { top: 50%; left: 12%; }
        .map-pin.end { top: 50%; left: 88%; background: rgba(241,101,42,0.3); border-color: rgba(241,101,42,0.5); }
        .map-mover { position: absolute; top: 50%; width: 14px; height: 14px; border-radius: 999px; background: var(--amber); box-shadow: 0 0 16px 4px rgba(245,158,11,0.6); transform: translate(-50%, -50%); animation: moveAlong 4s ease-in-out infinite; }
        @keyframes moveAlong { 0% { left: 12%; } 50% { left: 50%; } 100% { left: 88%; } }
        .map-info { padding: 20px 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }

        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink-soft); padding: 0 10px 12px; font-weight: 700; }
        td { padding: 13px 10px; font-size: 13.8px; border-top: 1px solid var(--line); }
        tr:hover td { background: var(--paper-dim); }
        .table-scroll { overflow-x: auto; }
        table { min-width: 560px; }
        .panel { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 22px; }

        .profile-grid { display: grid; grid-template-columns: 220px 1fr; gap: 24px; }
        @media (max-width: 720px) { .profile-grid { grid-template-columns: 1fr; } }
        .profile-avatar-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 26px; text-align: center; height: fit-content; }
        .profile-avatar-big { width: 84px; height: 84px; border-radius: 999px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; font-family: 'Fraunces', serif; margin: 0 auto 14px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full { grid-column: 1 / -1; }
        .form-field label { font-size: 13px; font-weight: 600; }
        .form-field input { border: 1.5px solid var(--line); border-radius: 11px; padding: 11px 13px; font-size: 13.8px; background: var(--paper); outline: none; }
        .form-field input:focus { border-color: var(--emerald); box-shadow: 0 0 0 4px rgba(22,163,74,0.1); background: white; }

        .empty-state { text-align: center; padding: 50px 20px; color: var(--ink-soft); }
        .empty-state svg { color: var(--line); margin-bottom: 14px; }

        .toast { position: fixed; bottom: 26px; right: 26px; background: var(--emerald-deep); color: var(--paper); padding: 14px 20px; border-radius: 12px; display: flex; align-items: center; gap: 10px; font-size: 13.8px; font-weight: 600; box-shadow: 0 14px 34px -12px rgba(0,0,0,0.4); z-index: 100; animation: toastIn 0.35s cubic-bezier(.22,.61,.36,1); }
        @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .backdrop-mobile { display: none; }
        @media (max-width: 940px) { .backdrop-mobile.show { display: block; position: fixed; inset: 0; background: rgba(18,36,26,0.4); z-index: 50; } }
      `}</style>

      <div className="shell">
        <div className={`backdrop-mobile ${mobileNavOpen ? "show" : ""}`} onClick={() => setMobileNavOpen(false)} />
        <aside className={`sidebar ${mobileNavOpen ? "open" : ""}`}>
          <Link to="/" className="side-brand" style={{ textDecoration: "none", color: "inherit" }}><span className="brand-mark"><UtensilsCrossed size={15} /></span>Foodward</Link>
          <nav className="side-nav">
            {NAV.map((n) => (
              <button key={n.id} className={tab === n.id ? "active" : ""} onClick={() => { setTab(n.id); setMobileNavOpen(false); }}>
                <n.icon size={17} /> {n.label}
                {n.id === "available" && available.length > 0 && <span className="nav-badge">{available.length}</span>}
                {n.id === "assigned" && assigned.length > 0 && <span className="nav-badge">{assigned.length}</span>}
              </button>
            ))}
          </nav>
          <div className="side-foot">
            <button onClick={() => navigate("/settings")}><Settings size={16} /> Settings</button>
            <button onClick={() => { auth.logout(); navigate("/"); }}><LogOut size={16} /> Log out</button>
          </div>
        </aside>

        <div>
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="icon-btn mobile-nav-toggle" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"><LayoutGrid size={17} /></button>
              <div className="search-shell"><Search size={15} /><input placeholder="Search pickups…" /></div>
            </div>
            <div className="top-actions">
              <button className="icon-btn" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
              <button className="icon-btn" aria-label="Notifications" onClick={() => navigate("/notifications")}><Bell size={17} /><span className="dot" /></button>
              <div className="avatar">DO</div>
            </div>
          </div>

          <div className="content">
            {tab === "available" && <Available items={available} onClaim={claim} />}
            {tab === "assigned" && <Assigned items={assigned} />}
            {tab === "route" && <RouteMap items={assigned} />}
            {tab === "completed" && <Completed />}
            {tab === "profile" && <Profile />}
          </div>
        </div>
      </div>

      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      <button className="fab" onClick={() => setTab("available")} aria-label="View available pickups"><Plus size={24} /></button>
    </div>
  );
}

function Available({ items, onClaim }) {
  return (
    <>
      <div className="page-head">
        <div><h2>Available pickups</h2><p>Claim a route — the sooner you claim, the fresher the food arrives.</p></div>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-ico"><Package size={18} /></div><div><div className="stat-value">{items.length}</div><div className="stat-label">Open pickups nearby</div></div></div>
        <div className="stat-card"><div className="stat-ico"><Bike size={18} /></div><div><div className="stat-value">12</div><div className="stat-label">Deliveries this month</div></div></div>
        <div className="stat-card"><div className="stat-ico"><Clock size={18} /></div><div><div className="stat-value">27 min</div><div className="stat-label">Avg. delivery time</div></div></div>
      </div>
      {items.length === 0 ? (
        <div className="empty-state panel">
          <Package size={34} />
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>No open pickups right now</div>
          <div style={{ fontSize: 13.5, marginTop: 4 }}>New routes will appear here as kitchens list surplus food.</div>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <div className="pickup-card" key={item.id}>
              <div className="pickup-top">
                <div className="pickup-ico"><Bike size={19} /></div>
                <span className="expiry-badge">Expires {item.expires}</span>
              </div>
              <div className="pickup-title">{item.food}</div>
              <div className="route-line-mini"><span className="route-dot" /> {item.from}</div>
              <div className="route-connector" />
              <div className="route-line-mini"><span className="route-dot end" /> {item.to}</div>
              <div className="pickup-meta">
                <span><Package size={12} /> {item.meals} meals</span>
                <span><MapPin size={12} /> {item.distance}</span>
              </div>
              <button className="btn btn-primary btn-sm" style={{ width: "100%" }} onClick={() => onClaim(item)}>Claim pickup</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Assigned({ items }) {
  return (
    <>
      <div className="page-head">
        <div><h2>Assigned deliveries</h2><p>Routes you've claimed and are actively running.</p></div>
      </div>
      {items.length === 0 ? (
        <div className="empty-state panel"><Bike size={34} /><div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>Nothing assigned yet</div><div style={{ fontSize: 13.5, marginTop: 4 }}>Claim a pickup and it'll show up here.</div></div>
      ) : (
        items.map((a) => (
          <div className="track-card" key={a.food}>
            <div className="track-top">
              <div>
                <div className="track-food">{a.food}</div>
                <div className="track-vol">{a.from} → {a.to} · {a.contact}</div>
              </div>
              <div className="track-actions">
                <button className="btn btn-ghost btn-sm"><Phone size={14} /> Call</button>
                <button className="btn btn-ghost btn-sm"><MessageCircle size={14} /> Message</button>
              </div>
            </div>
            <div className="track-steps">
              {["Claimed", "Picked up", "En route", "Delivered"].map((label, i) => (
                <div className="track-step" key={label}>
                  {i < 3 && <div className={`track-line ${i < a.stage ? "done" : ""}`} />}
                  <div className={`track-node ${i < a.stage ? "done" : i === a.stage ? "current" : ""}`}>{i < a.stage ? <Check size={14} /> : i + 1}</div>
                  <div className="track-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}

function RouteMap({ items }) {
  const current = items[0];
  return (
    <>
      <div className="page-head">
        <div><h2>Route map</h2><p>Live view of your current delivery route.</p></div>
      </div>
      {!current ? (
        <div className="empty-state panel"><Navigation size={34} /><div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>No active route</div><div style={{ fontSize: 13.5, marginTop: 4 }}>Claim a pickup to see it mapped here.</div></div>
      ) : (
        <div className="map-card">
          <div className="map-visual">
            <div className="map-route" />
            <div className="map-pin start"><UtensilsCrossed size={16} /></div>
            <div className="map-pin end"><MapPin size={16} /></div>
            <div className="map-mover" />
          </div>
          <div className="map-info">
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{current.food}</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{current.from} → {current.to}</div>
            </div>
            <button className="btn btn-primary btn-sm"><Navigation size={14} /> Start navigation</button>
          </div>
        </div>
      )}
    </>
  );
}

function Completed() {
  return (
    <>
      <div className="page-head">
        <div><h2>Completed deliveries</h2><p>Your full delivery record.</p></div>
        <button className="btn btn-ghost">Export CSV</button>
      </div>
      <div className="panel">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Date</th><th>Food</th><th>From</th><th>To</th><th>Meals</th></tr></thead>
            <tbody>
              {COMPLETED.map((c) => (
                <tr key={c.date + c.food}>
                  <td style={{ color: "var(--ink-soft)" }}>{c.date}</td>
                  <td style={{ fontWeight: 600 }}>{c.food}</td>
                  <td>{c.from}</td>
                  <td>{c.to}</td>
                  <td>{c.meals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Profile() {
  return (
    <>
      <div className="page-head"><div><h2>Profile</h2><p>Your details as seen by kitchens and shelters.</p></div></div>
      <div className="profile-grid">
        <div className="profile-avatar-card">
          <div className="profile-avatar-big">DO</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>David Owusu</div>
          <div style={{ fontSize: 12.8, color: "var(--ink-soft)", marginTop: 3 }}>Verified volunteer</div>
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 16 }}>Change photo</button>
        </div>
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="form-grid">
            <div className="form-field"><label>Full name</label><input defaultValue="David Owusu" /></div>
            <div className="form-field"><label>Contact email</label><input defaultValue="david.owusu@mail.com" /></div>
            <div className="form-field"><label>Phone</label><input defaultValue="+1 (555) 083-4471" /></div>
            <div className="form-field"><label>Vehicle</label><input defaultValue="Sedan · Plate FW-4471" /></div>
            <div className="form-field full"><label>Service area</label><input defaultValue="Within 5 km of downtown" /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <button className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </>
  );
}
