"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What ads are removed by Ad-Free Feed?",
    answer:
      "Ad-Free Feed removes approved advertising placements from your feed. This creates a more continuous browsing experience while allowing organic posts and community content to remain visible.",
  },
  {
    question: "Does Ad-Free Feed change my privacy?",
    answer:
      "No. Ad-Free Feed does not change your privacy settings or data handling. Your existing privacy controls, safety features, and community protections remain the same.",
  },
  {
    question: "Are organic posts and sponsored content still visible?",
    answer:
      "Yes. Organic posts from people and communities you follow continue to appear normally. Sponsored or promotional content created organically by communities may also remain visible because Ad-Free Feed only removes approved advertising placements.",
  },
  {
    question: "What happens if my Premium subscription ends?",
    answer:
      "When your Premium subscription ends, the Ad-Free Feed benefit will no longer apply to your account. Your feed, privacy settings, community access, and other standard features continue to work normally.",
  },
  {
    question: "Is Ad-Free Feed available everywhere?",
    answer:
      "Availability may depend on your account, Premium plan, platform, and region. Sign in to check whether Ad-Free Feed is currently available for your account.",
  },
];

export default function AdFreeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 py-10 sm:px-8 md:px-10">
        
        {/* Heading */}
        <div className="flex w-full flex-col items-center">
          <h2
            className="w-full text-center font-['Plus_Jakarta_Sans'] text-2xl font-extrabold leading-9 sm:text-3xl sm:leading-[51.2px]"
            style={{ color: "#102F38" }}
          >
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="flex w-full max-w-[800px] flex-col items-start">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="flex w-full flex-col items-start py-2"
              >
                <div
                  className="w-full overflow-hidden rounded-2xl bg-white"
                  style={{
                    border: "1px solid #D6E3E6",
                  }}
                >
                  {/* Question */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="flex min-h-16 w-full items-center justify-between px-5 text-left sm:px-6"
                  >
                    <span
                      className="pr-4 font-['Plus_Jakarta_Sans'] text-sm font-bold leading-6 sm:text-base"
                      style={{ color: "#102F38" }}
                    >
                      {faq.question}
                    </span>

                    {/* Icon */}
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#F5F7F7" }}
                    >
                      {isOpen ? (
                        <Minus
                          size={14}
                          strokeWidth={1.5}
                          style={{ color: "#102F38" }}
                        />
                      ) : (
                        <Plus
                          size={14}
                          strokeWidth={1.5}
                          style={{ color: "#102F38" }}
                        />
                      )}
                    </span>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div
                      className="px-5 pb-5 pt-0 sm:px-6"
                      style={{
                        borderTop: "1px solid #EEF3F4",
                      }}
                    >
                      <p
                        className="pt-4 font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6"
                        style={{ color: "#607780" }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}