import { useState } from "react";
import MemoryCreateForm from "../components/memory/MemoryCreateForm";
import MemorySearch from "../components/memory/MemorySearch";
import MemoryCategoryFilter from "../components/memory/MemoryCategoryFilter";
import MemoryTimeline from "../components/memory/MemoryTimeline";
import MemoryStatsBar from "../components/memory/MemoryStatsBar";
import MemoryBrowse from "../components/memory/MemoryBrowse";

export default function Memory() {
  // Bumping this forces Timeline/Browse/Stats to re-fetch after a change.
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <section className="max-w-[1400px] mx-auto mt-6 px-6 pb-16">
      <h1 className="text-3xl font-bold mb-1">Memory</h1>
      <p className="text-neutral-500 mb-4">
        Everything Altora remembers about your business.
      </p>

      <MemoryStatsBar key={`stats-${refreshKey}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-3">Add a Memory</h2>
          <MemoryCreateForm onCreated={bump} />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-10">
          <div>
            <h2 className="text-lg font-semibold mb-3">Search</h2>
            <MemorySearch />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Browse by Category</h2>
            <MemoryCategoryFilter />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Timeline</h2>
            <MemoryTimeline key={`timeline-${refreshKey}`} />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">All Memories</h2>
            <MemoryBrowse refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </section>
  );
}