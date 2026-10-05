"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { C } from "./theme";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How much does advertising cost?",
    answer:
      "You stay in full control of your spending. You can set a daily budget or lifetime campaign budget with an optional spend cap. Advertising runs on an auction model based on your objective (e.g. impressions or link clicks), and all taxes and fees are calculated upfront before launch.",
  },
  {
    id: "faq-2",
    question: "Who can advertise?",
    answer:
      "Advertising is open to verified animal-aligned professionals (such as veterinarians, trainers, groomers, boarders) and verified organizations (such as shelters, rescues, welfare charities, and commercial pet brands). Advertisers must complete verification before running campaigns.",
  },
  {
    id: "faq-3",
    question: "Do I need to be verified?",
    answer:
      "Yes. Every advertiser must complete Professional Verification or Organization Verification to verify credentials, licenses, and business legitimacy before campaigns can be submitted for review. Verification is completely free and separate from ad spend.",
  },
  {
    id: "faq-4",
    question: "How are ads labeled?",
    answer:
      "All paid content is clearly marked with a prominent 'Sponsored' label, the advertiser's verified business name, and an informational trigger explaining who paid for the placement. Ads never mimic organic posts or verified news.",
  },
  {
    id: "faq-5",
    question: "Can I see who clicked my ad?",
    answer:
      "No. To protect user privacy and comply with global safety standards, reporting provides only aggregate, non-personal metrics such as total reach, impressions, click counts, and placement distribution. You will never receive individual tracking or personal data.",
  },
  {
    id: "faq-6",
    question: "Will advertising improve my Directory or adoption ranking?",
    answer:
      "Never. Commercial spend can never influence or purchase ranking in the Professional Directory, verified animal welfare news, or adoption listings. Our welfare firewall strictly insulates algorithmic trust and safety decisions from advertising spend.",
  },
];

export default function AdvertisingFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px] border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[840px]">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em]"
            style={{ color: C.tarawera }}
          >
            Cookie questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col border-t border-[#DCE5E8]">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="border-b border-[#DCE5E8] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full py-5 sm:py-6 flex items-center justify-between gap-4 text-left cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="font-jakarta font-bold text-[16px] sm:text-[17px] text-[#073B47] group-hover:text-[#066879] transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#066879] text-white rotate-180"
                        : "bg-[#EEF8F9] text-[#066879]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pb-6 pr-6">
                    <p className="font-jakarta text-[14.5px] sm:text-[15px] leading-relaxed text-[#5E7076]">
                      {faq.answer}
                    </p>
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
