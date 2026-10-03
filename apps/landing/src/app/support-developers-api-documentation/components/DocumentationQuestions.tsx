"use client"
import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, ChevronRight, Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Which version am I reading?",
    answer:
      "You are viewing the latest active version of the documentation, updated in real-time alongside our core API releases.",
  },
  {
    question: "What does deprecated mean?",
    answer:
      "A deprecated feature or endpoint is marked for future removal. It remains functional for backward compatibility, but we recommend migrating to the newer alternative.",
  },
  {
    question: "Is the API down?",
    answer:
      "You can check real-time uptime, historical availability, and active incidents anytime on our official System Status page.",
  },
  {
    question: "Can I paste my keys into examples?",
    answer:
      "Never paste your live secret API keys into public code examples, repositories, or client-side code. Always use environment variables.",
  },
  {
    question: "Where do I get help with an integration?",
    answer:
      "Reach out to Developer Support through your dashboard or consult our community forums and error reference guides.",
  },
  {
    question: "Why are some sections missing?",
    answer:
      "Sections appear only when fully approved and officially supported. Unreleased or preview features are added incrementally.",
  },
];

export default function DocumentationQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-12">
        {/* Header Title */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#073B47] tracking-tight">
            Documentation questions
          </h2>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Image Card with Floating Button */}
          <div className="lg:col-span-5 relative w-full h-[360px] md:h-[420px] rounded-3xl overflow-hidden shadow-sm">
            <Image
              src="/api/12.png"
              alt="Stack of documents"
              fill
              className="object-cover object-center"
            />
            {/* Floating Action Box */}
            <div className="absolute bottom-6 left-6 right-6 bg-white backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-[#0A5C6F]" />
                </div>
                <span className="text-xs font-bold text-[#111827]">
                  Open the reference
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Right Side: Accordion Questions & Answers */}
          <div className="lg:col-span-7 flex flex-col border-t border-gray-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-gray-200 flex flex-col transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full py-5 flex items-center justify-between text-left gap-4 group cursor-pointer"
                  >
                    <span className="text-sm md:text-base font-bold text-[#073B47] group-hover:text-[#0A5C6F] transition-colors">
                      {faq.question}
                    </span>
                    <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center shrink-0 text-gray-500 group-hover:border-gray-300 transition-colors">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pb-5 pr-12 text-xs md:text-sm text-gray-600 font-normal leading-relaxed animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
