"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ShieldAlert, ArrowRight } from "lucide-react";
import { C } from "./theme";

export default function TrustSafetyNoticeSection() {
  return (
    <section className="w-full bg-[#F8FAFB] py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Teal Gradient Banner */}
        <div
          className="relative max-w-[1230px] mx-auto rounded-[24px] sm:rounded-[28px] p-6 sm:p-10 lg:p-14 text-center text-white overflow-hidden shadow-lg"
          style={{
            background: "linear-gradient(164deg, #066879 0%, #045363 100%)",
          }}
        >
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/12 border border-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-xs">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          {/* Heading */}
          <h2 className="font-jakarta font-extrabold text-[24px] sm:text-[32px] lg:text-[36px] leading-[1.15] text-white tracking-[-0.01em] mb-3">
            See a misleading or unsafe{" "}
            <br className="hidden sm:inline" /> profile?
          </h2>

          {/* Subtitle */}
          <p
            className="font-jakarta font-normal text-[14px] sm:text-[16px] leading-[1.6] max-w-[620px] mx-auto mb-6 sm:mb-8"
            style={{ color: C.botticelli }}
          >
            Report it to the Trust & Safety team. For an animal emergency,{" "}
            <br className="hidden sm:inline" /> contact a local emergency vet straight away.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 max-w-[420px] sm:max-w-none mx-auto">
            <Link
              href="/report-a-concern"
              className="font-jakarta font-semibold text-[14.5px] sm:text-[15px] text-white bg-white/12 hover:bg-white/20 border border-white/25 px-5 sm:px-6 py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Report a concern</span>
            </Link>

            <Link
              href="/community-standards"
              className="font-jakarta font-semibold text-[14.5px] sm:text-[15px] text-white bg-white/12 hover:bg-white/20 border border-white/25 px-5 sm:px-6 py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Safety Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

