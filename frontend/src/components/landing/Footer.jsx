import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-[var(--border)] bg-[var(--section)]"
    >
      <div className="container py-20">

        <div className="grid gap-12 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-lg font-bold text-white">
                F
              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  FounderOS
                </h2>

                <p className="text-sm text-[var(--muted)]">
                  AI Business Operating System
                </p>

              </div>

            </div>

            <p className="mt-6 leading-7 text-[var(--muted)]">
              FounderOS helps entrepreneurs manage finance,
              planning, AI, workspace, analytics, and growth
              from one intelligent platform.
            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Product
            </h3>

            <ul className="space-y-3 text-[var(--muted)]">

              <li className="hover:text-black transition">
                Features
              </li>

              <li className="hover:text-black transition">
                Workspace
              </li>

              <li className="hover:text-black transition">
                AI Advisor
              </li>

              <li className="hover:text-black transition">
                Analytics
              </li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Company
            </h3>

            <ul className="space-y-3 text-[var(--muted)]">

              <li className="hover:text-black transition">
                About
              </li>

              <li className="hover:text-black transition">
                Careers
              </li>

              <li className="hover:text-black transition">
                Contact
              </li>

              <li className="hover:text-black transition">
                Support
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3 text-[var(--muted)]">

                <Mail
                  size={18}
                  className="text-[var(--gold)]"
                />

                <span>hello@founderos.ai</span>

              </div>

              <div className="flex items-center gap-3 text-[var(--muted)]">

                <Phone
                  size={18}
                  className="text-[var(--gold)]"
                />

                <span>+1 (000) 000-0000</span>

              </div>

              <div className="flex items-start gap-3 text-[var(--muted)]">

                <MapPin
                  size={18}
                  className="mt-1 text-[var(--gold)]"
                />

                <span>
                  Chennai,
                  <br />
                  India
                </span>

              </div>

            </div>

            <button className="mt-8 flex items-center gap-2 rounded-full bg-black px-5 py-3 text-white transition hover:opacity-90">

              Get Started

              <ArrowUpRight size={18} />

            </button>

          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)] lg:flex-row">

          <p>
            © {new Date().getFullYear()} FounderOS. All Rights Reserved.
          </p>

          <div className="flex gap-6">

            <span className="cursor-pointer hover:text-black transition">
              Privacy Policy
            </span>

            <span className="cursor-pointer hover:text-black transition">
              Terms of Service
            </span>

          </div>

        </div>

      </div>
    </footer>
  );
}