"use client";

import React from "react";
import Image from "next/image";
import {
  Send,
  CheckCircle,
  Search,
  Stethoscope,
  ClipboardList,
  Wrench,
  RotateCcw,
  ShieldAlert,
  Clock,
} from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Submit",
    description:
      "Creative, audience, destination, schedule and any evidence.",
    icon: Send,
  },
  {
    number: "02",
    title: "Validate",
    description:
      "Completeness, advertiser status and destination checks.",
    icon: CheckCircle,
  },
  {
    number: "03",
    title: "Review",
    description: "Automated and human policy review.",
    icon: Search,
  },
  {
    number: "04",
    title: "Specialist review",
    description:
      "Welfare, child safety, privacy, legal or claims, when needed.",
    icon: Stethoscope,
  },
  {
    number: "05",
    title: "Decision",
    description:
      "Approved, Restricted, Changes required, More information needed, or Not approved.",
    icon: ClipboardList,
  },
  {
    number: "06",
    title: "Fix",
    description: "Make changes, add evidence or accept restrictions.",
    icon: Wrench,
  },
  {
    number: "07",
    title: "Resubmit or reconsider",
    description: "Send a new version, or ask for a second review.",
    icon: RotateCcw,
  },
  {
    number: "08",
    title: "Ongoing checks",
    description:
      "Changes, reports or safety signals can trigger re-review.",
    icon: ShieldAlert,
  },
];

export default function HowReviewWorksSection() {
  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em] mb-2.5">
            How review works
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16.5px] leading-relaxed text-[#5E7076]">
            From submission to launch, and after.
          </p>
        </div>

        {/* 2-Column Grid: Left steps, Right image & duration card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-10 items-start">
          {/* Left: 8-Step Grid (2 cols x 4 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="rounded-[18px] bg-[#F7F9FA] border border-[#DCE5E8] p-4 sm:p-4.5 flex flex-col justify-start hover:border-[#066879] transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-[10px] bg-white border border-[#DCE5E8] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#066879]" />
                    </div>
                    <h3 className="font-jakarta font-bold text-[15px] text-[#073B47] leading-snug">
                      {step.title}
                    </h3>
                  </div>
                  <p className="font-jakarta text-[12.5px] sm:text-[13px] leading-[1.45] text-[#5E7076]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Illustration & Time Notice */}
          <div className="flex flex-col gap-3.5 w-full">
            {/* Photo frame */}
            <div className="relative w-full h-[240px] sm:h-[260px] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#EEF8F9] border border-[#DCE5E8]">
              <Image
                src="/campaign-review/how-review-works.png"
                alt="Two companion dogs in community care"
                fill
                className="object-cover"
              />
            </div>

            {/* Time Card */}
            <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 sm:p-4.5 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-4 h-4 text-[#066879] shrink-0" />
                <h4 className="font-jakarta font-bold text-[14px] sm:text-[14.5px] text-[#073B47]">
                  How long does it take?
                </h4>
              </div>
              <p className="font-jakarta text-[12.5px] sm:text-[13px] leading-relaxed text-[#5E7076]">
                Review time varies with the campaign and any specialist checks.
                Your dashboard always shows the current status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
