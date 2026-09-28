const impactStats = [
  {
    value: "94%",
    description: "users feel safe on Zoiko (up from 87% in 2025)",
    percentage: 94,
    filled: false,
  },
  {
    value: "89%",
    description: "violations are removed within 24 hours",
    percentage: 89,
    filled: false,
  },
  {
    value: "47K",
    description: "accounts suspended this quarter for repeated violations",
    percentage: 100,
    filled: true,
  },
];

export default function Impact() {
  return (
    <section className="w-full bg-[#F7F9FA] px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-6">
        {/* Heading */}
        <h2 className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
          Impact of our standards
        </h2>

        {/* Description */}
        <p className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A]">
          Our community standards work. Here&apos;s the proof that our values
          are making Zoiko safer and healthier.
        </p>

        {/* Statistics */}
        <div className="grid w-full grid-cols-1 gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {impactStats.map((stat) => (
            <article
              key={stat.value}
              className="flex w-full flex-col items-center rounded-[20px] border border-[#D5E7EA] bg-white px-6 pb-10 pt-6"
            >
              {/* Circle */}
              <div className="flex h-32 w-32 items-center justify-center">
                {stat.filled ? (
                  /* Filled circle for 47K */
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#087789]">
                    <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-white">
                      {stat.value}
                    </span>
                  </div>
                ) : (
                  /* Progress ring for 94% / 89% */
                  <div
                    className="relative flex h-24 w-24 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(
                        #087789 ${stat.percentage}%,
                        #D9D9D9 ${stat.percentage}% 100%
                      )`,
                    }}
                  >
                    {/* Inner white circle */}
                    <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-white">
                      <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#087789]">
                        {stat.value}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 max-w-[300px] text-center font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
                {stat.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}