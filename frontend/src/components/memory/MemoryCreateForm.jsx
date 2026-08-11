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

  const inputClass =
    "rounded-xl border-2 border-[var(--gold-light)] bg-[var(--section)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--gold)] focus:bg-white";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        className={inputClass}
        required
      />

      <div className="flex gap-3">
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className={`flex-1 capitalize ${inputClass}`}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={form.importance}
          onChange={(e) => update("importance", Number(e.target.value))}
          className={`w-36 ${inputClass}`}
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
        className={`resize-none ${inputClass}`}
        required
      />

      <input
        type="text"
        placeholder="Tags (comma separated, optional)"
        value={form.tags}
        onChange={(e) => update("tags", e.target.value)}
        className={inputClass}
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Memory saved.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={16} />
        {loading ? "Saving..." : "Save Memory"}
      </button>
    </form>
  );
}
