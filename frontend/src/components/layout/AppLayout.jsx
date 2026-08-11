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
  Menu,
  X,
} from "lucide-react";

// Extracted from Person 3's original Workspace.jsx so navigation works on
// every page (Memory, Advisor, Finance, Chat), not just Workspace. Paths
// and styling are unchanged from the original.
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/workspace" },
  { name: "AI Advisor", icon: Sparkles, path: "/advisor" },
  { name: "Memory", icon: Brain, path: "/memory" },
  { name: "Chat", icon: MessageSquare, path: "/chat" },
  { name: "Finance", icon: Wallet, path: "/finance" },
  { name: "Inventory", icon: Package, path: "/inventory" },
  { name: "Milestones", icon: Flag, path: "/milestones" },
  { name: "Settings", icon: Settings, path: null },
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

export default function AppLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Desktop sidebar - visible lg and up */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-white p-6 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer - visible below lg, toggled by hamburger */}
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

      {/* Mobile menu button - only shown here, pages render their own header content */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          className="text-[var(--text)] bg-white rounded-full p-2 shadow-md"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Main content - each page renders its own content here */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}