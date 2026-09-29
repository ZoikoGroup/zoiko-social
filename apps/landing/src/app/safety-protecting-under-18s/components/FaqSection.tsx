"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "What is the minimum age to use Zoiko Social?",
    answer:
      "Users must be at least 13 years old to create an account on Zoiko Social. For users aged 13–17, enhanced safety defaults, age-appropriate content filters, and stricter direct messaging limits are applied automatically.",
  },
  {
    question: "Can my parent/guardian see my account?",
    answer:
      "We offer optional parental guidance tools that can be linked with mutual consent. Parents or guardians can monitor safety settings, content filters, and screen time boundaries while respecting young people's private messaging confidentiality.",
  },
  {
    question: "What happens if I report someone?",
    answer:
      "When you file a report, our dedicated safety and moderation team reviews the flagged content or account within 24 hours. Reports are strictly anonymous, and we provide transparent follow-up notifications regarding the review outcome.",
  },
  {
    question: "What if I disagree with a moderation decision?",
    answer:
      "You always have the right to appeal any content removal or account restriction. Simply submit an appeal via your notification feed or settings, and a different trained human moderator will re-evaluate the case.",
  },
  {
    question: "Is my data safe on Zoiko Social?",
    answer:
      "Yes. We use industry-standard encryption and strict data minimization practices. We never sell personal information, browsing history, or private communications of under-18 members to advertisers or third parties.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full bg-[#F8FAFA] py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[840px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          <span className="sm:hidden">Common Questions</span>
          <span className="hidden sm:inline">Frequently asked questions</span>
        </h2>

        <div className="mt-8 space-y-3 sm:mt-12 sm:space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition sm:px-6 sm:py-5"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center">
                    {/* Mobile Left Orange Indicator */}
                    <span
                      className={`mr-3 inline-flex size-4 shrink-0 items-center justify-center text-[#EA8A1A] transition-transform duration-200 sm:hidden ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ▼
                    </span>

                    <span className="text-xs font-semibold text-[#0F2422] sm:text-base">
                      {faq.question}
                    </span>
                  </div>

                  {/* Desktop Right Circular Chevron */}
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
                  <div className="border-t border-gray-100 px-5 pb-5 pt-3.5 text-xs leading-relaxed text-[#5A7371] sm:px-6 sm:pb-6 sm:pt-4 sm:text-sm sm:leading-6">
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
