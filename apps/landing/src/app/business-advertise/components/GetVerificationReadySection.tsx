"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, Upload, Award, Megaphone } from "lucide-react";
import { C } from "./theme";

const STEPS = [
  {
    icon: SlidersHorizontal,
    title: "Choose your path",
    description: "Professional or organization",
  },
  {
    icon: Upload,
    title: "Add evidence",
    description: "License, registration or authority",
  },
  {
    icon: Award,
    title: "Get verified",
    description: "Free, and separate from advertising",
  },
  {
    icon: Megaphone,
    title: "Come back to advertise",
    description: "Your draft campaign is saved",
  },
];

export default function GetVerificationReadySection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px] border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Get verification ready
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Verified advertisers can launch. Here&apos;s how to get there.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-7 lg:gap-8 items-center">
          {/* Left Column: Dog Photo */}
          <div className="relative w-full h-[360px] sm:h-[415px] rounded-[28px] overflow-hidden shadow-xs">
            <Image
              src="/business-advertise/verification-dog.png"
              alt="Get verification ready"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Right Column: 4 Step Cards */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              {STEPS.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.title}
                    className="flex items-center justify-between gap-3.5 p-3.5 sm:px-4 sm:py-3.5 rounded-[20px] bg-white border border-[#DCE5E8] shadow-2xs transition-all hover:border-[#066879]/30"
                  >
                    {/* Left Icon */}
                    <div className="w-11 h-11 rounded-[12px] bg-[#EEF8F9] flex items-center justify-center shrink-0">
                      <IconComponent className="w-[22px] h-[22px] text-[#066879]" />
                    </div>

                    {/* Middle Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-jakarta font-bold text-[15.5px] sm:text-[16px] text-[#073B47] leading-snug">
                        {step.title}
                      </h3>
                      <p className="font-jakarta text-[13px] sm:text-[13.5px] text-[#5E7076] mt-0.5 leading-tight">
                        {step.description}
                      </p>
                    </div>

                    {/* Right Circular Indicator */}
                    <div className="w-[26px] h-[26px] rounded-full bg-[#EEF8F9] shrink-0" />
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-1">
              <Link
                href="/buisness-verification"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#066879] hover:bg-[#055765] text-white font-jakarta font-semibold text-[15px] transition-colors shadow-2xs w-fit"
              >
                <Award className="w-4 h-4 text-white shrink-0" />
                <span>Start verification</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
