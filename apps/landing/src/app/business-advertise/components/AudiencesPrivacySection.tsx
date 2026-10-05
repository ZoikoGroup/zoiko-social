"use client";

import React, { useState } from "react";
import { Check, X, Users } from "lucide-react";
import { C } from "./theme";

const INTERESTS = [
  "Dogs",
  "Cats",
  "Adoption",
  "Training",
  "Nutrition",
  "Horses",
  "Birds",
];

const REGIONS = [
  "San Francisco Bay Area",
  "Seattle",
  "London",
  "Toronto",
];

const AGES = ["18+", "All ages"];

const PROHIBITED_TRAITS = [
  "Health conditions",
  "Religion",
  "Ethnicity",
  "Precise location",
  "Under-18 behavior",
];

const ALLOWED_TARGETING = [
  "Animal interests and topics",
  "City or region",
  "Age bands (18+ for restricted categories)",
  "Your own customer lists, with consent",
];

const RESTRICTED_TARGETING = [
  "Sensitive traits like health or religion",
  "Precise location",
  "Under-18 activity",
  "Anyone's private messages or data",
];

export default function AudiencesPrivacySection() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Dogs", "Cats"]);
  const [selectedRegion, setSelectedRegion] = useState<string>("San Francisco Bay Area");
  const [selectedAge, setSelectedAge] = useState<string>("18+");

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px] border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Audiences and privacy
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Reach the right people without crossing privacy lines.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 items-start">
          {/* Left Column: Interactive Audience Simulator */}
          <div className="rounded-[28px] bg-white border border-[#DCE5E8] p-6 sm:p-7 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-[10px] bg-[#EEF8F9] flex items-center justify-center text-[#066879]">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-jakarta font-bold text-[18px] text-[#073B47]">
                Build an audience
              </h3>
            </div>

            {/* Category: Interests */}
            <div className="flex flex-col gap-2">
              <span className="font-jakarta font-bold text-[13px] text-[#5E7076]">
                Interests
              </span>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((item) => {
                  const isSelected = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#066879] text-white border border-[#066879] shadow-2xs"
                          : "bg-white text-[#102A32] border border-[#DCE5E8] hover:border-[#066879]/50"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category: Region */}
            <div className="flex flex-col gap-2">
              <span className="font-jakarta font-bold text-[13px] text-[#5E7076]">
                Region
              </span>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((item) => {
                  const isSelected = selectedRegion === item;
                  return (
                    <button
                      key={item}
                      onClick={() => setSelectedRegion(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#066879] text-white border border-[#066879] shadow-2xs"
                          : "bg-white text-[#102A32] border border-[#DCE5E8] hover:border-[#066879]/50"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category: Age */}
            <div className="flex flex-col gap-2">
              <span className="font-jakarta font-bold text-[13px] text-[#5E7076]">
                Age
              </span>
              <div className="flex flex-wrap gap-2">
                {AGES.map((item) => {
                  const isSelected = selectedAge === item;
                  return (
                    <button
                      key={item}
                      onClick={() => setSelectedAge(item)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#066879] text-white border border-[#066879] shadow-2xs"
                          : "bg-white text-[#102A32] border border-[#DCE5E8] hover:border-[#066879]/50"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category: Not Available (Disabled) */}
            <div className="flex flex-col gap-2 pt-1 border-t border-[#DCE5E8]/60">
              <span className="font-jakarta font-bold text-[13px] text-[#5E7076]">
                Not available
              </span>
              <div className="flex flex-wrap gap-2">
                {PROHIBITED_TRAITS.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium bg-[#F7F9FA] text-[#8FA0AC] border border-[#DCE5E8] cursor-not-allowed line-through opacity-85"
                  >
                    <X className="w-3 h-3 text-[#A9B8BD]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Audience Output Summary */}
            <div className="mt-1 p-3.5 rounded-[12px] bg-[#EEF8F9] border border-[#066879]/15 text-[13.5px] leading-relaxed text-[#102A32]">
              <span className="font-bold text-[#073B47]">Your audience: </span>
              <span>
                people interested in {selectedInterests.join(", ")}, in {selectedRegion}, aged {selectedAge}.
              </span>
            </div>
          </div>

          {/* Right Column: Allowed vs Prohibited Rules */}
          <div className="flex flex-col gap-4">
            {/* What you can use */}
            <div className="rounded-[28px] bg-white border border-[#DCE5E8] p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#EEF8F9] flex items-center justify-center text-[#066879]">
                  <Check className="w-4 h-4" />
                </div>
                <h3 className="font-jakarta font-bold text-[18px] text-[#073B47]">
                  You can use
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {ALLOWED_TARGETING.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#102A32]">
                    <Check className="w-4 h-4 text-[#066879] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What you can't use */}
            <div className="rounded-[28px] bg-[#F7F9FA] border border-dashed border-[#A9B8BD] p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#F7F9FA] border border-[#DCE5E8] flex items-center justify-center text-[#E88924]">
                  <X className="w-4 h-4" />
                </div>
                <h3 className="font-jakarta font-bold text-[18px] text-[#073B47]">
                  You can&apos;t use
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {RESTRICTED_TARGETING.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#102A32]">
                    <X className="w-4 h-4 text-[#E88924] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
