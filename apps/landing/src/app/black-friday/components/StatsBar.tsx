const STATS = [
  { value: "2.4M+", label: "Active Members" },
  { value: "12K+", label: "Verified Communities" },
  { value: "99.2%", label: "Moderation Accuracy" },
  { value: "24h", label: "Avg Response Time" },
];

export default function StatsBar() {
  return (
    <section className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
      <dl className="grid grid-cols-2 gap-y-10 rounded-3xl bg-gradient-to-br from-[#0B6475] to-[#0A4F5E] px-6 py-12 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col-reverse items-center gap-2 text-center">
            <dt className="text-sm text-white/90">{s.label}</dt>
            <dd className="text-4xl font-extrabold text-white sm:text-5xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
