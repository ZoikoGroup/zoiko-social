"use client";

import React, { useState } from "react";

export default function TuneDiscoverySection() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Dogs",
    "Rescue & foster",
  ]);

  const interestOptions = [
    "Dogs",
    "Rescue & foster",
    "Cats",
    "Birds",
    "Wildlife",
    "Horses",
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  };

  return (
    <section className="flex flex-col items-center justify-center py-8 md:py-12 text-[#0F3838] bg-[#F7F9FA]">
      <div className="max-w-6xl w-full">
        {/* Outer Card Wrapper */}
        <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] p-6 md:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Tune your people discovery */}
            <div className="flex flex-col items-start text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2E2E] tracking-tight mb-2">
                Tune your people discovery
              </h2>
              <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed mb-6 font-normal">
                Adjust the interests and signals that shape who you see. Hiding
                or resetting never affects your existing follows, connections,
                or safety blocks.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#0B2E2E] transition-all cursor-pointer"
                >
                  See fewer professionals
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#0B2E2E] transition-all cursor-pointer"
                >
                  See more animal lovers
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#0B2E2E] transition-all cursor-pointer"
                >
                  Reset people discovery
                </button>
              </div>
            </div>

            {/* Right Column: Your animal interests */}
            <div className="flex flex-col items-start text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2E2E] tracking-tight mb-2">
                Your animal interests
              </h2>
              <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed mb-6 font-normal">
                Only interests you&apos;ve explicitly added are ever used.
              </p>

              {/* Interest Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                {interestOptions.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#EEF8F9] text-[#0369A1] border border-[#066879]"
                          : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0B2E2E]"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
