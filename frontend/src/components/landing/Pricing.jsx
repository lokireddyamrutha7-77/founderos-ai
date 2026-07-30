import { Check } from "lucide-react";
import Button from "../ui/Button";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "For founders validating their first idea.",
    features: [
      "1 active business idea",
      "Basic AI Advisor analysis",
      "Manual memory notes",
      "Community support",
    ],
    variant: "secondary",
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Founder",
    price: "$29",
    period: "/month",
    desc: "For founders actively building and scaling.",
    features: [
      "Unlimited business ideas",
      "Full AI Advisor + Chat with memory",
      "Finance & Inventory tracking",
      "Business Milestones timeline",
      "PDF export (Advisor + Finance)",
      "Priority support",
    ],
    variant: "primary",
    cta: "Start Your Journey",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    desc: "For founding teams working together.",
    features: [
      "Everything in Founder",
      "Up to 5 team members",
      "Shared memory & advisor context",
      "Team activity log",
      "Dedicated onboarding",
    ],
    variant: "secondary",
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-[var(--bg)] py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-violet-400">
            Pricing
          </p>
          <h2 className="mt-4 text-4xl font-semibold text-white lg:text-5xl">
            Simple plans for every stage
          </h2>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            Start free, upgrade when you're ready to scale. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                plan.highlighted
                  ? "border-violet-500/50 bg-linear-to-b from-violet-500/10 to-transparent"
                  : "border-white/10 bg-[var(--card)]/60"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-violet-500 to-blue-500 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{plan.desc}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-white">{plan.price}</span>
                {plan.period && (
                  <span className="text-[var(--muted)]">{plan.period}</span>
                )}
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                    <Check size={16} className="mt-0.5 shrink-0 text-violet-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button variant={plan.variant} fullWidth>
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
