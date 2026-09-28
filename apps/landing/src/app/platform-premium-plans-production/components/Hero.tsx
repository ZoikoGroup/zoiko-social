"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Hero — "Premium features for your lifestyle".
 *
 * Full-bleed photo background (/platform-premium-plans-production/Background.png,
 * the 1440x369 hero export) under a cyan gradient overlay; the Figma frame
 * stacks a cyan wash over the photo so the headline stays readable.
 * Monthly/Annual toggle switches the shown price ($9.99/month vs.
 * $95.90/year ≈ 20% annual saving, matching the pricing-note copy further
 * down the frame).
 */
export default function Hero() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src="/platform-premium-plans-production/Background.png"
        alt=""
        width={1440}
        height={369}
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#066879]/88 via-[#066879]/55 to-[#3b8894]/30" />

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-3 px-6 py-20 lg:px-28">
        <p className="text-center font-jakarta text-xs font-bold uppercase tracking-wide text-white/80">
          Zoiko Social Premium
        </p>
        <h1 className="text-center font-jakarta text-4xl font-extrabold leading-[57.6px] text-white lg:text-5xl">
          Premium features for your lifestyle
        </h1>
        <p className="max-w-[600px] pt-[3px] text-center font-jakarta text-base font-normal leading-7 text-white/90">
          Ad-free experience, advanced privacy, professional verification, and more.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-3">
          <div className="flex items-center rounded-3xl bg-white/20 p-2">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-[20px] px-6 py-3 font-jakarta text-sm font-semibold transition-colors ${
                billing === "monthly" ? "bg-white text-[#0f5a68]" : "text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`rounded-[20px] px-6 py-3 font-jakarta text-sm font-semibold transition-colors ${
                billing === "annual" ? "bg-white text-[#0f5a68]" : "text-white"
              }`}
            >
              Annual
            </button>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-center font-jakarta text-3xl font-extrabold text-white">
              {billing === "monthly" ? "$9.99" : "$95.90"}
            </span>
            <span className="text-center font-jakarta text-sm font-medium text-white/80">
              {billing === "monthly" ? "/month" : "/year"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
