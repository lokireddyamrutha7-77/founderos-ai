import {
  Brain,
  BarChart3,
  Rocket,
  ShieldCheck,
  Wallet,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Memory",
    desc: "Never forget anything",
  },
  {
    icon: BarChart3,
    title: "Business Brain",
    desc: "Make smarter decisions",
  },
  {
    icon: Rocket,
    title: "Growth Engine",
    desc: "Scale your startup",
  },
  {
    icon: ShieldCheck,
    title: "Strategic Guidance",
    desc: "24/7 AI advisor",
  },
  {
    icon: Wallet,
    title: "Finance OS",
    desc: "Manage your money",
  },
];

export default function FeaturePanel() {
  return (
    <div className="w-full max-w-[260px]">

      <div className="bg-white rounded-[28px] shadow-xl p-4">

        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">
          AI Capabilities
        </h3>

        <div className="space-y-3">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-3 bg-[#FAF7F0] rounded-2xl p-3 hover:bg-[#F5F0E7] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <Icon
                    size={18}
                    className="text-[#C9A961]"
                  />
                </div>

                <div>
                  <h4 className="text-[15px] font-semibold text-[#1A1A1A]">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

        <button className="w-full mt-5 bg-[#1A1A1A] text-white rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-black transition">

          Explore

          <ArrowRight size={16} />

        </button>

      </div>

    </div>
  );
}