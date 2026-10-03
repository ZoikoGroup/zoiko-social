"use client";

import React from "react";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { C } from "./theme";

export default function SavedSection() {
  return (
    <section id="saved" className="w-full bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="max-w-[1180px] mx-auto">
          {/* Section Header - Left Aligned to match design */}
          <div className="mb-6 sm:mb-8 lg:mb-10 text-left">
            <h2
              className="font-jakarta font-extrabold text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.15] tracking-[-0.015em] mb-2.5"
              style={{ color: C.tarawera }}
            >
              Keep the ones you like
            </h2>
            <p
              className="font-jakarta font-normal text-[15px] sm:text-[17.5px] leading-[1.6]"
              style={{ color: C.nevada }}
            >
              Save professionals to come back to them later.
            </p>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-center">
            {/* Left Column: Visual Image with Floating Pill */}
            <div className="relative h-[260px] sm:h-[320px] lg:h-[360px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-xs border border-[#E2ECEB]">
              <Image
                src="/professional-directory/saved-section-dog.png"
                alt="Saved professionals illustration"
                fill
                className="object-cover"
              />

              {/* Floating Badge at Bottom Left */}
              <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 bg-white/95 backdrop-blur-sm rounded-[12px] sm:rounded-[14px] py-2 sm:py-2.5 px-3.5 sm:px-4 flex items-center gap-2 sm:gap-2.5 shadow-sm border border-[#E2ECEB]">
                <Bookmark className="w-4 h-4 text-[#064E4E] stroke-[2.2]" />
                <span className="font-jakarta font-bold text-[13.5px] text-[#0A3E3F] leading-tight">
                  Saved to your account
                </span>
              </div>
            </div>

            {/* Right Column: Saved Card */}
            <div
              className="bg-white border rounded-[28px] p-7 sm:p-9 lg:p-10 shadow-xs h-full flex flex-col justify-center"
              style={{ borderColor: "#E2ECEB" }}
            >
              <div className="flex items-center gap-2.5 mb-6">
                <Bookmark className="w-5 h-5 text-[#0A3E3F] stroke-[2.2]" />
                <h3
                  className="font-jakarta font-bold text-[20px] leading-tight"
                  style={{ color: C.tarawera }}
                >
                  Your saved professionals
                </h3>
              </div>

              {/* Empty State Box */}
              <div
                className="bg-white border rounded-[18px] p-5 sm:p-6 flex items-center gap-4 mb-5 shadow-2xs"
                style={{ borderColor: "#E2ECEB" }}
              >
                <div className="w-12 h-12 rounded-[14px] bg-[#EAF5F4] flex items-center justify-center shrink-0">
                  <Bookmark className="w-5 h-5 text-[#0A7B7E] stroke-[2.2]" />
                </div>

                <div>
                  <h4
                    className="font-jakarta font-bold text-[16px] leading-tight mb-1"
                    style={{ color: C.tarawera }}
                  >
                    Nothing saved yet
                  </h4>
                  <p
                    className="font-jakarta text-[13.5px] leading-relaxed"
                    style={{ color: C.nevada }}
                  >
                    Use the bookmark on any profile to save it here.
                  </p>
                </div>
              </div>

              {/* Privacy Disclaimer (Plain text without lock icon) */}
              <p
                className="font-jakarta text-[13px] leading-normal"
                style={{ color: C.nevada }}
              >
                Saved lists are private. Professionals aren&apos;t told when you save them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
