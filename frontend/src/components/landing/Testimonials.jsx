import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Startup Founder",
    review:
      "FounderOS completely changed how I plan and grow my startup. Having an AI co-founder available 24/7 is a huge advantage.",
  },
  {
    name: "David Chen",
    role: "Tech Entrepreneur",
    review:
      "The dashboard, finance tracking, and AI guidance helped me make better decisions faster than ever before.",
  },
  {
    name: "Emily Carter",
    role: "Business Owner",
    review:
      "Beautiful interface, powerful AI, and incredibly useful insights. FounderOS is now my daily workspace.",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="text-center mb-16">

        <p className="text-[#C9A961] font-semibold tracking-widest uppercase">
          Testimonials
        </p>

        <h2 className="text-5xl font-bold mt-4 text-[#1A1A1A]">
          Loved by Founders
        </h2>

        <p className="text-gray-600 mt-5 max-w-2xl mx-auto text-lg">
          Thousands of entrepreneurs trust FounderOS to build,
          validate, and scale their businesses.
        </p>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >

            <div className="flex mb-5">
              {[1,2,3,4,5].map((star)=>(
                <Star
                  key={star}
                  size={18}
                  fill="#C9A961"
                  color="#C9A961"
                />
              ))}
            </div>

            <p className="text-gray-600 leading-8 mb-8">
              "{item.review}"
            </p>

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-[#C9A961] text-white flex items-center justify-center font-bold text-xl">
                {item.name.charAt(0)}
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {item.role}
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}