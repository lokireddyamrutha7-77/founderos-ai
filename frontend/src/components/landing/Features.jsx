import {
  Brain,
  MessageSquare,
  BarChart3,
  Wallet,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Co-Founder",
    description:
      "Get strategic advice, planning, and startup guidance whenever you need it.",
  },
  {
    icon: MessageSquare,
    title: "Smart Conversations",
    description:
      "Chat naturally with your AI assistant to brainstorm, plan, and solve problems.",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Track startup growth with interactive dashboards and meaningful insights.",
  },
  {
    icon: Wallet,
    title: "Finance Management",
    description:
      "Monitor expenses, budgets, and financial health from one workspace.",
  },
  {
    icon: Rocket,
    title: "Growth Tracking",
    description:
      "Set milestones, measure progress, and accelerate business growth.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Workspace",
    description:
      "Your ideas, memories, and business data remain safe and protected.",
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="text-center mb-16">

        <p className="text-[#C9A961] font-semibold uppercase tracking-widest">
          FEATURES
        </p>

        <h2 className="text-5xl font-bold text-[#1A1A1A] mt-4">
          Everything You Need
        </h2>

        <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
          FounderOS combines AI, finance, strategy, memory,
          and business intelligence into one beautiful platform.
        </p>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#FAF7F0] flex items-center justify-center mb-6">
                <Icon
                  size={30}
                  className="text-[#C9A961]"
                />
              </div>

              <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {feature.description}
              </p>
            </div>
          );
        })}

      </div>

    </section>
  );
}