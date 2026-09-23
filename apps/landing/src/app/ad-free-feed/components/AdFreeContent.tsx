"use client";

import React from "react";
import Image from "next/image";

export default function AdFreeContent() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-10 sm:px-8 md:px-12 lg:px-28">
        <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:gap-12">

          {/* Image */}
          <div className="relative flex h-72 min-h-72 w-full flex-1 items-center justify-center overflow-hidden rounded-3xl border border-[#D6E3E6] lg:w-1/2">
            <Image
              src="/ad-free-feed/image1.png"
              alt="Ad-free feed preview"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="flex w-full flex-1 flex-col items-start gap-4 lg:w-1/2">

            {/* Heading */}
            <div className="flex w-full flex-col items-start pb-[0.8px]">
              <h2
                className="w-full font-['Plus_Jakarta_Sans'] text-2xl font-extrabold leading-8 sm:text-3xl sm:leading-10"
                style={{ color: "#102F38" }}
              >
                Less interruption, more content
              </h2>
            </div>

            {/* Description */}
            <div className="flex w-full flex-col items-start">
              <p
                className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-7"
                style={{ color: "#607780" }}
              >
                Premium removes approved advertising placements from your
                feed, making your browsing experience more continuous. You stay
                focused on the communities and people you choose to follow.
              </p>
            </div>

            {/* Features */}
            <div className="flex w-full flex-col items-start pt-1.5">
              <p
                className="w-full font-['Plus_Jakarta_Sans'] text-xs font-semibold leading-6"
                style={{ color: "#087A8B" }}
              >
                ✓ Cleaner feed layout
                <br />
                ✓ Uninterrupted browsing
                <br />
                ✓ Focus on your communities
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}