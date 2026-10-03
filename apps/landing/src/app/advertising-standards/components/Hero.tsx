"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-white border-b border-[#DCE5E8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[105px] py-10 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* Left Column: Headline and Actions */}
          <div className="flex-1 max-w-[660px]">
            {/* Tag / Eyebrow */}
            <div className="inline-block mb-3">
              <span className="text-[#066879] text-xs font-bold tracking-[0.12em] uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                Advertising Standards
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-[48px] leading-[1.2] lg:leading-[52px] font-extrabold text-[#073B47] tracking-[-0.02em] font-['Plus_Jakarta_Sans',sans-serif] mb-4">
              Advertising that respects animals, people and trust.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-[17.5px] leading-relaxed sm:leading-[27px] text-[#5E7076] font-normal font-['Plus_Jakarta_Sans',sans-serif] mb-6 sm:mb-8">
              Ads on Zoiko Social come from verified, animal-aligned advertisers.
              They&apos;re clearly labeled, follow welfare and safety rules, respect privacy,
              and stay separate from verified news and adoption.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 sm:mb-8">
              <a
                href="#quick-check"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#066879] hover:bg-[#055765] text-white text-sm sm:text-[15px] font-semibold transition-colors shadow-sm text-center"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Check your campaign</span>
              </a>

              <Link
                href="/for-business/advertise"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#DCE5E8] hover:border-[#066879] text-[#102A32] text-sm sm:text-[15px] font-semibold transition-colors text-center"
              >
                <span>Advertise on Zoiko Social</span>
              </Link>
            </div>

            {/* Trust Assurance Statement */}
            <div className="flex items-start gap-2.5 pt-2 text-[#5E7076] text-xs sm:text-[13.5px] leading-relaxed sm:leading-[21px] font-['Plus_Jakarta_Sans',sans-serif]">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0 flex items-center justify-center text-[#066879]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p>
                Higher spend, sponsorships, partnerships or commercial importance never
                change these standards.
              </p>
            </div>
          </div>

          {/* Right Column: Visual Preview Cards */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center justify-center gap-5">
            {/* Phone Screen Mockup */}
            <div className="w-[260px] h-[500px] bg-[#073B47] rounded-[38px] p-2.5 shadow-[0px_20px_48px_rgba(7,59,71,0.16)] flex flex-col flex-shrink-0">
              <div className="w-full h-full bg-[#F7F9FA] rounded-[30px] flex flex-col overflow-hidden">
                {/* Header App Bar */}
                <div className="h-[49px] bg-white border-b border-[#DCE5E8] flex items-center px-3.5 gap-0.5">
                  <span className="font-extrabold text-[#066879] text-base font-['Plus_Jakarta_Sans',sans-serif]">
                    Zo
                  </span>
                  <span className="font-extrabold text-[#E88924] text-base font-['Plus_Jakarta_Sans',sans-serif]">
                    i
                  </span>
                  <span className="font-extrabold text-[#066879] text-base font-['Plus_Jakarta_Sans',sans-serif]">
                    ko
                  </span>
                </div>

                {/* Feed Cards Container */}
                <div className="flex-1 p-2.5 flex flex-col gap-2.5 overflow-hidden">
                  {/* Card 1: Sponsored Ad */}
                  <div className="bg-white border border-[#DCE5E8] rounded-2xl overflow-hidden shadow-xs">
                    {/* Header */}
                    <div className="p-2 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#066879] to-[#E88924] p-[1.5px] flex-shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                          <Image
                            src="/advertising-standards/hero-cat-avatar.png"
                            alt="Avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-[#102A32] truncate max-w-[140px]">
                          Harbor Point Veterinary Clinic
                        </span>
                        <span className="text-[10.5px] text-[#5E7076]">
                          Ad · Verified
                        </span>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-[105px] overflow-hidden bg-gradient-to-br from-[#066879] to-[#E88924]">
                      <Image
                        src="/advertising-standards/hero-clinic-dog.png"
                        alt="Harbor Point Veterinary"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Card 2: Community Post */}
                  <div className="bg-white border border-[#DCE5E8] rounded-2xl overflow-hidden shadow-xs flex-1 flex flex-col">
                    {/* Header */}
                    <div className="p-2 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#066879] to-[#E88924] p-[1.5px] flex-shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                          <Image
                            src="/advertising-standards/hero-cat-avatar.png"
                            alt="Cityside Cat Rescue"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-[#102A32] truncate max-w-[140px]">
                          Cityside Cat Rescue
                        </span>
                        <span className="text-[10.5px] text-[#5E7076]">
                          Community post · 2h
                        </span>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-[95px] overflow-hidden bg-gradient-to-br from-[#066879] to-[#E88924]">
                      <Image
                        src="/advertising-standards/hero-cat-post.png"
                        alt="Cityside Cat Rescue Post"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Caption */}
                    <div className="p-2 text-[11.5px] text-[#102A32] leading-tight truncate">
                      Three kittens found their families this
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Checks Floating Card */}
            <div className="w-[270px] bg-white border border-[#DCE5E8] rounded-[24px] p-5 shadow-[0px_8px_24px_rgba(7,59,71,0.1)] flex flex-col gap-3">
              {/* Card Header */}
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-9 h-9 rounded-xl bg-[#EEF8F9] flex items-center justify-center text-[#066879]">
                  <svg
                    className="w-5 h-5 text-[#066879]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-extrabold text-[#073B47] text-[15px] font-['Plus_Jakarta_Sans',sans-serif]">
                  Policy checks
                </h3>
              </div>

              {/* Check Items */}
              <div className="flex flex-col gap-2">
                {[
                  "Verified advertiser",
                  "Sponsored label shown",
                  "Claim is accurate",
                  "Landing page matches",
                  "Adults 18+ · San Francisco",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-[22px] h-[22px] rounded-full bg-[#066879] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13.5px] font-semibold text-[#102A32] font-['Plus_Jakarta_Sans',sans-serif]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom metadata */}
              <div className="pt-2 border-t border-[#DCE5E8] mt-1">
                <span className="text-xs text-[#5E7076] font-['Plus_Jakarta_Sans',sans-serif]">
                  Standards v3.2 · Reviewed Sep 19, 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
