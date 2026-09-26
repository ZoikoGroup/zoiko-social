import Image from "next/image";

const regions = [
  {
    flag: "/community-standards/us.png",
    name: "North America",
    focus: "Election misinformation, conspiracy theories, harassment",
    details:
      "3 dedicated regional teams. Rapid response to election-related content.",
  },
  {
    flag: "/community-standards/eu.png",
    name: "Europe",
    focus: "GDPR compliance, hate speech against protected groups",
    details:
      "2 teams handling strict data protection and right-to-be-forgotten requests.",
  },
  {
    flag: "🌏",
    name: "Asia Pacific",
    focus: "Language nuance, political sensitivity, religious respect",
    details:
      "3 teams with native speakers & cultural experts. Deep local knowledge.",
  },
];

export default function GlobalEnforcement() {
  return (
    <section className="w-full bg-white px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-8">
        {/* Heading */}
        <div className="flex w-full flex-col items-start gap-6">
          <h2 className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            How we enforce globally
          </h2>

          <p className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A]">
            Different regions have different norms, languages, and legal
            systems. We apply our core values globally but adapt enforcement
            for local context.
          </p>
        </div>

        {/* Regional Cards */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {regions.map((region) => (
            <article
              key={region.name}
              className="flex w-full flex-col items-start gap-2.5 rounded-[20px] border border-[#D5E7EA] bg-white p-6"
            >
              {/* Region Header */}
              <div className="flex w-full items-center gap-2 pb-px">
                {region.flag.startsWith("/") ? (
                  <Image
                    src={region.flag}
                    alt={`${region.name} flag`}
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  <span
                    className="flex h-6 w-6 items-center justify-center text-xl leading-6"
                    aria-hidden="true"
                  >
                    {region.flag}
                  </span>
                )}

                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#00AFC7]">
                  {region.name}
                </h3>
              </div>

              {/* Focus */}
              <p className="w-full font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
                <span className="font-bold">Focus:</span>{" "}
                {region.focus}
              </p>

              {/* Details */}
              <p className="w-full pt-1 font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5 text-[#46636A]">
                {region.details}
              </p>
            </article>
          ))}
        </div>

        {/* Why this matters */}
        <div className="w-full rounded-[20px] bg-[#F5F7F8] px-6 py-6">
          <p className="font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
            <span className="font-bold">Why this matters:</span>{" "}
            A phrase acceptable in one country might be offensive in another.
            A political joke clear to one culture might be misunderstood in
            another. We hire regional teams to catch these nuances.
          </p>
        </div>
      </div>
    </section>
  );
}