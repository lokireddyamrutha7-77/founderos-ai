import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export default function HeroContent() {
  return (
    <div className="max-w-xl">
      <Badge icon={<Sparkles size={14} className="text-violet-400" />}>
        Powered by Gemini AI
      </Badge>

      <h1 className="mt-8 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
        Build companies
        <br />
        that{" "}
        <span className="bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          deserve
        </span>
        <br />
        to exist.
      </h1>

      <p className="mt-6 max-w-md text-lg leading-8 text-[var(--muted)]">
        FounderOS AI is your intelligent operating system for founders —
        from idea to scale and beyond.
      </p>

      <div className="mt-9 flex flex-wrap gap-4">
        <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
          Start Your Journey
        </Button>

        <Button
          variant="secondary"
          size="lg"
          icon={
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20">
              <Play size={12} fill="currentColor" />
            </span>
          }
        >
          Watch Demo
        </Button>
      </div>
    </div>
  );
}
