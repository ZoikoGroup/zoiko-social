import React from 'react';
import Image from 'next/image';

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const partnershipSteps: StepItem[] = [
  {
    number: "1",
    title: "Discovery & Inquiry",
    description: "You submit a partnership inquiry describing your organization, goals, and proposed collaboration area. We review for alignment with our mission and platforms.",
  },
  {
    number: "2",
    title: "Qualification Discussion",
    description: "Our partnerships team discusses your proposal, asks clarifying questions, and assesses fit across mission, compliance, and technical requirements.",
  },
  {
    number: "3",
    title: "Scope & Terms",
    description: "If fit is strong, we discuss partnership scope, technical requirements, data handling, and draft initial terms. You may propose refinements.",
  },
  {
    number: "4",
    title: "Agreement & Integration",
    description: "Once terms are approved by both parties, we execute partnership agreement and begin technical integration, access provisioning, or content collaboration.",
  },
  {
    number: "5",
    title: "Ongoing Partnership",
    description: "Regular check-ins, performance review, and adjustment of partnership scope based on results, platform evolution, and changing needs.",
  },
];

export default function HowPartnershipWorks() {
  return (
    <div className="w-full bg-white py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            How partnership works
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            A transparent, qualification-first process designed to ensure strong fits and successful partnerships.
          </p>
        </div>

        {/* Timeline List Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-[#DCE5E8] relative">
          
          {/* Vertical connecting line for steps */}
          <div className="absolute left-[39px] md:left-[55px] top-10 bottom-10 w-0.5 bg-[#066879]/2 -z-0 hidden sm:block" />

          <div className="space-y-10 relative z-10">
            {partnershipSteps.map((step, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                
                {/* Number Badge */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#066879] text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 shadow-sm">
                  {step.number}
                </div>

                {/* Title & Description */}
                <div className="space-y-1 pt-1">
                  <h2 className="text-base md:text-lg font-bold text-[#1a2d37]">
                    {step.title}
                  </h2>
                  <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
                    {step.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Bottom Image Card */}
        <div className="w-full h-[280px] md:h-[380px] relative rounded-3xl overflow-hidden">
          <Image
            src="/partnerships/11.png"
            alt="Partners shaking hands over a meeting table"
            fill
            className="object-cover"
            priority
          />
        </div>

      </div>
    </div>
  );
}