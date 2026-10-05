"use client";

import React from "react";
import Image from "next/image";
import {
  List,
  Pencil,
  Columns2,
  Send,
  Search,
  X,
  Check,
  ArrowRight,
} from "lucide-react";

export default function FixAndResubmitSection() {
  const steps = [
    { title: "Open issues", subtitle: "See each problem", icon: List },
    { title: "Edit fields", subtitle: "Jump straight to them", icon: Pencil },
    { title: "Compare", subtitle: "Review what changed", icon: Columns2 },
    { title: "Resubmit", subtitle: "As a new version", icon: Send },
    {
      title: "Re-review",
      subtitle: "Changed parts checked",
      icon: Search,
      isHighlighted: true,
    },
  ];

  return (
    <section id="fix-and-resubmit" className="w-full bg-white py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em] mb-2.5">
            Fix and resubmit
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16.5px] leading-relaxed text-[#5E7076]">
            Each fix creates a new version, so you can see exactly what changed.
          </p>
        </div>

        {/* Big Card with Step Flow & Version Comparison */}
        <div className="rounded-[28px] bg-white border border-[#DCE5E8] p-6 sm:p-8 lg:p-10 shadow-xs">
          {/* Top 5-Step Stepper with Dashed Connector Lines */}
          <div className="flex md:items-start justify-between relative mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-[#DCE5E8] overflow-x-auto scrollbar-none gap-6 md:gap-0 -mx-2 px-2 sm:mx-0 sm:px-0">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-start z-10 shrink-0 min-w-[125px] md:min-w-0">
                    <div
                      className={`w-11 h-11 rounded-[12px] flex items-center justify-center mb-2.5 ${
                        s.isHighlighted
                          ? "bg-[#066879] text-white"
                          : "bg-[#EEF8F9] text-[#066879]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-jakarta font-bold text-[15px] text-[#073B47]">
                      {s.title}
                    </h4>
                    <p className="font-jakarta text-[12.5px] text-[#5E7076]">
                      {s.subtitle}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 hidden md:block mx-4 mt-[22px] border-t-2 border-dashed border-[#DCE5E8]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Visual Diff Comparison side-by-side */}
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Left Card: Version 1 (Issues) */}
            <div className="w-full flex-1 rounded-[20px] bg-white border border-[#DCE5E8] overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#DCE5E8] flex items-center justify-between">
                <span className="font-jakarta font-bold text-[13.5px] text-[#102A32]">
                  Riverbend Animal Rescue
                </span>
                <span className="font-jakarta font-semibold text-[11px] text-[#5B6B79] px-2.5 py-0.5 rounded-full border border-[#DCE5E8]">
                  Sponsored
                </span>
              </div>

              {/* Middle Image */}
              <div className="relative w-full h-[150px] sm:h-[160px] bg-[#E5EBEB]">
                <Image
                  src="/campaign-review/fix-resubmit-preview.png"
                  alt="Creative Preview"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Text Area */}
              <div className="p-4 bg-white">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#5B6B79] mb-1.5">
                  <X className="w-3.5 h-3.5 text-[#5B6B79]" />
                  <span>Version 1 · Sep 28</span>
                </div>
                <p className="font-jakarta text-[13px] text-[#102A32] leading-relaxed">
                  Adopt this week and get a guaranteed healthy pet, 100% vet certified .
                </p>
              </div>
            </div>

            {/* Center Arrow Indicator */}
            <div className="w-10 h-10 rounded-full bg-[#066879] text-white flex items-center justify-center shrink-0 shadow-xs my-2 lg:my-0 rotate-90 lg:rotate-0">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Right Card: Version 2 (Corrected Draft) */}
            <div className="w-full flex-1 rounded-[20px] bg-white border border-[#DCE5E8] overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#DCE5E8] flex items-center justify-between">
                <span className="font-jakarta font-bold text-[13.5px] text-[#102A32]">
                  Riverbend Animal Rescue
                </span>
                <span className="font-jakarta font-semibold text-[11px] text-[#5B6B79] px-2.5 py-0.5 rounded-full border border-[#DCE5E8]">
                  Sponsored
                </span>
              </div>

              {/* Middle Image */}
              <div className="relative w-full h-[150px] sm:h-[160px] bg-[#E5EBEB]">
                <Image
                  src="/campaign-review/fix-resubmit-preview.png"
                  alt="Creative Preview"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Text Area */}
              <div className="p-4 bg-white">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#5B6B79] mb-1.5">
                  <Check className="w-3.5 h-3.5 text-[#066879]" />
                  <span>Version 2 · draft</span>
                </div>
                <p className="font-jakarta text-[13px] text-[#102A32] leading-relaxed">
                  Adopt this week. Every pet has{" "}
                  <span className="font-bold text-[#102A32] bg-[#EEF8F9] px-1 py-0.5 rounded">
                    a vet health check before adoption
                  </span>{" "}
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
