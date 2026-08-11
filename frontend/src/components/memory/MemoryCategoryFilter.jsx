import { useEffect, useState } from "react";
import { getMemoriesByCategory } from "../../services/memory";

const CATEGORIES = ["idea", "conversation", "goal", "note", "business"];

export default function MemoryCategoryFilter() {
  const [active, setActive] = useState(CATEGORIES[0]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMemoriesByCategory(active);
        setMemories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [active]);

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
              active === cat
                ? "bg-black text-white"
                : "bg-white border border-[var(--gold-light)] text-neutral-600 hover:bg-[var(--gold-light)]/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-neutral-400">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-col gap-3">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="p-4 rounded-2xl border border-[var(--gold-light)] bg-[#FDFBF7] shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm text-neutral-800">{memory.title}</h4>
              <span className="rounded-full bg-[var(--gold-light)]/50 px-3 py-0.5 text-xs font-medium uppercase tracking-wide text-[var(--gold-dark)]">
                {memory.category}
              </span>
            </div>
            <p className="text-sm text-neutral-600">{memory.content}</p>
          </div>
        ))}
        {!loading && memories.length === 0 && (
          <p className="text-sm text-neutral-400">
            No memories in "{active}" yet.
          </p>
        )}
      </div>
    </div>
  );
}