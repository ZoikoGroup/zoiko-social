import Link from "next/link";
import Image from "next/image";

export default function TrustGovernance() {
  const cards = [
    {
      iconDesktop: "/company-press-media/icon-safety.png",
      iconMobile: "/company-press-media/emoji-shield.png",
      title: "Safety Center",
      desc: "Overview of user, animal, and community protections.",
      linkText: "Open Safety Center →",
      href: "#"
    },
    {
      iconDesktop: "/company-press-media/icon-verification.png",
      iconMobile: "/company-press-media/emoji-check.png",
      title: "Verification Systems",
      desc: "How organization, source, and professional verification works.",
      linkText: "Learn About Verification →",
      href: "#"
    },
    {
      iconDesktop: "/company-press-media/icon-standards.png",
      iconMobile: "/company-press-media/emoji-clipboard.png",
      title: "Community Standards",
      desc: "Rules and enforcement expectations for all users.",
      linkText: "Read Standards →",
      href: "#"
    },
    {
      iconDesktop: "/company-press-media/icon-transparency.png",
      iconMobile: "/company-press-media/emoji-chart.png",
      title: "Transparency Reports",
      desc: "Public reporting on moderation, safety incidents, and governance.",
      linkText: "View Reports →",
      href: "#"
    }
  ];

  return (
    <section className="bg-[#f7f9fa] w-full">
      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:flex flex-col gap-9 px-6 xl:px-20 py-[80px] mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[#102a32] text-[36px] font-bold font-jakarta leading-tight tracking-[-0.36px]">
            Trust and governance sources
          </h2>
          <p className="text-[#5e7076] text-[17px] font-jakarta">
            First-party evidence and official policies reporters can verify.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-5">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] p-6 h-auto min-h-[252px] flex flex-col items-center justify-between shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center gap-4 w-full">
                <div className="flex items-center justify-center mb-1">
                  <Image src={card.iconDesktop} alt={card.title} width={48} height={48} className="object-contain" />
                </div>
                <h3 className="text-[#066879] text-[20px] font-bold font-jakarta leading-tight">
                  {card.title}
                </h3>
                <p className="text-[#5e7076] text-[14px] leading-[1.65] font-jakarta px-2">
                  {card.desc}
                </p>
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
      </div>

      {/* === MOBILE LAYOUT === */}
      <div className="flex md:hidden flex-col items-start px-[24px] pt-[47px] pb-[96px] gap-[20px]">
        {/* Header */}
        <div className="flex flex-col gap-[20px] pb-[8px] w-full">
          <div className="flex flex-col w-full">
            <h2 className="text-[#102a32] text-[28px] font-extrabold font-jakarta leading-[33.6px] tracking-[-0.28px]">
              Trust and governance<br/>sources
            </h2>
          </div>
          <div className="flex flex-col w-full">
            <p className="text-[#5e7076] text-[17px] font-jakarta leading-[28px]">
              First-party evidence and official policies reporters can verify.
            </p>
          </div>
        </div>

        {/* Cards Stack */}
        <div className="flex flex-col gap-[24px] w-full">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] p-[24px] pb-[32px] pt-[32px] flex flex-col items-center gap-[11px] w-full"
            >
              <div className="flex items-center justify-center">
                <Image src={card.iconMobile} alt={card.title} width={40} height={40} className="object-contain" />
              </div>
              <h3 className="text-[#066879] text-[20px] font-bold font-jakarta leading-normal pt-[5px] text-center">
                {card.title}
              </h3>
              <div className="text-[#5e7076] text-[14px] leading-[23.1px] font-jakarta text-center px-1">
                {card.desc}
              </div>
              <Link 
                href={card.href}
                className="text-[#066879] text-[14px] font-bold font-jakarta mt-3 text-center"
              >
                {card.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
