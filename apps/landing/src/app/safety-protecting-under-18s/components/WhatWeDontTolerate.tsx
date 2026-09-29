import React from "react";

interface PolicyCard {
  title: string;
  description: string;
  desktopIcon: React.ReactNode;
  mobileIcon: React.ReactNode;
}

const POLICIES: PolicyCard[] = [
  {
    title: "Harassment & Bullying",
    description:
      "Targeting, name-calling, threats, and coordinated attacks are completely forbidden.",
    desktopIcon: (
      <svg
        className="size-11 stroke-[#006D77]"
        viewBox="0 0 48 48"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 18v12h6l12 8V10L18 18h-6z" />
        <path d="M36 18c2 2 2 8 0 10" />
        <line x1="8" y1="40" x2="40" y2="8" strokeWidth="2" stroke="#006D77" />
      </svg>
    ),
    mobileIcon: (
      <svg
        className="size-10 stroke-[#DC2626]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
      </svg>
    ),
  },
  {
    title: "Exploitation & Abuse",
    description:
      "Any content exploiting minors, sexualizing, grooming, or harm is strictly banned and reported.",
    desktopIcon: (
      <svg
        className="size-11 stroke-[#006D77]"
        viewBox="0 0 48 48"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M24 6 10 12v12c0 10 14 18 14 18s14-8 14-18V12L24 6z" />
        <circle cx="24" cy="23" r="6" />
        <line x1="20" y1="27" x2="28" y2="19" strokeWidth="1.8" />
      </svg>
    ),
    mobileIcon: (
      <div className="flex size-10 items-center justify-center text-3xl">
        ⚠️
      </div>
    ),
  },
  {
    title: "Hate & Discrimination",
    description:
      "Slurs, dehumanizing language, and attacks based on identity are zero-tolerance.",
    desktopIcon: (
      <svg
        className="size-11 stroke-[#006D77]"
        viewBox="0 0 48 48"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M24 10v28" />
        <path d="M14 16h20" />
        <path d="M10 28l4-12 4 12c-2 2-6 2-8 0z" />
        <path d="M30 28l4-12 4 12c-2 2-6 2-8 0z" />
        <path d="M18 38h12" />
      </svg>
    ),
    mobileIcon: (
      <div className="flex size-10 items-center justify-center text-3xl">
        🔥
      </div>
    ),
  },
];

export default function WhatWeDontTolerate() {
  return (
    <section className="w-full bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          What We Don&apos;t Tolerate
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {POLICIES.map((policy) => (
            <div
              key={policy.title}
              className="flex flex-col items-center rounded-2xl border border-gray-200/80 bg-gradient-to-b from-[#FFF5EB] via-[#FFFAF4] to-white p-7 text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md sm:bg-white sm:from-white sm:to-white sm:p-10"
            >
              {/* Desktop Icon */}
              <div className="mb-6 hidden size-14 items-center justify-center sm:flex">
                {policy.desktopIcon}
              </div>

              {/* Mobile Icon */}
              <div className="mb-4 flex size-12 items-center justify-center sm:hidden">
                {policy.mobileIcon}
              </div>

              <h3 className="text-base font-bold text-[#0F2422] sm:text-lg">
                {policy.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#5A7371] sm:mt-3 sm:text-sm">
                {policy.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
