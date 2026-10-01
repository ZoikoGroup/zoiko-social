"use client"
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "How do I get a copy of my data?",
    answer:
      "You can start a privacy request selecting 'Access my information'. Once your identity is confirmed, your export will be prepared and made available for secure download.[cite: 10, 12, 14]",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Submit a privacy request choosing 'Delete my information'. We will delete your account, profile, posts, media, and qualifying personal data, retaining only what the law or safety records require.[cite: 11]",
  },
  {
    question: "How long will my request take?",
    answer:
      "Timelines vary depending on your regional rule and the scope of your request. A due date will be specified in your tracking dashboard once submitted.[cite: 10]",
  },
  {
    question: "Why do you need to confirm my identity?",
    answer:
      "We confirm your identity to prevent unauthorized access or disclosure of your personal data. The verification level matches your request type—ranging from standard sign-in to additional verification for sensitive data.[cite: 9, 14]",
  },
  {
    question: "Can someone make a request for me?",
    answer:
      "Yes, where permitted, you can act through an authorized agent, as a parent or guardian for a child's account, or as an organization representative.[cite: 13]",
  },
  {
    question: "What if I disagree with the outcome?",
    answer:
      "Where a review is available for your region, you can request a review directly from your request tracking page.[cite: 14]",
  },
];

export default function FrequentlyAskedQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        {/* Header Title */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <span className="text-sm md:text-base font-bold text-[#111827]">
                    {faq.question}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] shrink-0">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-gray-600 font-normal leading-relaxed border-t border-gray-100">
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
