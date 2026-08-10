import React from "react";

export default function TrustSection() {
  const cards = [
    {
      id: "01",
      title: (
        <>
          Profanity-Free<br />Environment
        </>
      ),
      text: (
        <>
          All users operate within a profanity-free<br />
          environment enforced by automated and<br />
          human moderation.
        </>
      ),
      pt: "pt-[46px]",
      mt: "mt-[26px]",
      h: "lg:h-[267px]",
    },
    {
      id: "02",
      title: "Tiered Verification",
      text: (
        <>
          News and information are published<br />
          through tiered verification systems that<br />
          distinguish institutional sources, verified<br />
          professionals, and community<br />
          contributors.
        </>
      ),
      pt: "pt-[41px]",
      mt: "mt-[21px]",
      h: "lg:h-[267px]",
    },
    {
      id: "03",
      title: "Anti-Trafficking Controls",
      text: (
        <>
          Adoption, rescue, and commerce<br />
          functions are protected by anti-trafficking<br />
          controls, identity verification, and<br />
          jurisdiction-aware compliance processes.
        </>
      ),
      pt: "pt-[41px]",
      mt: "mt-[21px]",
      h: "lg:h-[267px]",
    },
    {
      id: "04",
      title: "Ethical Advertising",
      text: (
        <>
          Advertising is permitted only for vetted,<br />
          animal-aligned professionals and<br />
          organizations, clearly labeled and<br />
          structurally separated from news content.
        </>
      ),
      pt: "pt-[41px]",
      mt: "mt-[21px]",
      h: "lg:h-[240px]",
    },
    {
      id: "05",
      title: (
        <>
          Responsibility Over<br />Virality
        </>
      ),
      text: (
        <>
          ZoikoSocial does not optimize for virality.<br />
          It optimizes for responsibility.
        </>
      ),
      pt: "pt-[46px]",
      mt: "mt-[26px]",
      h: "lg:h-[240px]",
    },
  ];

  return (
    <section className="w-full bg-white px-6 py-16 md:px-[80px] lg:py-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-montserrat text-2xl font-extrabold text-gray-900 md:text-3xl lg:leading-[52.80px]">
            A Platform Governed by Trust
          </h2>
          <p className="mt-4 font-inter text-lg font-normal text-gray-600 md:text-xl lg:leading-8">
            Trust is the foundation of ZoikoSocial
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-12 flex w-full flex-wrap justify-center gap-6 lg:mt-[98px] lg:gap-x-[40px] lg:gap-y-[44px]">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className={`relative flex h-auto w-full flex-col rounded-2xl bg-gray-50 pl-[41px] pr-4 pb-8 outline outline-1 -outline-offset-1 outline-gray-200 lg:w-[400px] ${card.pt} ${card.h}`}
            >
              {/* Background Number */}
              <div className="absolute right-[16px] top-[21px] font-montserrat text-5xl font-extrabold leading-[48px] text-gray-200">
                {card.id}
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="font-inter text-xl font-bold leading-8 text-gray-900">
                  {card.title}
                </h3>
                <p className={`font-inter text-base font-normal leading-7 text-gray-600 ${card.mt}`}>
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
