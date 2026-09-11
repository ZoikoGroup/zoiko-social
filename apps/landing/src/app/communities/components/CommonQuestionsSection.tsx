"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "1",
    question: "How do I find animal communities?",
    answer:
      "You can browse communities by species, purpose collections, or filter by your region to discover local groups tailored to your specific interests.",
  },
  {
    id: "2",
    question: "Are communities moderated?",
    answer:
      "Yes, confirmed moderation coverage ensures all discussions remain respectful, safe, and focused on animal welfare standards.",
  },
  {
    id: "3",
    question: "Can I find local animal groups?",
    answer:
      "Absoluely! Use the region selector in the Local Communities section to view volunteer groups, rescue efforts, and events happening near you.",
  },
  {
    id: "4",
    question: "How do I create a community?",
    answer:
      "Click the 'Create a Community' button in the Trust & Safety section. Fill in your community details, rules, and purpose. High-risk categories may undergo a brief review before going public.",
  },
  {
    id: "5",
    question: 'What does "Verified Community" mean?',
    answer:
      "A Verified Community badge indicates that the leadership and credentials have been manually confirmed by our team against official verification records.",
  },
];

export default function CommonQuestionsSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-12 md:py-16 text-[#0B2E2E]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Section Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2E2E] tracking-tight mb-8 text-center">
          Common questions
        </h2>

        {/* Accordion List */}
        <div className="w-full flex flex-col gap-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="w-full bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-[#0B2E2E]">
                    {faq.question}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#E6F0F2] flex items-center justify-center shrink-0 ml-3">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 text-[#0B5C66]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#0B5C66]" />
                    )}
                  </div>
                </button>

                {/* Collapsible Answer */}
                {isOpen && (
                  <div className="px-5 pb-4 pt-0 text-xs sm:text-sm text-[#5B7171] leading-relaxed border-t border-[#F1F5F9]">
                    <p className="pt-3">{faq.answer}</p>
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
