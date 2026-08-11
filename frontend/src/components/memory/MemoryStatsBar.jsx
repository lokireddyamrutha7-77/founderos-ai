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
    <div className="flex flex-wrap items-center gap-2">
      <div className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white">
        {stats.total} total {stats.total === 1 ? "memory" : "memories"}
      </div>
      {categories.map(([category, count]) => (
        <div
          key={category}
          className="rounded-full border border-[var(--gold-light)] bg-[var(--gold-light)]/50 px-4 py-1.5 text-xs font-medium capitalize text-[var(--gold-dark)]"
        >
          {category}: {count}
        </div>
      ))}
    </div>
  );
}
