import { useEffect, useState } from "react";
import { Flag, Calendar, Plus, Loader2, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { getMilestones, createMilestone } from "../services/milestones";

export default function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchMilestonesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMilestones();
      setMilestones(data || []);
    } catch (err) {
      setError(err.message || "Failed to load milestones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestonesList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setError("Please enter a title for the milestone.");
      return;
    }
    if (!milestoneDate) {
      setError("Please select a target date for the milestone.");
      return;
    }

    setSubmitting(true);
    try {
      const newMilestone = await createMilestone({
        title: title.trim(),
        description: description.trim() || null,
        milestone_date: milestoneDate,
      });

      // Update list and sort chronologically by date
      setMilestones((prev) =>
        [...prev, newMilestone].sort((a, b) => new Date(a.milestone_date) - new Date(b.milestone_date))
      );

      setTitle("");
      setDescription("");
      setMilestoneDate("");
      setSuccessMsg("Milestone added successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || "Failed to create milestone.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    // Parse UTC date string YYYY-MM-DD
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dateObj = new Date(Date.UTC(year, month, day));
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
    }
    return dateStr;
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Header */}
      <header className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gold-light)] text-[var(--gold-dark)] shadow-sm">
          <Flag size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl tracking-tight">Business Milestones</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Map out key goals, product launches, and company achievements in chronological order.
          </p>
        </div>
      </header>

      {/* Notifications */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-fade-in-up">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-fade-in-up">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Creation Form */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm mb-10">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-1">Add New Milestone</h2>
        <p className="text-xs text-[var(--muted)] mb-5">
          Record upcoming target deadlines or past key achievements.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Milestone Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Launch MVP Beta, First $10k MRR"
                className="block w-full rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 px-4 py-2.5 text-sm font-medium text-[var(--text)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="milestone_date" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Target Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="milestone_date"
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  className="block w-full rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 px-4 py-2.5 text-sm font-medium text-[var(--text)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key details, criteria for success, or relevant notes..."
              className="block w-full rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-[var(--gold)] disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-[var(--gold)]" />
                  <span>Add Milestone</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Milestones Vertical Timeline / List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--text)]">Chronological Timeline</h2>
          <span className="text-xs font-medium text-[var(--muted)]">
            {milestones.length} {milestones.length === 1 ? "milestone" : "milestones"} total
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[var(--border)] shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--gold)] mb-3" />
            <p className="text-sm text-[var(--muted)] font-medium">Loading milestones...</p>
          </div>
        ) : milestones.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--section)] text-[var(--muted)] mb-3">
              <Flag size={20} />
            </div>
            <h3 className="text-base font-semibold text-[var(--text)]">No Milestones Yet</h3>
            <p className="mt-1 text-sm text-[var(--muted)] max-w-sm mx-auto">
              Add your first company milestone above to start tracking your business roadmap chronologically.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border)]">
            {milestones.map((item, index) => (
              <div
                key={item.id}
                style={{ animationDelay: `${index * 80}ms` }}
                className="relative animate-fade-in-up"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-6 sm:-left-8 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[var(--gold)] text-white shadow-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                {/* Milestone Card */}
                <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-[var(--text)] tracking-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 rounded-full bg-[var(--gold-light)]/60 px-3 py-1 text-xs font-semibold text-[var(--gold-dark)]">
                      <Calendar size={13} />
                      <span>{formatDate(item.milestone_date)}</span>
                    </div>
                  </div>

                  {item.description ? (
                    <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-wrap mt-2">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--muted)]/60 italic mt-1">No description provided</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
