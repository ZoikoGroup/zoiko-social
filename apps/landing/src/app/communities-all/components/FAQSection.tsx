import React from "react";

export default function FAQSection() {
  const faqs = [
    "What is All Communities?",
    "How do I find a community for a specific animal?",
    "Can I find rescue and adoption communities?",
    "Are there communities for training and animal behavior?",
    "Are there communities run by professionals?",
    "How can I understand a community before joining?",
    "What if I cannot find the right community?",
  ];

  return (
    <section className="w-full max-w-[1232px] mx-auto pt-4 pb-14 flex flex-col justify-start items-start gap-3">
      {/* Header */}
      <div className="w-full pb-2.5 flex flex-col justify-start items-start">
        <h2 className="text-cyan-900 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
          Frequently asked questions
        </h2>
      </div>

      {/* FAQ Accordion List */}
      <div className="w-full flex flex-col gap-2.5">
        {faqs.map((question, index) => (
          <button
            key={index}
            type="button"
            className="w-full px-5 py-4 bg-white rounded-2xl border border-gray-200 hover:border-cyan-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all flex justify-between items-center text-left group"
          >
            <span className="text-cyan-900 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5 pr-4">
              {question}
            </span>

            {/* Plus Icon */}
            <span className="text-cyan-600 group-hover:text-cyan-700 text-2xl font-normal font-['Plus_Jakarta_Sans'] leading-none flex-shrink-0 transition-colors">
              +
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
