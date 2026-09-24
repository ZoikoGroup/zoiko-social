"use client";

import React from "react";
import Image from "next/image";

export default function AdvancedModerationHero() {
  return (
    <section
      className="w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(110deg, #06262D 0%, #063E49 48%, #07515B 68%, #A9651F 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-28 lg:py-20">
        {/* Left Content */}
        <div className="flex w-full max-w-[686px] flex-col items-start">
          {/* Eyebrow */}
          <div className="mb-5 w-full">
            <div className="text-xs font-semibold uppercase tracking-wide leading-5 text-white">
              Premium+ · Advanced Moderation
            </div>
          </div>

          {/* Heading */}
          <div className="w-full max-w-[588px]">
            <h1 className="m-0 text-4xl font-extrabold leading-[48px] text-white sm:text-5xl sm:leading-[57.6px]">
              Deeper tools for community teams.
            </h1>
          </div>

          {/* Description */}
          <div className="mt-5 w-full max-w-[553px]">
            <p className="m-0 text-base font-normal leading-6 text-white">
              Keep your community safe with advanced moderation controls. Flag
              content, manage members, track actions, and maintain community
              standards with team collaboration tools.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-wrap items-start gap-4 pt-8">
            <button
              type="button"
              className="w-full rounded-xl bg-white px-6 py-3.5 text-center text-base font-semibold leading-6 text-[#066879] transition-opacity duration-200 hover:opacity-90 sm:w-auto sm:min-w-[136px]"
            >
              See the tools
            </button>

            <button
              type="button"
              className="w-full rounded-xl border border-white/50 px-6 py-3.5 text-center text-base font-semibold leading-6 text-white transition-colors duration-200 hover:bg-white/10 sm:w-auto"
            >
              View permissions
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="mt-10 w-full max-w-[540px] lg:mt-0 lg:ml-10">
          <div className="relative aspect-[540/388] w-full overflow-hidden rounded-[16px]">
            <Image
              src="/advanced-moderation/hero.png"
              alt="Community moderation tools"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 540px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}