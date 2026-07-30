import { Brain, TrendingUp, Rocket, ShieldCheck, Wallet } from "lucide-react";

const items = [
  { icon: Brain, title: "AI Memory", desc: "Never forget a thing" },
  { icon: TrendingUp, title: "Business Brain", desc: "Data-driven decisions" },
  { icon: Rocket, title: "Growth Engine", desc: "Scale with confidence" },
  { icon: ShieldCheck, title: "Strategic Guidance", desc: "Your AI co-founder" },
  { icon: Wallet, title: "Finance OS", desc: "Track, plan, grow" },
];

export default function HeroVisual() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      {/* Inline SVG glow illustration — no external image file required */}
      <svg
        viewBox="0 0 620 560"
        className="w-full max-w-[620px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="arcGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="arcGrad2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* scattered stars */}
        {[
          [40, 60], [90, 180], [30, 340], [520, 90], [560, 220],
          [480, 400], [70, 480], [550, 480], [20, 220], [500, 60],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.2} fill="#fff" opacity="0.6" />
        ))}

        {/* glowing crescent arcs */}
        <g filter="url(#glow)">
          <path
            d="M 460 40 A 260 260 0 1 1 460 520"
            fill="none"
            stroke="url(#arcGrad1)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 430 110 A 190 190 0 1 1 430 450"
            fill="none"
            stroke="url(#arcGrad2)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 470 150 A 140 140 0 1 1 470 410"
            fill="none"
            stroke="#C4B5FD"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* bright highlight point where arcs converge */}
        <circle cx="460" cy="40" r="18" fill="url(#starGlow)" />
        <circle cx="460" cy="520" r="14" fill="url(#starGlow)" />
      </svg>

      {/* floating feature card */}
      <div className="absolute -right-4 top-10 hidden w-64 rounded-2xl border border-white/10 bg-[var(--card)]/90 p-4 backdrop-blur-md shadow-2xl lg:block">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`flex items-center gap-3 py-3 ${
                i !== items.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Icon size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight text-white">{item.title}</p>
                <p className="text-xs text-[var(--muted)]">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
