import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Brain,
  Sparkles,
  Wallet,
  Package,
  Flag,
  MessageSquare,
  Settings,
  CheckCircle2,
  Circle,
  Target,
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  Lightbulb,
  Calendar,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/workspace" },
  { name: "AI Advisor", icon: Sparkles, path: "/advisor" },
  { name: "Memory", icon: Brain, path: "/memory" },
  { name: "Chat", icon: MessageSquare, path: "/chat" },
  { name: "Finance", icon: Wallet, path: "/finance" },
  { name: "Inventory", icon: Package, path: null },
  { name: "Milestones", icon: Flag, path: null },
  { name: "Settings", icon: Settings, path: null },
];

const tasks = [
  { id: 1, title: "Finalize Advisor prompt with Person 2", done: true },
  { id: 2, title: "Review Finance API contract", done: true },
  { id: 3, title: "Wire Workspace to real task data", done: false },
  { id: 4, title: "Responsive pass on landing page", done: false },
  { id: 5, title: "Cross-browser QA (Chrome/Firefox/Edge)", done: false },
];

const goals = [
  { id: 1, title: "Complete Foundations phase", progress: 100 },
  { id: 2, title: "Advisor milestone (Day 7)", progress: 80 },
  { id: 3, title: "Full integration (Day 8-15)", progress: 20 },
];

const activity = [
  { id: 1, text: "Signed up and created your account", time: "Just now" },
  { id: 2, text: "Reviewed the Foundations phase checklist", time: "2 hours ago" },
  { id: 3, text: "Workspace dashboard shell set up", time: "Yesterday" },
];

const chartPoints = [20, 35, 28, 45, 40, 60, 52, 68, 75];

function Sparkline({ points }) {
  const w = 280;
  const h = 100;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - ((p - min) / (max - min)) * (h - 10) - 5;
    return `${x},${y}`;
  });
  const linePath = `M${coords.join(" L")}`;
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-4 h-56 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkFill)" />
      <path
        d={linePath}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SidebarContent({ onNavigate, collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    if (onNavigate) onNavigate();
    navigate("/login");
  }

  return (
    <div className="flex h-full flex-col">
      <div className={`flex items-center gap-2 px-2 pb-2 ${collapsed ? "justify-center" : ""}`}>
        <Sparkles className="shrink-0 text-[var(--gold)]" size={20} />
        {!collapsed && (
          <span className="text-base font-semibold tracking-tight text-[var(--text)]">
            FounderOS
          </span>
        )}
      </div>

      <nav className="mt-8 flex-1 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;
          const isDisabled = !item.path;

          if (isDisabled) {
            return (
              <div
                key={item.name}
                title={collapsed ? `${item.name} — Soon` : undefined}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm text-[var(--muted)]/50 ${
                  collapsed ? "justify-center" : "w-full justify-between"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {!collapsed && item.name}
                </span>
                {!collapsed && (
                  <span className="rounded-full bg-[var(--section)] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide">
                    Soon
                  </span>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onNavigate}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                collapsed ? "justify-center" : "w-full"
              } ${
                isActive
                  ? "bg-[var(--gold-light)] font-medium text-[var(--text)]"
                  : "font-normal text-[var(--muted)] hover:bg-[var(--section)] hover:text-[var(--text)]"
              }`}
            >
              <Icon size={17} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        title={collapsed ? "Log Out" : undefined}
        className={`flex items-center gap-3 rounded-lg border-t border-[var(--border)] px-3 py-2.5 pt-4 text-sm text-[var(--muted)] transition-colors hover:text-red-600 ${
          collapsed ? "justify-center" : "w-full"
        }`}
      >
        <LogOut size={17} />
        {!collapsed && "Log Out"}
      </button>
    </div>
  );
}

export default function Workspace() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const stats = [
    { label: "Active Ideas", value: "3", icon: Lightbulb },
    { label: "Tasks Done", value: "12/20", icon: CheckCircle2 },
    { label: "Milestones", value: "4", icon: Flag },
    { label: "Days to Deadline", value: "18", icon: Calendar },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <aside
        className={`relative hidden h-screen shrink-0 border-r border-[var(--border)] bg-white p-4 transition-all duration-300 lg:block ${
          collapsed ? "w-20" : "w-64 p-6"
        }`}
      >
        <SidebarContent collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--muted)] shadow-sm transition-colors hover:text-[var(--text)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative flex h-full w-72 flex-col border-r border-[var(--border)] bg-white p-6 shadow-2xl">
            <button
              className="absolute right-4 top-4 text-[var(--muted)] hover:text-[var(--text)]"
              onClick={() => setMobileNavOpen(false)}
            >
              <X size={22} />
            </button>
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="text-[var(--text)] lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-semibold sm:text-2xl">Welcome back 👋</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Here's what's happening with your business today.
              </p>
            </div>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
            U
          </div>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{ animationDelay: `${index * 80}ms` }}
                className="animate-fade-in-up flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold-light)] text-[var(--gold-dark)]">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xl font-semibold sm:text-2xl">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted)] sm:text-sm">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp size={18} className="text-[var(--gold)]" />
                Growth Overview
              </h2>
              <span className="text-xs text-[var(--muted)]">This Month</span>
            </div>
            <Sparkline points={chartPoints} />
          </div>

          <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles size={18} className="text-[var(--gold)]" />
              AI Recommendation
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Your recent activity suggests focusing on the Advisor milestone next —
              you're 80% there and it unblocks the full integration phase.
            </p>
            <Link
              to="/advisor"
              className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-[var(--text)] px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
            >
              View Details
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <ul className="mt-5 space-y-3">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 text-sm">
                  {task.done ? (
                    <CheckCircle2 size={18} className="shrink-0 text-[var(--gold)]" />
                  ) : (
                    <Circle size={18} className="shrink-0 text-[var(--muted)]" />
                  )}
                  <span className={task.done ? "text-[var(--muted)] line-through" : "text-[var(--text)]"}>
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Goals</h2>
            <ul className="mt-5 space-y-5">
              {goals.map((goal) => (
                <li key={goal.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[var(--text)]">
                      <Target size={16} className="text-[var(--gold)]" />
                      {goal.title}
                    </span>
                    <span className="text-[var(--muted)]">{goal.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--section)]">
                    <div
                      className="h-full rounded-full bg-[var(--gold)] transition-all duration-700"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <ul className="mt-5 space-y-4">
            {activity.map((item) => (
              <li key={item.id} className="flex items-start gap-3 text-sm">
                <Clock size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
                <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-[var(--text)]">{item.text}</span>
                  <span className="text-xs text-[var(--muted)]">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}