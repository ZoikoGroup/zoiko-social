"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "What organizations does Zoiko Social partner with?",
    answer:
      "We partner with animal rescue organizations, shelters, welfare groups, research institutions, corporate partners, tech platforms, and content creators aligned with our mission and community values.",
  },
  {
    question: "How long does the partnership review process take?",
    answer:
      "The initial review process typically takes between 1 to 2 weeks, during which our team assesses alignment across mission, compliance, and technical requirements.",
  },
  {
    question: "Do you charge for partnerships?",
    answer:
      "Partnership structures vary depending on the pathway (such as integration, content, or strategic alliances). Specific terms are discussed during the qualification and scoping stage.",
  },
  {
    question: "What's your data policy for partners?",
    answer:
      "Partner access to user data is strictly limited, contractually bound, and auditable. We do not sell user data and adhere strictly to privacy and compliance laws.",
  },
  {
    question: "What if my organization doesn't fit right now?",
    answer:
      "If it's not the right fit at this moment, we welcome you to reapply in the future as your organization evolves or as new partnership paths open up.",
  },
  {
    question: "Can we pilot a partnership before full commitment?",
    answer:
      "Yes, we frequently explore scoping a pilot phase during our terms discussion to ensure a strong mutual fit before moving into a long-term commitment.",
  },
];

export default function FrequentlyAskedQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37] flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-10">
        {/* Section Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Frequently asked questions
          </h1>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-[#DCE5E8] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-sm md:text-base font-semibold text-[#1a2d37]">
                    {item.question}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F0F7F8] flex items-center justify-center text-[#066879] flex-shrink-0 ml-4">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-0 text-xs md:text-sm text-[#5a6e75] leading-relaxed border-t border-[#F0F2F3] pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
