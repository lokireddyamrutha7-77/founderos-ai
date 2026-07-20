export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-8 mt-10">

      <div className="grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 border border-[#E8DED1] rounded-full px-5 py-2 text-sm">

            ✨ Powered by Gemini AI

          </div>

          <h1
            className="mt-8 text-[78px] leading-[90px] font-semibold"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Build companies
            <br />

            that <span className="text-[#C79A45] italic">deserve</span>

            <br />

            to exist.
          </h1>

          <p className="mt-8 text-xl text-gray-600 max-w-xl">

            Your AI operating system for founders —
            from idea to scale and beyond.

          </p>

          <div className="flex gap-5 mt-10">

            <button className="bg-black text-white px-8 py-4 rounded-2xl">
              Start Your Journey
            </button>

            <button className="border px-8 py-4 rounded-2xl">
              Watch Demo
            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div>

          <div className="rounded-[35px] h-[520px] bg-[#EFE9DE] flex items-center justify-center text-2xl text-gray-500">

            Laptop Mockup

          </div>

        </div>

      </div>

    </section>
  );
}