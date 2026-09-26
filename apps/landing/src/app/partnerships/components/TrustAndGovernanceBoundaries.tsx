import React from "react";
import { Shield, CheckCircle2, FileText } from "lucide-react";

interface BoundaryCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const boundaryCards: BoundaryCard[] = [
  {
    title: "User Privacy",
    description:
      "Partner access to user data is strictly limited, contractually bound, and auditable. We do not sell user data.",
    icon: <Shield className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Community Standards",
    description:
      "All partners agree to enforce community standards. Welfare-first focus; no exploitation or misinformation allowed.",
    icon: <CheckCircle2 className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Compliance",
    description:
      "Partners must comply with applicable laws (GDPR, CCPA, COPPA, etc.) and animal welfare industry standards.",
    icon: <FileText className="w-5 h-5 text-[#066879]" />,
  },
];

export default function TrustAndGovernanceBoundaries() {
  return (
    <div className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Trust and governance boundaries
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base leading-relaxed">
            Clear principles that protect users, partners, and the animal
            welfare community.
          </p>
        </div>

        {/* 3 Cards Grid with light blue/teal tinted background containers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {boundaryCards.map((item, index) => (
            <div
              key={index}
              className="bg-[#F0F7F8]/50 rounded-3xl p-8 shadow-sm border border-[#066879]/30 flex flex-col justify-between space-y-6"
            >
              <div className="">
                {/* Icon Container */}
                <div className="w-10 h-10">
                  {item.icon}
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
