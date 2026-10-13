import React, { useState } from "react";
import {
  UtensilsCrossed,
  LayoutGrid,
  Radar,
  CheckCircle2,
  History,
  Bell,
  Search,
  MapPin,
  Clock,
  Package,
  ChevronRight,
  LogOut,
  Settings,
  UserCircle,
  Filter,
  Truck,
  X,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV = [
  { id: "nearby", label: "Nearby food", icon: Radar },
  { id: "accepted", label: "Accepted", icon: CheckCircle2 },
  { id: "pickup", label: "Pickup status", icon: Truck },
  { id: "history", label: "Donation history", icon: History },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: UserCircle },
];

const NEARBY = [
  { id: 1, food: "Banquet rice & curry trays", kitchen: "The Meridian Hotel", meals: 48, distance: "1.2 km", expires: "38 min", freshness: "Freshly cooked" },
  { id: 2, food: "Bread & pastry surplus", kitchen: "Corner Bakery Co.", meals: 22, distance: "2.8 km", expires: "1h 10m", freshness: "A few hours old" },
  { id: 3, food: "Vegetable biryani (event)", kitchen: "Grand Palace Banquets", meals: 60, distance: "0.9 km", expires: "22 min", freshness: "Freshly cooked" },
  { id: 4, food: "Sandwich & salad platters", kitchen: "The Oak Room", meals: 30, distance: "3.4 km", expires: "1h 45m", freshness: "Packaged / sealed" },
];

const ACCEPTED = [
  { food: "Paneer & dal trays", kitchen: "The Meridian Hotel", meals: 40, pickupWindow: "6:30 – 7:00 PM", status: "Awaiting pickup" },
  { food: "Fruit & dessert trays", kitchen: "Sunrise Catering", meals: 25, pickupWindow: "5:00 – 5:30 PM", status: "Volunteer assigned" },
];

const PICKUPS = [
  { food: "Rice & curry trays", volunteer: "David Owusu", eta: "12 min away", stage: 2 },
  { food: "Buffet leftovers", volunteer: "Priya Nair", eta: "En route", stage: 1 },
];

const HISTORY = [
  { date: "Jul 4, 2026", food: "Paneer & dal trays", meals: 40, kitchen: "The Meridian Hotel", status: "Completed" },
  { date: "Jul 2, 2026", food: "Sandwich platters", meals: 30, kitchen: "The Oak Room", status: "Completed" },
  { date: "Jun 29, 2026", food: "Fruit & dessert trays", meals: 25, kitchen: "Sunrise Catering", status: "Completed" },
  { date: "Jun 24, 2026", food: "Bakery surplus", meals: 18, kitchen: "Corner Bakery Co.", status: "Missed" },
];

const NOTIFS = [
  { title: "New donation nearby", body: "Grand Palace Banquets listed 60 meals, 0.9 km away.", time: "2 min ago", unread: true },
  { title: "Pickup confirmed", body: "David Owusu is en route for the rice & curry trays.", time: "26 min ago", unread: true },
  { title: "Donation expiring soon", body: "Bread & pastry surplus expires in 20 minutes.", time: "1h ago", unread: false },
];

function StatusPill({ status }) {
  const map = {
    "Awaiting pickup": { bg: "rgba(245,158,11,0.15)", fg: "#8A5A06" },
    "Volunteer assigned": { bg: "rgba(22,163,74,0.12)", fg: "#0B4A2B" },
    Completed: { bg: "rgba(22,163,74,0.12)", fg: "#0B4A2B" },
    Missed: { bg: "rgba(214,67,46,0.12)", fg: "#B5341F" },
  };
  const c = map[status] || map["Awaiting pickup"];
  return <span className="pill" style={{ background: c.bg, color: c.fg }}>{status}</span>;
}

export default function OrphanageDashboard() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [tab, setTab] = useState("nearby");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [accepted, setAccepted] = useState([]);
  const [nearby, setNearby] = useState(NEARBY);
  const [dark, setDark] = useState(false);

  function fireToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  function acceptDonation(item) {
    setNearby((n) => n.filter((i) => i.id !== item.id));
    fireToast(`Accepted "${item.food}" — pickup being arranged.`);
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
        .dash.dark .stat-card, .dash.dark .panel, .dash.dark .food-card, .dash.dark .req-ico, .dash.dark .track-card,
        .dash.dark .profile-avatar-card, .dash.dark .icon-btn, .dash.dark .search-shell, .dash.dark .btn-ghost { background: var(--card); }
        .dash.dark .form-field input, .dash.dark .form-field textarea { background: var(--paper); color: var(--ink); }
        * { box-sizing: border-box; }
        .dash { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); min-height: 100vh; -webkit-font-smoothing: antialiased; transition: background 0.3s ease, color 0.3s ease; }
        .dash h1, .dash h2, .dash .display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
        button { font-family: inherit; cursor: pointer; }
        :focus-visible { outline: 2px solid var(--emerald-deep); outline-offset: 2px; }

        .shell { display: grid; grid-template-columns: 258px 1fr; min-height: 100vh; }
        @media (max-width: 940px) { .shell { grid-template-columns: 1fr; } }

        .sidebar {
          background: linear-gradient(180deg, var(--emerald-deep), #0a3a22 70%, #0d2f1c);
          color: var(--paper); padding: 24px 18px; display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh;
        }
        @media (max-width: 940px) {
          .sidebar { position: fixed; inset: 0 20% 0 0; z-index: 60; transform: translateX(-100%); transition: transform 0.3s ease; }
          .sidebar.open { transform: translateX(0); }
        }
        .side-brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 17px; margin-bottom: 30px; padding: 0 6px; }
        .brand-mark { width: 28px; height: 28px; border-radius: 8px; background: rgba(251,248,242,0.14); border: 1px solid rgba(251,248,242,0.25); display: flex; align-items: center; justify-content: center; }
        .side-nav { display: flex; flex-direction: column; gap: 3px; flex: 1; }
        .side-nav button {
          display: flex; align-items: center; gap: 11px; padding: 11px 12px; border-radius: 10px;
          border: none; background: transparent; color: rgba(251,248,242,0.72); font-size: 14px; font-weight: 500;
          text-align: left; transition: background 0.2s ease, color 0.2s ease; position: relative;
        }
        .side-nav button:hover { background: rgba(251,248,242,0.08); color: var(--paper); }
        .side-nav button.active { background: rgba(251,248,242,0.14); color: var(--paper); font-weight: 600; }
        .nav-badge { position: absolute; right: 12px; background: var(--coral); color: white; font-size: 10.5px; font-weight: 700; padding: 1px 6px; border-radius: 999px; }
        .side-foot { border-top: 1px solid rgba(251,248,242,0.15); padding-top: 14px; margin-top: 14px; }
        .side-foot button { display: flex; align-items: center; gap: 10px; color: rgba(251,248,242,0.6); font-size: 13.5px; padding: 9px 12px; background: none; border: none; width: 100%; text-align: left; border-radius: 9px; }
        .side-foot button:hover { background: rgba(251,248,242,0.08); color: var(--paper); }

        .topbar {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 16px 28px; border-bottom: 1px solid var(--line); background: rgba(251,248,242,0.9);
          backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 20;
        }
        .search-shell {
          display: flex; align-items: center; gap: 9px; background: white; border: 1px solid var(--line);
          border-radius: 11px; padding: 9px 14px; width: 320px; max-width: 40vw; color: var(--ink-soft);
        }
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

        .filter-row { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
        .filter-chip { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px; border: 1.5px solid var(--line); background: white; font-size: 13px; font-weight: 600; color: var(--ink-soft); }
        .filter-chip.active { border-color: var(--emerald); color: var(--emerald-deep); background: rgba(22,163,74,0.06); }

        .card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 780px) { .card-grid { grid-template-columns: 1fr; } }
        .food-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 20px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .food-card:hover { transform: translateY(-3px); box-shadow: 0 16px 34px -20px rgba(18,36,26,0.25); }
        .food-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .food-ico { width: 42px; height: 42px; border-radius: 12px; background: var(--paper-dim); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; }
        .expiry-badge { font-size: 12px; font-weight: 700; color: var(--coral); background: rgba(241,101,42,0.1); padding: 4px 10px; border-radius: 999px; }
        .food-title { font-size: 15.5px; font-weight: 700; margin-bottom: 3px; }
        .food-kitchen { font-size: 12.8px; color: var(--ink-soft); margin-bottom: 12px; }
        .food-meta { display: flex; gap: 14px; font-size: 12.5px; color: var(--ink-soft); margin-bottom: 16px; flex-wrap: wrap; }
        .food-meta span { display: flex; align-items: center; gap: 4px; }
        .food-card-actions { display: flex; gap: 10px; }

        .panel { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 22px; margin-bottom: 22px; }
        .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .panel-head h3 { font-size: 15.5px; font-weight: 700; font-family: 'Inter'; margin: 0; }

        .req-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--line); }
        .req-row:last-child { border-bottom: none; }
        .req-main { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .req-ico { width: 40px; height: 40px; border-radius: 11px; background: var(--paper-dim); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .req-food { font-size: 14px; font-weight: 600; }
        .req-meta { font-size: 12.5px; color: var(--ink-soft); display: flex; gap: 10px; margin-top: 3px; flex-wrap: wrap; }
        .req-meta span { display: flex; align-items: center; gap: 4px; }
        .req-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
        .pill { padding: 5px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 700; white-space: nowrap; }

        /* pickup tracker */
        .track-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 22px; margin-bottom: 18px; }
        .track-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
        .track-food { font-size: 15.5px; font-weight: 700; }
        .track-vol { font-size: 12.8px; color: var(--ink-soft); margin-top: 2px; }
        .track-steps { display: flex; align-items: center; }
        .track-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
        .track-node { width: 30px; height: 30px; border-radius: 999px; background: var(--paper-dim); border: 2px solid var(--line); display: flex; align-items: center; justify-content: center; z-index: 2; color: var(--ink-soft); font-size: 12px; font-weight: 700; }
        .track-node.done { background: var(--emerald); border-color: var(--emerald); color: white; }
        .track-node.current { border-color: var(--coral); color: var(--coral); background: white; }
        .track-line { position: absolute; top: 15px; left: 50%; right: -50%; height: 2px; background: var(--line); z-index: 1; }
        .track-line.done { background: var(--emerald); }
        .track-label { font-size: 11px; color: var(--ink-soft); margin-top: 8px; text-align: center; }

        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink-soft); padding: 0 10px 12px; font-weight: 700; }
        td { padding: 13px 10px; font-size: 13.8px; border-top: 1px solid var(--line); }
        tr:hover td { background: var(--paper-dim); }
        .table-scroll { overflow-x: auto; }
        table { min-width: 560px; }

        .notif-row { display: flex; gap: 14px; padding: 15px 0; border-bottom: 1px solid var(--line); }
        .notif-row:last-child { border-bottom: none; }
        .notif-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--coral); margin-top: 6px; flex-shrink: 0; }
        .notif-dot.read { background: var(--line); }
        .notif-title { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
        .notif-body { font-size: 13px; color: var(--ink-soft); line-height: 1.5; }
        .notif-time { font-size: 11.5px; color: var(--ink-soft); margin-top: 4px; }

        .profile-grid { display: grid; grid-template-columns: 220px 1fr; gap: 24px; }
        @media (max-width: 720px) { .profile-grid { grid-template-columns: 1fr; } }
        .profile-avatar-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 26px; text-align: center; height: fit-content; }
        .profile-avatar-big { width: 84px; height: 84px; border-radius: 999px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; font-family: 'Fraunces', serif; margin: 0 auto 14px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full { grid-column: 1 / -1; }
        .form-field label { font-size: 13px; font-weight: 600; color: var(--ink); }
        .form-field input, .form-field textarea {
          border: 1.5px solid var(--line); border-radius: 11px; padding: 11px 13px; font-size: 13.8px;
          background: var(--paper); color: var(--ink); outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-field input:focus, .form-field textarea:focus { border-color: var(--emerald); box-shadow: 0 0 0 4px rgba(22,163,74,0.1); background: white; }
        .form-field textarea { resize: vertical; min-height: 80px; }

        .empty-state { text-align: center; padding: 50px 20px; color: var(--ink-soft); }
        .empty-state svg { color: var(--line); margin-bottom: 14px; }

        .toast {
          position: fixed; bottom: 26px; right: 26px; background: var(--emerald-deep); color: var(--paper);
          padding: 14px 20px; border-radius: 12px; display: flex; align-items: center; gap: 10px;
          font-size: 13.8px; font-weight: 600; box-shadow: 0 14px 34px -12px rgba(0,0,0,0.4); z-index: 100;
          animation: toastIn 0.35s cubic-bezier(.22,.61,.36,1);
        }
        @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .backdrop-mobile { display: none; }
        @media (max-width: 940px) { .backdrop-mobile.show { display: block; position: fixed; inset: 0; background: rgba(18,36,26,0.4); z-index: 50; } }
      `}</style>

      <div className="shell">
        <div className={`backdrop-mobile ${mobileNavOpen ? "show" : ""}`} onClick={() => setMobileNavOpen(false)} />
        <aside className={`sidebar ${mobileNavOpen ? "open" : ""}`}>
          <Link to="/" className="side-brand" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="brand-mark"><UtensilsCrossed size={15} /></span>
            Foodward
          </Link>
          <nav className="side-nav">
            {NAV.map((n) => (
              <button key={n.id} className={tab === n.id ? "active" : ""} onClick={() => { setTab(n.id); setMobileNavOpen(false); }}>
                <n.icon size={17} /> {n.label}
                {n.id === "nearby" && nearby.length > 0 && <span className="nav-badge">{nearby.length}</span>}
                {n.id === "notifications" && <span className="nav-badge">2</span>}
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
              <button className="icon-btn mobile-nav-toggle" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
                <LayoutGrid size={17} />
              </button>
              <div className="search-shell">
                <Search size={15} />
                <input placeholder="Search kitchens, food types…" />
              </div>
            </div>
            <div className="top-actions">
              <button className="icon-btn" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
              <button className="icon-btn" aria-label="Notifications" onClick={() => setTab("notifications")}><Bell size={17} /><span className="dot" /></button>
              <div className="avatar">HH</div>
            </div>
          </div>

          <div className="content">
            {tab === "nearby" && <NearbyFood items={nearby} onAccept={acceptDonation} />}
            {tab === "accepted" && <Accepted />}
            {tab === "pickup" && <PickupStatus />}
            {tab === "history" && <HistoryPage />}
            {tab === "notifications" && <Notifications />}
            {tab === "profile" && <Profile />}
          </div>
        </div>
      </div>

      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function NearbyFood({ items, onAccept }) {
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Nearby food</h2>
          <p>Live listings from kitchens within your radius, ranked by how soon they expire.</p>
        </div>
      </div>
      <div className="filter-row">
        <span className="filter-chip active"><Filter size={13} /> All</span>
        <span className="filter-chip">Under 1 km</span>
        <span className="filter-chip">Expiring soon</span>
        <span className="filter-chip">Freshly cooked</span>
      </div>
      {items.length === 0 ? (
        <div className="empty-state panel">
          <Radar size={34} />
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>No listings right now</div>
          <div style={{ fontSize: 13.5, marginTop: 4 }}>We'll notify you the moment a kitchen nearby lists surplus food.</div>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <div className="food-card" key={item.id}>
              <div className="food-card-top">
                <div className="food-ico"><Package size={19} /></div>
                <span className="expiry-badge">Expires {item.expires}</span>
              </div>
              <div className="food-title">{item.food}</div>
              <div className="food-kitchen">{item.kitchen}</div>
              <div className="food-meta">
                <span><Package size={12} /> {item.meals} meals</span>
                <span><MapPin size={12} /> {item.distance}</span>
                <span><Clock size={12} /> {item.freshness}</span>
              </div>
              <div className="food-card-actions">
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => onAccept(item)}>Accept</button>
                <button className="btn btn-ghost btn-sm">Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Accepted() {
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Accepted donations</h2>
          <p>Confirmed requests waiting for pickup.</p>
        </div>
      </div>
      <div className="panel">
        {ACCEPTED.map((a) => (
          <div className="req-row" key={a.food}>
            <div className="req-main">
              <div className="req-ico"><Package size={18} /></div>
              <div style={{ minWidth: 0 }}>
                <div className="req-food">{a.food}</div>
                <div className="req-meta">
                  <span><Package size={12} /> {a.meals} meals</span>
                  <span><MapPin size={12} /> {a.kitchen}</span>
                  <span><Clock size={12} /> Pickup {a.pickupWindow}</span>
                </div>
              </div>
            </div>
            <div className="req-right"><StatusPill status={a.status} /></div>
          </div>
        ))}
      </div>
    </>
  );
}

function PickupStatus() {
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Pickup status</h2>
          <p>Track volunteers on the way to your door in real time.</p>
        </div>
      </div>
      {PICKUPS.map((p) => (
        <div className="track-card" key={p.food}>
          <div className="track-top">
            <div>
              <div className="track-food">{p.food}</div>
              <div className="track-vol">{p.volunteer} · {p.eta}</div>
            </div>
            <button className="btn btn-ghost btn-sm"><Truck size={14} /> Message</button>
          </div>
          <div className="track-steps">
            {["Accepted", "Volunteer assigned", "En route", "Delivered"].map((label, i) => (
              <div className="track-step" key={label}>
                {i < 3 && <div className={`track-line ${i < p.stage ? "done" : ""}`} />}
                <div className={`track-node ${i < p.stage ? "done" : i === p.stage ? "current" : ""}`}>
                  {i < p.stage ? <Check size={14} /> : i + 1}
                </div>
                <div className="track-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function HistoryPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Donation history</h2>
          <p>Everything you've received, completed or missed.</p>
        </div>
        <button className="btn btn-ghost">Export CSV</button>
      </div>
      <div className="panel">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Date</th><th>Food</th><th>Meals</th><th>Kitchen</th><th>Status</th></tr></thead>
            <tbody>
              {HISTORY.map((h) => (
                <tr key={h.date + h.food}>
                  <td style={{ color: "var(--ink-soft)" }}>{h.date}</td>
                  <td style={{ fontWeight: 600 }}>{h.food}</td>
                  <td>{h.meals}</td>
                  <td>{h.kitchen}</td>
                  <td><StatusPill status={h.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Notifications() {
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Notifications</h2>
          <p>Everything that's happened, most recent first.</p>
        </div>
        <button className="btn btn-ghost">Mark all read</button>
      </div>
      <div className="panel">
        {NOTIFS.map((n) => (
          <div className="notif-row" key={n.title}>
            <div className={`notif-dot ${n.unread ? "" : "read"}`} />
            <div>
              <div className="notif-title">{n.title}</div>
              <div className="notif-body">{n.body}</div>
              <div className="notif-time">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Profile() {
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Profile</h2>
          <p>Manage how kitchens and volunteers see your shelter.</p>
        </div>
      </div>
      <div className="profile-grid">
        <div className="profile-avatar-card">
          <div className="profile-avatar-big">HH</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Hope House Orphanage</div>
          <div style={{ fontSize: 12.8, color: "var(--ink-soft)", marginTop: 3 }}>Verified shelter</div>
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 16 }}>Change photo</button>
        </div>
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="form-grid">
            <div className="form-field"><label>Organization name</label><input defaultValue="Hope House Orphanage" /></div>
            <div className="form-field"><label>Contact email</label><input defaultValue="admin@hopehouse.org" /></div>
            <div className="form-field"><label>Phone</label><input defaultValue="+1 (555) 044-7710" /></div>
            <div className="form-field"><label>Registration ID</label><input defaultValue="FW-ORG-01193" disabled /></div>
            <div className="form-field full"><label>Address</label><input defaultValue="14 Willow Street" /></div>
            <div className="form-field full"><label>Children in care (approx.)</label><input defaultValue="52" /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <button className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </>
  );
}
