"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, BookOpen, ChevronRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How can I tell if a problem is on my side?",
    answer:
      "If our status page shows all services as operational and green, but you're still experiencing issues, try clearing your browser cache, checking your internet connection, or disabling browser extensions that might interfere with loading scripts.",
  },
  {
    question: "What does Unknown mean?",
    answer:
      "An 'Unknown' status indicates that our monitoring systems are temporarily unable to reach or verify the health metrics of a specific service. Our engineering team is automatically notified to investigate the telemetry gap.",
  },
  {
    question: "What if this page says status couldn't be verified?",
    answer:
      "This usually occurs during brief network partitions between our status provider and our core infrastructure. It typically resolves automatically within a few minutes once connectivity is restored.",
  },
  {
    question: "Why is there no estimated fix time?",
    answer:
      "For complex or unexpected incidents, our engineers prioritize resolving the root cause over estimating timelines. Once we have reliable telemetry and a clear remediation path, we update the incident with an ETA.",
  },
  {
    question: "What's the difference between an incident and maintenance?",
    answer:
      "An incident is an unplanned disruption or degradation of service. Maintenance refers to scheduled, proactive work designed to improve system performance, security, or reliability.",
  },
  {
    question: "How current is this information?",
    answer:
      "Our status page updates in real-time. Telemetry metrics and incident updates are pulled directly from our infrastructure monitoring systems every 30 seconds.",
  },
];

export default function QuestionsAboutThisPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-start justify-between gap-12">
        {/* Left Side: Title & Image Card */}
        <div className="w-full lg:w-5/12 flex flex-col items-start sticky top-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight mb-8">
            Questions about this page
          </h2>

          <div className="relative w-full h-[380px] rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-6">
            <div className="absolute inset-0 z-0">
              <Image
                src="/system/5.png"
                alt="Siberian Husky in nature"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Floating Card at Bottom */}
            <div className="relative z-10 bg-white backdrop-blur-md rounded-2xl p-3.5 shadow-md flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-[#0A5C6F]" />
                </div>
                <span className="text-xs font-bold text-[#111827]">
                  More answers in the Help Center
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0A5C6F]" />
            </div>
          </div>
        </div>

        {/* Right Side: Accordion FAQ List */}
        <div className="w-full lg:w-7/12 flex flex-col divide-y divide-gray-200 border-t border-b border-gray-200">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-5 flex flex-col transition-colors">
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                >
                  <span className="text-sm md:text-base font-bold text-[#111827] group-hover:text-[#0A5C6F] transition-colors">
                    {item.question}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 bg-white group-hover:border-[#0A5C6F] transition-colors">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#0A5C6F]" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#111827]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 pr-12 text-xs md:text-sm text-gray-600 leading-relaxed font-normal animate-fadeIn">
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
