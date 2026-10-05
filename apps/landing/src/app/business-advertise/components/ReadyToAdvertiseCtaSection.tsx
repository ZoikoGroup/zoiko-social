"use client";

import React from "react";
import Link from "next/link";
import { Megaphone, LifeBuoy } from "lucide-react";

export default function ReadyToAdvertiseCtaSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-[105px]">
      <div className="mx-auto max-w-[1440px]">
        <div
          className="w-full rounded-[28px] px-6 py-12 sm:px-12 sm:py-14 lg:py-[52px] flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden"
          style={{
            background:
              "linear-gradient(164deg, rgba(6, 104, 121, 1) 0%, rgba(4, 83, 99, 1) 100%)",
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#E88924]/10 blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-11 h-11 rounded-[12px] bg-white/15 border border-white/20 flex items-center justify-center text-white mb-4 shadow-xs">
            <Megaphone className="w-5 h-5 text-white" />
          </div>

          {/* Heading */}
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] text-white tracking-[-0.01em] mb-2 leading-tight">
            Ready to reach animal lovers?
          </h2>

          {/* Subtitle */}
          <p className="font-jakarta text-[15px] sm:text-[16px] text-white/80 mb-6 max-w-[500px]">
            Build your first campaign in Ads Manager.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full sm:w-auto">
            <Link
              href="#start-advertising"
              id="start-advertising"
              className="inline-flex items-center justify-center gap-2 px-5 h-[44px] rounded-[12px] bg-white/10 hover:bg-white/15 text-white font-jakarta font-semibold text-[15px] transition-all border border-white/40 shadow-xs"
            >
              <Megaphone className="w-4 h-4 text-white shrink-0" />
              <span>Start advertising</span>
            </Link>

            <Link
              href="/support-developers-contact-us"
              id="contact-sales"
              className="inline-flex items-center justify-center gap-2 px-5 h-[44px] rounded-[12px] bg-white/10 hover:bg-white/15 text-white font-jakarta font-semibold text-[15px] transition-all border border-white/40 shadow-xs"
            >
              <LifeBuoy className="w-4 h-4 text-white shrink-0" />
              <span>Contact Sales</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
