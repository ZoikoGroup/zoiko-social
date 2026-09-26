/* eslint-disable @next/next/no-img-element */

export default function InterviewTopics() {
  const cards = [
    {
      title: "Animal-focused social infrastructure",
      desc: "Community design, platform responsibility, engagement ethics, animal-welfare technology, adoption coordination.",
      routing: "Routing: Product/Community spokesperson",
    },
    {
      title: "Trust, safety & moderation",
      desc: "Platform governance, content moderation, animal welfare policy, anti-trafficking approaches, verification systems.",
      routing: "Routing: Trust & Safety team",
    },
    {
      title: "Verified information & animal welfare news",
      desc: "News verification, editorial independence, welfare reporting, combating misinformation in animal communities.",
      routing: "Routing: Editorial/Content team",
    },
    {
      title: "Adoption, rescue & professional ecosystems",
      desc: "Rescue operations, shelter coordination, professional discovery, veterinary networks, adoption technology.",
      routing: "Routing: Product/Partnerships",
    }
  ];

  return (
    <section className="bg-white w-full">
      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:flex flex-col gap-9 px-6 xl:px-20 py-[80px] mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[#102a32] text-[36px] font-bold font-jakarta leading-tight tracking-[-0.36px]">
            What we can speak about
          </h2>
          <p className="text-[#5e7076] text-[17px] font-jakarta">
            Topic areas where Zoiko Social team members are available for interviews, commentary, and expert discussion.
          </p>
        </div>

        {/* Large Image Mask - Desktop */}
        <div className="aspect-[1280/350] relative rounded-[28px] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] shrink-0 w-full overflow-hidden">
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#066879] to-[#e88924]" />
          <img
            src="/company-press-media/interview-topics-hero.png"
            alt="Interview setup"
            className="absolute h-[243.81%] left-0 max-w-none top-[-37.27%] w-full"
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] p-8 flex flex-col gap-4 shadow-sm"
            >
              <h3 className="text-[#066879] text-[20px] font-bold font-jakarta leading-tight">
                {card.title}
              </h3>
              <p className="text-[#5e7076] text-[14px] leading-[1.65] font-jakarta mb-auto">
                {card.desc}
              </p>
              <p className="text-[#5e7076] text-[14px] font-jakarta">
                {card.routing}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* === MOBILE LAYOUT === */}
      <div className="flex md:hidden flex-col items-start pb-[48px] pt-[47px] px-[24px]">
        <div className="flex flex-col gap-[20px] pb-[36px] w-full">
          {/* Header */}
          <div className="flex flex-col w-full">
            <h2 className="text-[#102a32] text-[28px] font-extrabold font-jakarta leading-[33.6px] tracking-[-0.28px]">
              What we can speak<br/>about
            </h2>
          </div>
          <div className="flex flex-col w-full">
            <p className="text-[#5e7076] text-[17px] font-jakarta leading-[28px]">
              Topic areas where Zoiko Social team members are available for interviews, commentary, and expert discussion.
            </p>
          </div>
        </div>

        {/* Cards Stack */}
        <div className="flex flex-col gap-[24px] pb-[60px] pt-[28px] w-full">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] pb-[52px] pt-[32px] px-[32px] flex flex-col gap-[15px] w-full"
            >
              <h3 className="text-[#066879] text-[20px] font-bold font-jakarta leading-[24px]">
                {card.title}
              </h3>
              <div className="text-[#5e7076] text-[17px] leading-[28px] font-jakarta mb-auto">
                {card.desc}
              </div>
              <div className="text-[#5e7076] text-[14px] leading-[23.1px] font-jakarta">
                {card.routing}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Image */}
        <div className="w-full relative rounded-[28px] overflow-hidden aspect-[342/350] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)]">
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#066879] to-[#e88924]" />
          <img
            src="/company-press-media/mobile-interview-topics.png"
            alt="Interview and podcast production setup"
            className="absolute left-0 top-0 max-w-none w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
