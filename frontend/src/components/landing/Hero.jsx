import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";
import { Users, Lightbulb, Rocket, TrendingUp } from "lucide-react";

const stats = [
  { icon: Users, value: "10K+", label: "Active Founders" },
  { icon: Lightbulb, value: "25K+", label: "Ideas Validated" },
  { icon: Rocket, value: "500+", label: "Businesses Launched" },
  { icon: TrendingUp, value: "98%", label: "Founder Satisfaction" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24 bg-[var(--bg)]">
      {/* Background Decorations */}
      <div className="absolute left-[-180px] top-20 h-[420px] w-[420px] rounded-full bg-[var(--gold-light)] opacity-40 blur-[120px]" />
      <div className="absolute right-[-180px] bottom-0 h-[380px] w-[380px] rounded-full bg-white opacity-80 blur-[120px]" />

      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <HeroContent />
          <HeroVisual />
        </div>

        {/* Stats Bar */}
        <div className="mt-12 grid grid-cols-2 gap-8 rounded-3xl border border-[var(--border)] bg-white/70 p-8 lg:mt-16 lg:grid-cols-4">
          {stats.map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                style={{ animationDelay: `${index * 80}ms` }}
                className="animate-fade-in-up flex items-center gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--gold-light)]">
                  <Icon size={20} className="text-[var(--gold-dark)]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--text)]">{s.value}</p>
                  <p className="text-sm text-[var(--muted)]">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
