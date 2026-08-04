import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { ArrowRight, Play, Sparkles, Star } from "lucide-react";

export default function HeroContent() {
  return (
    <div className="max-w-xl">
      <Badge icon={<Sparkles size={14} className="text-[var(--gold)]" />}>
        Powered by Gemini AI
      </Badge>

      <h1 className="mt-8 text-4xl font-semibold leading-[1.1] text-[var(--text)] sm:text-5xl lg:text-6xl">
        Build companies
        <br />
        that{" "}
        <span className="bg-linear-to-r from-[var(--gold)] to-[var(--gold-dark)] bg-clip-text italic text-transparent">
          deserve
        </span>
        <br />
        to exist.
      </h1>

      <p className="mt-6 max-w-md text-lg leading-8 text-[var(--muted)]">
        Your AI operating system for founders — from idea to scale and beyond.
      </p>

      <div className="mt-9 flex flex-wrap gap-4">
        <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
          Start Your Journey
        </Button>

        <Button
          variant="secondary"
          size="lg"
          icon={
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)]">
              <Play size={12} fill="currentColor" />
            </span>
          }
        >
          Watch Demo
        </Button>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <div className="flex -space-x-3">
          <div className="h-10 w-10 rounded-full border-2 border-white bg-[var(--gold-light)]" />
          <div className="h-10 w-10 rounded-full border-2 border-white bg-[var(--section)]" />
          <div className="h-10 w-10 rounded-full border-2 border-white bg-[var(--border)]" />
        </div>

        <div className="flex items-center gap-1 text-[var(--gold)]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
          ))}
        </div>

        <p className="text-sm text-[var(--muted)]">
          Trusted by{" "}
          <span className="font-semibold text-[var(--gold)]">10,000+</span>{" "}
          founders worldwide
        </p>
      </div>
    </div>
  );
}
