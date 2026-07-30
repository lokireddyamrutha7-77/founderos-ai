import {
  Star,
  Users,
  Briefcase,
  Rocket,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10K+",
    title: "Founders",
    description: "Building startups with FounderOS.",
  },
  {
    icon: Briefcase,
    value: "150+",
    title: "Business Workflows",
    description: "Unified into one intelligent platform.",
  },
  {
    icon: Rocket,
    value: "98%",
    title: "Productivity",
    description: "Average improvement reported by early users.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28">
      <div className="container">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--muted)]">
            Trusted by Modern Founders
          </span>

          <h2 className="mt-6 text-5xl font-semibold">
            Built for ambitious startups.
          </h2>

          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
            FounderOS helps founders spend less time managing tools
            and more time building products, growing teams,
            and scaling businesses.
          </p>

        </div>

        {/* Rating */}

        <div className="mt-14 flex justify-center">

          <div className="rounded-full border border-[var(--border)] bg-white px-8 py-4 shadow-sm">

            <div className="flex items-center justify-center gap-2">

              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  fill="#C59D5F"
                  color="#C59D5F"
                />
              ))}

            </div>

            <p className="mt-3 text-center text-sm text-[var(--muted)]">
              Designed to simplify the founder journey.
            </p>

          </div>

        </div>

        {/* Stats */}

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {stats.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-3xl border border-[var(--border)] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--section)]">

                  <Icon
                    size={28}
                    className="text-[var(--gold)]"
                  />

                </div>

                <h3 className="mt-6 text-4xl font-semibold text-gray-900">
                  {item.value}
                </h3>

                <h4 className="mt-2 text-xl font-medium text-gray-900">
                  {item.title}
                </h4>

                <p className="mt-4 leading-7 text-[var(--muted)]">
                  {item.description}
                </p>

              </div>

            );
          })}

        </div>

      </div>
    </section>
  );
}