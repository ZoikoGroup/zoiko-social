"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Why was my campaign not approved?",
    answer:
      "Every unapproved ad links directly to a specific rule in our Advertising Standards (e.g., prohibited claims, unauthorized live animal sales, or unverified veterinary claims). You will receive an explainable decision notice citing the exact rule and whether the campaign can be modified for resubmission.",
  },
  {
    question: "How long does review take?",
    answer:
      "Most standard campaigns are reviewed within 24 to 48 hours. Complex submissions requiring specialist review (such as clinical claims, pharmaceuticals, animal transport, or charitable fundraisers) may take slightly longer. Your Ads Manager dashboard always shows the real-time status.",
  },
  {
    question: "Can I fix my campaign and try again?",
    answer:
      "Yes. If the status is 'Changes required', you will see the exact fields that need updating. Modifying and saving your campaign automatically generates a new version (e.g., Version 2) and sends it directly back into the review queue.",
  },
  {
    question: "What does Restricted mean?",
    answer:
      "Restricted campaigns are cleared to run only under specific safeguards—such as geographic restrictions (e.g., United States only), age gating (e.g., 18+), mandatory policy terms disclosures, or vetted landing pages. You must review and accept the conditions before the campaign can launch.",
  },
  {
    question: "Can Sales or a bigger budget change the decision?",
    answer:
      "Never. Zoiko Social operates with an unwavering animal welfare and safety firewall. Ad review decisions are strictly policy-based. Commercial spend, advertising budgets, or sales contacts cannot override our standards or expedite approvals.",
  },
  {
    question: "Why was an approved campaign paused?",
    answer:
      "Approved campaigns can be rechecked after launch if critical parameters change—such as modifying the live creative, changing the destination URL, or if your organization verification expires. In addition, urgent animal welfare or community safety signals can pause ad delivery immediately.",
  },
];

export default function CookieQuestionsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em]">
            Cookie questions
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-[16px] bg-white border border-[#DCE5E8] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-5 sm:px-6 py-4.5 sm:py-5 flex items-center justify-between gap-4 text-left transition-colors hover:bg-[#F7F9FA]/60"
                >
                  <span className="font-jakarta font-bold text-[15px] sm:text-[16px] text-[#073B47] leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 transition-transform ${
                      isOpen
                        ? "bg-[#066879] text-white rotate-180"
                        : "bg-[#EEF8F9] text-[#066879]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-[#F0F4F6] text-[13.5px] sm:text-[14px] leading-relaxed font-jakarta text-[#5E7076]">
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
