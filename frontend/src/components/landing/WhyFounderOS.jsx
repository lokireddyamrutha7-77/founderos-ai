import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const points = [
  "Everything in one unified workspace",
  "AI that understands your business",
  "No switching between multiple tools",
  "Real-time analytics and insights",
  "Built specifically for startup founders",
  "Secure, scalable and collaborative",
];

export default function WhyFounderOS() {
  return (
    <section
      id="modules"
      className="bg-[var(--section)] py-28"
    >
      <div className="container">

        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* Left */}

          <div>

            <span className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--muted)]">
              Why FounderOS
            </span>

            <h2 className="mt-6 text-5xl font-semibold leading-tight">
              Stop Managing
              <br />
              Multiple Apps.
            </h2>

            <p className="mt-8 text-lg leading-8 text-[var(--muted)]">
              Most founders use separate tools for finance,
              project management, notes, AI, analytics,
              calendars and communication.

              <br />
              <br />

              FounderOS brings everything together into one
              intelligent operating system that helps you make
              faster and better business decisions.
            </p>

            <div className="mt-10 space-y-5">

              {points.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >

                  <CheckCircle2
                    size={22}
                    className="text-[var(--gold)]"
                  />

                  <span className="text-lg">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Right */}

          <div className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-md)]">

            <h3 className="text-2xl font-semibold text-gray-900">
              Traditional Workflow
            </h3>

            <div className="mt-8 space-y-4">

              {[
                "Excel",
                "Notion",
                "Trello",
                "Google Drive",
                "ChatGPT",
                "Calendar",
              ].map((tool) => (

                <div
                  key={tool}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] px-5 py-4"
                >

                  <span className="text-gray-900">{tool}</span>

                  <ArrowRight
                    size={18}
                    className="text-[var(--muted)]"
                  />

                </div>

              ))}

            </div>

            <div className="my-8 flex justify-center">

              <ArrowRight
                size={42}
                className="text-[var(--gold)]"
              />

            </div>

            <div className="rounded-3xl bg-black p-8 text-center text-white">

              <h3 className="text-3xl font-semibold">
                FounderOS
              </h3>

              <p className="mt-3 text-gray-300">
                One platform for finance, AI,
                workspace, planning,
                analytics and growth.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}