import Button from "../ui/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section id="cta" className="py-28">
      <div className="container">

        <div className="relative overflow-hidden rounded-[40px] bg-black px-8 py-20 text-center text-white lg:px-20">

          {/* Background Glow */}

          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[var(--gold)] opacity-20 blur-[120px]" />

          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white opacity-10 blur-[120px]" />

          <div className="relative z-10">

            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              Start Your Journey
            </span>

            <h2 className="mx-auto mt-8 max-w-4xl text-4xl font-semibold leading-tight lg:text-6xl">
              Build the Future of
              <br />
              Your Startup with FounderOS
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-300">
              One intelligent platform for finance, planning,
              AI, collaboration, analytics, and business growth.
              Spend less time managing tools and more time
              building your company.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">

              <Link to="/workspace">
                <Button
                  variant="gold"
                  size="lg"
                  icon={<ArrowRight size={18} />}
                >
                  Get Started Free
                </Button>
              </Link>

              <Link to="/login">
                <Button
                  variant="secondary"
                  size="lg"
                >
                  Book a Demo
                </Button>
              </Link>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}