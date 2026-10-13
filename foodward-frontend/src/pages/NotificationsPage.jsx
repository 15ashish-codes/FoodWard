import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  UtensilsCrossed, Bell, Package, Truck, ShieldCheck, MessageCircle, CheckCheck, ArrowLeft, Filter, Sun, Moon,
} from "lucide-react";

const ALL_NOTIFS = [
  { id: 1, type: "donation", icon: Package, title: "New donation nearby", body: "Grand Palace Banquets listed 60 meals, 0.9 km away.", time: "2 min ago", unread: true },
  { id: 2, type: "pickup", icon: Truck, title: "Pickup confirmed", body: "David Owusu is en route for the rice & curry trays.", time: "26 min ago", unread: true },
  { id: 3, type: "donation", icon: Package, title: "Donation expiring soon", body: "Bread & pastry surplus expires in 20 minutes.", time: "1h ago", unread: true },
  { id: 4, type: "verification", icon: ShieldCheck, title: "Account verified", body: "Your organization has been approved and is now live on Foodward.", time: "3h ago", unread: false },
  { id: 5, type: "message", icon: MessageCircle, title: "New message", body: "Sister Miriam: \"Thank you, the pickup went smoothly.\"", time: "Yesterday", unread: false },
  { id: 6, type: "pickup", icon: Truck, title: "Delivery completed", body: "40 meals delivered to Hope House Orphanage.", time: "Yesterday", unread: false },
  { id: 7, type: "donation", icon: Package, title: "Weekly summary ready", body: "You saved 312 meals this week — 18% more than last week.", time: "2 days ago", unread: false },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "donation", label: "Donations" },
  { id: "pickup", label: "Pickups" },
  { id: "verification", label: "Account" },
  { id: "message", label: "Messages" },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [items, setItems] = useState(ALL_NOTIFS);
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const visible = filter === "all" ? items : items.filter((n) => n.type === filter);
  const unreadCount = items.filter((n) => n.unread).length;

  function markAllRead() {
    setItems((its) => its.map((n) => ({ ...n, unread: false })));
  }
  function markRead(id) {
    setItems((its) => its.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  return (
    <div className={`np-page ${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
          --ink: #12241A; --paper: #FBF8F2; --paper-dim: #F4F0E6; --emerald: #16A34A; --emerald-deep: #0B4A2B;
          --coral: #F1652A; --line: #E4E1D8; --ink-soft: rgba(18,36,26,0.62);
        }
        .np-page.dark { --ink: #F2F1EA; --paper: #0E1712; --paper-dim: #142019; --line: #263229; --ink-soft: rgba(242,241,234,0.6); }
        .np-page.dark .notif-card, .np-page.dark .back-btn { background: #16221C; }
        .np-page.dark .notif-card.unread { background: rgba(22,163,74,0.1); }
        * { box-sizing: border-box; }
        .np-page { font-family: 'Inter', -apple-system, sans-serif; color: var(--ink); background: var(--paper); min-height: 100vh; -webkit-font-smoothing: antialiased; transition: background 0.3s ease, color 0.3s ease; }
        .skel { background: linear-gradient(90deg, var(--paper-dim) 25%, var(--line) 37%, var(--paper-dim) 63%); background-size: 400% 100%; animation: skel-shine 1.4s ease infinite; border-radius: 14px; height: 76px; margin-bottom: 10px; }
        @keyframes skel-shine { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
        .np-page h1 { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
        button { font-family: inherit; cursor: pointer; }
        .wrap { max-width: 680px; margin: 0 auto; padding: 0 24px; }

        .top-strip { border-bottom: 1px solid var(--line); padding: 16px 0; }
        .top-inner { display: flex; align-items: center; justify-content: space-between; }
        .brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 17px; }
        .brand-mark { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--emerald), var(--emerald-deep)); color: white; display: flex; align-items: center; justify-content: center; }
        .back-btn { display: flex; align-items: center; gap: 6px; background: white; border: 1px solid var(--line); border-radius: 10px; padding: 8px 12px; font-size: 13px; font-weight: 600; color: var(--ink); }

        .head-row { display: flex; justify-content: space-between; align-items: flex-end; margin: 32px 0 20px; flex-wrap: wrap; gap: 12px; }
        h1 { font-size: 26px; font-weight: 600; margin: 0 0 4px; display: flex; align-items: center; gap: 10px; }
        .unread-badge { font-size: 12px; font-weight: 700; background: var(--coral); color: white; padding: 2px 9px; border-radius: 999px; }
        .head-sub { font-size: 13.8px; color: var(--ink-soft); }
        .mark-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: var(--emerald-deep); font-size: 13.5px; font-weight: 600; }

        .filter-row { display: flex; gap: 8px; margin-bottom: 22px; flex-wrap: wrap; }
        .filter-chip { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px; border: 1.5px solid var(--line); background: white; font-size: 13px; font-weight: 600; color: var(--ink-soft); }
        .filter-chip.active { border-color: var(--emerald); color: var(--emerald-deep); background: rgba(22,163,74,0.06); }

        .notif-card { display: flex; gap: 14px; padding: 16px; border: 1px solid var(--line); border-radius: 16px; background: white; margin-bottom: 10px; transition: background 0.2s ease, border-color 0.2s ease; cursor: pointer; }
        .notif-card.unread { background: rgba(22,163,74,0.045); border-color: rgba(22,163,74,0.2); }
        .notif-card:hover { border-color: rgba(22,163,74,0.35); }
        .notif-ico { width: 40px; height: 40px; border-radius: 11px; background: var(--paper-dim); color: var(--emerald-deep); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .notif-body-wrap { flex: 1; min-width: 0; }
        .notif-title-row { display: flex; align-items: center; gap: 8px; }
        .notif-title { font-size: 14.5px; font-weight: 700; }
        .notif-unread-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--coral); flex-shrink: 0; }
        .notif-body { font-size: 13.5px; color: var(--ink-soft); line-height: 1.5; margin-top: 3px; }
        .notif-time { font-size: 11.8px; color: var(--ink-soft); margin-top: 6px; }

        .empty-state { text-align: center; padding: 60px 20px; color: var(--ink-soft); }
        .empty-state svg { color: var(--line); margin-bottom: 14px; }
      `}</style>

      <div className="top-strip">
        <div className="wrap top-inner">
          <div className="brand"><span className="brand-mark"><UtensilsCrossed size={15} /></span>Foodward</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="back-btn" onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode">{dark ? <Sun size={14} /> : <Moon size={14} />}</button>
            <button className="back-btn" onClick={() => navigate(auth.user ? `/dashboard/${auth.user.role}` : "/")}><ArrowLeft size={14} /> Back to dashboard</button>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="head-row">
          <div>
            <h1>Notifications {unreadCount > 0 && <span className="unread-badge">{unreadCount} new</span>}</h1>
            <div className="head-sub">Everything happening across your donations and pickups.</div>
          </div>
          <button className="mark-btn" onClick={markAllRead}><CheckCheck size={16} /> Mark all as read</button>
        </div>

        <div className="filter-row">
          {FILTERS.map((f) => (
            <span key={f.id} className={`filter-chip ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)} role="button" tabIndex={0}>
              {f.id === "all" && <Filter size={12} />} {f.label}
            </span>
          ))}
        </div>

        {loading ? (
          [0, 1, 2, 3].map((i) => <div className="skel" key={i} />)
        ) : visible.length === 0 ? (
          <div className="empty-state"><Bell size={34} /><div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>Nothing here</div><div style={{ fontSize: 13.5, marginTop: 4 }}>You're all caught up in this category.</div></div>
        ) : (
          visible.map((n) => (
            <div className={`notif-card ${n.unread ? "unread" : ""}`} key={n.id} onClick={() => markRead(n.id)}>
              <div className="notif-ico"><n.icon size={18} /></div>
              <div className="notif-body-wrap">
                <div className="notif-title-row">
                  <span className="notif-title">{n.title}</span>
                  {n.unread && <span className="notif-unread-dot" />}
                </div>
                <div className="notif-body">{n.body}</div>
                <div className="notif-time">{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
