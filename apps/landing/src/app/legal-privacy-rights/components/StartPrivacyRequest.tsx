"use client"
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

const steps: Step[] = [
  { number: 1, label: "Your request" },
  { number: 2, label: "Details" },
  { number: 3, label: "Review and submit" },
];

const goals = [
  "Access my information",
  "Delete my information",
  "Correct my information",
  "Change privacy choices",
  "Object or restrict",
];

const regions = [
  "United States (US)",
  "European Union (EU)",
  "United Kingdom (UK)",
  "Canada",
  "Australia",
  "India",
];

const relationships = [
  "Current user / account holder",
  "Former user",
  "Authorized agent",
  "Legal guardian",
  "Non-user / visitor",
];

export default function StartPrivacyRequest() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [relationship, setRelationship] = useState<string>("");

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Start a privacy request
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Three short steps. No account? You can still submit one.
          </p>
        </div>

        {/* Main Layout: Left Stepper, Right Form Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Stepper Navigation */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2">
            {steps.map((step) => {
              const isActive = currentStep === step.number;

              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-colors text-left cursor-pointer ${
                    isActive
                      ? "bg-[#F0F9FA] border border-[#E0F2F4] text-[#0A5C6F] font-bold shadow-2xs"
                      : "bg-transparent text-gray-500 hover:bg-gray-50 font-medium"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-[#0A5C6F] text-white"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="text-xs md:text-sm">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Form Content Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-10 flex flex-col justify-between gap-10">
            {/* Step 1 Form Content */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-6">
                <h3 className="text-lg md:text-xl font-bold text-[#111827]">
                  Your request
                </h3>
                <p className="text-xs md:text-sm text-gray-500 font-normal">
                  Tell us what you want and where you live.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Goal Dropdown */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs font-bold text-gray-700">
                    What do you want to do? (required)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown("goal")}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between text-[#111827] font-medium shadow-2xs hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <span
                        className={goal ? "text-[#111827]" : "text-gray-400"}
                      >
                        {goal || "Choose a goal"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {activeDropdown === "goal" && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                        {goals.map((item, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setGoal(item);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0F9FA] hover:text-[#0A5C6F] transition-colors cursor-pointer font-normal"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Region & Relationship Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Region Dropdown */}
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold text-gray-700">
                      Country or region (required)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown("region")}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between text-[#111827] font-medium shadow-2xs hover:border-gray-400 transition-colors cursor-pointer"
                      >
                        <span
                          className={
                            region ? "text-[#111827]" : "text-gray-400"
                          }
                        >
                          {region || "Choose a region"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>

                      {activeDropdown === "region" && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                          {regions.map((item, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setRegion(item);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0F9FA] hover:text-[#0A5C6F] transition-colors cursor-pointer font-normal"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Relationship Dropdown */}
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold text-gray-700">
                      Your relationship to Zoiko Social (required)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown("relationship")}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between text-[#111827] font-medium shadow-2xs hover:border-gray-400 transition-colors cursor-pointer"
                      >
                        <span
                          className={
                            relationship ? "text-[#111827]" : "text-gray-400"
                          }
                        >
                          {relationship || "Choose one"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>

                      {activeDropdown === "relationship" && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                          {relationships.map((item, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setRelationship(item);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0F9FA] hover:text-[#0A5C6F] transition-colors cursor-pointer font-normal"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Continue Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 bg-[#0A5C6F] hover:bg-[#074653] text-white text-xs md:text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm cursor-pointer"
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
