import { Sparkles, ChevronDown, ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full">
      <div className="max-w-[1450px] mx-auto px-8 py-5">

        <div className="bg-white/70 backdrop-blur-md rounded-3xl px-8 py-4 flex items-center justify-between shadow-sm">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-[#F6E9C9] flex items-center justify-center">
              <Sparkles className="text-[#C9A961]" size={20} />
            </div>

            <h1
              className="text-[34px] font-semibold text-[#1A1A1A]"
              style={{ fontFamily: "Playfair Display" }}
            >
              FounderOS
            </h1>

          </div>

          {/* Menu */}

          <nav className="hidden lg:flex items-center gap-12">

            <a
              href="#"
              className="text-[18px] font-medium hover:text-[#C9A961] transition"
            >
              Product
            </a>

            <a
              href="#"
              className="text-[18px] font-medium hover:text-[#C9A961] transition"
            >
              Features
            </a>

            <a
              href="#"
              className="text-[18px] font-medium hover:text-[#C9A961] transition"
            >
              Pricing
            </a>

            <a
              href="#"
              className="flex items-center gap-1 text-[18px] font-medium hover:text-[#C9A961] transition"
            >
              Resources
              <ChevronDown size={16} />
            </a>

            <a
              href="#"
              className="text-[18px] font-medium hover:text-[#C9A961] transition"
            >
              About
            </a>

          </nav>

          {/* Buttons */}

          <div className="flex items-center gap-4">

            <button className="border border-gray-300 rounded-2xl px-7 py-3 font-medium hover:bg-gray-100 transition">
              Sign In
            </button>

            <button className="bg-[#1A1A1A] text-white rounded-2xl px-8 py-3 flex items-center gap-3 hover:bg-black transition">
              <span className="font-medium">
                Get Started
              </span>

              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </div>
    </header>
  );
}