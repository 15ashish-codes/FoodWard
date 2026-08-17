import React, { useState } from "react";
import {
  UtensilsCrossed,
  LayoutGrid,
  PlusCircle,
  History,
  Radar,
  BarChart3,
  UserCircle,
  Bell,
  Search,
  MapPin,
  Clock,
  Package,
  ChevronRight,
  Image as ImageIcon,
  X,
  Check,
  LogOut,
  Settings,
  TrendingUp,
  Sun,
  Moon,
  Plus,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "add", label: "Add donation", icon: PlusCircle },
  { id: "active", label: "Active requests", icon: Radar },
  { id: "history", label: "Donation history", icon: History },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: UserCircle },
];

const ACTIVE_REQUESTS = [
  { food: "Banquet rice & curry trays", meals: 48, shelter: "Hope House Orphanage", distance: "1.2 km", status: "Accepted", expires: "38 min" },
  { food: "Bread & pastry surplus", meals: 22, shelter: "St. Anne's Home", distance: "2.8 km", status: "Pending", expires: "1h 10m" },
  { food: "Vegetable biryani (event)", meals: 60, shelter: "Sunrise Shelter", distance: "0.9 km", status: "Pickup scheduled", expires: "22 min" },
];

const HISTORY = [
  { date: "Jul 4, 2026", food: "Paneer & dal trays", meals: 40, shelter: "Hope House Orphanage", status: "Completed" },
  { date: "Jul 2, 2026", food: "Sandwich platters", meals: 30, shelter: "St. Anne's Home", status: "Completed" },
  { date: "Jun 29, 2026", food: "Fruit & dessert trays", meals: 25, shelter: "Sunrise Shelter", status: "Completed" },
  { date: "Jun 26, 2026", food: "Rice & curry trays", meals: 55, shelter: "New Hope Center", status: "Completed" },
  { date: "Jun 21, 2026", food: "Buffet leftovers", meals: 70, shelter: "Hope House Orphanage", status: "Cancelled" },
];

const WEEKLY = [
  { day: "Mon", meals: 32 }, { day: "Tue", meals: 48 }, { day: "Wed", meals: 28 },
  { day: "Thu", meals: 61 }, { day: "Fri", meals: 74 }, { day: "Sat", meals: 90 }, { day: "Sun", meals: 55 },
];
const CATEGORY = [
  { name: "Rice & curry", value: 38 }, { name: "Bakery", value: 22 },
  { name: "Buffet mix", value: 26 }, { name: "Beverages", value: 9 },
];

const CATEGORIES = ["Cooked meal", "Bakery", "Beverages", "Fruits & desserts", "Buffet mix"];

function StatusPill({ status }) {
  const map = {
    Accepted: { bg: "rgba(22,163,74,0.12)", fg: "#0B4A2B" },
    Pending: { bg: "rgba(245,158,11,0.15)", fg: "#8A5A06" },
    "Pickup scheduled": { bg: "rgba(22,163,74,0.12)", fg: "#0B4A2B" },
    Completed: { bg: "rgba(22,163,74,0.12)", fg: "#0B4A2B" },
    Cancelled: { bg: "rgba(214,67,46,0.12)", fg: "#B5341F" },
  };
  const c = map[status] || map.Pending;
  return <span className="pill" style={{ background: c.bg, color: c.fg }}>{status}</span>;
}

export default function HotelDashboard() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [tab, setTab] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  function fireToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
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
        .dash.dark .stat-card, .dash.dark .panel, .dash.dark .food-card, .dash.dark .req-ico,
        .dash.dark .profile-avatar-card, .dash.dark .icon-btn, .dash.dark .search-shell, .dash.dark .btn-ghost,
        .dash.dark .upload-box { background: var(--card); }
        .dash.dark .form-field input, .dash.dark .form-field select, .dash.dark .form-field textarea { background: var(--paper); color: var(--ink); }
        * { box-sizing: border-box; }
        .dash { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); min-height: 100vh; -webkit-font-smoothing: antialiased; transition: background 0.3s ease, color 0.3s ease; }

        /* skeleton loading */
        .skel { background: linear-gradient(90deg, var(--paper-dim) 25%, var(--line) 37%, var(--paper-dim) 63%); background-size: 400% 100%; animation: skel-shine 1.4s ease infinite; border-radius: 8px; }
        @keyframes skel-shine { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
        .skel-stat { height: 96px; border-radius: 16px; }
        .skel-row { height: 58px; border-radius: 12px; margin-bottom: 10px; }

        /* FAB */
        .fab { position: fixed; bottom: 26px; right: 26px; width: 56px; height: 56px; border-radius: 999px; border: none;
          background: linear-gradient(135deg, var(--coral), #E24A15); color: white; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 14px 30px -10px rgba(241,101,42,0.6); z-index: 90; transition: transform 0.2s ease; }
        .fab:hover { transform: scale(1.06); }
        .fab:active { transform: scale(0.95); }
        @media (min-width: 941px) { .fab { display: none; } }
        .dash h1, .dash h2, .dash .display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
        button { font-family: inherit; cursor: pointer; }
        :focus-visible { outline: 2px solid var(--emerald-deep); outline-offset: 2px; }
        input, select, textarea { font-family: inherit; }

        .shell { display: grid; grid-template-columns: 258px 1fr; min-height: 100vh; }
        @media (max-width: 940px) { .shell { grid-template-columns: 1fr; } }

        /* SIDEBAR */
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
          text-align: left; transition: background 0.2s ease, color 0.2s ease;
        }
        .side-nav button:hover { background: rgba(251,248,242,0.08); color: var(--paper); }
        .side-nav button.active { background: rgba(251,248,242,0.14); color: var(--paper); font-weight: 600; }
        .side-foot { border-top: 1px solid rgba(251,248,242,0.15); padding-top: 14px; margin-top: 14px; }
        .side-foot button { display: flex; align-items: center; gap: 10px; color: rgba(251,248,242,0.6); font-size: 13.5px; padding: 9px 12px; background: none; border: none; width: 100%; text-align: left; border-radius: 9px; }
        .side-foot button:hover { background: rgba(251,248,242,0.08); color: var(--paper); }

        /* TOPBAR */
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
        .top-profile { display: flex; align-items: center; gap: 9px; }
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

        /* stat cards */
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
        @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .stat-grid { grid-template-columns: 1fr; } }
        .stat-card { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 20px; }
        .stat-card .top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
        .stat-ico { width: 36px; height: 36px; border-radius: 10px; background: rgba(22,163,74,0.1); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; }
        .stat-trend { font-size: 12px; font-weight: 700; color: var(--emerald-deep); display: flex; align-items: center; gap: 3px; }
        .stat-value { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; }
        .stat-label { font-size: 12.8px; color: var(--ink-soft); margin-top: 2px; }

        .panel { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 22px; margin-bottom: 22px; }
        .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .panel-head h3 { font-size: 15.5px; font-weight: 700; font-family: 'Inter'; margin: 0; }
        .link-more { font-size: 12.8px; font-weight: 600; color: var(--emerald-deep); display: flex; align-items: center; gap: 3px; background: none; border: none; }

        .req-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--line); }
        .req-row:last-child { border-bottom: none; }
        .req-main { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .req-ico { width: 40px; height: 40px; border-radius: 11px; background: var(--paper-dim); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .req-food { font-size: 14px; font-weight: 600; }
        .req-meta { font-size: 12.5px; color: var(--ink-soft); display: flex; gap: 10px; margin-top: 3px; flex-wrap: wrap; }
        .req-meta span { display: flex; align-items: center; gap: 4px; }
        .req-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
        .req-expiry { font-size: 12.5px; color: var(--coral); font-weight: 600; }

        .pill { padding: 5px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 700; white-space: nowrap; }

        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink-soft); padding: 0 10px 12px; font-weight: 700; }
        td { padding: 13px 10px; font-size: 13.8px; border-top: 1px solid var(--line); }
        tr:hover td { background: var(--paper-dim); }
        .table-scroll { overflow-x: auto; }
        table { min-width: 560px; }

        .charts-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; }
        @media (max-width: 900px) { .charts-grid { grid-template-columns: 1fr; } }
        .bar-legend { display: flex; flex-direction: column; gap: 12px; margin-top: 6px; }
        .bar-legend-row { display: flex; align-items: center; gap: 10px; font-size: 13px; }
        .bar-legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
        .bar-legend-track { flex: 1; height: 8px; background: var(--paper-dim); border-radius: 999px; overflow: hidden; }
        .bar-legend-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--emerald), var(--emerald-deep)); }
        .bar-legend-val { font-weight: 700; width: 30px; text-align: right; }

        /* Add donation form */
        .form-card { max-width: 720px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full { grid-column: 1 / -1; }
        .form-field label { font-size: 13px; font-weight: 600; color: var(--ink); }
        .form-field input, .form-field select, .form-field textarea {
          border: 1.5px solid var(--line); border-radius: 11px; padding: 11px 13px; font-size: 13.8px;
          background: var(--paper); color: var(--ink); outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
          border-color: var(--emerald); box-shadow: 0 0 0 4px rgba(22,163,74,0.1); background: white;
        }
        .form-field textarea { resize: vertical; min-height: 80px; }
        .upload-box {
          border: 1.5px dashed var(--line); border-radius: 14px; padding: 26px; text-align: center;
          color: var(--ink-soft); font-size: 13px; background: var(--paper-dim); cursor: pointer;
        }
        .upload-box svg { margin-bottom: 8px; color: var(--emerald-deep); }
        .step-track { display: flex; gap: 8px; margin-bottom: 26px; }
        .step-dot { flex: 1; height: 5px; border-radius: 999px; background: var(--line); }
        .step-dot.done { background: linear-gradient(90deg, var(--emerald), var(--emerald-deep)); }

        /* profile */
        .profile-grid { display: grid; grid-template-columns: 220px 1fr; gap: 24px; }
        @media (max-width: 720px) { .profile-grid { grid-template-columns: 1fr; } }
        .profile-avatar-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 26px; text-align: center; height: fit-content; }
        .profile-avatar-big { width: 84px; height: 84px; border-radius: 999px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; font-family: 'Fraunces', serif; margin: 0 auto 14px; }

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
                <input placeholder="Search donations, shelters…" />
              </div>
            </div>
            <div className="top-actions">
              <button className="icon-btn" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
              <button className="icon-btn" aria-label="Notifications" onClick={() => navigate("/notifications")}><Bell size={17} /><span className="dot" /></button>
              <div className="top-profile">
                <div className="avatar">TM</div>
              </div>
            </div>
          </div>

          <div className="content">
            {tab === "overview" && (
              <Overview loading={loading} onDonate={() => fireToast("Opening donation form…") || setTab("add")} />
            )}
            {tab === "add" && <AddDonation onSubmit={() => fireToast("Donation listed — nearby shelters notified.")} />}
            {tab === "active" && <ActiveRequests />}
            {tab === "history" && <HistoryPage />}
            {tab === "analytics" && <Analytics />}
            {tab === "profile" && <Profile />}
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast"><Check size={16} /> {toast}</div>
      )}

      <button className="fab" onClick={() => setTab("add")} aria-label="Add donation"><Plus size={24} /></button>
    </div>
  );
}

function Overview({ onDonate, loading }) {
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Good afternoon, The Meridian</h2>
          <p>Here's what's happening with your donations today.</p>
        </div>
        <button className="btn btn-primary" onClick={onDonate}><PlusCircle size={16} /> Add donation</button>
      </div>

      {loading ? (
        <div className="stat-grid">
          {[0, 1, 2, 3].map((i) => <div className="skel skel-stat" key={i} />)}
        </div>
      ) : (
        <div className="stat-grid">
          <StatCard icon={Package} label="Meals donated this month" value="1,240" trend="+18%" />
          <StatCard icon={Radar} label="Active requests" value="3" trend="+1" />
          <StatCard icon={Clock} label="Avg. pickup time" value="34 min" trend="-6%" />
          <StatCard icon={TrendingUp} label="Waste reduced" value="61%" trend="+4%" />
        </div>
      )}

      <div className="panel">
        <div className="panel-head">
          <h3>Active requests</h3>
          <button className="link-more">View all <ChevronRight size={14} /></button>
        </div>
        {loading ? (
          [0, 1, 2].map((i) => <div className="skel skel-row" key={i} />)
        ) : ACTIVE_REQUESTS.map((r) => (
          <div className="req-row" key={r.food}>
            <div className="req-main">
              <div className="req-ico"><Package size={18} /></div>
              <div style={{ minWidth: 0 }}>
                <div className="req-food">{r.food}</div>
                <div className="req-meta">
                  <span><Package size={12} /> {r.meals} meals</span>
                  <span><MapPin size={12} /> {r.shelter} · {r.distance}</span>
                </div>
              </div>
            </div>
            <div className="req-right">
              <div className="req-expiry">Expires in {r.expires}</div>
              <StatusPill status={r.status} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <div className="stat-card">
      <div className="top-row">
        <div className="stat-ico"><Icon size={17} /></div>
        <div className="stat-trend"><TrendingUp size={12} /> {trend}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function ActiveRequests() {
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Active requests</h2>
          <p>Track every donation from listing to pickup.</p>
        </div>
      </div>
      <div className="panel">
        {ACTIVE_REQUESTS.map((r) => (
          <div className="req-row" key={r.food}>
            <div className="req-main">
              <div className="req-ico"><Package size={18} /></div>
              <div style={{ minWidth: 0 }}>
                <div className="req-food">{r.food}</div>
                <div className="req-meta">
                  <span><Package size={12} /> {r.meals} meals</span>
                  <span><MapPin size={12} /> {r.shelter} · {r.distance}</span>
                </div>
              </div>
            </div>
            <div className="req-right">
              <div className="req-expiry">Expires in {r.expires}</div>
              <StatusPill status={r.status} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function HistoryPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Donation history</h2>
          <p>Every donation you've listed, completed or otherwise.</p>
        </div>
        <button className="btn btn-ghost">Export CSV</button>
      </div>
      <div className="panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Date</th><th>Food</th><th>Meals</th><th>Shelter</th><th>Status</th></tr>
            </thead>
            <tbody>
              {HISTORY.map((h) => (
                <tr key={h.date + h.food}>
                  <td style={{ color: "var(--ink-soft)" }}>{h.date}</td>
                  <td style={{ fontWeight: 600 }}>{h.food}</td>
                  <td>{h.meals}</td>
                  <td>{h.shelter}</td>
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

function Analytics() {
  const max = Math.max(...CATEGORY.map((c) => c.value));
  const colors = ["#16A34A", "#0B4A2B", "#F59E0B", "#F1652A"];
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Analytics</h2>
          <p>How your donations have trended this week.</p>
        </div>
      </div>
      <div className="charts-grid">
        <div className="panel">
          <div className="panel-head"><h3>Meals donated — last 7 days</h3></div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={WEEKLY} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="mealFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D8" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#12241A99" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#12241A99" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E1D8", fontSize: 13 }} />
                <Area type="monotone" dataKey="meals" stroke="#0B4A2B" strokeWidth={2.5} fill="url(#mealFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>By category</h3></div>
          <div className="bar-legend">
            {CATEGORY.map((c, i) => (
              <div className="bar-legend-row" key={c.name}>
                <div className="bar-legend-dot" style={{ background: colors[i] }} />
                <span style={{ width: 96, color: "var(--ink-soft)" }}>{c.name}</span>
                <div className="bar-legend-track"><div className="bar-legend-fill" style={{ width: `${(c.value / max) * 100}%`, background: colors[i] }} /></div>
                <span className="bar-legend-val">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function AddDonation({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "", category: CATEGORIES[0], quantity: "", meals: "", freshness: "Freshly cooked",
    cookedTime: "", expiryTime: "", pickupTime: "", location: "", notes: "",
  });
  const steps = ["Food details", "Timing", "Location & notes"];
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  function next() { if (step < steps.length - 1) setStep(step + 1); else { onSubmit(); setStep(0); setData({ ...data, name: "" }); } }
  function back() { if (step > 0) setStep(step - 1); }

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Add a food donation</h2>
          <p>List surplus food so nearby shelters can be notified instantly.</p>
        </div>
      </div>
      <div className="panel form-card">
        <div className="step-track">
          {steps.map((s, i) => <div key={s} className={`step-dot ${i <= step ? "done" : ""}`} />)}
        </div>

        {step === 0 && (
          <div className="form-grid">
            <div className="form-field full">
              <label>Food name</label>
              <input placeholder="e.g. Banquet rice & curry trays" value={data.name} onChange={set("name")} />
            </div>
            <div className="form-field">
              <label>Category</label>
              <select value={data.category} onChange={set("category")}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Freshness</label>
              <select value={data.freshness} onChange={set("freshness")}>
                <option>Freshly cooked</option>
                <option>A few hours old</option>
                <option>Packaged / sealed</option>
              </select>
            </div>
            <div className="form-field">
              <label>Quantity (trays/kg)</label>
              <input placeholder="e.g. 6 trays" value={data.quantity} onChange={set("quantity")} />
            </div>
            <div className="form-field">
              <label>Number of meals</label>
              <input placeholder="e.g. 48" value={data.meals} onChange={set("meals")} />
            </div>
            <div className="form-field full">
              <label>Photos</label>
              <div className="upload-box"><ImageIcon size={22} /><div>Drag photos here, or click to upload</div></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="form-grid">
            <div className="form-field">
              <label>Cooked time</label>
              <input type="time" value={data.cookedTime} onChange={set("cookedTime")} />
            </div>
            <div className="form-field">
              <label>Expiry time</label>
              <input type="time" value={data.expiryTime} onChange={set("expiryTime")} />
            </div>
            <div className="form-field full">
              <label>Preferred pickup window</label>
              <input type="time" value={data.pickupTime} onChange={set("pickupTime")} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-grid">
            <div className="form-field full">
              <label>Hotel location</label>
              <input placeholder="Address or use current location" value={data.location} onChange={set("location")} />
            </div>
            <div className="form-field full">
              <label>Special notes</label>
              <textarea placeholder="Allergen info, packaging details, access instructions…" value={data.notes} onChange={set("notes")} />
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
          <button className="btn btn-ghost" onClick={back} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>Back</button>
          <button className="btn btn-primary" onClick={next}>{step === steps.length - 1 ? "List donation" : "Continue"}</button>
        </div>
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
          <p>Manage how shelters and volunteers see your kitchen.</p>
        </div>
      </div>
      <div className="profile-grid">
        <div className="profile-avatar-card">
          <div className="profile-avatar-big">TM</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>The Meridian Hotel</div>
          <div style={{ fontSize: 12.8, color: "var(--ink-soft)", marginTop: 3 }}>Verified kitchen</div>
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 16 }}>Change photo</button>
        </div>
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="form-grid">
            <div className="form-field"><label>Business name</label><input defaultValue="The Meridian Hotel" /></div>
            <div className="form-field"><label>Contact email</label><input defaultValue="kitchen@meridianhotel.com" /></div>
            <div className="form-field"><label>Phone</label><input defaultValue="+1 (555) 019-2201" /></div>
            <div className="form-field"><label>Registration ID</label><input defaultValue="FW-HTL-00842" disabled /></div>
            <div className="form-field full"><label>Address</label><input defaultValue="220 Harbor Ave, Suite 4" /></div>
            <div className="form-field full"><label>About your kitchen</label><textarea defaultValue="Full-service banquet and event kitchen, typically listing surplus after evening functions." /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <button className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </>
  );
}
