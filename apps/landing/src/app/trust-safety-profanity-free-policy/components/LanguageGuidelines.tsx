"use client";

import { useState } from "react";

interface GuidelineItem {
  title: string;
  description: string;
}

const GUIDELINES: GuidelineItem[] = [
  {
    title: "Profanity & Strong Language",
    description:
      "Casual profanity used among consenting adult peers without hostility may be allowed in designated spaces, but abusive, gratuitous, or threatening swearing is filtered.",
  },
  {
    title: "Hate Speech & Harassment",
    description:
      "Zero tolerance for slurs, derogatory epithets, dehumanizing speech, or targeted attacks directed at individuals or protected groups.",
  },
  {
    title: "Quoting & References",
    description:
      "Direct quotes from literature, historical archives, legal filings, or news reporting containing sensitive terms are permitted when used for educational or discussion purposes.",
  },
  {
    title: "Sarcasm & Banter",
    description:
      "Playful teasing and colloquial banter between friends is understood through relationship context, while bad-faith mockery and bullying are prohibited.",
  },
  {
    title: "Special Contexts: Medical, Legal, Academic",
    description:
      "Clinical, anatomical, legal, and academic discussions receive specialized moderation review to ensure necessary professional dialogue is never silenced.",
  },
];

export default function LanguageGuidelines() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full bg-white py-12 sm:hidden">
      <div className="mx-auto max-w-[840px] px-5">
        <h2 className="text-left text-[26px] font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Language Guidelines
        </h2>

        <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-3.5">
          {GUIDELINES.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.title}
                className="overflow-hidden rounded-2xl border border-gray-100/90 bg-[#F8FAFA] shadow-sm transition hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition sm:px-6 sm:py-4"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-[9px] text-[#1E293B] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                  <span className="text-xs font-bold text-[#0F2422] sm:text-sm">
                    {item.title}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-3 text-xs leading-relaxed text-[#5A7371] sm:px-6 sm:pb-5 sm:pt-3 sm:text-sm">
                    {item.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
