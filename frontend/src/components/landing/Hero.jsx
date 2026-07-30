import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";

const stats = [
  { value: "10K+", label: "Active Founders" },
  { value: "25K+", label: "Ideas Validated" },
  { value: "500+", label: "Businesses Launched" },
  { value: "98%", label: "Founder Satisfaction" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24 bg-[var(--bg)]">
      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <HeroContent />
          <HeroVisual />
        </div>

        {/* Stats Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center lg:mt-16 lg:justify-between lg:text-left rounded-3xl border border-white/10 bg-[var(--card)]/60 px-8 py-8">
          <p className="text-sm leading-6 text-[var(--muted)]">
            Trusted by
            <br />
            founders worldwide
          </p>

          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-2xl font-semibold text-transparent">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
