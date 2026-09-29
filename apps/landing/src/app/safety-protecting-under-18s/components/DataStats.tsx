interface StatItem {
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  {
    value: "99%+",
    label: "Harmful Content Removed",
  },
  {
    value: "18h",
    label: "Avg Response Time",
  },
  {
    value: "4.2M+",
    label: "Young People Here",
  },
  {
    value: "100%",
    label: "Appeal Access",
  },
];

export default function DataStats() {
  return (
    <section className="w-full bg-[#F8FAFA] py-12 sm:py-0 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Descriptive text */}
          <div className="max-w-[500px]">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px] lg:leading-[1.25]">
              We Back This Up With Data
            </h2>

            <p className="mt-4 text-xs leading-relaxed text-[#5A7371] sm:mt-5 sm:text-base sm:leading-7">
              Our commitment to youth safety is more than words. These numbers
              show our track record and areas where we&apos;re improving.
            </p>

            <p className="mt-3 text-xs leading-relaxed text-[#5A7371] sm:mt-4 sm:text-base sm:leading-7">
              Every month, we publish transparency reports showing how often we
              enforce rules, how fast we respond, and where we can do better.
            </p>
          </div>

          {/* Right Column: 2x2 Stat Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md sm:p-8"
              >
                <span className="text-xl font-bold tracking-tight text-[#006D77] sm:text-3xl lg:text-[32px]">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-[11px] font-medium text-[#5A7371] sm:mt-2 sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
