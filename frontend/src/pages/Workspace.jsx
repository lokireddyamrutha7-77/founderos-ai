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
} from "lucide-react";

// NOTE: paths for AI Advisor, Finance, and Chat are assumed to follow the
// same lowercase convention as /workspace and /memory (confirmed by
// teammate). Inventory, Milestones, and Settings have no page built yet,
// so they're intentionally non-navigable "coming soon" items rather than
// links to a route that would 404. Double-check the three assumed paths
// against the actual merged App.jsx and adjust the `path` values below
// if they don't match.
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

// Static placeholder data — swap for real API data once
// Person 4 (Memory) and Person 5 (Finance/Milestones) endpoints are ready.
// Fetch with the shared instance from src/services/api.js, e.g.:
//   const { data } = await api.get("/tasks");
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
      <div className={`flex items-center gap-2 px-2 ${collapsed ? "justify-center" : ""}`}>
        <Sparkles className="shrink-0 text-[var(--gold)]" size={22} />
        {!collapsed && (
          <span className="text-lg font-semibold text-[var(--text)]">FounderOS</span>
        )}
      </div>

      <nav className="mt-10 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;
          const isDisabled = !item.path;

          if (isDisabled) {
            return (
              <div
                key={item.name}
                title={collapsed ? `${item.name} — Soon` : undefined}
                className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted)]/50 ${
                  collapsed ? "justify-center" : "w-full justify-between"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {!collapsed && item.name}
                </span>
                {!collapsed && (
                  <span className="rounded-full bg-[var(--section)] px-2 py-0.5 text-[10px] uppercase tracking-wide">
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
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                collapsed ? "justify-center" : "w-full"
              } ${
                isActive
                  ? "bg-[var(--gold-light)] text-[var(--text)]"
                  : "text-[var(--muted)] hover:bg-[var(--section)] hover:text-[var(--text)]"
              }`}
            >
              <Icon size={18} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        title={collapsed ? "Log Out" : undefined}
        className={`flex items-center gap-3 rounded-xl border-t border-[var(--border)] px-4 py-3 pt-4 text-sm font-medium text-[var(--muted)] transition-colors hover:text-red-600 ${
          collapsed ? "justify-center" : "w-full"
        }`}
      >
        <LogOut size={18} />
        {!collapsed && "Log Out"}
      </button>
    </div>
  );
}

export default function Workspace() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Desktop sidebar — visible lg and up, collapsible like Claude's sidebar */}
      <aside
        className={`relative hidden h-screen shrink-0 border-r border-[var(--border)] bg-white p-4 transition-all duration-300 lg:block ${
          collapsed ? "w-20" : "w-64 p-6"
        }`}
      >
        <SidebarContent collapsed={collapsed} />

        {/* Collapse/expand toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--muted)] shadow-sm transition-colors hover:text-[var(--text)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </aside>

      {/* Mobile sidebar drawer — visible below lg, toggled by hamburger */}
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

      {/* Main content */}
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
          {[
            { label: "Active Ideas", value: "3" },
            { label: "Tasks Done", value: "12/20" },
            { label: "Milestones", value: "4" },
            { label: "Days to Deadline", value: "18" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              style={{ animationDelay: `${index * 80}ms` }}
              className="animate-fade-in-up rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5"
            >
              <p className="text-xl font-semibold sm:text-2xl">{stat.value}</p>
              <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
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

        {/* Recent Activity — fills out the page, gives demo-day visual weight */}
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
