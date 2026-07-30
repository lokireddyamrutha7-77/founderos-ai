import { useState } from "react";
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
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "AI Advisor", icon: Sparkles },
  { name: "Memory", icon: Brain },
  { name: "Chat", icon: MessageSquare },
  { name: "Finance", icon: Wallet },
  { name: "Inventory", icon: Package },
  { name: "Milestones", icon: Flag },
  { name: "Settings", icon: Settings },
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

export default function Workspace() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[var(--card)]/40 p-6 lg:block">
        <div className="flex items-center gap-2 px-2">
          <Sparkles className="text-violet-400" size={22} />
          <span className="text-lg font-semibold">FounderOS</span>
        </div>

        <nav className="mt-10 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveNav(item.name)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-linear-to-r from-violet-500/20 to-blue-500/20 text-white"
                    : "text-[var(--muted)] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back 👋</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-violet-500 to-blue-500 text-sm font-semibold">
            U
          </div>
        </header>

        {/* Stat cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Active Ideas", value: "3" },
            { label: "Tasks Done", value: "12/20" },
            { label: "Milestones", value: "4" },
            { label: "Days to Deadline", value: "18" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-[var(--card)]/60 p-5"
            >
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Tasks section */}
          <div className="rounded-2xl border border-white/10 bg-[var(--card)]/60 p-6">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <ul className="mt-5 space-y-3">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 text-sm">
                  {task.done ? (
                    <CheckCircle2 size={18} className="shrink-0 text-violet-400" />
                  ) : (
                    <Circle size={18} className="shrink-0 text-[var(--muted)]" />
                  )}
                  <span className={task.done ? "text-[var(--muted)] line-through" : "text-white"}>
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Goals section */}
          <div className="rounded-2xl border border-white/10 bg-[var(--card)]/60 p-6">
            <h2 className="text-lg font-semibold">Goals</h2>
            <ul className="mt-5 space-y-5">
              {goals.map((goal) => (
                <li key={goal.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white">
                      <Target size={16} className="text-violet-400" />
                      {goal.title}
                    </span>
                    <span className="text-[var(--muted)]">{goal.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-violet-500 to-blue-500"
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
