"use client";

import React from "react";
import {
  BookOpen,
  HelpCircle,
  Wrench,
  Scale,
  FileCheck2,
  CheckCircle,
  EyeOff,
  HeartPulse,
} from "lucide-react";

interface Principle {
  title: string;
  description: string;
  icon: React.ElementType;
}

const PRINCIPLES: Principle[] = [
  {
    title: "Policy-based",
    description:
      "Every decision links to a specific Advertising Standards rule and version.",
    icon: BookOpen,
  },
  {
    title: "Explainable",
    description:
      "You get a clear reason whenever it's safe to share one.",
    icon: HelpCircle,
  },
  {
    title: "Actionable",
    description:
      "Fixable issues say exactly what to change, and where.",
    icon: Wrench,
  },
  {
    title: "Proportionate",
    description:
      "Warnings, changes, restrictions and pauses match the risk.",
    icon: Scale,
  },
  {
    title: "Auditable",
    description:
      "Every version, decision and response is recorded.",
    icon: FileCheck2,
  },
  {
    title: "Consistent",
    description:
      "The same status words everywhere: Ads Manager, email and support.",
    icon: CheckCircle,
  },
  {
    title: "Privacy-safe",
    description:
      "No internal risk scores or unrelated data are ever shown.",
    icon: EyeOff,
  },
  {
    title: "Welfare-first",
    description:
      "Urgent risks to animals or people can pause a campaign right away.",
    icon: HeartPulse,
  },
];

export default function PrinciplesSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em] mb-2.5">
            How we review every campaign
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16.5px] leading-relaxed text-[#5E7076]">
            Eight principles that apply to every advertiser, whatever their size.
          </p>
        </div>

        {/* 8-Card Grid (4 cols x 2 rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {PRINCIPLES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-[20px] bg-white border border-[#DCE5E8] p-5 sm:p-5.5 flex flex-col justify-start hover:border-[#066879] hover:shadow-xs transition-all"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-[12px] bg-[#EEF8F9] flex items-center justify-center mb-3.5 shrink-0">
                  <Icon className="w-5 h-5 text-[#066879]" />
                </div>

                {/* Title */}
                <h3 className="font-jakarta font-bold text-[16px] text-[#073B47] mb-1.5 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-jakarta text-[13px] leading-[1.5] text-[#5E7076]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
