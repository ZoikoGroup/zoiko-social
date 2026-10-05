"use client";

import React from "react";
import Link from "next/link";
import { Megaphone, Scale } from "lucide-react";

export default function PlanNextCampaignCtaSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="rounded-[28px] overflow-hidden bg-gradient-to-br from-[#066879] to-[#045363] text-white p-8 sm:p-12 lg:p-14 text-center shadow-lg relative">
          <div className="mx-auto max-w-[640px] flex flex-col items-center">
            {/* Overlay Icon matching Figma #1471:1475 */}
            <div className="w-11 h-11 rounded-[12px] bg-white/12 flex items-center justify-center mb-4">
              <Megaphone className="w-5 h-5 text-white" />
            </div>

            {/* Heading */}
            <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-white tracking-[-0.02em] mb-2.5">
              Plan your next campaign
            </h2>

            {/* Subtitle */}
            <p className="font-jakarta text-[15px] sm:text-[16px] text-[#CFE6EA] leading-relaxed mb-7 max-w-[500px]">
              Check the Standards first, so review goes smoothly.
            </p>

            {/* CTAs matching Figma EL-bfcd5411 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
              <Link
                href="/advertising-standards"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] border border-white/45 bg-transparent hover:bg-white/10 text-white font-jakarta font-semibold text-[14px] transition-all"
              >
                <Scale className="w-4 h-4 text-white" />
                <span>Advertising Standards</span>
              </Link>
              <Link
                href="/business-advertise"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] border border-white/45 bg-transparent hover:bg-white/10 text-white font-jakarta font-semibold text-[14px] transition-all"
              >
                <Megaphone className="w-4 h-4 text-white" />
                <span>Advertise</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
