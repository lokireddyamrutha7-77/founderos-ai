import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] rounded-[40px] p-14 text-center text-white shadow-2xl">

        <span className="inline-block bg-[#C9A961]/20 text-[#F5D98B] px-5 py-2 rounded-full text-sm font-medium mb-6">
          🚀 Build Smarter with AI
        </span>

        <h2 className="text-5xl font-bold leading-tight max-w-4xl mx-auto">
          Your AI Co-Founder is Ready.
          <br />
          Build Faster. Scale Smarter.
        </h2>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-8 leading-8">
          Join thousands of founders using FounderOS to validate ideas,
          manage finances, track growth, and build successful startups.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">

          <button className="bg-[#C9A961] hover:bg-[#b89446] text-black font-semibold px-8 py-4 rounded-xl transition duration-300">
            Get Started Free
          </button>

          <button className="border border-gray-500 hover:bg-white hover:text-black px-8 py-4 rounded-xl flex items-center gap-2 transition duration-300">
            Schedule Demo
            <ArrowRight size={18} />
          </button>

        </div>

      </div>
    </section>
  );
}