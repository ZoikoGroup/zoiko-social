import React from "react";
import Image from "next/image";

interface PartnerCard {
  title: string;
  description: string;
  icon: string;
}

const partnerCards: PartnerCard[] = [
  {
    title: "Rescue & Shelters",
    description:
      "Animal rescue organizations, shelters, and sanctuaries building community and adoption networks.",
    icon: "/partnerships/2.png",
  },
  {
    title: "Welfare & Research",
    description:
      "Animal welfare organizations, research institutions, and conservation groups focused on impact.",
    icon: "/partnerships/3.png",
  },
  {
    title: "Corporate Partners",
    description:
      "Companies seeking to engage customers around animal welfare and responsible innovation.",
    icon: "/partnerships/4.png",
  },
  {
    title: "Tech & Content",
    description:
      "Technology platforms, media partners, and content creators amplifying animal-focused stories.",
    icon: "/partnerships/5.png",
  },
];

export default function WhoWePartnerWith() {
  return (
    <div className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading & Subtitle */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Who we partner with
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base leading-relaxed">
            We work with organizations across animal welfare, rescue, research,
            technology, and corporate sectors—unified by shared commitment to
            animals and community.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerCards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#DCE5E8] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4 text-center">
                {/* Icon Image - Centered with mx-auto */}
                <div className="w-12 h-12 relative overflow-hidden mx-auto">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    className="object-contain p-2.5"
                  />
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h2 className="text-base md:text-lg font-bold text-[#066879]">
                    {item.title}
                  </h2>
                  <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
