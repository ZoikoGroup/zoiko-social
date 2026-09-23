"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PrivacyHero() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-28 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-center gap-10 lg:flex-row lg:gap-12">
          {/* Left Content */}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
            {/* Eyebrow */}
            <div className="flex w-full flex-col items-start">
              <div
                className="w-full font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#087A8B" }}
              >
                Premium · Advanced Privacy
              </div>
            </div>

            {/* Heading */}
            <div className="flex w-full flex-col items-start">
              <h1
                className="w-full font-['Plus_Jakarta_Sans'] text-4xl font-extrabold leading-[1.2] sm:text-[42px] lg:text-5xl lg:leading-[57.6px]"
                style={{ color: "#102F38" }}
              >
                More control over who sees what.
              </h1>
            </div>

            {/* Description */}
            <div className="flex w-full flex-col items-start pt-2">
              <p
                className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-6"
                style={{ color: "#607780" }}
              >
                Choose who can see your posts, profile, and activity. Advanced
                privacy lets you set visibility to Public, Community, Friends,
                or Private — giving you complete control over your presence on
                Zoiko.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex w-full flex-wrap items-start gap-4 pt-1">
              {/* Compare Plans */}
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-['Arial'] text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#087A8B",
                }}
              >
                Compare Plans
              </Link>

              {/* See What Changes */}
              <Link
                href="#what-changes"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-['Arial'] text-sm font-bold transition-colors hover:bg-[#F7FAFA]"
                style={{
                  color: "#102F38",
                  border: "1px solid #D6E3E6",
                }}
              >
                See what changes
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex min-w-0 flex-1 flex-col items-start pb-1">
            <div className="relative h-[280px] w-full overflow-hidden rounded-3xl shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] sm:h-[340px] lg:h-[394px]">
              <Image
                src="/advanced-privacy/hero.png"
                alt="Advanced Privacy"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 591px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}