import React from "react";
import Image from "next/image";

interface Step {
  step: string;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    step: "Step 1",
    title: "Choose plan",
    description:
      "Compare options, review coverage, select your plan. Takes 30-60 minutes.",
    icon: "/market/6.png",
  },
  {
    step: "Step 2",
    title: "Complete application",
    description:
      "Provide personal and health information. Online or paper form available.",
    icon: "/market/7.png",
  },
  {
    step: "Step 3",
    title: "Review & approval",
    description:
      "Insurance reviews application. Typically approved within 5-10 business days.",
    icon: "/market/8.png",
  },
  {
    step: "Step 4",
    title: "Coverage begins",
    description: "Receive insurance card. Start using benefits immediately.",
    icon: "/market/9.png",
  },
];

export default function ApplyingForInsurance() {
  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-12 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Applying for insurance
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            The process is straightforward. Here&apos;s what to expect from
            start to approval.
          </p>
        </div>

        {/* Hero Image Container */}
        <div className="w-full relative overflow-hidden rounded-3xl">
          <Image
            src="/market/5.png"
            alt="Applying for health insurance paperwork"
            width={1400}
            height={500}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {steps.map((item, index) => (
            <div
              key={index}
              className="p-6 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full border-2 border-[#066879] bg-[#EEF8F9] flex items-center justify-center p-3 relative">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#066879] tracking-wider uppercase">
                  {item.step}: {item.title}
                </div>
                <p className="text-[#5a6e75] text-xs leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Open Enrollment Period Banner */}
        <div className="bg-[#EEF8F9] border-l-4 border-[#066879] rounded-2xl p-6 space-y-1">
          <h3 className="text-sm font-bold text-[#1a2d37]">
            Open Enrollment Period
          </h3>
          <p className="text-xs text-[#5a6e75] leading-relaxed">
            If you&apos;re getting insurance through an employer, you can
            typically change plans during open enrollment (usually Oct-Dec). If
            you&apos;re self-purchasing, you can apply anytime, with coverage
            beginning the following month.
          </p>
        </div>
      </div>
    </div>
  );
}
