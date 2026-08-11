import { useEffect, useState } from "react";
import { DollarSign, TrendingDown, Clock, Wallet, Save, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { getFinanceSnapshot, updateFinanceSnapshot } from "../services/finance";

export default function Finance() {
  const [snapshot, setSnapshot] = useState(null);
  const [revenueInput, setRevenueInput] = useState("");
  const [expensesInput, setExpensesInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchSnapshot = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFinanceSnapshot();
      setSnapshot(data);
      setRevenueInput(data.revenue !== undefined ? String(data.revenue) : "0");
      setExpensesInput(data.expenses !== undefined ? String(data.expenses) : "0");
    } catch (err) {
      setError(err.message || "Failed to load financial snapshot.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const rev = parseFloat(revenueInput);
    const exp = parseFloat(expensesInput);

    if (isNaN(rev) || rev < 0) {
      setError("Please enter a valid positive number for revenue.");
      setSaving(false);
      return;
    }
    if (isNaN(exp) || exp < 0) {
      setError("Please enter a valid positive number for expenses.");
      setSaving(false);
      return;
    }

    try {
      const updated = await updateFinanceSnapshot(rev, exp);
      setSnapshot(updated);
      setRevenueInput(String(updated.revenue));
      setExpensesInput(String(updated.expenses));
      setSuccessMsg("Financial snapshot updated successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || "Failed to update financial snapshot.");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatRunway = (months, burnRate) => {
    if (burnRate === 0) {
      return "∞ (Profitable / Break-even)";
    }
    if (months === null || months === undefined) {
      return "N/A";
    }
    return `${months} ${months === 1 ? "month" : "months"}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl tracking-tight">Finance Snapshot</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Track high-level revenue, expenses, monthly burn rate, and runway.
          </p>
        </div>
      </header>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[var(--border)] shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--gold)] mb-3" />
          <p className="text-sm text-[var(--muted)] font-medium">Loading finance snapshot...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Notifications */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-fade-in-up">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-fade-in-up">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Editable Form */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-1">Update Financial Inputs</h2>
            <p className="text-xs text-[var(--muted)] mb-5">
              Enter your monthly numbers to recalculate your company's burn rate and runway estimate.
            </p>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="revenue" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                    Monthly Revenue ($)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-400 font-medium sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="revenue"
                      id="revenue"
                      step="any"
                      min="0"
                      value={revenueInput}
                      onChange={(e) => setRevenueInput(e.target.value)}
                      placeholder="0.00"
                      className="block w-full rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 pl-8 pr-4 py-2.5 text-sm font-semibold text-[var(--text)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="expenses" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                    Monthly Expenses ($)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-400 font-medium sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="expenses"
                      id="expenses"
                      step="any"
                      min="0"
                      value={expensesInput}
                      onChange={(e) => setExpensesInput(e.target.value)}
                      placeholder="0.00"
                      className="block w-full rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 pl-8 pr-4 py-2.5 text-sm font-semibold text-[var(--text)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-[var(--gold)] disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-[var(--gold)]" />
                      <span>Save Snapshot</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Cards Grid */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Key Metrics Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Revenue */}
              <div className="animate-fade-in-up rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm" style={{ animationDelay: "0ms" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Revenue</span>
                  <div className="p-2 rounded-xl bg-[var(--gold-light)]/50 text-[var(--gold-dark)]">
                    <Wallet size={18} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {formatCurrency(snapshot?.revenue)}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">Gross monthly incoming</p>
              </div>

              {/* Card 2: Expenses */}
              <div className="animate-fade-in-up rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm" style={{ animationDelay: "80ms" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Expenses</span>
                  <div className="p-2 rounded-xl bg-neutral-100 text-neutral-700">
                    <DollarSign size={18} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {formatCurrency(snapshot?.expenses)}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">Total monthly outgoing</p>
              </div>

              {/* Card 3: Burn Rate */}
              <div className="animate-fade-in-up rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm" style={{ animationDelay: "160ms" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Burn Rate</span>
                  <div className={`p-2 rounded-xl ${snapshot?.burn_rate > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                    <TrendingDown size={18} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {formatCurrency(snapshot?.burn_rate)}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {snapshot?.burn_rate > 0 ? "Net monthly outflow" : "No active burn"}
                </p>
              </div>

              {/* Card 4: Runway */}
              <div className="animate-fade-in-up rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm" style={{ animationDelay: "240ms" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Runway</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Clock size={18} />
                  </div>
                </div>
                <p className="text-xl font-bold text-[var(--text)] truncate">
                  {formatRunway(snapshot?.runway_months, snapshot?.burn_rate)}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">Estimated financial runway</p>
              </div>
            </div>
          </div>

          {/* Additional note / disclaimer */}
          <div className="text-xs text-[var(--muted)] italic text-right">
            * Note: Runway calculation is a simplified estimate (Revenue / Burn Rate), for high-level snapshot purposes.
          </div>
        </div>
      )}
    </div>
  );
}