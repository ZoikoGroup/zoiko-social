"use client"
import React, { useState } from "react";
import {
  Lock,
  AlertTriangle,
  Bell,
  Activity,
  Terminal,
  HelpCircle,
  ChevronRight,
  Check,
} from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface IssueOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { number: 1, title: "Choose an issue" },
  { number: 2, title: "Check the docs" },
  { number: 3, title: "Describe it" },
  { number: 4, title: "Add evidence" },
  { number: 5, title: "Review and send" },
];

const issueOptions: IssueOption[] = [
  {
    id: "access",
    title: "Access and permissions",
    description: "Your app can&apos;t sign in or is refused access.",
    icon: <Lock className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "errors",
    title: "Errors and responses",
    description: "Requests fail or return something unexpected.",
    icon: <AlertTriangle className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "events",
    title: "Event delivery",
    description: "Events arrive late, twice, or not at all.",
    icon: <Bell className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "usage",
    title: "Usage and limits",
    description: "You&apos;re hitting a usage limit you didn&apos;t expect.",
    icon: <Activity className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "integration",
    title: "Integration setup",
    description: "Getting a new integration working for the first time.",
    icon: <Terminal className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "other",
    title: "Something else",
    description: "None of these fit. The team will route it.",
    icon: <HelpCircle className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function RequestDeveloperHelp() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedIssue, setSelectedIssue] = useState<string>("access");

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Request developer help
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Share only what&apos;s needed to reproduce the issue.
          </p>
        </div>

        {/* Main Content Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Wizard Steps Navigation */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = step.number < currentStep;

              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-colors text-left ${
                    isActive
                      ? "bg-[#F0F9FA] text-[#0A5C6F] font-bold"
                      : "text-gray-600 hover:bg-gray-50 font-medium"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isActive
                        ? "bg-[#0A5C6F] text-white"
                        : isCompleted
                          ? "bg-[#0A5C6F] text-white"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs md:text-sm">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Step 1 Content Panel */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-10 flex flex-col justify-between min-h-[500px]">
            <div className="flex flex-col gap-6">
              {/* Step Heading */}
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-[#111827]">
                  What&apos;s going wrong?
                </h3>
                <p className="text-xs md:text-sm text-gray-500 font-normal">
                  Pick the closest match.
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {issueOptions.map((option) => {
                  const isSelected = selectedIssue === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedIssue(option.id)}
                      className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 cursor-pointer ${
                        isSelected
                          ? "border-gray-200 bg-white hover:border-gray-300"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                        {option.icon}
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs md:text-sm font-bold text-[#111827]">
                          {option.title}
                        </span>
                        <span className="text-[11px] text-gray-500 font-normal leading-relaxed">
                          {option.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="flex items-center justify-end pt-8 mt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 5))}
                className="inline-flex items-center gap-2 bg-[#0A5C6F] hover:bg-[#074653] text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
