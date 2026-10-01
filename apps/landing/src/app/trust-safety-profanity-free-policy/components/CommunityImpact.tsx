interface ImpactStat {
  value: string;
  label: string;
}

const STATS: ImpactStat[] = [
  {
    value: "98.7%",
    label: "Members Feel Safe & Respected",
  },
  {
    value: "24h",
    label: "Avg Moderation Response Time",
  },
  {
    value: "2.1M",
    label: "Active Family-Friendly Members",
  },
  {
    value: "Zero",
    label: "Tolerance for Harassment",
  },
];

export default function CommunityImpact() {
  return (
    <section className="w-full bg-white py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <h2 className="text-center text-[26px] font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Community Impact <br className="sm:hidden" />by the Numbers
        </h2>

        {/* Mobile: 2x2 Grid with Orange Borders | Desktop: 4 Columns with Teal Borders */}
        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-[#EA8A1A] bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:border-[#006D77]/30 sm:p-8 sm:shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            >
              <span className="text-2xl font-bold tracking-tight text-[#006D77] sm:text-[36px]">
                {stat.value}
              </span>
              <span className="mt-1.5 text-[10px] font-medium leading-tight text-[#5A7371] sm:mt-2 sm:text-[13px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
