import { useEffect, useState } from "react";
import { Clock, Pencil, Trash2, X, Check } from "lucide-react";
import { deleteMemory, getMemoryTimeline, updateMemory } from "../../services/memory";

const CATEGORIES = ["idea", "conversation", "goal", "note", "business"];

export default function MemoryTimeline() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

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

  function startEdit(memory) {
    setEditingId(memory.id);
    setEditForm({
      title: memory.title,
      category: memory.category,
      content: memory.content,
      importance: memory.importance,
      source: memory.source,
      tags: memory.tags,
      user_id: memory.user_id ?? null,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit(id) {
    setSaving(true);
    try {
      const updated = await updateMemory(id, editForm);
      setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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

            {editingId === memory.id ? (
              <div className="p-3 rounded-xl border border-[#C9A961] bg-white flex flex-col gap-2">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="px-2 py-1.5 rounded-lg border border-neutral-200 text-sm outline-none"
                />
                <div className="flex gap-2">
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                    className="flex-1 px-2 py-1.5 rounded-lg border border-neutral-200 text-sm capitalize outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={editForm.importance}
                    onChange={(e) => setEditForm((f) => ({ ...f, importance: Number(e.target.value) }))}
                    className="w-32 px-2 py-1.5 rounded-lg border border-neutral-200 text-sm outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>Importance {n}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                  rows={2}
                  className="px-2 py-1.5 rounded-lg border border-neutral-200 text-sm outline-none resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-neutral-200 hover:bg-neutral-50 transition"
                  >
                    <X size={12} /> Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(memory.id)}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1A1A1A] text-white hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Check size={12} /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm">{memory.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#C9A961] uppercase tracking-wide">
                      {memory.category}
                    </span>
                    <button
                      onClick={() => startEdit(memory)}
                      className="text-neutral-300 hover:text-[#C9A961] transition"
                      title="Edit memory"
                    >
                      <Pencil size={14} />
                    </button>
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
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
