"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Send,
  FileCheck,
} from "lucide-react";

export default function ReconsiderationSection() {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedReason, setSelectedReason] = useState("Policy applied incorrectly");
  const [explanation, setExplanation] = useState("");
  const [isAccurate, setIsAccurate] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reasons = [
    "Policy applied incorrectly",
    "New evidence",
    "Factual error",
    "Circumstances changed",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !explanation.trim() || !isAccurate) return;
    setIsSubmitted(true);
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em] mb-2.5">
            Ask for reconsideration
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16.5px] leading-relaxed text-[#5E7076]">
            If you think a decision is wrong, ask for a second review.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-start">
          {/* Left Form Card */}
          <div className="rounded-[28px] bg-white border border-[#DCE5E8] p-6 sm:p-8 lg:p-9 shadow-xs">
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#EEF8F9] flex items-center justify-center text-[#066879] mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-jakarta font-bold text-[20px] text-[#073B47] mb-2">
                  Reconsideration Request Submitted
                </h3>
                <p className="font-jakarta text-[14px] text-[#5E7076] max-w-[420px] mb-6">
                  Your request has been routed to an independent senior policy
                  reviewer. You will receive an update in Ads Manager within
                  24–48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setExplanation("");
                    setIsAccurate(false);
                  }}
                  className="px-5 py-2.5 rounded-[12px] bg-[#066879] text-white font-jakarta font-semibold text-[13.5px]"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 1. Campaign select */}
                <div>
                  <label className="block font-jakarta text-[13px] font-bold text-[#102A32] mb-1.5">
                    Campaign <span className="text-[#E88924]">(required)</span>
                  </label>
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-[12px] bg-white border border-[#DCE5E8] text-[13.5px] font-jakarta text-[#102A32] focus:outline-none focus:border-[#066879] cursor-pointer"
                  >
                    <option value="">Choose a campaign</option>
                    <option value="CMP-24816">
                      Spring Adoption Week (CMP-24816)
                    </option>
                    <option value="CMP-24822">
                      Senior Dog Food Launch (CMP-24822)
                    </option>
                    <option value="CMP-24745">Exotic Bird Sale (CMP-24745)</option>
                    <option value="CMP-24590">Grain-Free Treats (CMP-24590)</option>
                    <option value="CMP-24760">
                      Holiday Pet Insurance (CMP-24760)
                    </option>
                  </select>
                </div>

                {/* 2. Reason grid */}
                <div>
                  <label className="block font-jakarta text-[13px] font-bold text-[#102A32] mb-2">
                    Reason
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {reasons.map((r) => {
                      const isChecked = selectedReason === r;
                      return (
                        <label
                          key={r}
                          onClick={() => setSelectedReason(r)}
                          className={`flex items-center gap-2.5 px-3.5 py-3 rounded-[12px] border text-[13px] font-jakarta font-medium cursor-pointer transition-all ${
                            isChecked
                              ? "bg-[#EEF8F9] border-[#066879] text-[#073B47]"
                              : "bg-white border-[#DCE5E8] text-[#5E7076] hover:border-[#066879]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="reconsideration-reason"
                            checked={isChecked}
                            onChange={() => setSelectedReason(r)}
                            className="w-4 h-4 text-[#066879] focus:ring-[#066879]"
                          />
                          <span>{r}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Textarea */}
                <div>
                  <label className="block font-jakarta text-[13px] font-bold text-[#102A32] mb-1.5">
                    Explain why{" "}
                    <span className="text-[#E88924]">(required)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    required
                    placeholder="Provide details about why the decision should be reviewed again..."
                    className="w-full px-4 py-3 rounded-[12px] bg-white border border-[#DCE5E8] text-[13.5px] font-jakarta text-[#102A32] placeholder:text-[#8E9B9F] focus:outline-none focus:border-[#066879] resize-none"
                  />
                  <p className="font-jakarta text-[12px] text-[#5E7076] mt-1.5 leading-relaxed">
                    Reconsideration is a fresh look by a different reviewer.
                    Changes to the campaign need a resubmission instead.
                  </p>
                </div>

                {/* 4. Confirmation Checkbox */}
                <div className="p-3.5 rounded-[12px] bg-[#F7F9FA] border border-[#DCE5E8] flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="confirm-accurate"
                    checked={isAccurate}
                    onChange={(e) => setIsAccurate(e.target.checked)}
                    required
                    className="w-4 h-4 text-[#066879] rounded border-[#DCE5E8] focus:ring-[#066879] cursor-pointer"
                  />
                  <label
                    htmlFor="confirm-accurate"
                    className="font-jakarta text-[13px] text-[#102A32] cursor-pointer select-none"
                  >
                    The information I&apos;ve given is accurate.
                  </label>
                </div>

                {/* Submit Row */}
                <div className="pt-4 border-t border-[#DCE5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-jakarta text-[12px] text-[#5E7076]">
                    Spend or sales contacts don&apos;t affect the outcome.
                  </span>
                  <button
                    type="submit"
                    disabled={!selectedCampaign || !explanation.trim() || !isAccurate}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#066879] hover:bg-[#073B47] disabled:opacity-50 disabled:cursor-not-allowed text-white font-jakarta font-semibold text-[14px] transition-colors shadow-2xs w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4" />
                    <span>Request reconsideration</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Cat Photo & "Good to know" Card */}
          <div className="flex flex-col gap-4 w-full">
            {/* Photo with overlay badge */}
            <div className="relative w-full h-[280px] sm:h-[300px] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#EEF8F9] border border-[#DCE5E8]">
              <Image
                src="/campaign-review/reconsideration-cat.png"
                alt="Independent review companion"
                fill
                className="object-cover"
              />
              {/* Floating Badge */}
              <div className="absolute left-4 bottom-4 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-[14px] bg-white text-[#073B47] shadow-[0px_8px_24px_0px_rgba(7,59,71,0.1)] border border-[#DCE5E8]">
                <div className="w-6 h-6 rounded-[8px] bg-[#EEF8F9] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#066879]" />
                </div>
                <span className="font-jakarta font-bold text-[13px]">
                  Reviewed by someone new
                </span>
              </div>
            </div>

            {/* "Good to know" Card */}
            <div className="rounded-[20px] bg-white border border-[#DCE5E8] p-5 sm:p-6 shadow-2xs">
              <h4 className="font-jakarta font-bold text-[15px] text-[#073B47] mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#066879]" />
                <span>Good to know</span>
              </h4>
              <ul className="space-y-2.5 text-[13px] font-jakarta text-[#102A32]">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#066879] mt-2 shrink-0" />
                  <span>One reconsideration per decision</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#066879] mt-2 shrink-0" />
                  <span>Not available for safety removals</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#066879] mt-2 shrink-0" />
                  <span>Outcome shows in your history</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
