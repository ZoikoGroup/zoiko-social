"use client";

import React from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { C } from "./theme";

const VERIFICATION_MEANS = [
  "The professional passed Zoiko Social checks for their category",
  "Their identity and professional status were confirmed",
  "The badge comes straight from our verification system",
  "Status is rechecked when key details change, and every 12 months",
];

const VERIFICATION_DOESNT_MEAN = [
  "A guarantee of service quality, advice or outcomes",
  "A recommendation or endorsement by Zoiko Social",
  "A higher place in results, or a paid promotion",
  "Access to their private documents or license files",
];

export default function VerificationExplainerSection() {
  return (
    <section id="verification" className="w-full bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="max-w-[1180px] mx-auto">
          {/* Section Header - Left Aligned to match design */}
          <div className="mb-6 sm:mb-8 lg:mb-10 text-left">
            <h2
              className="font-jakarta font-extrabold text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.15] tracking-[-0.015em] mb-2.5"
              style={{ color: C.tarawera }}
            >
              What “Verified professional” means
            </h2>
            <p
              className="font-jakarta font-normal text-[15px] sm:text-[17.5px] leading-[1.6]"
              style={{ color: C.nevada }}
            >
              The badge confirms identity and category checks. It isn&apos;t a rating.
            </p>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: Verification Means */}
            <div
              className="bg-white border rounded-[30px] p-7 sm:p-9 lg:p-10 shadow-xs transition-all duration-300"
              style={{ borderColor: "#E2ECEB" }}
            >
              <div className="flex items-center gap-3.5 mb-7">
                <div className="w-11 h-11 rounded-[14px] bg-[#EAF5F4] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#064E4E] stroke-[2.2]" />
                </div>
                <h3
                  className="font-jakarta font-bold text-[20px] leading-tight"
                  style={{ color: C.tarawera }}
                >
                  Verification means
                </h3>
              </div>

              <ul className="space-y-4 sm:space-y-4.5">
                {VERIFICATION_MEANS.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-[#0A7B7E] stroke-[2] shrink-0 mt-0.5" />
                    <span
                      className="font-jakarta text-[15px] sm:text-[15.5px] leading-[1.5]"
                      style={{ color: C.firefly }}
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2: Verification Doesn't Mean */}
            <div
              className="bg-white border border-dashed rounded-[30px] p-7 sm:p-9 lg:p-10 transition-all duration-300"
              style={{ borderColor: "#CFDCDC" }}
            >
              <div className="flex items-center gap-3.5 mb-7">
                <div className="w-11 h-11 rounded-[14px] bg-[#F1F5F5] flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-[#5A7175] stroke-[2.2]" />
                </div>
                <h3
                  className="font-jakarta font-bold text-[20px] leading-tight"
                  style={{ color: C.tarawera }}
                >
                  Verification doesn&apos;t mean
                </h3>
              </div>

              <ul className="space-y-4 sm:space-y-4.5">
                {VERIFICATION_DOESNT_MEAN.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-[#7A8E92] stroke-[2.2]" />
                    </div>
                    <span
                      className="font-jakarta text-[15px] sm:text-[15.5px] leading-[1.5]"
                      style={{ color: C.firefly }}
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
