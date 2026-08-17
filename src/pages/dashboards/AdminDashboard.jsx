import React, { useState } from "react";
import {
  UtensilsCrossed,
  LayoutGrid,
  Users,
  Package,
  FileBarChart,
  ShieldCheck,
  Bell,
  Search,
  TrendingUp,
  LogOut,
  Settings,
  UserCircle,
  Check,
  X,
  MoreHorizontal,
  Building2,
  HeartHandshake,
  Bike,
  Sun,
  Moon,
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
} from "recharts";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "users", label: "Users", icon: Users },
  { id: "donations", label: "Donations", icon: Package },
  { id: "reports", label: "Reports", icon: FileBarChart },
  { id: "verification", label: "Verification", icon: ShieldCheck },
  { id: "profile", label: "Profile", icon: UserCircle },
];

const USERS = [
  { name: "The Meridian Hotel", role: "Hotel", status: "Verified", joined: "Jan 2026" },
  { name: "Hope House Orphanage", role: "Orphanage", status: "Verified", joined: "Feb 2026" },
  { name: "David Owusu", role: "Volunteer", status: "Verified", joined: "Mar 2026" },
  { name: "Grand Palace Banquets", role: "Hotel", status: "Pending", joined: "Jul 2026" },
  { name: "New Hope Center", role: "Orphanage", status: "Pending", joined: "Jul 2026" },
  { name: "Priya Nair", role: "Volunteer", status: "Verified", joined: "May 2026" },
];

const DONATIONS = [
  { date: "Jul 6, 2026", food: "Banquet rice & curry trays", kitchen: "The Meridian Hotel", shelter: "Hope House Orphanage", meals: 48, status: "In progress" },
  { date: "Jul 5, 2026", food: "Vegetable biryani", kitchen: "Grand Palace Banquets", shelter: "Sunrise Shelter", meals: 60, status: "Completed" },
  { date: "Jul 4, 2026", food: "Paneer & dal trays", kitchen: "The Meridian Hotel", shelter: "Hope House Orphanage", meals: 40, status: "Completed" },
  { date: "Jun 24, 2026", food: "Bakery surplus", kitchen: "Corner Bakery Co.", shelter: "Hope House Orphanage", meals: 18, status: "Missed" },
];

const PENDING_VERIFICATION = [
  { name: "Grand Palace Banquets", type: "Hotel", icon: Building2, submitted: "2 days ago", docs: 3 },
  { name: "New Hope Center", type: "Orphanage", icon: HeartHandshake, submitted: "1 day ago", docs: 2 },
  { name: "Priya Nair", type: "Volunteer", icon: Bike, submitted: "5 hours ago", docs: 1 },
];

const WEEKLY = [
  { day: "Mon", meals: 420 }, { day: "Tue", meals: 512 }, { day: "Wed", meals: 388 },
  { day: "Thu", meals: 610 }, { day: "Fri", meals: 740 }, { day: "Sat", meals: 890 }, { day: "Sun", meals: 605 },
];

function StatusPill({ status }) {
  const map = {
    Verified: { bg: "rgba(22,163,74,0.12)", fg: "#0B4A2B" },
    Pending: { bg: "rgba(245,158,11,0.15)", fg: "#8A5A06" },
    Completed: { bg: "rgba(22,163,74,0.12)", fg: "#0B4A2B" },
    "In progress": { bg: "rgba(245,158,11,0.15)", fg: "#8A5A06" },
    Missed: { bg: "rgba(214,67,46,0.12)", fg: "#B5341F" },
  };
  const c = map[status] || map.Pending;
  return <span className="pill" style={{ background: c.bg, color: c.fg }}>{status}</span>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [tab, setTab] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [pending, setPending] = useState(PENDING_VERIFICATION);
  const [dark, setDark] = useState(false);

  function fireToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  function decide(name, approved) {
    setPending((p) => p.filter((x) => x.name !== name));
    fireToast(approved ? `${name} approved and verified.` : `${name} rejected.`);
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
        .dash.dark .stat-card, .dash.dark .panel, .dash.dark .verify-card, .dash.dark .verify-ico,
        .dash.dark .profile-avatar-card, .dash.dark .icon-btn, .dash.dark .search-shell, .dash.dark .btn-ghost { background: var(--card); }
        .dash.dark .form-field input { background: var(--paper); color: var(--ink); }
        * { box-sizing: border-box; }
        .dash { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); min-height: 100vh; -webkit-font-smoothing: antialiased; transition: background 0.3s ease, color 0.3s ease; }
        .dash h1, .dash h2 { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
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
        .btn-icon-only { width: 34px; height: 34px; padding: 0; justify-content: center; border-radius: 9px; }
        .btn-approve { background: rgba(22,163,74,0.12); color: var(--emerald-deep); border-color: rgba(22,163,74,0.25); }
        .btn-approve:hover { background: rgba(22,163,74,0.2); }
        .btn-reject { background: rgba(214,67,46,0.1); color: var(--danger); border-color: rgba(214,67,46,0.25); }
        .btn-reject:hover { background: rgba(214,67,46,0.18); }

        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
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
        .panel-head h3 { font-size: 15.5px; font-weight: 700; margin: 0; }

        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink-soft); padding: 0 10px 12px; font-weight: 700; }
        td { padding: 13px 10px; font-size: 13.8px; border-top: 1px solid var(--line); }
        tr:hover td { background: var(--paper-dim); }
        .table-scroll { overflow-x: auto; }
        table { min-width: 560px; }
        .pill { padding: 5px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 700; white-space: nowrap; }
        .role-tag { font-size: 11.5px; font-weight: 700; color: var(--ink-soft); background: var(--paper-dim); padding: 3px 9px; border-radius: 7px; }

        .filter-row { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
        .filter-chip { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px; border: 1.5px solid var(--line); background: white; font-size: 13px; font-weight: 600; color: var(--ink-soft); }
        .filter-chip.active { border-color: var(--emerald); color: var(--emerald-deep); background: rgba(22,163,74,0.06); }

        .verify-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 20px; display: flex; align-items: center; gap: 16px; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; }
        .verify-left { display: flex; align-items: center; gap: 14px; }
        .verify-ico { width: 46px; height: 46px; border-radius: 13px; background: var(--paper-dim); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .verify-name { font-size: 15px; font-weight: 700; }
        .verify-meta { font-size: 12.8px; color: var(--ink-soft); margin-top: 2px; }
        .verify-actions { display: flex; gap: 8px; }

        .empty-state { text-align: center; padding: 50px 20px; color: var(--ink-soft); }
        .empty-state svg { color: var(--line); margin-bottom: 14px; }

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
                {n.id === "verification" && pending.length > 0 && <span className="nav-badge">{pending.length}</span>}
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
              <div className="search-shell"><Search size={15} /><input placeholder="Search users, donations…" /></div>
            </div>
            <div className="top-actions">
              <button className="icon-btn" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
              <button className="icon-btn" aria-label="Notifications" onClick={() => navigate("/notifications")}><Bell size={17} /><span className="dot" /></button>
              <div className="avatar">AD</div>
            </div>
          </div>

          <div className="content">
            {tab === "overview" && <Overview />}
            {tab === "users" && <UsersPage />}
            {tab === "donations" && <DonationsPage />}
            {tab === "reports" && <Reports />}
            {tab === "verification" && <Verification pending={pending} onDecide={decide} />}
            {tab === "profile" && <Profile />}
          </div>
        </div>
      </div>

      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function Overview() {
  return (
    <>
      <div className="page-head">
        <div><h2>Network overview</h2><p>How Foodward is performing across every kitchen and shelter.</p></div>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="top-row"><div className="stat-ico"><Package size={17} /></div><div className="stat-trend"><TrendingUp size={12} /> +18%</div></div><div className="stat-value">182,400+</div><div className="stat-label">Total meals saved</div></div>
        <div className="stat-card"><div className="top-row"><div className="stat-ico"><Building2 size={17} /></div><div className="stat-trend"><TrendingUp size={12} /> +12</div></div><div className="stat-value">640</div><div className="stat-label">Registered kitchens</div></div>
        <div className="stat-card"><div className="top-row"><div className="stat-ico"><HeartHandshake size={17} /></div><div className="stat-trend"><TrendingUp size={12} /> +8</div></div><div className="stat-value">310</div><div className="stat-label">Connected orphanages</div></div>
        <div className="stat-card"><div className="top-row"><div className="stat-ico"><ShieldCheck size={17} /></div><div className="stat-trend"><TrendingUp size={12} /> 3 new</div></div><div className="stat-value">3</div><div className="stat-label">Pending verifications</div></div>
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Meals saved — last 7 days</h3></div>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={WEEKLY} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="adminFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D8" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#12241A99" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#12241A99" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E4E1D8", fontSize: 13 }} />
              <Area type="monotone" dataKey="meals" stroke="#0B4A2B" strokeWidth={2.5} fill="url(#adminFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function UsersPage() {
  return (
    <>
      <div className="page-head">
        <div><h2>Users</h2><p>Every hotel, orphanage, volunteer and admin on the network.</p></div>
      </div>
      <div className="filter-row">
        <span className="filter-chip active">All</span>
        <span className="filter-chip">Hotels</span>
        <span className="filter-chip">Orphanages</span>
        <span className="filter-chip">Volunteers</span>
        <span className="filter-chip">Pending</span>
      </div>
      <div className="panel">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.name}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td><span className="role-tag">{u.role}</span></td>
                  <td><StatusPill status={u.status} /></td>
                  <td style={{ color: "var(--ink-soft)" }}>{u.joined}</td>
                  <td><button className="btn btn-ghost btn-icon-only"><MoreHorizontal size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function DonationsPage() {
  return (
    <>
      <div className="page-head">
        <div><h2>Donations</h2><p>Every listing across the network, live and historical.</p></div>
        <button className="btn btn-ghost">Export CSV</button>
      </div>
      <div className="panel">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Date</th><th>Food</th><th>Kitchen</th><th>Shelter</th><th>Meals</th><th>Status</th></tr></thead>
            <tbody>
              {DONATIONS.map((d) => (
                <tr key={d.date + d.food}>
                  <td style={{ color: "var(--ink-soft)" }}>{d.date}</td>
                  <td style={{ fontWeight: 600 }}>{d.food}</td>
                  <td>{d.kitchen}</td>
                  <td>{d.shelter}</td>
                  <td>{d.meals}</td>
                  <td><StatusPill status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Reports() {
  return (
    <>
      <div className="page-head">
        <div><h2>Reports</h2><p>Download summaries for stakeholders and grant applications.</p></div>
      </div>
      <div className="panel">
        {[
          { title: "Monthly impact report — June 2026", meta: "PDF · 1.2 MB" },
          { title: "Kitchen participation summary", meta: "XLSX · 480 KB" },
          { title: "Shelter response times", meta: "PDF · 640 KB" },
          { title: "Volunteer activity log", meta: "CSV · 210 KB" },
        ].map((r) => (
          <div key={r.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{r.meta}</div>
            </div>
            <button className="btn btn-ghost btn-sm">Download</button>
          </div>
        ))}
      </div>
    </>
  );
}

function Verification({ pending, onDecide }) {
  return (
    <>
      <div className="page-head">
        <div><h2>Verification queue</h2><p>Review documents before a kitchen or shelter can go live.</p></div>
      </div>
      {pending.length === 0 ? (
        <div className="empty-state panel"><ShieldCheck size={34} /><div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>Queue is clear</div><div style={{ fontSize: 13.5, marginTop: 4 }}>New sign-ups will appear here for review.</div></div>
      ) : (
        pending.map((p) => (
          <div className="verify-card" key={p.name}>
            <div className="verify-left">
              <div className="verify-ico"><p.icon size={20} /></div>
              <div>
                <div className="verify-name">{p.name}</div>
                <div className="verify-meta">{p.type} · Submitted {p.submitted} · {p.docs} document{p.docs > 1 ? "s" : ""}</div>
              </div>
            </div>
            <div className="verify-actions">
              <button className="btn btn-approve btn-sm" onClick={() => onDecide(p.name, true)}><Check size={14} /> Approve</button>
              <button className="btn btn-reject btn-sm" onClick={() => onDecide(p.name, false)}><X size={14} /> Reject</button>
            </div>
          </div>
        ))
      )}
    </>
  );
}

function Profile() {
  return (
    <>
      <div className="page-head"><div><h2>Profile</h2><p>Your admin account details.</p></div></div>
      <div className="profile-grid">
        <div className="profile-avatar-card">
          <div className="profile-avatar-big">AD</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Foodward Admin</div>
          <div style={{ fontSize: 12.8, color: "var(--ink-soft)", marginTop: 3 }}>Super admin</div>
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 16 }}>Change photo</button>
        </div>
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="form-grid">
            <div className="form-field"><label>Full name</label><input defaultValue="Alex Devraj" /></div>
            <div className="form-field"><label>Contact email</label><input defaultValue="admin@foodward.org" /></div>
            <div className="form-field"><label>Phone</label><input defaultValue="+1 (555) 099-1002" /></div>
            <div className="form-field"><label>Access level</label><input defaultValue="Super admin" disabled /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <button className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </>
  );
}
