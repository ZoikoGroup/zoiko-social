"use client"
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What's the difference between insurance and a care plan?",
    answer:
      "Insurance is underwritten coverage designed to protect against unexpected veterinary accidents and illnesses. Care plans are wellness subscriptions that cover routine and preventive care, such as exams and vaccines. We keep them clearly distinct.",
  },
  {
    question: "Can I see the full plan terms here?",
    answer:
      "Yes, all material terms like waiting periods, exclusions, and benefit caps are provided upfront based on official sources. However, we always recommend reviewing the complete policy documents directly from the provider.",
  },
  {
    question: "Are these plans available in my state?",
    answer:
      "Plan availability depends on your specific location and jurisdiction. Use the location filter at the top of the comparison tool to view options supported in your area.",
  },
  {
    question: "Will my pet's pre-existing condition be covered?",
    answer:
      "Generally, pre-existing conditions are excluded from standard insurance coverage and care plans. Be sure to check individual provider terms for specific definitions and waiting periods.",
  },
  {
    question: "What if my claim is denied?",
    answer:
      "If your claim is denied, you have the right to appeal through the provider's official dispute process. Check your policy documents for the exact steps and timelines required to submit an appeal.",
  },
  {
    question: "How current is this pricing information?",
    answer:
      "All pricing and policy details are pulled directly from official source-governed data. Prices may vary based on your pet's age, breed, and location, and are updated regularly to reflect current offerings.",
  },
];

export default function FrequentlyAskedQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Frequently asked questions
          </h1>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                onClick={() => toggleAccordion(index)}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#DCE5E8] cursor-pointer transition-colors hover:border-[#066879]/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-base font-semibold text-[#1a2d37]">
                    {item.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#EEF8F9] flex items-center justify-center text-[#066879] flex-shrink-0 ml-4">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-[#DCE5E8] text-xs md:text-sm text-[#5a6e75] leading-relaxed">
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
