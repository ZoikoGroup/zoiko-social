"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { C } from "./theme";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px] py-12 sm:py-16 lg:py-[64px]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="flex flex-col items-start max-w-[560px]">
            {/* Eyebrow */}
            <div className="mb-3">
              <span
                className="font-jakarta text-[12px] font-bold uppercase tracking-[0.12em]"
                style={{ color: C.mosque }}
              >
                Campaign Review
              </span>
            </div>

            {/* Heading 1 */}
            <h1 className="font-jakarta font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.08] tracking-[-0.02em] text-[#073B47] mb-4">
              Know what changed,
              <br />
              why it matters, and
              <br />
              what to do next.
            </h1>

            {/* Subtitle */}
            <p className="font-jakarta text-[16px] sm:text-[17.5px] leading-[1.55] text-[#5E7076] mb-8">
              Track ad review decisions, resolve campaign issues, submit
              evidence, and resubmit eligible campaigns under Zoiko Social&apos;s
              current Advertising Standards.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <a
                href="#your-campaigns"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-[#066879] hover:bg-[#073B47] text-white font-jakarta font-semibold text-[15px] transition-colors shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Check campaign status</span>
              </a>
              <Link
                href="/advertising-standards"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-white hover:bg-[#F7F9FA] text-[#102A32] font-jakarta font-semibold text-[15px] border border-[#DCE5E8] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#5E7076]" />
                <span>Advertising Standards</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Campaign Review Preview Card */}
          <div className="w-full">
            <div className="relative rounded-[24px] sm:rounded-[32px] bg-white border border-[#DCE5E8] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] overflow-hidden">
              {/* Card Header Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-[#DCE5E8] bg-white">
                <div>
                  <h3 className="font-jakarta font-bold text-[16px] text-[#073B47]">
                    Spring Adoption Week
                  </h3>
                  <p className="font-jakarta text-[12.5px] text-[#5E7076] mt-0.5">
                    Riverbend Animal Rescue · CMP-24816 · Submitted Sep 28, 2026
                  </p>
                </div>
                {/* Status Badge: Changes required */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5E8] border border-[#E88924] text-[#7A430B] font-jakarta font-bold text-[11.5px]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#E88924]" />
                  <span>Changes required</span>
                </div>
              </div>

              {/* Card Body: Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-[0.88fr_1.12fr]">
                {/* Left Side: Mock Ad Card */}
                <div className="p-4 sm:p-5 bg-[#F7F9FA] border-b md:border-b-0 md:border-r border-[#DCE5E8]">
                  <div className="rounded-[20px] bg-white border border-[#DCE5E8] overflow-hidden shadow-xs">
                    {/* Brand header */}
                    <div className="flex items-center justify-between p-3 border-b border-[#F0F4F6]">
                      <div className="flex items-center gap-2">
                        <span className="font-jakarta font-bold text-[12px] text-[#102A32] leading-tight">
                          Riverbend Animal
                          <br />
                          Rescue
                        </span>
                        <ShieldCheck className="w-4 h-4 text-[#066879] shrink-0" />
                      </div>
                    </div>

                    {/* Creative Photo */}
                    <div className="relative w-full h-[150px] bg-[#E5EBEB] overflow-hidden">
                      <Image
                        src="/campaign-review/hero-ad-preview.png"
                        alt="Spring Adoption Week dog creative"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Copy & Button */}
                    <div className="p-3">
                      <p className="font-jakarta text-[12.5px] text-[#102A32] leading-snug mb-3">
                        Adopt this week and get a{" "}
                        <span className="bg-[#FFF5E8] text-[#7A430B] px-1 rounded font-medium">
                          guaranteed healthy
                        </span>{" "}
                        pet.
                      </p>
                      <button
                        type="button"
                        className="w-full py-1.5 rounded-[8px] bg-[#066879] text-white font-jakarta font-bold text-[12px] text-center"
                      >
                        Meet the pets
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action Checklist & Stepper */}
                <div className="p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <p className="font-jakarta text-[13px] text-[#5E7076] leading-relaxed mb-3">
                      This campaign can be approved after you update the 2 items
                      below.
                    </p>

                    {/* Issue 1 */}
                    <div className="rounded-[12px] border border-[#DCE5E8] p-3 mb-2.5 flex items-start gap-2.5 bg-white hover:border-[#E88924] transition-colors">
                      <div className="w-7 h-7 rounded-full bg-[#FFF5E8] flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#E88924]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-jakarta font-bold text-[13.5px] text-[#102A32] leading-snug">
                          Health claim needs changing
                        </h4>
                        <p className="font-jakarta text-[12px] text-[#5E7076]">
                          Creative · Standards 4.2 · Claims
                        </p>
                      </div>
                    </div>

                    {/* Issue 2 */}
                    <div className="rounded-[12px] border border-[#DCE5E8] p-3 mb-4 flex items-start gap-2.5 bg-white hover:border-[#E88924] transition-colors">
                      <div className="w-7 h-7 rounded-full bg-[#FFF5E8] flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#E88924]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-jakarta font-bold text-[13.5px] text-[#102A32] leading-snug">
                          Landing page doesn&apos;t match the ad
                        </h4>
                        <p className="font-jakarta text-[12px] text-[#5E7076]">
                          Destination · Standards 6.1
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stepper Indicator */}
                  <div className="pt-2 border-t border-[#F0F4F6] overflow-x-auto scrollbar-none">
                    <div className="flex items-center justify-between text-[11px] font-jakarta min-w-[260px] py-1">
                      {/* Step 1 */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#066879]" />
                        <span className="text-[#5E7076]">Submitted</span>
                      </div>
                      <div className="w-5 h-[2px] bg-[#DCE5E8]" />

                      {/* Step 2 */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#066879]" />
                        <span className="text-[#5E7076]">Reviewed</span>
                      </div>
                      <div className="w-5 h-[2px] bg-[#DCE5E8]" />

                      {/* Step 3 */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#E88924]" />
                        <span className="text-[#7A430B] font-bold">Changes</span>
                      </div>
                      <div className="w-5 h-[2px] bg-[#DCE5E8]" />

                      {/* Step 4 */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#DCE5E8]" />
                        <span className="text-[#A9B8BD]">Approved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
