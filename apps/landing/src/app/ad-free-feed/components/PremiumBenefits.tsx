"use client";

import React from "react";
import Image from "next/image";

export default function PremiumBenefits() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1232px] items-center gap-12 px-6 py-10 sm:px-8 md:px-10 lg:px-0">

        {/* Content */}
        <div className="flex w-full flex-1 flex-col items-start gap-4">

          {/* Heading */}
          <div className="flex w-full flex-col items-start pb-[0.8px]">
            <h2
              className="w-full font-['Plus_Jakarta_Sans'] text-2xl font-extrabold leading-8 sm:text-3xl sm:leading-10"
              style={{ color: "#102F38" }}
            >
              Premium membership benefits
            </h2>
          </div>

          {/* Description */}
          <div className="flex w-full flex-col items-start">
            <p
              className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-7"
              style={{ color: "#607780" }}
            >
              Ad-Free Feed is one of several Premium benefits. Combine it with
              other features to customize your Zoiko experience exactly how
              you want it.
            </p>
          </div>

          {/* Benefits */}
          <div className="flex w-full flex-col items-start pt-1.5">
            <p
              className="w-full font-['Plus_Jakarta_Sans'] text-xs font-semibold leading-6"
              style={{ color: "#087A8B" }}
            >
              ✓ Approved ad surfaces covered
              <br />
              ✓ Works across platforms
              <br />
              ✓ Updates with your Premium status
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-72 min-h-72 w-full flex-1 overflow-hidden rounded-3xl border border-[#D6E3E6]">
          <Image
            src="/ad-free-feed/image2.png"
            alt="Premium membership benefits"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

      </div>
    </section>
  );
}