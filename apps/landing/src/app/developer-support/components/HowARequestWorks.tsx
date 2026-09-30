import React from "react";
import { Layers, BookOpen, Edit2, Upload, Send } from "lucide-react";

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const steps: StepItem[] = [
  {
    number: "1",
    title: "Choose an issue",
    description: "What's going wrong",
    icon: <Layers className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    number: "2",
    title: "Check the docs",
    description: "Matched to your issue",
    icon: <BookOpen className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    number: "3",
    title: "Describe it",
    description: "Expected vs actual",
    icon: <Edit2 className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    number: "4",
    title: "Add evidence",
    description: "Redacted logs, optional",
    icon: <Upload className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    number: "5",
    title: "Review and send",
    description: "Get a reference",
    icon: <Send className="w-4 h-4 text-white" />,
    isActive: true,
  },
];

export default function HowARequestWorks() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            How a request works
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Five short steps. Your answers are kept if you go back.
          </p>
        </div>

        {/* Steps Container Card */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col gap-4 relative">
                {/* Connecting dashed line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-12 right-0 w-[calc(100%-3rem)] border-t border-dashed border-gray-200 z-0" />
                )}

                {/* Step Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm z-10 ${
                    step.isActive
                      ? "bg-[#0A5C6F] border-[#0A5C6F]"
                      : "bg-[#F0F9FA] border-[#E0F2F4]"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Step Text Info */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-[#111827]">
                    {step.title}
                  </span>
                  <span className="text-xs text-gray-500 font-normal leading-relaxed">
                    {step.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
