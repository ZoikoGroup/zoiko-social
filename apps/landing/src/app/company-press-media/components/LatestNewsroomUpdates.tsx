import Link from "next/link";

export default function LatestNewsroomUpdates() {
  const cards = [
    {
      title: "Zoiko Social Launches Verified Rescue Network",
      tag: "Press Release",
      date: "September 20, 2026 • Global",
      desc: "New institutional verification program for rescue organizations and shelters, enhancing safety and coordination across adoption and fostering ecosystems.",
      linkText: "Read Release →",
      href: "#"
    },
    {
      title: "Animal Welfare Commitment 2026",
      tag: "Company Update",
      date: "September 15, 2026 • Global",
      desc: "Annual report on platform investments in welfare reporting, anti-trafficking technology, and community moderation initiatives.",
      linkText: "Read Update →",
      href: "#"
    },
    {
      title: "New Event Features for Communities",
      tag: "Product Announcement",
      date: "September 10, 2026 • Global",
      desc: "Enhanced event planning tools for animal rescue fundraisers, adoption events, training workshops, and community gatherings.",
      linkText: "Read Announcement →",
      href: "#"
    }
  ];

  return (
    <section className="bg-white w-full py-[80px]">
      <div className="mx-auto flex flex-col gap-9 px-4 sm:px-6 xl:px-20 max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[#102a32] text-[32px] md:text-[36px] font-bold font-jakarta leading-tight tracking-[-0.36px]">
            Latest newsroom updates
          </h2>
          <p className="text-[#5e7076] text-[16px] md:text-[17px] font-jakarta">
            Official company announcements, press releases, and media advisories.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] p-6 h-auto min-h-[297px] flex flex-col justify-between shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-[#102a32] text-[20px] font-bold font-jakarta leading-tight">
                    {card.title}
                  </h3>
                  <span className="bg-[#eef8f9] text-[#066879] px-2 py-1 rounded-[12px] text-[12px] font-semibold whitespace-nowrap shrink-0">
                    {card.tag}
                  </span>
                </div>
                <div className="text-[#5e7076] text-[14px] font-jakarta">
                  {card.date}
                </div>
                <div className="text-[#5e7076] text-[14px] leading-[1.65] font-jakarta">
                  {card.desc}
                </div>
              </div>
              <Link 
                href={card.href}
                className="text-[#066879] text-[16px] font-semibold font-jakarta mt-6 block hover:underline"
              >
                {card.linkText}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="flex justify-center mt-4">
          <Link 
            href="#"
            className="text-[#066879] text-[16px] font-semibold font-jakarta underline hover:text-[#055361] transition-colors"
          >
            Browse all releases →
          </Link>
        </div>
      </div>
    </section>
  );
}
