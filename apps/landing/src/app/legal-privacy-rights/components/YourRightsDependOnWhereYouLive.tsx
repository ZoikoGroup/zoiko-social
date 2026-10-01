"use client"
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const regions = [
  "United States (US)",
  "European Union (EU) / EEA",
  "United Kingdom (UK)",
  "Canada",
  "Australia",
  "India",
  "Other / Global",
];

export default function YourRightsDependOnWhereYouLive() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Your rights depend on where you live
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Choose a region to see which rights apply to you.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Card: Dropdown Selector */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2 relative">
              <label className="text-xs font-bold text-gray-700">
                Country or region
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between text-[#111827] font-medium shadow-2xs hover:border-gray-400 transition-colors cursor-pointer"
                >
                  <span
                    className={
                      selectedRegion ? "text-[#111827]" : "text-gray-400"
                    }
                  >
                    {selectedRegion || "Choose a region"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                    {regions.map((region, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setSelectedRegion(region);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0F9FA] hover:text-[#0A5C6F] transition-colors cursor-pointer font-normal"
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-gray-500 font-normal leading-relaxed">
              Only your broad region is used. We never ask for your precise
              location here.
            </p>
          </div>

          {/* Right Card: Dynamic Information Display */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-12 flex flex-col justify-center min-h-[220px]">
            {selectedRegion ? (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <h3 className="text-lg font-bold text-[#111827]">
                  Rights for {selectedRegion}
                </h3>
                <div className="flex flex-col gap-2 text-xs md:text-sm text-gray-600 font-normal leading-relaxed">
                  <p>
                    <strong className="text-[#111827]">Rights:</strong> Access,
                    deletion, correction, and portability rights apply under
                    regional legislation.
                  </p>
                  <p>
                    <strong className="text-[#111827]">Response timing:</strong>{" "}
                    Standard responses are processed within 30 days of verified
                    submission.
                  </p>
                  <p>
                    <strong className="text-[#111827]">Review options:</strong>{" "}
                    You have the right to appeal or request a review if your
                    request is restricted.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs md:text-sm text-gray-400 font-normal text-center">
                Rights, response timing and review options appear once you
                choose a region.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
