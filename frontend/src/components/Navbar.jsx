import { ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">

        {/* Logo */}

        <div className="flex items-center gap-3 cursor-pointer">

          <div className="w-10 h-10 rounded-full bg-[#C79A45] flex items-center justify-center shadow-md">

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"
                fill="white"
              />
            </svg>

          </div>

          <h1
            className="text-4xl tracking-wide"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Altora
          </h1>

        </div>

        {/* Menu */}

        <div className="hidden lg:flex gap-10 text-[17px] font-medium">

          <a href="/">Product</a>
          <a href="/">Features</a>
          <a href="/">Pricing</a>
          <a href="/">Resources</a>
          <a href="/">About</a>

        </div>

        {/* Buttons */}

        <div className="flex gap-4">

          <button className="px-7 py-3 rounded-xl border border-gray-300 hover:bg-white transition">
            Sign in
          </button>

          <button className="px-7 py-3 rounded-xl bg-[#151515] text-white flex items-center gap-2 hover:scale-105 transition">

            Get Started

            <ArrowRight size={18} />

          </button>

        </div>

      </div>
    </nav>
  );
}