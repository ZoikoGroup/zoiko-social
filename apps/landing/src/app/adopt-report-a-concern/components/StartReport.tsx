"use client";

import { useState } from "react";
import { C } from "./theme";
import { useReportForm } from "./ReportFormContext";

type ReportStep = {
  number: string;
  title: string;
};

const REPORT_STEPS: ReportStep[] = [
  { number: "1", title: "Concern" },
  { number: "2", title: "Context" },
  { number: "3", title: "What happened" },
  { number: "4", title: "Evidence" },
  { number: "5", title: "Safety check" },
  { number: "6", title: "Follow-up" },
  { number: "7", title: "Review" },
];

const CATEGORY_OPTIONS = [
  "Animal welfare",
  "Suspicious adoption/foster listing",
  "Scam / payment concern",
  "Trafficking / prohibited transfer",
  "Organization / verification concern",
  "Harassment / threat / coercion",
  "Privacy / sensitive data",
  "Unsafe external link / contact",
  "Minor / vulnerable-user safety",
  "Other concern",
  "Not sure",
];

export default function StartReport() {
  const {
    currentStep,
    setCurrentStep,
    formData,
    updateFormData,
    isSubmitted,
    setIsSubmitted,
    resetForm,
  } = useReportForm();

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNext = () => {
    setValidationError(null);
    if (currentStep === 1 && !formData.category) {
      setValidationError("Please select a category to continue.");
      return;
    }
    if (currentStep === 3 && !formData.description.trim()) {
      setValidationError("Please provide details of what happened.");
      return;
    }
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      // Step 7: Submit
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercent = Math.round((currentStep / REPORT_STEPS.length) * 100);

  return (
    <section
      id="report-form"
      className="w-full scroll-mt-10"
      style={{ backgroundColor: C.page }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 pb-20 sm:px-8 lg:px-10 lg:pb-24">
        {/* =====================================================
            SECTION HEADING
        ====================================================== */}
        <div className="mx-auto w-full max-w-[640px] pt-12 text-center">
          <h2
            className="text-3xl font-extrabold leading-[48px]"
            style={{ color: C.inkDeep }}
          >
            Start a report
          </h2>
          <p className="mt-2 text-sm" style={{ color: C.muted }}>
            Complete this step-by-step form to file a confidential report with our safety team.
          </p>
        </div>

        {/* =====================================================
            REPORT CONTENT
        ====================================================== */}
        <div className="flex w-full flex-col lg:flex-row items-start gap-8 pt-12">
          {/* ===================================================
              LEFT STEP NAVIGATION
          ==================================================== */}
          <div className="w-full lg:w-56 shrink-0">
            <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {REPORT_STEPS.map((step, index) => {
                const stepNum = index + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;
                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => {
                      // Allow jumping to already completed steps or current step
                      if (stepNum <= currentStep || (stepNum === 2 && formData.category)) {
                        setValidationError(null);
                        setCurrentStep(stepNum);
                      }
                    }}
                    className="text-left"
                  >
                    <ReportStepItem
                      number={step.number}
                      title={step.title}
                      active={isActive}
                      completed={isCompleted}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ===================================================
              RIGHT REPORT FORM
          ==================================================== */}
          <div
            className="flex min-w-0 flex-1 flex-col items-start gap-6 rounded-[32px] border bg-white p-6 sm:p-8 w-full shadow-sm"
            style={{ borderColor: C.line }}
          >
            {/* PROGRESS BAR */}
            <div
              className="relative h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "#F0F2F3" }}
            >
              <div
                className="absolute left-0 top-0 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: C.brand,
                }}
              />
            </div>

            {/* CONFIRMATION / SUBMITTED SCREEN */}
            {isSubmitted ? (
              <div className="flex w-full flex-col items-center justify-center py-10 text-center">
                <div
                  className="flex size-16 items-center justify-center rounded-full mb-4"
                  style={{ backgroundColor: C.chip }}
                >
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3
                  className="text-2xl font-bold leading-tight"
                  style={{ color: C.inkDeep }}
                >
                  Report Submitted
                </h3>
                <p
                  className="mt-2 max-w-md text-sm leading-relaxed"
                  style={{ color: C.muted }}
                >
                  Thank you for keeping our community safe. Your report regarding{" "}
                  <strong className="text-gray-900">{formData.category}</strong> has been logged.
                  Our safety team will triage and review the matter in accordance with Zoiko Social community standards.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: C.brand }}
                  >
                    Submit Another Report
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* STEP CONTENTS */}
                <div className="w-full flex flex-col gap-4">
                  {/* STEP 1: CONCERN / CATEGORY */}
                  {currentStep === 1 && (
                    <div className="flex w-full flex-col items-start gap-4">
                      <div>
                        <h3
                          className="text-xl font-extrabold leading-8"
                          style={{ color: C.inkDeep }}
                        >
                          What&apos;s your concern about?
                        </h3>
                        <p className="text-sm font-normal leading-5 mt-1" style={{ color: C.muted }}>
                          Choose a category from the dropdown or pick one from the cards above.
                        </p>
                      </div>

                      {/* CATEGORY DROPDOWN */}
                      <div className="w-full max-w-lg mt-2">
                        <label
                          htmlFor="concern-category"
                          className="block text-xs font-semibold uppercase tracking-wider mb-2"
                          style={{ color: C.ink }}
                        >
                          Concern Category
                        </label>
                        <select
                          id="concern-category"
                          value={formData.category}
                          onChange={(e) => {
                            setValidationError(null);
                            updateFormData({ category: e.target.value });
                          }}
                          className="w-full rounded-xl border px-4 py-3 text-sm font-medium bg-white text-gray-800 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          style={{ borderColor: formData.category ? C.brand : C.line }}
                        >
                          <option value="">-- Select a violation category --</option>
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* CURRENT STATUS BADGE */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium" style={{ color: C.muted }}>
                          Selected category:
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            formData.category
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {formData.category || "No category selected yet"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: CONTEXT */}
                  {currentStep === 2 && (
                    <div className="flex w-full flex-col items-start gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold leading-8" style={{ color: C.inkDeep }}>
                          Context & Target
                        </h3>
                        <p className="text-sm font-normal leading-5 mt-1" style={{ color: C.muted }}>
                          Where did this violation take place?
                        </p>
                      </div>

                      <div className="w-full max-w-lg mt-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.ink }}>
                          Location / Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["Listing", "User Profile", "Direct Message", "Comment/Post"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => updateFormData({ contextType: type })}
                              className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                                formData.contextType === type
                                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="w-full max-w-lg mt-3">
                        <label htmlFor="ref-url" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.ink }}>
                          Link or User/Listing ID (Optional)
                        </label>
                        <input
                          id="ref-url"
                          type="text"
                          placeholder="e.g. https://zoikosocial.com/adopt/123 or @username"
                          value={formData.referenceUrlOrId}
                          onChange={(e) => updateFormData({ referenceUrlOrId: e.target.value })}
                          className="w-full rounded-xl border px-4 py-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          style={{ borderColor: C.line }}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: WHAT HAPPENED */}
                  {currentStep === 3 && (
                    <div className="flex w-full flex-col items-start gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold leading-8" style={{ color: C.inkDeep }}>
                          What happened?
                        </h3>
                        <p className="text-sm font-normal leading-5 mt-1" style={{ color: C.muted }}>
                          Please describe the situation in as much detail as possible.
                        </p>
                      </div>

                      <div className="w-full mt-2">
                        <label htmlFor="report-desc" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.ink }}>
                          Description *
                        </label>
                        <textarea
                          id="report-desc"
                          rows={5}
                          placeholder="Provide details about dates, specific behaviors, messages, or risks observed..."
                          value={formData.description}
                          onChange={(e) => {
                            setValidationError(null);
                            updateFormData({ description: e.target.value });
                          }}
                          className="w-full rounded-xl border p-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          style={{ borderColor: C.line }}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 4: EVIDENCE */}
                  {currentStep === 4 && (
                    <div className="flex w-full flex-col items-start gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold leading-8" style={{ color: C.inkDeep }}>
                          Evidence & Documentation
                        </h3>
                        <p className="text-sm font-normal leading-5 mt-1" style={{ color: C.muted }}>
                          Do you have screenshots, chat records, or transaction IDs?
                        </p>
                      </div>

                      <div className="w-full mt-2">
                        <label htmlFor="evidence-notes" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.ink }}>
                          Evidence Notes or Links
                        </label>
                        <textarea
                          id="evidence-notes"
                          rows={4}
                          placeholder="Mention any screenshots or file links you hold. If safety investigators need them, they may request them via follow-up."
                          value={formData.evidenceNotes}
                          onChange={(e) => updateFormData({ evidenceNotes: e.target.value })}
                          className="w-full rounded-xl border p-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          style={{ borderColor: C.line }}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 5: SAFETY CHECK */}
                  {currentStep === 5 && (
                    <div className="flex w-full flex-col items-start gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold leading-8" style={{ color: C.inkDeep }}>
                          Urgency & Safety Check
                        </h3>
                        <p className="text-sm font-normal leading-5 mt-1" style={{ color: C.muted }}>
                          Is there immediate physical danger to an animal or individual?
                        </p>
                      </div>

                      <div className="w-full rounded-2xl border p-5 bg-amber-50/50 border-amber-200 mt-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isUrgentSafetyThreat}
                            onChange={(e) => updateFormData({ isUrgentSafetyThreat: e.target.checked })}
                            className="mt-1 size-4 rounded text-amber-600 focus:ring-amber-500"
                          />
                          <div>
                            <span className="text-sm font-bold text-amber-900 block">
                              Immediate danger or urgent physical risk
                            </span>
                            <span className="text-xs text-amber-800 mt-1 block">
                              Check this if an animal or person is currently in life-threatening jeopardy or acute danger.
                              (Remember to also alert local animal welfare or emergency services if life is in immediate danger).
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: FOLLOW-UP */}
                  {currentStep === 6 && (
                    <div className="flex w-full flex-col items-start gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold leading-8" style={{ color: C.inkDeep }}>
                          Follow-up & Contact
                        </h3>
                        <p className="text-sm font-normal leading-5 mt-1" style={{ color: C.muted }}>
                          Choose how we should follow up with you regarding status updates.
                        </p>
                      </div>

                      <div className="w-full max-w-lg mt-2">
                        <label className="flex items-center gap-3 cursor-pointer mb-4">
                          <input
                            type="checkbox"
                            checked={formData.isAnonymous}
                            onChange={(e) => updateFormData({ isAnonymous: e.target.checked })}
                            className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm font-medium text-gray-800">
                            Submit anonymously (we won&apos;t share your details)
                          </span>
                        </label>

                        {!formData.isAnonymous && (
                          <div>
                            <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.ink }}>
                              Your Email (for status updates)
                            </label>
                            <input
                              id="contact-email"
                              type="email"
                              placeholder="you@example.com"
                              value={formData.contactEmail}
                              onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                              className="w-full rounded-xl border px-4 py-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              style={{ borderColor: C.line }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 7: REVIEW */}
                  {currentStep === 7 && (
                    <div className="flex w-full flex-col items-start gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold leading-8" style={{ color: C.inkDeep }}>
                          Review your report
                        </h3>
                        <p className="text-sm font-normal leading-5 mt-1" style={{ color: C.muted }}>
                          Please verify the summary below before final submission.
                        </p>
                      </div>

                      <div className="w-full rounded-2xl border p-5 bg-gray-50 flex flex-col gap-3 text-sm">
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Category</span>
                          <span className="font-bold text-gray-900">{formData.category || "None"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Context Type</span>
                          <span className="font-semibold text-gray-800">{formData.contextType}</span>
                        </div>
                        {formData.referenceUrlOrId && (
                          <div className="flex justify-between border-b pb-2">
                            <span className="font-medium text-gray-500">Target / Reference</span>
                            <span className="font-semibold text-gray-800">{formData.referenceUrlOrId}</span>
                          </div>
                        )}
                        <div className="flex flex-col border-b pb-2">
                          <span className="font-medium text-gray-500 mb-1">Description</span>
                          <p className="text-gray-800 text-xs sm:text-sm whitespace-pre-wrap">
                            {formData.description || "(No description provided)"}
                          </p>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-medium text-gray-500">Urgent Safety Threat</span>
                          <span className={`font-semibold ${formData.isUrgentSafetyThreat ? "text-red-600 font-bold" : "text-gray-700"}`}>
                            {formData.isUrgentSafetyThreat ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-500">Contact Mode</span>
                          <span className="font-semibold text-gray-800">
                            {formData.isAnonymous ? "Anonymous" : formData.contactEmail || "Signed in account"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VALIDATION ERROR MESSAGE */}
                  {validationError && (
                    <div className="w-full rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                      {validationError}
                    </div>
                  )}
                </div>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}
                <div
                  className="flex w-full items-center justify-between gap-3 border-t pt-6"
                  style={{ borderColor: C.line }}
                >
                  {/* BACK BUTTON */}
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`flex items-center justify-center rounded-xl border px-6 py-3 text-base font-semibold transition-colors ${
                      currentStep === 1
                        ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400"
                        : "bg-white text-gray-800 hover:bg-gray-50 cursor-pointer"
                    }`}
                    style={{ borderColor: C.line }}
                  >
                    Back
                  </button>

                  {/* CONTINUE / SUBMIT BUTTON */}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex flex-1 max-w-[200px] items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: C.brand }}
                  >
                    {currentStep === 7 ? "Submit Report" : "Continue"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REPORT STEP ITEM
========================================================= */

function ReportStepItem({
  number,
  title,
  active,
  completed,
}: {
  number: string;
  title: string;
  active: boolean;
  completed?: boolean;
}) {
  return (
    <div
      className="w-full lg:w-56 px-3 py-2.5 rounded-lg border-2 inline-flex justify-start items-center gap-2.5 transition-all cursor-pointer"
      style={{
        backgroundColor: active ? C.chip : completed ? "#F0FDF4" : "#F4F4F4",
        borderColor: active ? C.brand : completed ? "#86EFAC" : "#E5E7EB",
      }}
    >
      {/* NUMBER CIRCLE */}
      <div
        className="size-6 shrink-0 rounded-xl flex items-center justify-center transition-colors"
        style={{
          backgroundColor: active ? C.brand : completed ? "#16A34A" : "#E5E7EB",
        }}
      >
        {completed ? (
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span
            className="text-center text-xs font-extrabold leading-5"
            style={{
              color: active ? C.white : C.muted,
            }}
          >
            {number}
          </span>
        )}
      </div>

      {/* STEP TITLE */}
      <div className="inline-flex flex-col items-start">
        <span
          className="text-center text-xs font-semibold leading-5"
          style={{
            color: active ? C.ink : completed ? "#166534" : C.muted,
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}