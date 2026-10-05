"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function CurrentStandardsStrip() {
  return (
    <section className="w-full bg-white border-b border-[#DCE5E8] py-3.5">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] font-jakarta">
          {/* Left group */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[#5E7076]">
            <div className="flex items-center gap-2 font-medium text-[#102A32]">
              <ShieldCheck className="w-4 h-4 text-[#066879]" />
              <span>Advertising Standards</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F7F9FA] border border-[#DCE5E8] text-[#102A32] font-bold text-[11.5px]">
              version 3.2
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Effective September 1, 2026</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline text-[#5E7076]">
              All reviews use the current version
            </span>
          </div>

          {/* Right link */}
          <Link
            href="/advertising-standards#version-history"
            className="inline-flex items-center gap-1 font-bold text-[#066879] hover:underline transition-all text-[12.5px]"
          >
            <span>What changed in 3.2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
