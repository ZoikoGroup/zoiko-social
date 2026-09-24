import { C } from "./theme";

/** Stats shown in the strip under the hero. */
const STATS: readonly { value: string; label: string }[] = [
  { value: "847K", label: "Reports reviewed" },
  { value: "94%", label: "Community satisfaction" },
  { value: "24h", label: "Average review time" },
  { value: "15+", label: "Years of safety" },
];

export default function WhyReportingMatters() {
  return (
    <section style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold leading-10" style={{ color: C.ink }}>
            Why reporting matters
          </h2>
          <p className="text-base leading-6" style={{ color: C.muted }}>
            Every report helps us understand what&apos;s happening on Zoiko and
            take appropriate action. Your voice builds a safer community for
            everyone.
          </p>

          <div className="flex flex-col gap-8 pt-14 sm:flex-row">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-1 flex-col items-center gap-3 rounded-[20px] p-8"
                style={{ background: C.white, border: `1px solid ${C.line}` }}
              >
                <p className="text-5xl font-extrabold" style={{ color: C.brand }}>
                  {s.value}
                </p>
                <p className="text-sm font-semibold" style={{ color: C.ink }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}