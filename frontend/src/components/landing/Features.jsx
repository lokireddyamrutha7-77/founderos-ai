import {
  Brain,
  Wallet,
  FolderKanban,
  TrendingUp,
  Database,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Finance OS",
    description:
      "Track revenue, expenses, cash flow, and financial health from one intelligent dashboard.",
  },
  {
    icon: Brain,
    title: "AI Business Advisor",
    description:
      "Receive smart recommendations, forecasts, and business insights powered by AI.",
  },
  {
    icon: FolderKanban,
    title: "Workspace",
    description:
      "Manage projects, documents, meetings, and daily operations without switching tools.",
  },
  {
    icon: TrendingUp,
    title: "Growth Analytics",
    description:
      "Visualize KPIs, customer trends, and business growth with interactive dashboards.",
  },
  {
    icon: Database,
    title: "Founder Memory",
    description:
      "Store ideas, conversations, strategies, and important decisions in one searchable place.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description:
      "Enterprise-grade security and role-based access keep your startup data protected.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28">
      <div className="container">

        <div className="mx-auto mb-20 max-w-3xl text-center">

          <span className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--muted)]">
            Everything You Need
          </span>

          <h2 className="mt-6 text-4xl font-semibold lg:text-5xl">
            One Platform.
            <br />
            Every Tool a Founder Needs.
          </h2>

          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
            FounderOS replaces scattered tools with one intelligent
            operating system built specifically for modern founders.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-[var(--border)] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--section)]">
                  <Icon
                    size={28}
                    className="text-[var(--gold)]"
                  />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-[var(--muted)]">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}