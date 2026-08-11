import { useState } from "react";
import MemoryCreateForm from "../components/memory/MemoryCreateForm";
import MemorySearch from "../components/memory/MemorySearch";
import MemoryCategoryFilter from "../components/memory/MemoryCategoryFilter";
import MemoryTimeline from "../components/memory/MemoryTimeline";
import MemoryStatsBar from "../components/memory/MemoryStatsBar";
import MemoryBrowse from "../components/memory/MemoryBrowse";

// Reskinned wrapper layout to match the cream/gold design system.
// Every sub-component (MemoryCreateForm, MemorySearch, etc.) and all
// state/logic below is completely untouched — only the surrounding
// JSX structure, headings, spacing, and card styling changed. The
// inputs/dropdowns inside those sub-components will still look
// unstyled until those individual files are reskinned separately.

export default function Memory() {
  // Bumping this forces Timeline/Browse/Stats to re-fetch after a change.
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <section className="mx-auto mt-6 max-w-[1400px] bg-[var(--bg)] px-6 pb-16 pt-10">
      <h1 className="text-3xl font-semibold text-[var(--text)]">Memory</h1>
      <p className="mt-1 mb-6 text-[var(--muted)]">
        Everything Altora remembers about your business.
      </p>

      <div className="mb-8 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <MemoryStatsBar key={`stats-${refreshKey}`} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">
              Add a Memory
            </h2>
            <MemoryCreateForm onCreated={bump} />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">
              Search
            </h2>
            <MemorySearch />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">
              Browse by Category
            </h2>
            <MemoryCategoryFilter />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">
              Timeline
            </h2>
            <MemoryTimeline key={`timeline-${refreshKey}`} />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">
              All Memories
            </h2>
            <MemoryBrowse refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </section>
  );
}
