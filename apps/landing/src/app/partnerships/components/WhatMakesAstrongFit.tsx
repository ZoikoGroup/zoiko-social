import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

interface FitItem {
  title: string;
  description: string;
}

const fitItems: FitItem[] = [
  {
    title: "Aligned on animal welfare",
    description: "Mission-driven, not just commercial",
  },
  {
    title: "Commitment to transparency",
    description: "Open communication, honest partnership terms",
  },
  {
    title: "Data responsibility",
    description: "Respect for user privacy and organization data",
  },
  {
    title: "Quality & compliance",
    description: "Meet industry standards, regulatory requirements",
  },
  {
    title: "Long-term vision",
    description: "Looking for sustained partnership, not one-off deals",
  },
  {
    title: "Community respect",
    description: "Understanding animal welfare community norms and values",
  },
];

export default function WhatMakesAstrongFit() {
  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-16 px-4 md:px-12 font-sans flex items-center justify-center">
      <div className="max-w-7xl w-full space-y-12">
        {/* Section Heading */}
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a2d37] tracking-tight">
            What makes a strong fit
          </h1>
        </div>

        {/* Main Content Grid: Left List, Right Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Criteria List */}
          <div className="lg:col-span-6">
            {fitItems.map((item, index) => (
              <div
                key={index}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-[#066879] flex-shrink-0">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-[#1a2d37]">
                    {item.title}
                  </span>
                </div>

                <span className="text-xs md:text-sm text-[#5a6e75] pl-8 sm:pl-0">
                  — {item.description}
                </span>
              </div>
            ))}
          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full h-[320px] md:h-[480px] rounded-3xl overflow-hidden">
              <Image
                src="/partnerships/10.png"
                alt="People shaking hands in a strong partnership meeting"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
