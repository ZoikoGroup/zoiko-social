interface StatItem {
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  {
    value: "2.4M+",
    label: "Active Members",
  },
  {
    value: "12K+",
    label: "Verified Communities",
  },
  {
    value: "99.2%",
    label: "Moderation Accuracy",
  },
  {
    value: "24h",
    label: "Avg Response Time",
  },
];

export default function StatsBanner() {
  return (
    <section className="w-full bg-[#F8FAFA] pb-14 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-[#055D6E] px-6 py-10 shadow-lg sm:rounded-3xl sm:bg-[#006D77] sm:px-10 sm:py-12">
          <div className="grid grid-cols-1 gap-7 text-center text-white sm:grid-cols-4 sm:gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[40px]">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-normal text-white/80 sm:mt-2 sm:text-sm">
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
