import React from "react";
import Image from "next/image";

interface Strategy {
  title: string;
  description: string;
  icon: string;
}

const strategies: Strategy[] = [
  {
    title: "Use in-network providers",
    description:
      "In-network therapists cost less (lower copay) and are definitely covered. Always check before scheduling.",
    icon: "/market/10.png",
  },
  {
    title: "Meet your deductible",
    description:
      "Early in the year, your visits go toward your deductible. Plan strategically if you need regular care.",
    icon: "/market/11.png",
  },
  {
    title: "Ask about your benefits",
    description:
      'Call your insurance company. Ask specifically: "What mental health services are covered?" Get answers in writing.',
    icon: "/market/12.png",
  },
  {
    title: "Review annual coverage",
    description:
      "Revisit your plan each year. Coverage limits reset. Some plans offer preventive mental health visits free.",
    icon: "/market/13.png",
  },
  {
    title: "Check telehealth coverage",
    description:
      "Many plans now cover online therapy. If in-person isn't accessible, telehealth may be fully covered or low-cost.",
    icon: "/market/14.png",
  },
  {
    title: "Use your EAP if available",
    description:
      "Many employers offer Employee Assistance Programs (EAP): free, confidential counseling sessions (often 3–5 free visits).",
    icon: "/market/15.png",
  },
];

export default function MakingTheMostOfYourInsurance() {
  return (
    <div className="w-full min-h-screen bg-white py-12 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Making the most of your insurance
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            Once you have coverage, these strategies help you get maximum value
            from your mental health benefits.
          </p>
        </div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {strategies.map((item, index) => (
            <div
              key={index}
              className="relative p-6 border-l-4 border-[#066879] rounded-2xl flex flex-col justify-center space-y-3"
            >
              {/* Header with Icon and Title */}
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex-shrink-0 relative">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-base font-bold text-[#1a2d37]">
                  {item.title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
