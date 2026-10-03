"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { C } from "./theme";

export default function EligibilityCheckerSection() {
  const [answers, setAnswers] = useState<{
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
    q5?: string;
    q6?: string;
  }>({});

  const handleSelect = (question: "q1" | "q2" | "q3" | "q4" | "q5" | "q6", value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const isComplete =
    answers.q1 && answers.q2 && answers.q3 && answers.q4 && answers.q5 && answers.q6;

  const isEligible =
    isComplete &&
    answers.q2 === "A category listed above" &&
    answers.q4 === "Yes" &&
    answers.q5 === "Yes";

  return (
    <section id="eligibility-checker" className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Check if you can verify
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            Six quick questions. Nothing is saved.
          </p>
        </div>

        {/* 2 Columns: Form on Left + Result on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8 items-start">
          {/* Form Card */}
          <div
            className="bg-white rounded-[28px] border p-6 sm:p-8 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] flex flex-col gap-6"
            style={{ borderColor: C.geyser }}
          >
            {/* Question 1 */}
            <div className="flex flex-col gap-2.5 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-jakarta font-bold text-[12.5px] shrink-0 mt-0.5"
                  style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                >
                  1
                </span>
                <span
                  className="font-jakarta font-bold text-[15px] sm:text-[15.5px] leading-snug"
                  style={{ color: C.firefly }}
                >
                  Are you verifying yourself or an organization?
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5 ml-0 sm:ml-9">
                {["Myself", "An organization"].map((opt) => {
                  const selected = answers.q1 === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect("q1", opt)}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-[13.5px] sm:text-[14px] font-jakarta font-semibold border transition-all cursor-pointer ${
                        selected
                          ? "bg-[#066879] text-white border-[#066879] shadow-sm"
                          : "bg-white text-[#102A32] border-[#DCE5E8] hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2 */}
            <div className="flex flex-col gap-2.5 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-jakarta font-bold text-[12.5px] shrink-0 mt-0.5"
                  style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                >
                  2
                </span>
                <span
                  className="font-jakarta font-bold text-[15px] sm:text-[15.5px] leading-snug"
                  style={{ color: C.firefly }}
                >
                  Which fits best?
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5 ml-0 sm:ml-9">
                {["A category listed above", "Something else"].map((opt) => {
                  const selected = answers.q2 === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect("q2", opt)}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-[13.5px] sm:text-[14px] font-jakarta font-semibold border transition-all cursor-pointer ${
                        selected
                          ? "bg-[#066879] text-white border-[#066879] shadow-sm"
                          : "bg-white text-[#102A32] border-[#DCE5E8] hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3 */}
            <div className="flex flex-col gap-2.5 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-jakarta font-bold text-[12.5px] shrink-0 mt-0.5"
                  style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                >
                  3
                </span>
                <span
                  className="font-jakarta font-bold text-[15px] sm:text-[15.5px] leading-snug"
                  style={{ color: C.firefly }}
                >
                  Where do you mainly operate?
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5 ml-0 sm:ml-9">
                {["United States", "UK or Ireland", "Canada", "Somewhere else"].map((opt) => {
                  const selected = answers.q3 === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect("q3", opt)}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-[13.5px] sm:text-[14px] font-jakarta font-semibold border transition-all cursor-pointer ${
                        selected
                          ? "bg-[#066879] text-white border-[#066879] shadow-sm"
                          : "bg-white text-[#102A32] border-[#DCE5E8] hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 4 */}
            <div className="flex flex-col gap-2.5 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-jakarta font-bold text-[12.5px] shrink-0 mt-0.5"
                  style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                >
                  4
                </span>
                <span
                  className="font-jakarta font-bold text-[15px] sm:text-[15.5px] leading-snug"
                  style={{ color: C.firefly }}
                >
                  Do you control the profile you want verified?
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5 ml-0 sm:ml-9">
                {["Yes", "No"].map((opt) => {
                  const selected = answers.q4 === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect("q4", opt)}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-[13.5px] sm:text-[14px] font-jakarta font-semibold border transition-all cursor-pointer ${
                        selected
                          ? "bg-[#066879] text-white border-[#066879] shadow-sm"
                          : "bg-white text-[#102A32] border-[#DCE5E8] hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 5 */}
            <div className="flex flex-col gap-2.5 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-jakarta font-bold text-[12.5px] shrink-0 mt-0.5"
                  style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                >
                  5
                </span>
                <span
                  className="font-jakarta font-bold text-[15px] sm:text-[15.5px] leading-snug"
                  style={{ color: C.firefly }}
                >
                  Are you authorized to act for it, or do you provide this service yourself?
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5 ml-0 sm:ml-9">
                {["Yes", "No"].map((opt) => {
                  const selected = answers.q5 === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect("q5", opt)}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-[13.5px] sm:text-[14px] font-jakarta font-semibold border transition-all cursor-pointer ${
                        selected
                          ? "bg-[#066879] text-white border-[#066879] shadow-sm"
                          : "bg-white text-[#102A32] border-[#DCE5E8] hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 6 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-jakarta font-bold text-[12.5px] shrink-0 mt-0.5"
                  style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                >
                  6
                </span>
                <span
                  className="font-jakarta font-bold text-[15px] sm:text-[15.5px] leading-snug"
                  style={{ color: C.firefly }}
                >
                  Do you have evidence ready, like a license or registration?
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5 ml-0 sm:ml-9">
                {["Yes", "Not yet"].map((opt) => {
                  const selected = answers.q6 === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect("q6", opt)}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-[13.5px] sm:text-[14px] font-jakarta font-semibold border transition-all cursor-pointer ${
                        selected
                          ? "bg-[#066879] text-white border-[#066879] shadow-sm"
                          : "bg-white text-[#102A32] border-[#DCE5E8] hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Results + Photo */}
          <div className="flex flex-col gap-6 sticky top-24">
            {/* Result Box */}
            <div
              className="bg-white rounded-[28px] border p-6 sm:p-7 flex flex-col gap-3 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
              style={{ borderColor: C.geyser }}
            >
              {!isComplete ? (
                <>
                  <h3
                    className="font-jakarta font-bold text-[18px] sm:text-[20px]"
                    style={{ color: C.tarawera }}
                  >
                    Your result appears here
                  </h3>
                  <p
                    className="font-jakarta text-[14px] sm:text-[14.5px] leading-[1.6]"
                    style={{ color: C.nevada }}
                  >
                    Answer the questions on the left.
                  </p>
                </>
              ) : isEligible ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-jakarta font-bold text-[17px]">
                      You&apos;re likely eligible!
                    </span>
                  </div>
                  <p className="font-jakarta text-[14px] text-gray-600 leading-[1.55]">
                    Based on your answers, you can proceed with the{" "}
                    <strong>{answers.q1}</strong> path in {answers.q3}. Have your
                    documents ready to submit.
                  </p>
                  <a
                    href="#workspace"
                    className="inline-flex items-center gap-1.5 font-jakarta font-semibold text-[14px] text-[#066879] hover:underline mt-1"
                  >
                    <span>Go to verification workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-jakarta font-bold text-[17px]">
                      Special review needed
                    </span>
                  </div>
                  <p className="font-jakarta text-[14px] text-gray-600 leading-[1.55]">
                    Your category or region may have specific eligibility
                    criteria. Contact our verification support team to verify your
                    case directly.
                  </p>
                </div>
              )}
            </div>

            {/* Photo Container */}
            <div className="relative h-[240px] sm:h-[269px] w-full rounded-[28px] overflow-hidden bg-gradient-to-br from-[#066879] to-[#E88924] shadow-sm">
              <Image
                src="/buisness-verification/checker_aside_cat-31e69a.png"
                alt="Verification assistant kitten"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
