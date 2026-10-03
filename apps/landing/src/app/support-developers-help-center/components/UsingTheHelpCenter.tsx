"use client"
import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, Plus, Minus, ChevronRight } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How do I find the right article?",
    answer:
      "You can use the search bar at the top of the Help Center to look up keywords, or browse through our categorized topics on the homepage to find step-by-step guides.",
  },
  {
    question: "What if search finds nothing?",
    answer:
      "If your search yields no results, try using broader keywords or head over to our Community Forums to ask other members for assistance.",
  },
  {
    question: "Is Zoiko Social down?",
    answer:
      "You can check the live system status and real-time maintenance updates on our dedicated System Status page.",
  },
  {
    question: "Where do I get accessibility help?",
    answer:
      "Visit our Accessibility Support section to find specialist resources and guides tailored for using Zoiko Social your way.",
  },
  {
    question: "Where are the API docs?",
    answer:
      "Technical documentation, endpoints, and developer guides can be found under the Developer and API sections of our site.",
  },
  {
    question: "Are forum answers official?",
    answer:
      "Community forum answers are provided by fellow members and are not official support team responses.",
  },
];

export default function UsingTheHelpCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-start justify-between gap-12">
        {/* Left Side: Title & Image Card */}
        <div className="w-full lg:w-5/12 flex flex-col items-start">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight mb-8">
            Using the Help Center
          </h2>

          <div className="relative w-full h-[380px] rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-4">
            <div className="absolute inset-0 z-0">
              <Image
                src="/help/14.png"
                alt="Cat using help center"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Floating Banner inside Image */}
            <a
              href="/support-developers-contact-us"
              className="relative z-10 bg-white backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] text-[#0A5C6F] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#111827]">
                  Still stuck? Contact support
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-[#0A5C6F] group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>

        {/* Right Side: FAQ Accordion */}
        <div className="w-full lg:w-7/12 flex flex-col divide-y divide-gray-100">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left py-2 group focus:outline-none"
                >
                  <span className="text-base font-bold text-[#111827] group-hover:text-[#0A5C6F] transition-colors">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-[#0A5C6F] group-hover:text-[#0A5C6F] transition-all shrink-0 ml-4">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="mt-2 pr-12 text-sm text-gray-600 font-normal leading-relaxed">
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
