import { useState } from "react";
import { Plus } from "lucide-react";
import { createMemory } from "../../services/memory";
import { Input, Textarea, Select } from "../ui/Input";
import Button from "../ui/Button";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        required
      />

      <div className="flex gap-3">
        <Select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="flex-1 capitalize"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <Select
          value={form.importance}
          onChange={(e) => update("importance", Number(e.target.value))}
          className="w-40"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>Importance {n}</option>
          ))}
        </Select>
      </div>

      <Textarea
        placeholder="What do you want to remember?"
        value={form.content}
        onChange={(e) => update("content", e.target.value)}
        rows={3}
        required
      />

      <Input
        type="text"
        placeholder="Tags (comma separated, optional)"
        value={form.tags}
        onChange={(e) => update("tags", e.target.value)}
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Memory saved.
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={loading} className="mt-1">
        <Plus size={16} />
        {loading ? "Saving..." : "Save Memory"}
      </Button>
    </form>
  );
}