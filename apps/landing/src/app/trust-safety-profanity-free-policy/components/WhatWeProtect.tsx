import React from "react";

interface ProtectCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  mobileEmoji: string;
}

const PROTECT_CARDS: ProtectCard[] = [
  {
    title: "Child Safety First",
    description:
      "Age-appropriate content controls and extra protections for young members keep families safe.",
    mobileEmoji: "👶",
    icon: (
      <svg
        className="size-7 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="10" r="2.5" />
        <path d="M8.5 16c0-1.8 1.6-3 3.5-3s3.5 1.2 3.5 3" />
      </svg>
    ),
  },
  {
    title: "Prevent Harassment",
    description:
      "Hateful language, personal attacks, and targeted harassment have zero tolerance. Period.",
    mobileEmoji: "🤝",
    icon: (
      <svg
        className="size-7 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
        <path d="M4.93 4.93l14.14 14.14" />
        <path d="M9 10h6" />
      </svg>
    ),
  },
  {
    title: "Allow Education",
    description:
      "Discussing difficult topics, quoting research, or teaching history is encouraged respectfully.",
    mobileEmoji: "🎓",
    icon: (
      <svg
        className="size-7 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
  },
  {
    title: "Respect Diversity",
    description:
      "Language norms differ by culture and context. We respect that while maintaining standards.",
    mobileEmoji: "🌍",
    icon: (
      <svg
        className="size-7 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function WhatWeProtect() {
  return (
    <section className="w-full bg-white py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <h2 className="text-left text-[26px] font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          What We Protect
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6">
          {PROTECT_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start sm:gap-5 sm:p-7 sm:shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            >
              {/* Mobile: Top horizontal pill badge with emoji */}
              <div className="mb-4 flex h-11 w-full items-center justify-center rounded-xl border border-gray-100/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:hidden">
                <span className="text-xl">{card.mobileEmoji}</span>
              </div>

              {/* Desktop: Left square pale cyan badge */}
              <div className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-[#E8F4F5] sm:flex">
                {card.icon}
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0F2422] sm:text-base lg:text-lg">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#5A7371] sm:text-sm">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
