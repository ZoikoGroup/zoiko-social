"use client"
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Do I own what I post?",
    answer:
      "Yes, you retain ownership of all original content, media, and text you post on Zoiko Social. However, you grant us a worldwide, non-exclusive license to host, display, and distribute your content as necessary to provide the service.",
  },
  {
    question: "How old do I need to be?",
    answer:
      "You must be at least 13 years old (or the minimum legal age required in your country of residence) to create an account and use Zoiko Social.",
  },
  {
    question: "Can my account be suspended?",
    answer:
      "Yes, accounts can be temporarily suspended or permanently terminated if they violate our Community Standards, Terms of Service, or engage in fraudulent or harmful activities.",
  },
  {
    question: "How will I know if the Terms change?",
    answer:
      "We notify users of any material changes via email, dashboard announcements, or prominent banners on our platform prior to the updated terms taking effect.",
  },
  {
    question: "Which law applies?",
    answer:
      "These Terms are governed by and construed in accordance with applicable regional and corporate jurisdiction laws as outlined in our legal notices and regional terms.",
  },
  {
    question: "How do I close my account?",
    answer:
      "You can permanently close and delete your account at any time through your account settings or privacy preferences panel.",
  },
];

export default function TermsOfServiceFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-5xl flex flex-col items-center gap-10">
        {/* Header Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight text-center">
          Frequently asked questions
        </h2>

        {/* FAQ Accordion List */}
        <div className="w-full flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 flex items-center justify-between text-left gap-4 cursor-pointer group"
                >
                  <span className="text-sm md:text-base font-bold text-[#111827]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? "bg-[#0A5C6F] text-white"
                        : "bg-[#F0F9FA] text-[#0A5C6F] border border-[#E0F2F4]"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-xs md:text-sm text-gray-600 font-normal leading-relaxed border-t border-gray-100 mt-2">
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
