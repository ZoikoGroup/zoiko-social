"use client";

import React from "react";
import { User, Fingerprint, File, CheckCircle2, RefreshCw } from "lucide-react";
import { VERIFICATION_STEPS } from "./directoryData";
import { C } from "./theme";

const STEP_ICONS = [User, Fingerprint, File, CheckCircle2, RefreshCw];

export default function HowVerificationWorksSection() {
  return (
    <section id="how-we-verify" className="w-full bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="max-w-[1180px] mx-auto">
          {/* Section Header - Left Aligned to match design */}
          <div className="mb-6 sm:mb-8 lg:mb-10 text-left">
            <h2
              className="font-jakarta font-extrabold text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.15] tracking-[-0.015em] mb-2.5"
              style={{ color: C.tarawera }}
            >
              How verification works
            </h2>
            <p
              className="font-jakarta font-normal text-[15px] sm:text-[17.5px] leading-[1.6]"
              style={{ color: C.nevada }}
            >
              Five checks before a professional appears here.
            </p>
          </div>

          {/* 5-Step Process Container */}
          <div
            className="bg-white border rounded-[24px] sm:rounded-[30px] p-6 sm:p-10 lg:px-12 lg:py-14 shadow-xs relative"
            style={{ borderColor: "#E2ECEB" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-4 relative">
              {/* Dashed Connector Line for Desktop */}
              <div
                className="hidden lg:block absolute top-6 left-[10%] right-[10%] border-t-[1.5px] border-dashed pointer-events-none z-0"
                style={{ borderColor: "#D5E3E4" }}
              />

              {VERIFICATION_STEPS.map((step, idx) => {
                const Icon = STEP_ICONS[idx];
                const isLast = idx === VERIFICATION_STEPS.length - 1;
                return (
                  <div
                    key={step.step}
                    className="flex flex-col items-center text-center relative z-10 group"
                  >
                    {/* Icon Box */}
                    <div
                      className={`w-12 h-12 rounded-[14px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105 ${
                        isLast
                          ? "bg-[#064E4E] text-white shadow-xs"
                          : "bg-[#EAF5F4] text-[#064E4E]"
                      }`}
                    >
                      <Icon
                        className={`w-[21px] h-[21px] ${
                          isLast ? "text-white" : "text-[#064E4E]"
                        } stroke-[2.2]`}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className="font-jakarta font-bold text-[17px] leading-tight mb-1.5"
                      style={{ color: C.tarawera }}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="font-jakarta font-normal text-[13px] sm:text-[13.5px] leading-snug max-w-[170px]"
                      style={{ color: C.nevada }}
                    >
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
