"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { C } from "./theme";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Does verification cost anything?",
    answer:
      "No. Verification on Zoiko Social is completely free to apply for and maintain. There are no application fees, review charges, or recurring maintenance fees. Payment never buys verification, and verification is never bundled with paid promotion.",
  },
  {
    question: "How long does it take?",
    answer:
      "Most straightforward professional applications are reviewed within 2 to 5 business days once all required evidence is submitted. Organization reviews may take 5 to 7 business days if registry checks or secondary authorization are needed.",
  },
  {
    question: "What evidence do I need?",
    answer:
      "For professionals: government-issued photo ID, state or national professional license/registration, and proof of practice or active service. For organizations: entity registration documents, proof of signing authority, official domain verification, and applicable welfare permits for rescues/shelters.",
  },
  {
    question: "Who can see my documents?",
    answer:
      "Nobody outside our dedicated verification compliance team. Your uploaded licenses, ID photos, and official filings are encrypted and stored in secure isolation. Only your public badge, category, and verification date appear on your profile.",
  },
  {
    question: "Does verification rank me higher?",
    answer:
      "No. Verification confirms identity and credentials; it does not inflate search ranking, boost feed visibility, or confer algorithmic favoritism over unverified accounts. Quality, transparency, and community safety come first.",
  },
  {
    question: "What if I'm not verified?",
    answer:
      "Unverified professionals and community members can still participate actively on Zoiko Social. However, specific trust-sensitive features (such as listing animal adoptions or advertising clinical veterinary services) require verification to protect community welfare.",
  },
];

export default function VerificationFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[36px] lg:text-[40px] leading-[1.15] tracking-[-0.01em]"
            style={{ color: C.tarawera }}
          >
            Cookie questions
          </h2>
        </div>

        {/* Accordion Container (max-w 800px) */}
        <div className="max-w-[800px] mx-auto flex flex-col divide-y divide-gray-200 border-y border-gray-200">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.question} className="py-4.5 sm:py-6">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 text-left cursor-pointer group"
                >
                  <span
                    className="font-jakarta font-bold text-[15px] sm:text-[17px] leading-[1.4] transition-colors"
                    style={{ color: isOpen ? C.mosque : C.tarawera }}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#EEF8F9] text-[#066879]" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 sm:pt-3.5 pr-0 sm:pr-8 text-[13.5px] sm:text-[15px] leading-[1.6] text-gray-600 font-jakarta">
                    <p>{faq.answer}</p>
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
