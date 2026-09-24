"use client";

import React from "react";
import Image from "next/image";

export default function FundraisingHero() {
  return (
    <section className="w-full bg-[#F7F9FA]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-10 sm:py-16 lg:px-28 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1230px] flex-col justify-between gap-10 lg:flex-row lg:items-center lg:gap-0">

          {/* Left Content */}
          <div className="flex w-full flex-col items-start gap-3 lg:w-[612px]">

            {/* Eyebrow */}
            <div className="w-full text-xs font-semibold uppercase tracking-wide text-[#F27C00]">
              Premium+ · Fundraising Toolkit
            </div>

            {/* Heading */}
            <div className="w-full">
              <h1 className="m-0 w-full max-w-[598px] text-[40px] font-extrabold leading-[48px] tracking-[-1px] text-[#102A32] sm:text-[48px] sm:leading-[57.6px]">
                Tools to run and track campaigns.
              </h1>
            </div>

            {/* Description */}
            <div className="w-full pt-2">
              <p className="m-0 w-full max-w-[612px] text-base font-normal leading-6 text-[#5E7076]">
                Manage fundraising campaigns directly on Zoiko. Set goals,
                track donations, share updates, and engage your supporters all
                in one place.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex w-full flex-wrap items-center gap-4 pt-5">

              {/* Primary CTA */}
              <button
                type="button"
                className="rounded-xl bg-[#066879] px-5 py-3 text-center text-sm font-bold leading-5 text-white transition-opacity duration-200 hover:opacity-90"
              >
                See the tools
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                className="rounded-xl border border-[#DADFE1] bg-white px-5 py-3 text-center text-sm font-bold leading-5 text-[#102A32] transition-colors duration-200 hover:bg-[#F7F9FA]"
              >
                View examples
              </button>

            </div>
          </div>

          {/* Right Image */}
          <div className="flex w-full items-center justify-center lg:w-[602px] lg:justify-end">
            <div className="relative w-full max-w-[602px] overflow-hidden">
              <Image
                src="/fundraising-toolkit/hero.png"
                alt="Fundraising campaign toolkit"
                width={602}
                height={384}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}