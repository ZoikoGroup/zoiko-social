import React from "react";
import Image from "next/image";

interface PartnershipPath {
  title: string;
  description: string;
  icon: string;
}

const partnershipPaths: PartnershipPath[] = [
  {
    title: "Integration & Access",
    description:
      "Get API access, organization verification, professional profiles, and integration into rescue and adoption networks. Best for: Tech platforms, data integrations, multi-org tools.",
    icon: "/partnerships/7.png",
  },
  {
    title: "Content & Visibility",
    description:
      "Amplify animal welfare stories, brand awareness, and community engagement through Zoiko Social's platform. Best for: Media partners, nonprofits, advocacy orgs.",
    icon: "/partnerships/8.png",
  },
  {
    title: "Strategic Alliance",
    description:
      "Co-develop features, expand into new markets, or align on governance and standards. Best for: Industry leaders, ecosystem partners, welfare-focused companies.",
    icon: "/partnerships/9.png",
  },
];

export default function RecommendedPartnershipPaths() {
  return (
    <div className="w-full bg-white py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading & Subtitle */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Recommended partnership paths
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base leading-relaxed">
            Choose the path that aligns with your organization&apos;s goals and
            capabilities.
          </p>
        </div>

        {/* Hero Image Card */}
        <div className="w-full h-[300px] md:h-[380px] relative rounded-3xl overflow-hidden">
          <Image
            src="/partnerships/6.png"
            alt="People working together on partnership strategy"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnershipPaths.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#DCE5E8] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Icon Image */}
                <div className="w-12 h-12 relative overflow-hidden">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h2 className="text-base md:text-lg font-bold text-[#D97706]">
                    {item.title}
                  </h2>
                  <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Learn More Link */}
              <div className="pt-2">
                <a
                  href="#"
                  className="inline-flex items-center text-xs md:text-sm font-semibold text-[#066879] hover:underline"
                >
                  Learn more &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
