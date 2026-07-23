import { ArrowRight, Play, Sparkles, Star } from "lucide-react";

export default function HeroContent() {
  return (
    <div className="max-w-[470px]">

      {/* Badge */}

      <div className="inline-flex items-center gap-2 bg-white border border-[#E9DFC8] rounded-full px-5 py-2 mb-6 shadow-sm">
        <Sparkles size={16} className="text-[#C9A961]" />

        <span className="text-[#B88B2A] text-[16px] font-medium">
          Powered by FounderOS AI
        </span>
      </div>

      {/* Heading */}

      <h1
        className="text-[60px] leading-[1] font-semibold text-[#1A1A1A]"
        style={{ fontFamily: "Playfair Display" }}
      >
        Build startups
        <br />

        that{" "}
        <span className="italic text-[#C9A961]">
          deserve
        </span>

        <br />

        to exist.
      </h1>

      {/* Description */}

      <p className="text-[18px] text-gray-600 leading-8 mt-7">
        Your AI operating system for founders —
        from idea validation to finance,
        growth and execution.
      </p>

      {/* Buttons */}

      <div className="flex items-center gap-4 mt-8">

        <button className="bg-[#1A1A1A] hover:bg-black transition text-white rounded-2xl px-7 py-3 flex items-center gap-3">

          <span className="font-medium text-[17px]">
            Start Your Journey
          </span>

          <ArrowRight size={18} />

        </button>

        <button className="border border-gray-300 bg-white rounded-2xl px-7 py-3 flex items-center gap-3 hover:bg-gray-50 transition">

          <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
            <Play size={13} />
          </div>

          <span className="text-[17px] font-medium">
            Watch Demo
          </span>

        </button>

      </div>

      {/* Trust Section */}

      <div className="flex items-center gap-4 mt-8">

        <div className="flex -space-x-3">

          <img
            src="https://i.pravatar.cc/100?img=32"
            alt=""
            className="w-10 h-10 rounded-full border-2 border-white"
          />

          <img
            src="https://i.pravatar.cc/100?img=13"
            alt=""
            className="w-10 h-10 rounded-full border-2 border-white"
          />

          <img
            src="https://i.pravatar.cc/100?img=68"
            alt=""
            className="w-10 h-10 rounded-full border-2 border-white"
          />

        </div>

        <div>

          <div className="flex items-center gap-1">

            {[1,2,3,4,5].map((item)=>(
              <Star
                key={item}
                size={15}
                fill="#C9A961"
                color="#C9A961"
              />
            ))}

          </div>

          <p className="text-gray-600 text-[15px] mt-1">
            Trusted by <b>10,000+</b> founders worldwide
          </p>

        </div>

      </div>

    </div>
  );
}