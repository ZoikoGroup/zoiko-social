"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Terminal, ChevronRight, Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Where is the API documentation?",
    answer:
      "You can find our comprehensive API reference, endpoint guides, and code examples in the API Documentation section of our main menu.",
  },
  {
    question: "Is the API down?",
    answer:
      "Check our live System Status page for real-time uptime metrics, historical status, and active incident updates.",
  },
  {
    question: "Can I send API keys or tokens to support?",
    answer:
      "Never send API keys, passwords, or tokens. Support team members never require your credentials to resolve issues.",
  },
  {
    question: "How quickly will I hear back?",
    answer:
      "Standard developer support requests typically receive a response within 24 hours, while high-priority or urgent issues are routed based on your tier.",
  },
  {
    question: "Do I need a special account to get help?",
    answer:
      "Any registered developer can submit a support request. Certain dedicated implementation routes require an approved plan.",
  },
  {
    question: "What if my question isn't about code?",
    answer:
      "For account, billing, or general product questions, please visit our Help Center or contact our general support team.",
  },
];

export default function DeveloperSupportQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-12">
        {/* Header Title */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Developer support questions
          </h2>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Image Card with Floating Button */}
          <div className="lg:col-span-5 relative w-full h-[360px] md:h-[420px] rounded-3xl overflow-hidden shadow-sm">
            <Image
              src="/developer/img9.png"
              alt="Developers collaborating"
              fill
              className="object-cover object-center"
            />
            {/* Floating Action Box */}
            <div className="absolute bottom-6 left-6 right-6 bg-white backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  <Terminal className="w-4 h-4 text-[#0A5C6F]" />
                </div>
                <span className="text-xs font-bold text-[#111827]">
                  Start a support request
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
                    <span className="text-sm md:text-base font-bold text-[#111827] group-hover:text-[#0A5C6F] transition-colors">
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
                    <div className="pb-5 pr-12 text-xs md:text-sm text-gray-600 font-normal leading-relaxed">
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
