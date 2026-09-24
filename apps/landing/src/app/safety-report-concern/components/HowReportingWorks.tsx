import { C } from "./theme";

/** The three numbered steps from the design. */
const STEPS: readonly { number: string; title: string; blurb: string }[] = [
  {
    number: "1",
    title: "Report",
    blurb:
      "Share details about what concerns you. Be as specific as possible to help us understand the issue.",
  },
  {
    number: "2",
    title: "Review",
    blurb:
      "Our moderation team carefully reviews your report against our Community Standards.",
  },
  {
    number: "3",
    title: "Action",
    blurb:
      "We take appropriate action if content or behavior violates our guidelines.",
  },
];

export default function HowReportingWorks() {
  return (
    <section style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-12">
          <h2 className="text-3xl font-extrabold leading-10" style={{ color: C.ink }}>
            How reporting works
          </h2>

          <div className="flex flex-col gap-8 lg:flex-row lg:justify-center">
            {STEPS.map((s) => (
              <div
                key={s.number}
                className="flex flex-col items-center gap-4 rounded-2xl bg-white py-4 lg:w-96"
              >
                <p className="text-5xl font-bold" style={{ color: C.brand }}>
                  {s.number}
                </p>
                <p className="text-base font-bold" style={{ color: C.brand }}>
                  {s.title}
                </p>
                <p
                  className="max-w-64 text-center text-sm leading-6"
                  style={{ color: C.muted }}
                >
                  {s.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
