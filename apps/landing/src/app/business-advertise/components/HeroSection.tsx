"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Megaphone,
  Sparkles,
  MapPin,
  Tag,
} from "lucide-react";
import { C } from "./theme";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"Objective" | "Audience" | "Creative" | "Budget" | "Review">("Audience");

  return (
    <section className="relative w-full overflow-hidden bg-[#071B20]">
      {/* Background Image with Dark Teal Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/business-advertise/hero-bg.png"
          alt="Zoiko Social Advertising"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7, 27, 32, 0.88) 0%, rgba(7, 42, 50, 0.65) 85%, rgba(7, 59, 71, 0.45) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px] py-14 sm:py-16 lg:py-[64px] pb-16 lg:pb-[72px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="flex flex-col items-start max-w-[620px]">
            {/* Eyebrow */}
            <div className="mb-3">
              <span
                className="font-jakarta text-[12px] font-bold uppercase tracking-[0.12em]"
                style={{ color: C.morningGlory }}
              >
                Advertise on Zoiko Social
              </span>
            </div>

            {/* Heading 1 */}
            <h1 className="font-jakarta font-extrabold text-[28px] xs:text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.12] tracking-[-0.02em] text-white mb-4">
              Reach animal communities without compromising trust.
            </h1>

            {/* Description */}
            <p
              className="font-jakarta text-[15px] sm:text-[17px] leading-[1.55] font-normal mb-7 sm:mb-8"
              style={{ color: C.botticelli }}
            >
              Promote approved products, services, organizations, education and
              events in a community built around animals, with clear labeling,
              verified advertisers and welfare-first review.
            </p>

            {/* Action Buttons */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
              <Link
                href="#start-advertising"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-white text-[#073B47] font-jakarta font-semibold text-[15px] leading-tight hover:bg-[#F7F9FA] transition-all shadow-sm group"
              >
                <span>Start advertising</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/advertising-standards"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-[#066879] text-white font-jakarta font-semibold text-[15px] leading-tight hover:bg-[#055765] transition-all border border-[#066879]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Advertising Standards</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Ads Manager Card */}
          <div className="w-full max-w-[560px] mx-auto lg:max-w-none">
            <div className="bg-white rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-[0px_30px_60px_rgba(0,0,0,0.35)] border border-white/20">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#F7F9FA] border-b border-[#DCE5E8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#066879]/10 flex items-center justify-center text-[#066879]">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <span className="font-jakarta font-bold text-[13px] text-[#073B47]">
                    Ads Manager · Cat Dental Month
                  </span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-[#F7F9FA] border border-dashed border-[#A9B8BD] flex items-center gap-1.5 text-[12px] font-semibold text-[#5E7076]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9B8BD]"></span>
                  <span>Draft</span>
                </div>
              </div>

              {/* Workflow Stepper Tabs */}
              <div className="flex items-center px-3 sm:px-4 py-2 border-b border-[#DCE5E8] gap-1 sm:gap-1.5 overflow-x-auto">
                {(["Objective", "Audience", "Creative", "Budget", "Review"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 min-w-[70px] py-1.5 px-2 text-center rounded-[8px] font-jakarta font-bold text-[11.5px] transition-all ${
                        isActive
                          ? "bg-[#EEF8F9] text-[#073B47] shadow-[inset_0px_-2px_0px_#E88924]"
                          : "text-[#5E7076] hover:bg-black/5"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Main Card Body */}
              <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-[1.1fr_0.9fr] gap-4">
                {/* Left Parameter List */}
                <div className="flex flex-col gap-3.5 justify-between">
                  {/* Objective Field */}
                  <div className="flex flex-col gap-1">
                    <span className="font-jakarta font-bold text-[11.5px] text-[#5E7076] uppercase tracking-wider">
                      Objective
                    </span>
                    <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-[12px] bg-[#EEF8F9] border-2 border-[#066879]">
                      <Sparkles className="w-4 h-4 text-[#066879]" />
                      <span className="font-jakarta font-bold text-[13.5px] text-[#073B47]">
                        Awareness
                      </span>
                    </div>
                  </div>

                  {/* Audience Targeting Field */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-jakarta font-bold text-[11.5px] text-[#5E7076] uppercase tracking-wider">
                      Audience
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DCE5E8] text-[12px] font-semibold text-[#102A32] bg-white">
                        <Tag className="w-3 h-3 text-[#5E7076]" />
                        Cats
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DCE5E8] text-[12px] font-semibold text-[#102A32] bg-white">
                        <Tag className="w-3 h-3 text-[#5E7076]" />
                        Pet health
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DCE5E8] text-[12px] font-semibold text-[#102A32] bg-white">
                        <MapPin className="w-3 h-3 text-[#5E7076]" />
                        San Francisco
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DCE5E8] text-[12px] font-semibold text-[#102A32] bg-white">
                        18+
                      </span>
                    </div>
                  </div>

                  {/* Budget Field */}
                  <div className="flex flex-col gap-1">
                    <span className="font-jakarta font-bold text-[11.5px] text-[#5E7076] uppercase tracking-wider">
                      Budget you set
                    </span>
                    <div className="flex items-center justify-between px-3 py-2 rounded-[12px] border border-[#DCE5E8] bg-white">
                      <span className="font-jakarta text-[13px] text-[#102A32]">
                        Daily budget
                      </span>
                      <span className="font-jakarta font-bold text-[15px] text-[#073B47]">
                        $70.00
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Ad Mockup Preview */}
                <div className="flex flex-col gap-1">
                  <span className="font-jakarta font-bold text-[11.5px] text-[#5E7076] uppercase tracking-wider">
                    Preview
                  </span>
                  <div className="rounded-[14px] border border-[#DCE5E8] bg-white overflow-hidden flex flex-col shadow-xs">
                    {/* Mock Post Header */}
                    <div className="flex items-center gap-2 p-2 border-b border-[#DCE5E8]/60 bg-[#F7F9FA]/40">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-[#DCE5E8]">
                        <Image
                          src="/business-advertise/placement-vet-avatar.png"
                          alt="Harbor Point Veterinary Clinic"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-jakarta font-bold text-[11px] leading-tight text-[#102A32] truncate">
                          Harbor Point Vet
                        </span>
                        <span className="font-jakarta text-[9.5px] text-[#5E7076]">
                          Sponsored · Verified
                        </span>
                      </div>
                    </div>

                    {/* Mock Image */}
                    <div className="relative w-full h-[120px] bg-gradient-to-br from-[#066879] to-[#E88924] overflow-hidden">
                      <Image
                        src="/business-advertise/placement-feed-cat.png"
                        alt="Cat dental check ad"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Mock Text */}
                    <div className="p-2 text-[11px] leading-snug font-medium text-[#102A32]">
                      Book a dental check for your cat this October.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Policy Safeguard Strip */}
              <div className="px-4 py-2.5 bg-[#F7F9FA] border-t border-[#DCE5E8] flex items-center gap-2 text-[12px] text-[#5E7076]">
                <FileCheck className="w-4 h-4 text-[#066879] shrink-0" />
                <span>Reviewed against Advertising Standards v3.2 before launch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
