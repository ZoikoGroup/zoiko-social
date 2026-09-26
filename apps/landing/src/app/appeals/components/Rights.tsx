export default function Rights() {
  const stats = [
    {
      value: "44.2K",
      label: "Appeals reviewed in Q3 2026",
    },
    {
      value: "929",
      label: "Decisions overturned (2.1%)",
    },
    {
      value: "4.2 days",
      label: "Average review time",
    },
  ];

  return (
    <section className="w-full bg-[#F7F9F9]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20 lg:py-20 xl:px-28">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="w-full text-center text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
              You have the right to appeal
            </h2>
          </div>

          {/* Description */}
          <div className="flex w-full flex-col items-start">
            <p className="w-full text-center text-base font-normal leading-7 text-[#46636A]">
              Every enforcement decision can be reviewed. We take appeals
              seriously and adjust our decisions when we&apos;re wrong.
            </p>
          </div>

          {/* Statistics */}
          <div className="flex w-full flex-col items-stretch justify-center gap-4 pt-4 sm:gap-5 md:pt-6 lg:flex-row lg:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="flex flex-1 flex-col items-center justify-start gap-2 rounded-[20px] border border-[#BFE7E9] bg-white p-6 sm:p-8"
              >
                <div className="flex w-full flex-col items-center">
                  <div className="text-center text-4xl font-extrabold leading-tight text-[#00AFC7] sm:text-5xl">
                    {stat.value}
                  </div>
                </div>

                <div className="flex w-full flex-col items-center">
                  <p className="text-center text-sm font-normal leading-5 text-[#46636A]">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}