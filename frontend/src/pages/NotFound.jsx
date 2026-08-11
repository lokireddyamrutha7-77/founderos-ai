import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-6 py-16">
      <div className="absolute left-[-180px] top-[-100px] h-[420px] w-[420px] rounded-full bg-[var(--gold-light)] opacity-40 blur-[120px]" />
      <div className="absolute right-[-180px] bottom-[-100px] h-[380px] w-[380px] rounded-full bg-white opacity-80 blur-[120px]" />

      <div className="relative z-10 max-w-md text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Sparkles className="text-[var(--gold)]" size={22} />
          <span className="text-xl font-semibold text-[var(--text)]">FounderOS</span>
        </div>

        <h1 className="text-6xl font-semibold text-[var(--text)]">404</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          This page doesn't exist — it may have moved, or the link was
          incorrect.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
