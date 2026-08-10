import { useEffect, useState } from "react";
import { getMemoryStats } from "../../services/memory";

export default function MemoryStatsBar() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMemoryStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  if (error) return null; // stats are a nice-to-have, fail silently
  if (!stats) return null;

  const categories = Object.entries(stats.by_category || {});

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <div className="px-3 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-medium">
        {stats.total} total {stats.total === 1 ? "memory" : "memories"}
      </div>
      {categories.map(([category, count]) => (
        <div
          key={category}
          className="px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-xs capitalize text-neutral-600"
        >
          {category}: {count}
        </div>
      ))}
    </div>
  );
}
