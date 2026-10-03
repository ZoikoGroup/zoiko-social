"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "./directoryData";
import { C } from "./theme";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="w-full bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading */}
        <div className="text-center max-w-[780px] mx-auto mb-8 sm:mb-10 lg:mb-12">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Frequently asked questions
          </h2>
          <p
            className="font-jakarta font-normal text-[15px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Clear answers about directory listings, verification checks, and rankings.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-[800px] mx-auto divide-y divide-[#DCE5E8] border-y border-[#DCE5E8]">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 sm:py-5 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between gap-4 text-left group"
                >
                  <span
                    className="font-jakarta font-bold text-[16.5px] sm:text-[18px] leading-snug group-hover:text-[#066879] transition-colors"
                    style={{ color: isOpen ? C.mosque : C.tarawera }}
                  >
                    {item.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border border-[#DCE5E8] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#EEF8F9] text-[#066879]" : "bg-white text-[#8A9BA1]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 pr-8">
                    <p
                      className="font-jakarta text-[14.5px] sm:text-[15px] leading-relaxed"
                      style={{ color: C.nevada }}
                    >
                      {item.a}
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
