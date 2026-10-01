import React from "react";
import {
  AlertTriangle,
  Search,
  Terminal,
  Activity,
  MessageSquare,
} from "lucide-react";

interface StepItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  isHighlighted?: boolean;
}

const steps: StepItem[] = [
  {
    title: "Read the error",
    description: "Code and message",
    icon: <AlertTriangle className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Look it up",
    description: "In the error reference",
    icon: <Search className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Apply the fix",
    description: "Documented recovery",
    icon: <Terminal className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Check status",
    description: "Rule out an incident",
    icon: <Activity className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Ask for help",
    description: "Developer Support",
    icon: <MessageSquare className="w-4 h-4 text-white" />,
    isHighlighted: true,
  },
];

export default function WhenARequestFails() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            When a request fails
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Follow the error to the fix.
          </p>
        </div>

        {/* Horizontal Steps Container Card */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-start relative group"
              >
                {/* Connecting Dotted Line (hidden on mobile and after last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-12 right-[-50%] border-t-2 border-dashed border-gray-200 z-0" />
                )}

                {/* Icon Container */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-4 transition-colors ${
                    step.isHighlighted
                      ? "bg-[#0A5C6F] text-white shadow-md"
                      : "bg-[#F0F9FA] border border-[#E0F2F4] text-[#0A5C6F]"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1 z-10">
                  <h3 className="text-sm font-bold text-[#111827]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-normal leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
