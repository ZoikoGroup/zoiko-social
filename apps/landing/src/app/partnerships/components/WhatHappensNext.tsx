import React from "react";

interface StepItem {
  step: string;
  title: string;
  description: string;
}

const nextSteps: StepItem[] = [
  {
    step: "1",
    title: "Review",
    description:
      "Our partnerships team reviews your inquiry (1–2 weeks) and assesses alignment with our mission and capabilities.",
  },
  {
    step: "2",
    title: "Qualification",
    description:
      "If fit looks promising, we reach out to discuss your proposal and ask clarifying questions about your organization.",
  },
  {
    step: "3",
    title: "Next Steps",
    description:
      "We outline options: scoping a pilot, drafting terms, or determining that partnership isn't the right fit right now.",
  },
];

export default function WhatHappensNext() {
  return (
    <div className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37] flex items-center justify-center">
      <div className="max-w-7xl w-full">
        {/* Outer Container Card with Light Teal Background */}
        <div className="bg-[#F0F7F8]/60 rounded-3xl p-6 md:p-10 shadow-sm border border-[#066879]/30 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold text-[#1a2d37] tracking-tight">
              What happens next?
            </h1>
            <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
              Your inquiry goes through a structured review process designed to
              ensure good partnership fit and alignment.
            </p>
          </div>

          {/* 3 Inner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextSteps.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#DCE5E8] flex flex-col justify-between space-y-4 text-center"
              >
                <div className="space-y-3">
                  {/* Step Title with Number */}
                  <div className="flex items-center justify-center space-x-1.5 font-bold text-sm md:text-base text-[#D97706]">
                    <span>{item.step}</span>
                    <span className="text-[#1a2d37]">{item.title}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
