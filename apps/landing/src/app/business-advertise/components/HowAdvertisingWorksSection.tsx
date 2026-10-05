"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  FileCheck,
  Rocket,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import { C } from "./theme";

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Create",
    description: "Objective, audience, creative and budget",
    icon: Sparkles,
  },
  {
    step: "2",
    title: "Verify",
    description: "Confirm your identity, if needed",
    icon: ShieldCheck,
  },
  {
    step: "3",
    title: "Review",
    description: "Checked against the Standards",
    icon: FileCheck,
  },
  {
    step: "4",
    title: "Launch",
    description: "Goes live on your schedule",
    icon: Rocket,
  },
  {
    step: "5",
    title: "Measure",
    description: "Delivery and results",
    icon: BarChart2,
  },
  {
    step: "6",
    title: "Improve",
    description: "Edit and relaunch. Changes are re-reviewed",
    icon: RefreshCw,
  },
];

export default function HowAdvertisingWorksSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            How advertising works
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Six steps from idea to results.
          </p>
        </div>

        {/* 6 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {PROCESS_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-[20px] bg-white border border-[#DCE5E8] p-5 flex flex-col justify-between hover:border-[#066879]/50 transition-colors shadow-2xs"
              >
                <div>
                  {/* Step Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#066879] to-[#045363] text-white flex items-center justify-center font-jakarta font-bold text-[13px] shadow-xs">
                      {item.step}
                    </div>
                    <Icon className="w-4.5 h-4.5 text-[#066879]/70" />
                  </div>
                  <h3 className="font-jakarta font-bold text-[16px] text-[#073B47] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="font-jakarta text-[13px] leading-relaxed text-[#5E7076]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Campaign Review Notice Banner */}
        <div className="rounded-[20px] bg-white border border-[#DCE5E8] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EEF8F9] flex items-center justify-center text-[#066879] shrink-0 mt-0.5 sm:mt-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <p className="font-jakarta text-[14px] sm:text-[14.5px] leading-relaxed text-[#102A32]">
              <strong className="font-bold">Every campaign is reviewed.</strong> Decisions are Approved,
              Restricted, Changes required, More information needed, or Not approved, each with a reason.
            </p>
          </div>
          <Link
            href="/advertising-standards"
            className="inline-flex items-center justify-center px-4 py-2 rounded-[12px] bg-white border border-[#DCE5E8] text-[#102A32] font-jakarta font-semibold text-[14px] hover:bg-[#F7F9FA] transition-all shrink-0"
          >
            Campaign Review
          </Link>
        </div>
      </div>
    </section>
  );
}
