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
        <div className="flex items-center flex-1 bg-white rounded-full px-4 py-2 border border-neutral-200">
          <Search size={18} className="text-neutral-400 mr-2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search your memories..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-full text-sm font-medium bg-[#1A1A1A] text-white hover:opacity-90 transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-sm text-neutral-400">Searching...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-col gap-3">
        {results.map((memory) => (
          <div
            key={memory.id}
            className="p-4 rounded-2xl border border-neutral-200 bg-white"
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm">{memory.title}</h4>
              <span className="text-xs text-[#C9A961] uppercase tracking-wide">
                {memory.category}
              </span>
            </div>
            <p className="text-sm text-neutral-600">{memory.content}</p>
          </div>
        ))}
        {!loading && results.length === 0 && keyword && (
          <p className="text-sm text-neutral-400">No memories found.</p>
        )}
      </div>
    </div>
  );
}
