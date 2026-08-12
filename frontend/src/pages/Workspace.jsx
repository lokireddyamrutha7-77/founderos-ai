import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Target,
  Brain,
  Sparkles,
  Wallet,
  Package,
  Flag,
  Loader2,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMemoryStats } from "../services/memory";
import { getFinanceSnapshot } from "../services/finance";
import { getItems } from "../services/inventory";
import { getMilestones } from "../services/milestones";

export default function Workspace() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [memoryStats, setMemoryStats] = useState({ total: 0 });
  const [financeData, setFinanceData] = useState(null);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [milestonesList, setMilestonesList] = useState([]);

  useEffect(() => {
    async function loadWorkspaceData() {
      setLoading(true);
      try {
        const [memRes, finRes, invRes, msRes] = await Promise.allSettled([
          getMemoryStats(),
          getFinanceSnapshot(),
          getItems(),
          getMilestones(),
        ]);

        if (memRes.status === "fulfilled") setMemoryStats(memRes.value || { total: 0 });
        if (finRes.status === "fulfilled") setFinanceData(finRes.value || null);
        if (invRes.status === "fulfilled") setInventoryCount((invRes.value || []).length);
        if (msRes.status === "fulfilled") setMilestonesList(msRes.value || []);
      } catch (err) {
        console.error("Workspace load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaceData();
  }, []);

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const completedMilestones = milestonesList.filter((m) => m.status === "completed" || m.is_completed).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl tracking-tight">
            Welcome back, {user?.name || user?.email || "Founder"} 👋
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Here's the live operational snapshot of your business today.
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-sm font-bold text-[var(--gold)] border border-[var(--gold)]/30 shadow-xs">
          {(user?.name || user?.email || "F").charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Metrics Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-2xl border border-[var(--border)] shadow-2xs">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--gold)] mr-2" />
          <span className="text-sm font-medium text-[var(--muted)]">Syncing workspace metrics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Card 1: Memories */}
          <Link
            to="/memory"
            className="animate-fade-in-up rounded-2xl border border-[var(--border)] bg-white p-5 shadow-2xs hover:border-[var(--gold)] transition-colors group"
          >
            <div className="flex items-center justify-between text-[var(--muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Memories</span>
              <Brain size={18} className="text-[var(--gold)] group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">{memoryStats.total || 0}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Saved insights & notes</p>
          </Link>

          {/* Card 2: Financial Runway */}
          <Link
            to="/finance"
            className="animate-fade-in-up rounded-2xl border border-[var(--border)] bg-white p-5 shadow-2xs hover:border-[var(--gold)] transition-colors group"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex items-center justify-between text-[var(--muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Runway</span>
              <Wallet size={18} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">
              {financeData?.runway_months !== undefined && financeData?.runway_months !== null
                ? `${financeData.runway_months} mo`
                : "Set Revenue"}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {financeData ? `Rev: ${formatCurrency(financeData.revenue)}` : "Click to set finance"}
            </p>
          </Link>

          {/* Card 3: Inventory Products */}
          <Link
            to="/inventory"
            className="animate-fade-in-up rounded-2xl border border-[var(--border)] bg-white p-5 shadow-2xs hover:border-[var(--gold)] transition-colors group"
            style={{ animationDelay: "160ms" }}
          >
            <div className="flex items-center justify-between text-[var(--muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Inventory</span>
              <Package size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">{inventoryCount}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Tracked SKUs / products</p>
          </Link>

          {/* Card 4: Milestones Progress */}
          <Link
            to="/milestones"
            className="animate-fade-in-up rounded-2xl border border-[var(--border)] bg-white p-5 shadow-2xs hover:border-[var(--gold)] transition-colors group"
            style={{ animationDelay: "240ms" }}
          >
            <div className="flex items-center justify-between text-[var(--muted)] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Milestones</span>
              <Flag size={18} className="text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">
              {completedMilestones} / {milestonesList.length}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">Completed company goals</p>
          </Link>
        </div>
      )}

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advisor CTA */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-[var(--gold)]" size={22} />
              <h2 className="text-lg font-semibold text-[var(--text)]">AI Startup Advisor</h2>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Generate a 9-point viability analysis, competitor breakdown, and SWOT matrix for any new business concept.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/advisor"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1A1A1A] hover:text-[var(--gold-dark)] transition-colors"
            >
              <span>Launch Advisor Tool</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Chat Copilot CTA */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="text-blue-600" size={22} />
              <h2 className="text-lg font-semibold text-[var(--text)]">AI Copilot Chat</h2>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Have an interactive dialogue with your AI assistant grounded in your business memories and advisor reports.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1A1A1A] hover:text-[var(--gold-dark)] transition-colors"
            >
              <span>Open Chat Session</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Live Milestones Trail List */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-[var(--gold)]" />
            <h2 className="text-lg font-semibold text-[var(--text)]">Company Milestones</h2>
          </div>
          <Link
            to="/milestones"
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1"
          >
            <span>Manage All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {milestonesList.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[var(--border)] rounded-xl bg-[#FAF7F0]/30">
            <p className="text-xs text-[var(--muted)]">No company milestones created yet.</p>
            <Link
              to="/milestones"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--gold-dark)] hover:underline"
            >
              <PlusCircle size={14} />
              <span>Add your first milestone</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {milestonesList.slice(0, 5).map((m) => {
              const isDone = m.status === "completed" || m.is_completed;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-[#FAF7F0]/20 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-[var(--gold)] shrink-0" />
                    ) : (
                      <Circle size={18} className="text-[var(--muted)] shrink-0" />
                    )}
                    <div>
                      <span className={`font-semibold ${isDone ? "line-through text-[var(--muted)]" : "text-[var(--text)]"}`}>
                        {m.title}
                      </span>
                      {m.target_date && (
                        <span className="block text-[10px] text-[var(--muted)] mt-0.5">Target: {m.target_date}</span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isDone ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isDone ? "Done" : "In Progress"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}