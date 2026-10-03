"use client";

import React, { useState } from "react";

export default function PolicyVersionStrip() {
  const [selectedRegion, setSelectedRegion] = useState("All regions");
  const [showWhatChangedModal, setShowWhatChangedModal] = useState(false);

  return (
    <div className="w-full bg-white border-b border-[#DCE5E8] py-3 sm:py-3.5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[105px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Metadata items */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-6 lg:gap-8 text-xs sm:text-sm">
            {/* Version */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg
                className="w-4 h-4 text-[#5E7076]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-[#5E7076] font-normal">Version</span>
              <span className="font-bold text-[#102A32]">3.2</span>
            </div>

            {/* Effective */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg
                className="w-4 h-4 text-[#5E7076]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[#5E7076] font-normal">Effective</span>
              <span className="font-bold text-[#102A32]">Sep 1, 2026</span>
            </div>

            {/* Updated */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg
                className="w-4 h-4 text-[#5E7076]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-[#5E7076] font-normal">Updated</span>
              <span className="font-bold text-[#102A32]">Sep 24, 2026</span>
            </div>
          </div>

          {/* Region selector & What changed button */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#DCE5E8]/60">
            {/* Regions Selector */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                aria-label="Select Region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full appearance-none bg-white border border-[#DCE5E8] rounded-xl px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm font-semibold text-[#5E7076] hover:border-[#066879] focus:outline-none focus:ring-1 focus:ring-[#066879] cursor-pointer"
              >
                <option value="All regions">All regions</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="European Union">European Union</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5E7076]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* What Changed Button */}
            <button
              onClick={() => {
                const element = document.getElementById("standards-15-2");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                } else {
                  setShowWhatChangedModal(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white border border-[#DCE5E8] hover:border-[#066879] text-[#102A32] text-xs sm:text-sm font-semibold transition-colors shrink-0"
            >
              <span>What changed</span>
              <svg className="w-3.5 h-3.5 text-[#066879]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* What changed popup / modal */}
      {showWhatChangedModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#DCE5E8]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#073B47]">What changed in Version 3.2</h3>
              <button
                onClick={() => setShowWhatChangedModal(false)}
                className="text-[#5E7076] hover:text-[#102A32]"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-[#5E7076] mb-4">
              Effective September 1, 2026:
            </p>
            <ul className="list-disc pl-5 text-sm text-[#102A32] space-y-2 mb-6">
              <li>Added the welfare firewall (Section 8) to explicitly bar paid placement from affecting adoption ranking.</li>
              <li>Clarified insurance rules (Section 7.3) requiring regional licensing and adult targeting.</li>
              <li>Banned AI impersonation of animals, individuals, or platform branding without clear disclosure (Section 5.3).</li>
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setShowWhatChangedModal(false)}
                className="px-4 py-2 bg-[#066879] text-white text-sm font-semibold rounded-lg hover:bg-[#055765]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
