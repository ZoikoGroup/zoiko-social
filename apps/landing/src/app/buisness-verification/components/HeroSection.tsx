"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Play,
  ShieldAlert,
  Check,
  Clock,
  Sparkles,
  Lock,
  RotateCw,
} from "lucide-react";
import { C } from "./theme";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-18 lg:pb-24 overflow-visible">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading & Information */}
          <div className="flex flex-col items-start max-w-[620px]">
            {/* Eyebrow */}
            <div className="mb-3.5 inline-flex items-center gap-2">
              <span
                className="font-jakarta text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.12em]"
                style={{ color: C.mosque }}
              >
                Professional &amp; Organization Verification
              </span>
            </div>

            {/* Heading 1 */}
            <h1
              className="font-jakarta font-extrabold text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.08] tracking-[-0.02em] mb-4.5"
              style={{ color: C.tarawera }}
            >
              Prove who you are. Build trust that can be understood.
            </h1>

            {/* Description */}
            <p
              className="font-jakarta text-[16px] sm:text-[17.5px] leading-[1.58] mb-8 font-normal"
              style={{ color: C.nevada }}
            >
              Verify a professional identity or organization through the checks
              for your category and region, with clear evidence requests,
              secure handling and status tracking.
            </p>

            {/* CTA Buttons */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-7">
              <button
                type="button"
                onClick={() => scrollToSection("choose-path")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] font-jakarta font-semibold text-[15px] leading-[1.2] text-white shadow-sm hover:brightness-105 transition-all cursor-pointer"
                style={{ backgroundColor: C.mosque }}
              >
                <ShieldCheck className="w-5 h-5" strokeWidth={2.2} />
                <span>Start verification</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] font-jakarta font-semibold text-[15px] leading-[1.2] bg-white border hover:bg-gray-50 transition-all cursor-pointer"
                style={{ borderColor: C.geyser, color: C.firefly }}
              >
                <Play className="w-4 h-4 fill-current opacity-85" />
                <span>See how it works</span>
              </button>
            </div>

            {/* Disclaimer Notice */}
            <div className="flex items-start gap-2.5 sm:gap-3 text-[12.5px] sm:text-[13.5px] leading-[1.55] pt-1">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ color: C.mosque }}
              >
                <ShieldAlert className="w-4.5 h-4.5" strokeWidth={2} />
              </div>
              <p style={{ color: C.nevada }}>
                Verification is independent from Premium, advertising,
                partnerships, sales, follower counts and popularity.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Verification Preview Card */}
          <div className="relative w-full max-w-[530px] mx-auto lg:mx-0">
            {/* Top-Right Floating Badge */}
            <div
              className="absolute -top-5 right-2 sm:right-6 z-20 hidden sm:flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-[14px] border border-[#DCE5E8]/60 shadow-[0px_8px_24px_rgba(7,59,71,0.12)] animate-pulse"
              style={{ animationDuration: "4s" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: C.mosque }}
              >
                <ShieldCheck className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span
                className="font-jakarta font-bold text-[14px] leading-tight"
                style={{ color: C.tarawera }}
              >
                Verified professional
              </span>
            </div>

            {/* Main Preview Card Container */}
            <div
              className="w-full bg-white rounded-[32px] border overflow-hidden shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)]"
              style={{ borderColor: C.geyser }}
            >
              {/* Card Banner Image with Gradient */}
              <div className="relative h-[120px] w-full overflow-hidden bg-gradient-to-r from-[#066879] to-[#E88924]">
                <Image
                  src="/buisness-verification/hero_verification_banner-4032ef.png"
                  alt="Professional verification banner preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 530px"
                  className="object-cover opacity-90"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Pill overlay on bottom edge */}
                <div
                  className="absolute bottom-2.5 left-4.5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-full shadow-[0px_8px_24px_rgba(7,59,71,0.15)]"
                >
                  <ShieldCheck
                    className="w-4 h-4"
                    style={{ color: C.mosque }}
                    strokeWidth={2.5}
                  />
                  <span
                    className="font-jakarta font-bold text-[13.5px] leading-tight"
                    style={{ color: C.tarawera }}
                  >
                    Professional verification
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-7 pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-6 items-center">
                  {/* Gauge Widget */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-[110px] h-[110px] flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background Ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#E5E7EB"
                          strokeWidth="9"
                        />
                        {/* 60% Progress Arc */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#066879"
                          strokeWidth="9"
                          strokeDasharray="251.2"
                          strokeDashoffset="100.48"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Gauge Inner Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span
                          className="font-jakarta font-bold text-[22px] sm:text-[24px] leading-none"
                          style={{ color: C.tarawera }}
                        >
                          60%
                        </span>
                        <span
                          className="font-jakarta font-bold text-[11px] sm:text-[11.5px] mt-1"
                          style={{ color: C.nevada }}
                        >
                          complete
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Task checklist */}
                  <div className="flex flex-col gap-2.5">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between gap-2 text-[13px] sm:text-[13.5px]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: C.mosque }}
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <span
                          className="font-jakarta font-semibold"
                          style={{ color: C.firefly }}
                        >
                          Identity confirmed
                        </span>
                      </div>
                      <span className="font-jakarta text-[11.5px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Done
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between gap-2 text-[13px] sm:text-[13.5px]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: C.mosque }}
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <span
                          className="font-jakarta font-semibold"
                          style={{ color: C.firefly }}
                        >
                          Category: veterinary
                        </span>
                      </div>
                      <span className="font-jakarta text-[11.5px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Done
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between gap-2 text-[13px] sm:text-[13.5px]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white"
                          style={{ borderColor: C.zest }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: C.zest }}
                          />
                        </div>
                        <span
                          className="font-jakarta font-semibold"
                          style={{ color: C.firefly }}
                        >
                          License uploaded
                        </span>
                      </div>
                      <span
                        className="font-jakarta text-[11.5px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: C.serenade, color: C.cafeRoyale }}
                      >
                        Checking
                      </span>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center justify-between gap-2 text-[13px] sm:text-[13.5px]">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
                          <Clock className="w-3 h-3" />
                        </div>
                        <span
                          className="font-jakarta font-medium"
                          style={{ color: C.nevada }}
                        >
                          Team review
                        </span>
                      </div>
                    </div>

                    {/* Item 5 */}
                    <div className="flex items-center justify-between gap-2 text-[13px] sm:text-[13.5px]">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
                          <Sparkles className="w-3 h-3" />
                        </div>
                        <span
                          className="font-jakarta font-medium"
                          style={{ color: C.nevada }}
                        >
                          Badge live
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Notice Strip */}
              <div
                className="flex items-center gap-2.5 px-5 py-3 border-t text-[12.5px] sm:text-[13px] font-jakarta"
                style={{
                  backgroundColor: C.athensGray,
                  borderColor: C.geyser,
                  color: C.nevada,
                }}
              >
                <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                <span>Documents are private and used only for review</span>
              </div>
            </div>

            {/* Bottom-Right Floating Pill Badge */}
            <div
              className="absolute -bottom-5 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-[14px] border border-[#DCE5E8]/60 shadow-[0px_8px_24px_rgba(7,59,71,0.12)]"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: C.mosque }}
              >
                <RotateCw className="w-4 h-4" strokeWidth={2.3} />
              </div>
              <span
                className="font-jakarta font-bold text-[13.5px] leading-tight"
                style={{ color: C.tarawera }}
              >
                Rechecked every 12 months
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
