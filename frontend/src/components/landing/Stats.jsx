import {
  Users,
  Rocket,
  Briefcase,
  Star,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "10K+",
    label: "Active Founders",
  },
  {
    icon: Rocket,
    number: "25K+",
    label: "Ideas Validated",
  },
  {
    icon: Briefcase,
    number: "500+",
    label: "Startups Launched",
  },
  {
    icon: Star,
    number: "98%",
    label: "User Satisfaction",
  },
];

export default function Stats() {
  return (
    <section className="max-w-7xl mx-auto px-8 pb-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-[#FAF7F0] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Icon
                  className="text-[#C9A961]"
                  size={30}
                />
              </div>

              <h2 className="text-4xl font-bold text-[#1A1A1A]">
                {item.number}
              </h2>

              <p className="mt-3 text-gray-600">
                {item.label}
              </p>
            </div>
          );
        })}

      </div>
    </section>
  );
}