export default function Enforce() {
  const rows = [
    {
      level: "Minor violation",
      examples: "Low-level disrespect, accidental slurs",
      first: "Warning + education",
      repeated: "Content removal",
      severe: "Account restriction",
    },
    {
      level: "Major violation",
      examples: "Hate speech, harassment",
      first: "Content removal",
      repeated: "Account suspension",
      severe: "Permanent ban",
    },
    {
      level: "Critical violation",
      examples: "Threats, illegal content",
      first: "Immediate account ban",
      repeated: "Law enforcement",
      severe: "Law enforcement",
    },
  ];

  return (
    <section className="w-full bg-white px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-8">
        {/* Heading */}
        <div className="flex w-full flex-col items-start gap-5 sm:gap-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            How we enforce
          </h2>

          <p className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A]">
            Our enforcement is proportional to the violation. We aim to
            educate and give people chances to improve, while protecting the
            community.
          </p>
        </div>

        {/* Table */}
        <div className="w-full overflow-hidden rounded-[20px] border border-[#D5E7EA] bg-white">
          {/* Desktop Header */}
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] border-b-2 border-[#D5E7EA] bg-gradient-to-b from-[#F2F5F6] to-white md:grid">
            <div className="p-6">
              <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#00AFC7]">
                Violation Level
              </span>
            </div>

            <div className="p-6">
              <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#00AFC7]">
                First Offense
              </span>
            </div>

            <div className="p-6">
              <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#00AFC7]">
                Repeated
              </span>
            </div>

            <div className="p-6">
              <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#00AFC7]">
                Severe/Deliberate
              </span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, index) => (
            <div
              key={row.level}
              className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] ${
                index !== rows.length - 1
                  ? "border-b border-[#D5E7EA]"
                  : ""
              }`}
            >
              {/* Violation */}
              <div className="p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#073B47]">
                    {row.level}
                  </h3>

                  <p className="font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5 text-[#46636A]">
                    {row.examples}
                  </p>
                </div>
              </div>

              {/* First Offense */}
              <div className="px-6 pb-5 pt-2 md:py-6">
                <div className="md:hidden mb-1 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wide text-[#00AFC7]">
                  First Offense
                </div>

                <p className="font-['Plus_Jakarta_Sans'] text-base font-normal leading-6 text-[#073B47]">
                  {row.first}
                </p>
              </div>

              {/* Repeated */}
              <div className="px-6 pb-5 pt-2 md:py-6">
                <div className="md:hidden mb-1 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wide text-[#00AFC7]">
                  Repeated
                </div>

                <p className="font-['Plus_Jakarta_Sans'] text-base font-normal leading-6 text-[#073B47]">
                  {row.repeated}
                </p>
              </div>

              {/* Severe / Deliberate */}
              <div className="px-6 pb-6 pt-2 md:py-6">
                <div className="md:hidden mb-1 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wide text-[#00AFC7]">
                  Severe/Deliberate
                </div>

                <p className="font-['Plus_Jakarta_Sans'] text-base font-normal leading-6 text-[#073B47]">
                  {row.severe}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}