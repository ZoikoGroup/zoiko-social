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
    question: "How much does Zoiko Social cost for businesses?",
    answer:
      "Joining Zoiko Social and creating a standard professional or organization presence is free. Professional and organization verification is also 100% free to apply for and maintain. Paid options include self-serve or managed advertising campaigns, premium organization toolkits, multi-seat team workspaces, and custom enterprise rollouts.",
  },
  {
    question: "How soon will Sales reply?",
    answer:
      "Our commercial team reviews every inquiry individually and typically replies within 1 to 2 business days. If your request is better served by our Help Center, Verification portal, or Campaign Review team, we will route you to the fastest path immediately.",
  },
  {
    question: "Can I get a demo?",
    answer:
      "Yes. For multi-team organizations, rescue networks, veterinary hospital groups, agencies, and institutions considering managed rollouts, our team offers tailored live video walkthroughs of the Zoiko Social platform and administrative tools.",
  },
  {
    question: "Can Sales get my campaign approved?",
    answer:
      "No. All advertising campaigns are evaluated independently by our trust, safety, and welfare compliance teams under our public Advertising Standards. Sales representatives cannot alter, expedite, or override review decisions.",
  },
  {
    question: "Do I need to be an organization?",
    answer:
      "No. Independent verified professionals—such as solo veterinarians, certified trainers, animal behaviorists, pet sitters, and groomers—can work with Zoiko Social directly for advertising, Directory listings, and premium tools.",
  },
  {
    question: "Do you support procurement and security reviews?",
    answer:
      "Yes. For enterprise partners, municipal agencies, academic institutions, and national welfare organizations, we support standard security assessments, vendor onboarding, master service agreements, and consolidated invoicing.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading matching Figma */}
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em]"
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
                      isOpen
                        ? "rotate-180 bg-[#EEF8F9] text-[#066879]"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 sm:pt-3.5 pr-0 sm:pr-8 text-[13.5px] sm:text-[15px] leading-[1.6] text-[#5E7076] font-jakarta">
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
