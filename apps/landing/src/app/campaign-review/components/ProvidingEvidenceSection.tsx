"use client";

import React from "react";
import {
  Award,
  FileText,
  ImageIcon,
  Briefcase,
  Link2,
  Ban,
} from "lucide-react";

interface EvidenceItem {
  title: string;
  description: string;
  icon: React.ElementType;
  isNegative?: boolean;
}

const ITEMS: EvidenceItem[] = [
  {
    title: "Credentials and licenses",
    description: "Veterinary or professional proof, where required.",
    icon: Award,
  },
  {
    title: "Claim evidence",
    description: "Studies, official documents or offer terms.",
    icon: FileText,
  },
  {
    title: "Rights and permissions",
    description: "Permission for images, logos or testimonials.",
    icon: ImageIcon,
  },
  {
    title: "Agency authorization",
    description: "Proof you can act for the client.",
    icon: Briefcase,
  },
  {
    title: "Destination ownership",
    description: "Show you control the landing page.",
    icon: Link2,
  },
  {
    title: "We never ask for",
    description:
      "Passwords, private member data, private messages or unrelated medical records.",
    icon: Ban,
    isNegative: true,
  },
];

export default function ProvidingEvidenceSection() {
  return (
    <section id="providing-evidence" className="w-full bg-white py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-8 sm:mb-10">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em] mb-2.5">
            Providing evidence
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16.5px] leading-relaxed text-[#5E7076]">
            What we may ask for, and what we never will.
          </p>
        </div>

        {/* 6-Card Grid (3 cols x 2 rows) matching Figma layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;
            if (item.isNegative) {
              return (
                <div
                  key={index}
                  className="rounded-[20px] bg-[#F7F9FA] border border-dashed border-[#DCE5E8] p-4 sm:p-4.5 flex flex-row items-center gap-3.5 transition-all"
                >
                  <div className="w-11 h-11 rounded-[12px] bg-white border border-[#DCE5E8] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#5B6B79]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-jakarta font-bold text-[16px] text-[#073B47] mb-0.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="font-jakarta text-[13px] leading-[1.45] text-[#5B6B79]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="rounded-[20px] bg-white border border-[#DCE5E8] p-4 sm:p-4.5 flex flex-row items-center gap-3.5 hover:border-[#B2CAD0] transition-all"
              >
                <div className="w-11 h-11 rounded-[12px] bg-[#EEF8F9] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#066879]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-jakarta font-bold text-[16px] text-[#073B47] mb-0.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-jakarta text-[13px] leading-[1.45] text-[#5B6B79]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
