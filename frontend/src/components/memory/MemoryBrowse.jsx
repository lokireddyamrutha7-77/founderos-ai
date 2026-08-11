import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllMemories } from "../../services/memory";

const PAGE_SIZE = 5;

export default function MemoryBrowse({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllMemories(page * PAGE_SIZE, PAGE_SIZE);
        setItems(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (loading) return <p className="text-sm text-neutral-400">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="text-sm text-neutral-400">No memories yet.</p>
      )}

      {items.map((memory) => (
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

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--gold-light)] hover:bg-[var(--gold-light)]/30 transition disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-xs text-neutral-400">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--gold-light)] hover:bg-[var(--gold-light)]/30 transition disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}