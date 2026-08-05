"use client";

const stats = [
  {
    value: "12,500+",
    label: "Verified Professionals",
  },
  {
    value: "2,800+",
    label: "Active Communities",
  },
  {
    value: "<2 min",
    label: "Average Response Time",
  },
];

export default function StatsSection() {
  return (
    <section className="-mt-16 relative z-20">
      <div className="mx-auto max-w-[807px] rounded-2xl bg-white shadow-md shadow-black/10">
        <div className="grid h-36 grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center ${
                index !== stats.length - 1 ? "border-r border-gray-100" : ""
              }`}
            >
              <h2 className="font-inter text-[32px] font-extrabold leading-[51.2px] text-[#066879]">
                {stat.value}
              </h2>

              <p className="mt-2 font-inter text-center text-sm font-normal leading-6 text-[#4B5563]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}