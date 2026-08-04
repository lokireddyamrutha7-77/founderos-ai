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
      {/* Inline SVG desk illustration — no external image file required */}
      <svg
        viewBox="0 0 620 500"
        className="h-auto w-full max-w-[420px] sm:max-w-[500px] lg:max-w-[620px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCFAF7" />
            <stop offset="100%" stopColor="#F3ECDF" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FAF8F4" />
          </linearGradient>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C59D5F" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C59D5F" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* backdrop */}
        <rect x="0" y="0" width="620" height="500" rx="28" fill="url(#bgGrad)" />

        {/* desk surface shadow */}
        <ellipse cx="310" cy="430" rx="260" ry="30" fill="#000000" opacity="0.05" />

        {/* plant vase (right) */}
        <g transform="translate(455,300)">
          <path d="M-22 90 Q-26 40 -14 0 L14 0 Q26 40 22 90 Z" fill="#EDE3D3" stroke="#DCCBAE" strokeWidth="2" />
          {[-30, -14, 0, 14, 30].map((x, i) => (
            <path
              key={i}
              d={`M0 0 C ${x * 0.3} -60, ${x} -150, ${x * 1.1} -190`}
              stroke="#8B8A5C"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          ))}
          {[-30, -14, 0, 14, 30].map((x, i) =>
            [40, 80, 120, 160].map((t, j) => (
              <ellipse
                key={`${i}-${j}`}
                cx={(x * (t / 190)) * 1.05}
                cy={-t}
                rx="7"
                ry="3"
                fill="#7C7B4F"
                opacity="0.85"
                transform={`rotate(${x > 0 ? 40 : -40} ${(x * (t / 190)) * 1.05} ${-t})`}
              />
            ))
          )}
        </g>

        {/* coffee mug (left) */}
        <g transform="translate(120,360)">
          <ellipse cx="0" cy="46" rx="34" ry="8" fill="#000" opacity="0.06" />
          <path d="M-26 0 Q-26 40 -18 44 L18 44 Q26 40 26 0 Z" fill="#EFE7D8" stroke="#D8C7A6" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="26" ry="7" fill="#E3D6BC" />
          <path d="M24 8 Q42 8 42 22 Q42 34 24 32" fill="none" stroke="#D8C7A6" strokeWidth="3" />
        </g>

        {/* laptop */}
        <g transform="translate(190,150)">
          {/* screen */}
          <rect x="0" y="0" width="260" height="180" rx="10" fill="#1A1A1A" />
          <rect x="8" y="8" width="244" height="164" rx="4" fill="url(#screenGrad)" />

          <text x="20" y="28" fontFamily="Inter, sans-serif" fontSize="11" fill="#6F6F73">
            Growth Overview
          </text>
          <text x="200" y="28" fontFamily="Inter, sans-serif" fontSize="9" fill="#B8B2A4">
            Last 6 months
          </text>

          {/* chart area */}
          <polyline
            points="20,140 55,110 90,120 125,80 160,95 195,55 230,70"
            fill="none"
            stroke="#C59D5F"
            strokeWidth="2.5"
          />
          <polygon
            points="20,140 55,110 90,120 125,80 160,95 195,55 230,70 230,155 20,155"
            fill="url(#chartFill)"
          />
          {["20", "55", "90", "125", "160", "195", "230"].map((x, i) => (
            <circle key={i} cx={x} cy={[140, 110, 120, 80, 95, 55, 70][i]} r="2.5" fill="#C59D5F" />
          ))}

          {/* base/keyboard */}
          <path d="M-20 180 L280 180 L300 210 L-40 210 Z" fill="#D4D4D4" />
          <path d="M-40 210 L300 210 L300 218 L-40 218 Z" fill="#B8B8B8" />
        </g>

        {/* notebook + pen */}
        <g transform="translate(330,400)">
          <rect x="0" y="0" width="150" height="16" rx="3" fill="#FFFFFF" stroke="#E5DCC9" strokeWidth="1.5" />
          <rect x="4" y="-4" width="142" height="10" rx="2" fill="#FDFCF9" stroke="#E5DCC9" strokeWidth="1.5" />
          <line x1="90" y1="-10" x2="150" y2="-2" stroke="#C59D5F" strokeWidth="4" strokeLinecap="round" />
          <circle cx="150" cy="-2" r="3" fill="#8a6a2f" />
        </g>
      </svg>

      {/* floating feature card */}
      <div className="absolute -right-4 top-6 hidden w-64 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl lg:block">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`flex items-center gap-3 py-3 ${
                i !== items.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black">
                <Icon size={16} className="text-[var(--gold)]" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight text-[var(--text)]">{item.title}</p>
                <p className="text-xs text-[var(--muted)]">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
