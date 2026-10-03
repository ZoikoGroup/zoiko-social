"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Who can advertise on Zoiko Social?",
    answer:
      "Verified organizations, businesses, and professionals whose offerings align with the care, welfare, and enjoyment of animals. Advertisers must complete Professional or Organization Verification before campaigns can run.",
  },
  {
    question: "Can I advertise animals for sale?",
    answer:
      "No. Live animal sales, shipping, or trading are strictly prohibited across all advertising placements. Adoption is facilitated exclusively through verified rescue organizations within our dedicated Adopt network.",
  },
  {
    question: "Do I need to be verified?",
    answer:
      "Yes. Every advertiser must complete Professional Verification or Organization Verification to confirm identity, licensing, and legitimacy before their ads can be reviewed or launched.",
  },
  {
    question: "Can ads help my adoption listings rank higher?",
    answer:
      "No. Our welfare firewall strictly separates paid advertising from adoption listings. Paid campaigns can raise awareness of verified rescue events, but commercial spend can never buy or influence adoption ranking or algorithms.",
  },
  {
    question: "Is the quick check an approval?",
    answer:
      "No. The quick policy check provides fast, automated guidance to help you prepare your campaign. Every submitted campaign still undergoes formal Campaign Review by our review team before going live.",
  },
  {
    question: "What if my ad is rejected?",
    answer:
      "You will receive a clear decision notice citing the specific section of these standards. You may address the issues and resubmit, or request one reconsideration by an independent reviewer.",
  },
];

export default function CookieQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-10 sm:py-16 lg:py-24 border-b border-[#DCE5E8]">
      <div className="max-w-[840px] mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] leading-[1.2] font-extrabold text-[#073B47] tracking-[-0.01em] font-['Plus_Jakarta_Sans',sans-serif]">
            Cookie questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="border-t border-[#DCE5E8] divide-y divide-[#DCE5E8]">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-[17px] font-bold text-[#073B47] group-hover:text-[#066879] transition-colors font-['Plus_Jakarta_Sans',sans-serif]">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F7F9FA] flex items-center justify-center flex-shrink-0 text-[#073B47] group-hover:bg-[#EEF8F9] transition-colors">
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 pr-8 text-sm sm:text-[15px] leading-[24px] text-[#5E7076] font-normal font-['Plus_Jakarta_Sans',sans-serif]">
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
