"use client";

import React from "react";
import {
  Compass,
  Fingerprint,
  FileCheck,
  Users,
  MessageSquareReply,
  Scale,
  ShieldCheck,
  Info,
} from "lucide-react";
import { C } from "./theme";

interface ProcessStep {
  num: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  isFinal?: boolean;
}

const STEPS: ProcessStep[] = [
  {
    num: 1,
    title: "Choose path",
    subtitle: "Professional or organization",
    icon: Compass,
  },
  {
    num: 2,
    title: "Confirm identity",
    subtitle: "Quick, secure check",
    icon: Fingerprint,
  },
  {
    num: 3,
    title: "Add evidence",
    subtitle: "Licenses or registration",
    icon: FileCheck,
  },
  {
    num: 4,
    title: "Review",
    subtitle: "Checked by our team",
    icon: Users,
  },
  {
    num: 5,
    title: "Answer requests",
    subtitle: "If we need more",
    icon: MessageSquareReply,
  },
  {
    num: 6,
    title: "Decision",
    subtitle: "With clear reasons",
    icon: Scale,
  },
  {
    num: 7,
    title: "Badge live",
    subtitle: "Shown on your profile",
    icon: ShieldCheck,
    isFinal: true,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 text-left">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            How verification works
          </h2>
          <p
            className="font-jakarta text-[15px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            Seven steps from start to badge.
          </p>
        </div>

        {/* Mobile View: Vertical Timeline (< md) */}
        <div className="flex flex-col gap-3 md:hidden mb-8">
          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className="relative flex items-center gap-3.5 p-3.5 bg-white rounded-[20px] border shadow-sm"
                style={{ borderColor: C.geyser }}
              >
                {/* Step Icon */}
                <div
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 shadow-sm ${
                    step.isFinal
                      ? "bg-[#066879] text-white"
                      : "bg-[#EEF8F9] text-[#066879] border border-[#C5D8DE]"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.2} />
                </div>

                {/* Step Info */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-jakarta font-bold text-[11px] uppercase tracking-wider text-gray-400">
                      Step {step.num}
                    </span>
                    {step.isFinal && (
                      <span className="font-jakarta font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full">
                        Final
                      </span>
                    )}
                  </div>
                  <h4
                    className="font-jakarta font-bold text-[14.5px] leading-tight"
                    style={{ color: C.tarawera }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="font-jakarta text-[12.5px] leading-[1.4] text-gray-500 mt-0.5"
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop / Tablet View: Horizontal Timeline (>= md) */}
        <div className="hidden md:block w-full mb-10 overflow-x-auto pb-4">
          <div className="flex items-start justify-between min-w-[780px] lg:min-w-0 gap-2">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const hasNext = idx < STEPS.length - 1;

              return (
                <div key={step.num} className="flex-1 flex items-start">
                  {/* Step Node */}
                  <div className="flex flex-col items-center text-center w-full">
                    {/* Circle Icon */}
                    <div
                      className={`w-14 h-14 rounded-[18px] flex items-center justify-center mb-3.5 shadow-sm transition-all ${
                        step.isFinal
                          ? "bg-[#066879] text-white"
                          : "bg-white border border-[#DCE5E8] text-[#066879]"
                      }`}
                    >
                      <Icon className="w-6 h-6" strokeWidth={2.2} />
                    </div>

                    {/* Step Title */}
                    <h4
                      className="font-jakarta font-bold text-[14.5px] leading-tight mb-1"
                      style={{ color: C.tarawera }}
                    >
                      {step.title}
                    </h4>

                    {/* Step Subtitle */}
                    <p
                      className="font-jakarta text-[12px] sm:text-[12.5px] leading-[1.38] max-w-[130px]"
                      style={{ color: C.nevada }}
                    >
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Horizontal Line Connector */}
                  {hasNext && (
                    <div className="w-6 lg:w-10 h-0.5 bg-gray-200 mt-7 shrink-0 -mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Banner */}
        <div
          className="flex items-start gap-3.5 p-4 sm:p-5 bg-white rounded-[20px] border text-[13.5px] sm:text-[14.5px] leading-[1.5] shadow-sm"
          style={{ borderColor: C.geyser }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ color: C.mosque }}
          >
            <Info className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <p style={{ color: C.firefly }}>
            Free to apply. Review time depends on your category and region, and
            your workspace always shows the current status.
          </p>
        </div>
      </div>
    </section>
  );
}
