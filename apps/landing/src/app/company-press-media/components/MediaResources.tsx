import Link from "next/link";
import Image from "next/image";

export default function MediaResources() {
  const resources = [
    {
      iconDesktop: "/company-press-media/icon-media-kit.png",
      iconMobile: "/company-press-media/emoji-package.png",
      title: "Media Kit",
      desc: "Company overview, approved boilerplate, key facts, and contact information.",
      btnText: "Download",
      btnPrimary: true,
      meta: "ZIP • 12 MB • Updated Sept 2026",
    },
    {
      iconDesktop: "/company-press-media/icon-fact-sheet.png",
      iconMobile: "/company-press-media/emoji-page.png",
      title: "Fact Sheet",
      desc: "Quick-reference company facts with last-updated metadata.",
      btnText: "Download",
      btnPrimary: true,
      meta: "PDF • 240 KB • Current",
    },
    {
      iconDesktop: "/company-press-media/icon-screenshots.png",
      iconMobile: "/company-press-media/emoji-picture.png",
      title: "Screenshots & UI",
      desc: "Approved product screenshots and mobile interface images with captions.",
      btnText: "Download",
      btnPrimary: true,
      meta: "ZIP • 45 MB • Updated Sept 2026",
    },
    {
      iconDesktop: "/company-press-media/icon-brand-assets.png",
      iconMobile: "/company-press-media/emoji-palette.png",
      title: "Brand Assets",
      desc: "Official logos, marks, and brand guidelines with usage rules.",
      btnText: "View Brand Assets",
      btnPrimary: false,
      meta: "Multi-format • Managed elsewhere",
    }
  ];

  return (
    <section className="bg-[#f7f9fa] w-full">
      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:flex flex-col gap-9 px-6 xl:px-20 py-[80px] mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[#102a32] text-[36px] font-bold font-jakarta leading-tight tracking-[-0.36px]">
            Media resources
          </h2>
          <p className="text-[#5e7076] text-[17px] font-jakarta">
            Approved assets, boilerplate, and materials for journalists, broadcasters, and content creators.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-5">
          {resources.map((res, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] p-6 h-auto min-h-[324px] flex flex-col items-center justify-between shadow-sm"
            >
              <div className="flex flex-col items-center text-center gap-4 w-full">
                <div className="flex items-center justify-center mb-1">
                  <Image src={res.iconDesktop} alt={res.title} width={48} height={48} className="object-contain" />
                </div>
                <h3 className="text-[#066879] text-[20px] font-bold font-jakarta leading-tight">
                  {res.title}
                </h3>
                <p className="text-[#5e7076] text-[14px] leading-[1.65] font-jakarta">
                  {res.desc}
                </p>
              </div>
              
              <div className="flex flex-col items-center w-full mt-6 gap-3">
                <Link 
                  href="#"
                  className={`w-full py-[12px] px-[20px] rounded-[12px] font-semibold font-jakarta text-[14px] text-center transition-colors flex items-center justify-center ${
                    res.btnPrimary 
                      ? "bg-[#066879] text-white hover:bg-[#055361]" 
                      : "bg-white border border-[#dce5e8] text-[#102a32] hover:bg-gray-50"
                  }`}
                >
                  {res.btnText}
                </Link>
                <div className="text-[#5e7076] text-[12px] font-jakarta text-center">
                  {res.meta}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boilerplate Section */}
        <div className="bg-[#eef8f9] rounded-[12px] p-8 flex flex-col gap-4 mt-2">
          <h3 className="text-[#066879] text-[20px] font-bold font-jakarta leading-tight">
            Company boilerplate
          </h3>
          <div className="text-[#5e7076] text-[14px] leading-[1.65] font-jakarta">
            <p className="mb-2">
              Zoiko Social is a global social network and social infrastructure designed around animal life, communities, professionals, organizations, verified information, and responsible engagement. Operating as a trading name and division of Zoiko Media Corp, Zoiko Social provides tools for community building, adoption coordination, professional networking, and welfare-focused information sharing. The platform operates with institutional moderation, source verification, profanity-free environments, and anti-trafficking safeguards.
            </p>
            <p>Learn more at zoikosocial.com.</p>
          </div>
          <div className="mt-2 flex">
            <button className="bg-white border border-[#dce5e8] text-[#102a32] font-semibold font-jakarta text-[14px] py-[10px] px-[20px] rounded-[12px] hover:bg-gray-50 transition-colors">
              Copy Boilerplate
            </button>
          </div>
        </div>
      </div>

      {/* === MOBILE LAYOUT === */}
      <div className="flex md:hidden flex-col gap-5 px-6 py-[48px]">
        {/* Header */}
        <div className="flex flex-col gap-[20px]">
          <h2 className="text-[#102a32] text-[28px] font-extrabold font-jakarta leading-[33.6px] tracking-[-0.28px]">
            Media resources
          </h2>
          <p className="text-[#5e7076] text-[17px] font-jakarta leading-[28px]">
            Approved assets, boilerplate, and materials for journalists, broadcasters, and content creators.
          </p>
        </div>

        {/* Cards Stack */}
        <div className="flex flex-col gap-[24px] pt-[8px]">
          {resources.map((res, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] p-[24px] flex flex-col items-center"
            >
              <div className="flex items-center justify-center">
                <Image src={res.iconMobile} alt={res.title} width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-[#066879] text-[20px] font-bold font-jakarta leading-normal pt-[16px] text-center">
                {res.title}
              </h3>
              <div className="text-[#5e7076] text-[14px] leading-[23.1px] font-jakarta text-center pt-[11px]">
                {res.desc}
              </div>
              <div className="text-[#5e7076] text-[12px] font-jakarta text-center pt-[12px]">
                {res.meta}
              </div>
              <div className="w-full pt-[12px] mt-auto">
                <Link 
                  href="#"
                  className={`w-full py-[12px] px-[20px] rounded-[12px] font-semibold font-jakarta text-[14px] text-center transition-colors flex items-center justify-center ${
                    res.btnPrimary 
                      ? "bg-[#066879] text-white hover:bg-[#055361]" 
                      : "bg-white border border-[#dce5e8] text-[#102a32] hover:bg-gray-50"
                  }`}
                >
                  {res.btnText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Boilerplate Section */}
        <div className="bg-white border border-[#dce5e8] rounded-[20px] px-[32px] pt-[60px] pb-[32px] flex flex-col gap-[16px] mt-[12px]">
          <h3 className="text-[#066879] text-[20px] font-bold font-jakarta leading-normal">
            Company boilerplate
          </h3>
          <div className="bg-[#eef8f9] rounded-[12px] p-[16px]">
            <div className="text-[#5e7076] text-[14px] leading-[23.1px] font-jakarta">
              Zoiko Social is a global social network and social infrastructure designed around animal life, communities, professionals, organizations, verified information, and responsible engagement. Operating as a trading name and division of Zoiko Media Corp, Zoiko Social provides tools for community building, adoption coordination, professional networking, and welfare-focused information sharing. The platform operates with institutional moderation, source verification, profanity-free environments, and anti-trafficking safeguards. Learn more at zoikosocial.com.
            </div>
          </div>
          <button className="bg-white border border-[#dce5e8] text-[#102a32] font-semibold font-jakarta text-[14px] py-[12px] px-[20px] rounded-[12px] hover:bg-gray-50 transition-colors w-full mt-2">
            Copy Boilerplate
          </button>
        </div>
      </div>
    </section>
  );
}
