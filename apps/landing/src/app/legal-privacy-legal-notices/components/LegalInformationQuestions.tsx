"use client"
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "operates",
    question: "Who operates Zoiko Social?",
    answer:
      "Zoiko Social is operated by Zoiko Media Corp., registered in Delaware, USA.",
  },
  {
    id: "copyright",
    question: "How do I report copyright infringement?",
    answer:
      "You can submit an IP notice using the copyright infringement form provided in our intellectual property complaints section.",
  },
  {
    id: "logo",
    question: "Can I use the Zoiko Social logo?",
    answer:
      "Logo and brand misuse notices can be submitted through our brand misuse reporting form. Unauthorized commercial use is strictly prohibited.",
  },
  {
    id: "privacy",
    question: "Where do I send a privacy request?",
    answer:
      "Privacy requests can be submitted via our Privacy Rights portal or by reaching out to our data protection team directly.",
  },
  {
    id: "legal-documents",
    question: "Does contacting Legal count as serving legal documents?",
    answer:
      "No. Emailing Legal or using online contact forms does not substitute for proper service of process, which must be served to our registered agent.",
  },
  {
    id: "open-source",
    question: "Where are open-source licenses listed?",
    answer:
      "All third-party open-source software packages and their respective licenses are listed in our Open-source and software notices section.",
  },
];

export default function LegalInformationQuestions() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-4xl flex flex-col items-center gap-10">
        {/* Header Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight text-center">
          Legal information questions
        </h2>

        {/* FAQ Accordion List */}
        <div className="w-full flex flex-col gap-4">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-sm md:text-base font-bold text-[#111827]">
                    {item.question}
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] shrink-0">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-gray-600 font-normal leading-relaxed border-t border-gray-100">
                    {item.answer}
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
