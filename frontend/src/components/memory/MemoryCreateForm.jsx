import { useState } from "react";
import { Plus } from "lucide-react";
import { createMemory } from "../../services/memory";

const CATEGORIES = ["idea", "conversation", "goal", "note", "business"];

export default function MemoryCreateForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    content: "",
    importance: 3,
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createMemory({ ...form, source: "user" });
      setForm({ title: "", category: CATEGORIES[0], content: "", importance: 3, tags: "" });
      setSuccess(true);
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-4 rounded-2xl border border-neutral-200 bg-white"
    >
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        className="px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#C9A961]"
        required
      />

      <div className="flex gap-3">
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm capitalize outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={form.importance}
          onChange={(e) => update("importance", Number(e.target.value))}
          className="w-32 px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>Importance {n}</option>
          ))}
        </select>
      </div>

      <textarea
        placeholder="What do you want to remember?"
        value={form.content}
        onChange={(e) => update("content", e.target.value)}
        rows={3}
        className="px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none resize-none focus:border-[#C9A961]"
        required
      />

      <input
        type="text"
        placeholder="Tags (comma separated, optional)"
        value={form.tags}
        onChange={(e) => update("tags", e.target.value)}
        className="px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Memory saved.</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#1A1A1A] text-white hover:opacity-90 transition disabled:opacity-50"
      >
        <Plus size={16} />
        {loading ? "Saving..." : "Save Memory"}
      </button>
    </form>
  );
}
