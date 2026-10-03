"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Key, Lock, Send, CheckCircle2, Edit3 } from "lucide-react";

interface StepItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: StepItem[] = [
  {
    title: "Get access",
    description: "Requirements come from the approved source",
    icon: <Key className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Authenticate",
    description: "Using the documented method",
    icon: <Lock className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Make a first request",
    description: "A tested example for the current version",
    icon: <Send className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Check the response",
    description: "With a link to errors if it fails",
    icon: <CheckCircle2 className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function GettingStarted() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="getting-started" className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side: Header & Step Cards */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6">
          {/* Badge */}
          <div className="w-fit bg-[#FEF3C7] border border-amber-200/60 rounded-full px-3.5 py-1 flex items-center gap-1.5 shadow-sm">
            <span className="text-[11px] font-medium text-amber-800">
              Quickstart publishes once an approved first-success path exists
            </span>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight">
              Getting started
            </h2>
            <p className="text-sm text-gray-500 font-normal">
              From access to your first working request.
            </p>
          </div>

          {/* Steps List */}
          <div className="flex flex-col gap-3.5 mt-2">
            {steps.map((step, index) => {
              const isSelected = activeStep === index;
              return (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full bg-white rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition-all shadow-sm ${
                    isSelected
                      ? "border-[#DCE5E8]"
                      : "border-[#DCE5E8] hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-[#111827]">
                        {step.title}
                      </span>
                      <span className="text-xs text-gray-500 font-normal">
                        {step.description}
                      </span>
                    </div>
                  </div>

                  {/* Radio / Check Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-[#0A5C6F] bg-[#0A5C6F]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Image with Floating Tag */}
        <div className="w-full lg:w-5/12 flex justify-center">
          <div className="relative w-full max-w-lg h-[360px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white">
            <Image
              src="/api/2.png"
              alt="Developer working on code"
              fill
              className="object-cover object-center"
            />

            {/* Floating Tag at Bottom Left */}
            <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-md flex items-center gap-2.5 border border-gray-100">
              <div className="w-7 h-7 rounded-lg bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                <Edit3 className="w-3.5 h-3.5 text-[#0A5C6F]" />
              </div>
              <span className="text-xs font-bold text-[#111827]">
                Four steps to first success
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
