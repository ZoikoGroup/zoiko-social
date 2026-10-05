"use client";

import React from "react";
import Image from "next/image";
import { Ban, AlertOctagon } from "lucide-react";
import { C } from "./theme";

const NEVER_BUYS = [
  "Verification",
  "News placement",
  "Moderation decisions",
  "Adoption ranking",
  "Safety status",
  "Directory ranking",
];

const NEVER_ALLOWED = [
  "Live animal sales",
  "Cruelty or fighting",
  "Wildlife trade",
  "Fake urgency",
];

export default function TrustWelfareSafetySection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Trust, welfare and brand safety
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Some things no ad can do, whatever the budget.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 sm:gap-8 items-center">
          {/* Left Column: Prohibitions & Protections */}
          <div className="rounded-[28px] bg-white border border-[#DCE5E8] p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            {/* Advertising never buys */}
            <div>
              <h3 className="font-jakarta font-bold text-[18px] sm:text-[19px] text-[#073B47] mb-3.5">
                Advertising never buys
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {NEVER_BUYS.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#066879] text-[#073B47] font-jakarta font-bold text-[13.5px] shadow-2xs"
                  >
                    <Ban className="w-3.5 h-3.5 text-[#066879]" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Never allowed in ads */}
            <div className="pt-2 border-t border-[#DCE5E8]/60">
              <h3 className="font-jakarta font-bold text-[18px] sm:text-[19px] text-[#073B47] mb-3.5">
                Never allowed in ads
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {NEVER_ALLOWED.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#E88924] text-[#073B47] font-jakarta font-bold text-[13.5px] shadow-2xs"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-[#E88924]" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dog Photo in Gradient Frame */}
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-[28px] overflow-hidden p-1 bg-gradient-to-br from-[#066879] to-[#E88924] shadow-sm">
            <div className="relative w-full h-full rounded-[26px] overflow-hidden">
              <Image
                src="/business-advertise/trust-dog.png"
                alt="Animal welfare and brand safety"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
