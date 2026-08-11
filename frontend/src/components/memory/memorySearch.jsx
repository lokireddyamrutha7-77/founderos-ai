import { useState } from "react";
import { Search } from "lucide-react";
import { searchMemories } from "../../services/memory";

export default function MemorySearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchMemories(keyword);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <div className="flex items-center flex-1 bg-white rounded-full px-4 py-2 border border-[var(--gold-light)] shadow-sm">
          <Search size={18} className="text-[var(--gold-dark)] mr-2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search your memories..."
            className="flex-1 bg-transparent outline-none text-sm text-neutral-700 placeholder:text-neutral-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !keyword.trim()}
          className="px-5 py-2 rounded-full text-sm font-medium bg-black text-white hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      <div className="flex flex-col gap-3">
        {results.map((memory) => (
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
        {!loading && results.length === 0 && keyword.trim() && (
          <p className="text-sm text-neutral-400">No memories found for "{keyword}".</p>
        )}
        {!loading && results.length === 0 && !keyword.trim() && (
          <p className="text-sm text-neutral-400">Search to see what Altora remembers.</p>
        )}
      </div>
    </div>
  );
}