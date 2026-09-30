"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How does Zoiko Social keep animals safe?",
    answer:
      "We enforce strict zero-tolerance policies on animal cruelty, deploy AI to intercept harmful content before it spreads, and rely on certified veterinarians and animal welfare experts to review flagged media.",
  },
  {
    question: "What happens if I report harmful content?",
    answer:
      "Your report is immediately escalated to our 24/7 moderation queue. Our specialists review the content within 24 hours, take enforcement action if violations are found, and notify you of the outcome.",
  },
  {
    question: "Can I appeal a moderation decision?",
    answer:
      "Yes. Every member has the right to appeal any content removal or account restriction. Appeals are assigned to independent senior moderators with domain expertise for unbiased review.",
  },
  {
    question: "Are there special protections for young members?",
    answer:
      "Yes, under-18 members receive dedicated privacy safeguards, age-appropriate content filtering, restricted messaging defaults, and access to guided youth safety resources.",
  },
  {
    question: "How often does Zoiko publish safety reports?",
    answer:
      "We publish comprehensive transparency reports every month, documenting our enforcement volumes, response times, removal rates, and appeal outcomes to ensure full public accountability.",
  },
];

export default function AnimalWelfareFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full bg-[#F8FAFA] py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[840px] px-5 sm:px-6 lg:px-8">
        <h2 className="text-left text-[26px] font-bold tracking-tight text-[#0F2422] sm:text-center sm:text-3xl lg:text-[34px]">
          Frequently Asked <br className="sm:hidden" />Questions
        </h2>

        <div className="mt-8 space-y-3 sm:mt-12 sm:space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-sm border border-[#334155]/80 bg-[#EFEFEF] shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl sm:border-gray-200/80 sm:bg-white sm:shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between px-3 py-3 text-left transition sm:px-6 sm:py-5"
                  aria-expanded={isOpen}
                >
                  {/* Mobile Layout: Triangle ▼ on left, centered question */}
                  <div className="flex w-full items-center gap-2.5 sm:hidden">
                    <span
                      className={`text-[9px] text-[#1E293B] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                    <span className="flex-1 text-center text-xs font-bold leading-tight text-[#0F2422]">
                      {faq.question}
                    </span>
                  </div>

                  {/* Desktop Layout: Question on left, pale cyan badge on right */}
                  <span className="hidden text-sm font-semibold text-[#0F2422] sm:block sm:text-base">
                    {faq.question}
                  </span>

                  <div className="ml-4 hidden size-8 shrink-0 items-center justify-center rounded-full bg-[#E8F4F5] text-[#006D77] transition-transform duration-200 sm:flex">
                    <svg
                      className={`size-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-300/80 bg-white px-4 pb-4 pt-3 text-xs leading-relaxed text-[#5A7371] sm:border-gray-100 sm:px-6 sm:pb-6 sm:pt-4 sm:text-sm sm:leading-6">
                    {faq.answer}
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
