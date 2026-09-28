import { C } from "./theme";

const STATS = [
  { value: "50.1K", label: "Animals helped" },
  { value: "2M", label: "Community interactions" },
  { value: "41.8K", label: "Events hosted" },
  { value: "120K+", label: "Active organizations" },
];

/** "Real impact, real numbers" — 4 outlined stat cards. */
export default function RealImpactRealNumbers() {
  return (
    <section className="w-full px-4 py-12 sm:px-8 sm:py-16 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 lg:gap-12">
        <h2
          className="text-center font-jakarta text-2xl font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl"
          style={{ color: C.ink }}
        >
          Real impact, real numbers
        </h2>
        <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-[20px] border bg-white p-6 sm:p-8"
              style={{ borderColor: C.line }}
            >
              <span className="text-center font-jakarta text-3xl font-extrabold sm:text-4xl" style={{ color: C.brand }}>
                {stat.value}
              </span>
              <span className="text-center text-[13px] font-semibold" style={{ color: C.muted }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
