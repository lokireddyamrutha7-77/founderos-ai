import { useEffect, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { deleteMemory, getMemoryTimeline } from "../../services/memory";

export default function MemoryTimeline() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    try {
      const data = await getMemoryTimeline();
      setMemories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading timeline...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (memories.length === 0)
    return <p className="text-sm text-neutral-400">No memories yet.</p>;

  return (
    <div className="flex flex-col gap-4">
      {memories.map((memory) => (
        <div key={memory.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-[#C9A961] mt-2" />
            <div className="flex-1 w-px bg-neutral-200" />
          </div>
          <div className="pb-4 flex-1">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <Clock size={12} />
              {new Date(memory.created_at).toLocaleString()}
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm">{memory.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#C9A961] uppercase tracking-wide">
                    {memory.category}
                  </span>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    disabled={deletingId === memory.id}
                    className="text-neutral-300 hover:text-red-500 transition disabled:opacity-50"
                    title="Delete memory"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-neutral-600">{memory.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
