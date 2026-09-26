import { Check } from "lucide-react";
import { C } from "./theme";

const PRINCIPLES = [
  {
    title: "Purpose Over Generic Engagement",
    description:
      "Designed around animal life and care — not adapted from a general-interest social network. Every feature serves this mission.",
    items: [
      "Animal-focused by design, not as an afterthought",
      "Features built for welfare and responsibility",
      "No engagement-for-engagement's-sake optimization",
    ],
  },
  {
    title: "Governed Environment",
    description:
      "Safety, moderation, verification, and accountability are product architecture, not optional polish added later.",
    items: [
      "Profanity-free and family-friendly",
      "Tiered verification for different content types",
      "Human + automated moderation",
    ],
  },
  {
    title: "Responsibility Over Virality",
    description:
      "The platform does not optimize for outrage, unsafe reach, or exploitative engagement loops.",
    items: [
      "Verified information prioritized over speed",
      "Community standards enforced consistently",
      "Transparency over hidden algorithms",
    ],
  },
  {
    title: "Animal Welfare Protections",
    description:
      "Adoption, reporting, and commerce operate within welfare safeguards and anti-trafficking controls.",
    items: [
      "Verified rescue and shelter partnerships",
      "Animal welfare reporting mechanisms",
      "Protection against exploitative commerce",
    ],
  },
  {
    title: "Trustworthy Information",
    description:
      "Institutional and professional source verification distinguishes types of information and expertise.",
    items: [
      "Verified badges for different expertise types",
      "Attribution and source transparency",
      "Misinformation reporting and review",
    ],
  },
  {
    title: "Global Perspective, Local Care",
    description:
      "Global reach with local laws, languages, moderation, and communities operating with regional awareness.",
    items: [
      "Multi-language support and local communities",
      "Regional law and cultural respect",
      "Location-aware discovery and resources",
    ],
  },
];

export default function WhatMakesDifferentSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:gap-4 max-w-[850px]">
          <h2
            className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]"
            style={{ color: C.firefly }}
          >
            What makes Zoiko Social different
          </h2>
          <p
            className="text-sm font-normal leading-relaxed sm:text-base lg:text-[17px] sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Zoiko Social is intentionally designed with five core principles that set it
            apart from general-purpose social networks:
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="flex flex-col rounded-[18px] sm:rounded-[20px] p-5 sm:p-7 lg:p-8 shadow-sm transition hover:shadow-md"
              style={{
                background: C.white,
                border: `1px solid ${C.geyser}`,
              }}
            >
              {/* Card Title */}
              <h3
                className="text-base sm:text-lg lg:text-[20px] font-bold leading-snug sm:leading-[26px]"
                style={{ color: C.mosque }}
              >
                {principle.title}
              </h3>

              {/* Description */}
              <p
                className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-[16px] font-normal leading-relaxed sm:leading-[26px]"
                style={{ color: C.nevada }}
              >
                {principle.description}
              </p>

              {/* Checkmark List */}
              <ul className="mt-5 sm:mt-6 flex flex-col gap-2.5 sm:gap-3">
                {principle.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 sm:gap-3">
                    <span
                      className="mt-0.5 flex size-4 sm:size-5 shrink-0 items-center justify-center font-bold text-xs sm:text-sm"
                      style={{ color: C.mosque }}
                    >
                      <Check size={15} strokeWidth={2.5} />
                    </span>
                    <span
                      className="text-xs sm:text-sm lg:text-[15px] font-normal leading-snug sm:leading-normal"
                      style={{ color: C.firefly }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
