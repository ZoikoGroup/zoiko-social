/* eslint-disable @next/next/no-img-element */

export default function CompanyAtAGlance() {
  const cards = [
    {
      icon: "/company-press-media/emoji-globe.png",
      title: "What we are",
      desc: "A global social network and social infrastructure designed around animal life, communities, professionals, organizations, verified welfare information, and responsible engagement."
    },
    {
      icon: "/company-press-media/emoji-building.png",
      title: "Company structure",
      desc: "Zoiko Social is a trading name and division of Zoiko Media Corp. Zoiko Media Corp is a Zoiko Group company."
    },
    {
      icon: "/company-press-media/emoji-pin.png",
      title: "Headquarters",
      desc: (
        <>
          <p className="mb-0 text-[#5e7076]">
            <span className="font-bold">North America:</span> Sacramento, California, USA.
          </p>
          <p className="text-[#5e7076] mt-2">
            <span className="font-bold">Europe:</span> London, United Kingdom.
          </p>
        </>
      )
    },
    {
      icon: "/company-press-media/emoji-check.png",
      title: "Core platform areas",
      desc: "Communities, verified news, events, adoption & fostering, professional discovery, marketplace, premium features, and safety."
    },
    {
      icon: "/company-press-media/emoji-shield.png",
      title: "Trust model",
      desc: "Profanity-free environment, organization & source verification, institutional moderation, animal welfare reporting, and anti-trafficking controls."
    },
    {
      icon: "/company-press-media/emoji-clipboard.png",
      title: "Source of record",
      desc: "Official releases, approved announcements, and verified company information published here. Questions? Use Media Inquiry below."
    }
  ];

  return (
    <section className="bg-[#f7f9fa] w-full">
      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:flex flex-col gap-10 pt-[80px] pb-[100px] px-6 xl:px-20 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[#102a32] text-[40px] font-bold font-jakarta leading-tight">
            Company at a glance
          </h2>
          <p className="text-[#5e7076] text-[18px] font-jakarta">
            Verified facts and company positioning for journalists and media professionals.
          </p>
        </div>

        {/* Cards Grid - 3 columns desktop */}
        <div className="grid grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] p-8 flex flex-col gap-4 shadow-sm"
            >
              <h3 className="text-[#e88924] text-[20px] font-bold font-jakarta">
                {card.title}
              </h3>
              <div className="text-[#5e7076] text-[17px] leading-relaxed font-jakarta">
                {card.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop bottom image */}
        <div className="w-full relative mt-6 rounded-[28px] overflow-hidden shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] aspect-[1230/336]">
          <img
            src="http://localhost:3845/assets/b1b230d21f9ef72354b9e1e4129bfe16c1b09783.png"
            alt="Editorial team working"
            className="absolute left-0 max-w-none w-full h-[243.66%] top-[-58.08%] object-fill"
          />
        </div>
      </div>

      {/* === MOBILE LAYOUT === */}
      <div className="flex md:hidden flex-col gap-5 px-6 py-[48px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[#102a32] text-[28px] font-extrabold font-jakarta leading-tight tracking-[-0.28px]">
            Company at a glance
          </h2>
          <p className="text-[#5e7076] text-[17px] font-jakarta leading-[28px]">
            Verified facts and company positioning for journalists and media professionals.
          </p>
        </div>

        {/* Mobile cards - single column with Twemoji icons */}
        <div className="flex flex-col gap-6 pt-[8px] pb-[60px]">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] pb-[52px] pt-[32px] px-[32px] flex flex-col gap-3 shadow-sm"
            >
              {/* Twemoji icon - matches Figma emoji rendering */}
              <img
                src={card.icon}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h3 className="text-[#e88924] text-[20px] font-bold font-jakarta mt-1">
                {card.title}
              </h3>
              <div className="text-[#5e7076] text-[17px] leading-[28px] font-jakarta">
                {card.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile bottom image — different asset, square-ish aspect ratio */}
        <div className="w-full relative rounded-[28px] overflow-hidden shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] aspect-[342/350]">
          <div
            className="absolute inset-0 rounded-[28px]"
            style={{ backgroundImage: "linear-gradient(135deg, rgb(6,104,121) 0%, rgb(232,137,36) 100%)" }}
          />
          <img
            src="/company-press-media/mobile-editorial.png"
            alt="Editorial team working on newsroom and company communications"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
