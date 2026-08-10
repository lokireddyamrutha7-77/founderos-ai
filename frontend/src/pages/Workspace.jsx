import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

function SidebarContent({ onNavigate }) {
  const location = useLocation();

  return (
    <>
      <div className="flex items-center gap-2 px-2">
        <Sparkles className="text-[var(--gold)]" size={22} />
        <span className="text-lg font-semibold text-[var(--text)]">FounderOS</span>
      </div>

      <nav className="mt-10 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;
          const isDisabled = !item.path;

          if (isDisabled) {
            return (
              <div
                key={item.name}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted)]/50"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.name}
                </span>
                <span className="rounded-full bg-[var(--section)] px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onNavigate}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--gold-light)] text-[var(--text)]"
                  : "text-[var(--muted)] hover:bg-[var(--section)] hover:text-[var(--text)]"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function Workspace() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Desktop sidebar — visible lg and up */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-white p-6 lg:block">
        <SidebarContent />
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
      </main>
    </div>
  );
}
