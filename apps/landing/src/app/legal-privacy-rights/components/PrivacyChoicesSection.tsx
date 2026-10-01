"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  Send,
  Info,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function PrivacyChoicesSection() {
  const [activeTab, setActiveTab] = useState("new");
  const [goal, setGoal] = useState("");
  const [region, setRegion] = useState("");

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Title, Description, Security Note & Links */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A5C6F]">
              Data Protection & Privacy Rights
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#073B47] tracking-tight">
              Understand and exercise your privacy choices.
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-normal leading-relaxed pt-1">
              Manage your settings, get a copy of your data, correct it, delete
              it, or use other rights that may apply where you live.
            </p>
          </div>

          {/* Security / Verification Note Box */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF8F9] border border-[#E0F2F4] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#0A5C6F]" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-normal leading-snug">
              We only ask for what&apos;s needed to find your request and protect
              your data from anyone else.
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#0A5C6F] hover:text-[#073B47] transition-colors"
            >
              Review your privacy choices
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#0A5C6F] hover:text-[#073B47] transition-colors"
            >
              Read the Privacy Policy
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Side: Interactive Privacy Request Card */}
        <div className="lg:col-span-6 w-full bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
          {/* Card Tabs Header */}
          <div className="flex border-b border-gray-100 px-6 pt-4 gap-8 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("new")}
              className={`pb-3 relative transition-colors ${
                activeTab === "new"
                  ? "text-[#073B47]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              New request
              {activeTab === "new" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0A5C6F]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("existing")}
              className={`pb-3 relative transition-colors ${
                activeTab === "existing"
                  ? "text-[#073B47]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Existing request
              {activeTab === "existing" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0A5C6F]" />
              )}
            </button>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8 flex flex-col gap-6">
            {/* Goal Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs md:text-sm font-medium text-gray-700">
                What do you want to do?
              </label>
              <div className="relative">
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-[#0A5C6F] transition-colors pr-10"
                >
                  <option value="" disabled>
                    Choose a goal
                  </option>
                  <option value="access">Get a copy of my data</option>
                  <option value="delete">Delete my data</option>
                  <option value="correct">Correct my data</option>
                  <option value="settings">Manage privacy settings</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Region Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs md:text-sm font-medium text-gray-700">
                Where do you live?
              </label>
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-[#0A5C6F] transition-colors pr-10"
                >
                  <option value="" disabled>
                    Choose a region
                  </option>
                  <option value="us">United States</option>
                  <option value="eea">European Economic Area (EEA)</option>
                  <option value="uk">United Kingdom</option>
                  <option value="other">Other regions</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="w-full bg-[#0A5C6F] hover:bg-[#073B47] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm text-sm"
            >
              <Send className="w-4 h-4 rotate-45" />
              Start a privacy request
            </button>

            {/* Footer helper note */}
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Your available rights may vary by region.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
