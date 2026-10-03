"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Check,
  Clock,
  AlertTriangle,
  Send,
  FileText,
  UploadCloud,
  Lock,
  Calendar,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
} from "lucide-react";
import { C } from "./theme";

export default function WorkspacePreviewSection() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState(false);

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (licenseNumber.trim()) {
      setSubmittedAnswer(true);
    }
  };

  return (
    <section id="workspace" className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Your verification workspace
          </h2>
          <p
            className="font-jakarta text-[15px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            Track tasks, evidence and status in one place.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-6 lg:gap-8 items-start">
          {/* Left Column: Interactive Workspace Main Card */}
          <div
            className="bg-white rounded-[24px] sm:rounded-[28px] border overflow-hidden shadow-sm"
            style={{ borderColor: C.geyser }}
          >
            {/* Dark Header Banner */}
            <div
              className="p-4 sm:p-6 text-white flex flex-col justify-between"
              style={{ backgroundColor: C.tarawera }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-white/40 overflow-hidden shrink-0 bg-teal-900">
                    <Image
                      src="/buisness-verification/workspace_user_avatar-6f87f6.png"
                      alt="Dr. Lena Ruiz"
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-[17px] sm:text-[20px] leading-tight">
                      Dr. Lena Ruiz
                    </h3>
                    <p className="font-jakarta text-[11.5px] sm:text-[12.5px] text-[#BFE3E8] mt-0.5 leading-snug">
                      Professional verification · Veterinary rehabilitation · Application VRF-30412
                    </p>
                  </div>
                </div>

                {/* Status Pill (Visible on both mobile & desktop) */}
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] sm:text-[12px] font-jakarta font-bold border shrink-0"
                  style={{
                    backgroundColor: C.serenade,
                    color: C.cafeRoyale,
                    borderColor: C.zest,
                  }}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>In review</span>
                </span>
              </div>

              {/* Meta information */}
              <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-white/80 border-t border-white/10 pt-3">
                <ShieldCheck className="w-4 h-4 text-[#BFE3E8] shrink-0" />
                <span className="leading-snug">
                  Signed in as <strong>Dr. Lena Ruiz</strong> · Updated October 1, 2026
                </span>
              </div>
            </div>

            {/* Workspace Content Body */}
            <div className="p-4 sm:p-7 flex flex-col gap-6 sm:gap-7">
              {/* Tasks Sub-section */}
              <div>
                <h4
                  className="font-jakarta font-bold text-[15.5px] sm:text-[16px] mb-3.5"
                  style={{ color: C.tarawera }}
                >
                  Tasks
                </h4>

                <div className="flex flex-col gap-3">
                  {/* Task 1 */}
                  <div
                    className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border bg-white"
                    style={{ borderColor: C.geyser }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: C.mosque }}
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-jakarta font-semibold text-[13.5px] sm:text-[14px] truncate" style={{ color: C.firefly }}>
                          Confirm your identity
                        </h5>
                        <p className="font-jakarta text-[11.5px] sm:text-[12px]" style={{ color: C.nevada }}>
                          Completed September 22, 2026
                        </p>
                      </div>
                    </div>
                    <span className="font-jakarta text-[11.5px] sm:text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full shrink-0">
                      Done
                    </span>
                  </div>

                  {/* Task 2 */}
                  <div
                    className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border bg-white"
                    style={{ borderColor: C.geyser }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: C.mosque }}
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-jakarta font-semibold text-[13.5px] sm:text-[14px] truncate" style={{ color: C.firefly }}>
                          Choose your category
                        </h5>
                        <p className="font-jakarta text-[11.5px] sm:text-[12px]" style={{ color: C.nevada }}>
                          Veterinary rehabilitation
                        </p>
                      </div>
                    </div>
                    <span className="font-jakarta text-[11.5px] sm:text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full shrink-0">
                      Done
                    </span>
                  </div>

                  {/* Task 3 */}
                  <div
                    className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border bg-white"
                    style={{ borderColor: C.geyser }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: C.mosque }}
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-jakarta font-semibold text-[13.5px] sm:text-[14px] truncate" style={{ color: C.firefly }}>
                          Upload your license
                        </h5>
                        <p className="font-jakarta text-[11.5px] sm:text-[12px] truncate" style={{ color: C.nevada }}>
                          California veterinary license · Sep 23, 2026
                        </p>
                      </div>
                    </div>
                    <span className="font-jakarta text-[11.5px] sm:text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full shrink-0">
                      Done
                    </span>
                  </div>

                  {/* Action Needed Card */}
                  <div
                    className="p-4 sm:p-5 rounded-[20px] border flex flex-col gap-3.5"
                    style={{
                      backgroundColor: C.serenade,
                      borderColor: C.zest,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-[#E88924] bg-white border border-[#E88924]/30 shrink-0 mt-0.5"
                        >
                          <AlertTriangle className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div>
                          <h5
                            className="font-jakarta font-extrabold text-[14px] sm:text-[14.5px]"
                            style={{ color: C.firefly }}
                          >
                            Request from the verification team
                          </h5>
                          <p className="font-jakarta text-[12.5px] sm:text-[13px] leading-[1.45] text-gray-700 mt-0.5">
                            Please add your California license number so we can check it against the state register.
                          </p>
                        </div>
                      </div>

                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] sm:text-[11.5px] font-jakarta font-bold border shrink-0 bg-white self-start sm:self-auto"
                        style={{ color: C.cafeRoyale, borderColor: C.zest }}
                      >
                        Action needed
                      </span>
                    </div>

                    {!submittedAnswer ? (
                      <form onSubmit={handleSubmitAnswer} className="flex flex-col gap-2.5 mt-1 ml-0 sm:ml-12">
                        <label className="font-jakarta text-[12px] sm:text-[12.5px] font-semibold text-gray-700">
                          California license number <span className="text-red-500 font-normal">(required)</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                          <input
                            type="text"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            placeholder="For example: VET 12345"
                            className="w-full sm:flex-1 px-3.5 sm:px-4 py-2.5 bg-white border border-[#DCE5E8] rounded-xl text-[13.5px] sm:text-[14px] font-mono focus:outline-none focus:border-[#066879]"
                            required
                          />
                          <button
                            type="submit"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-jakarta font-semibold text-[13.5px] text-white hover:brightness-105 transition-all cursor-pointer shadow-sm"
                            style={{ backgroundColor: C.mosque }}
                          >
                            <Send className="w-4 h-4" />
                            <span>Send answer</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="ml-0 sm:ml-12 p-3 bg-white/80 rounded-xl border border-emerald-300 text-emerald-800 text-[12.5px] sm:text-[13px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          License number <strong>{licenseNumber}</strong> submitted to the verification team for review!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Evidence Sub-section */}
              <div>
                <h4
                  className="font-jakarta font-bold text-[15.5px] sm:text-[16px] mb-3.5"
                  style={{ color: C.tarawera }}
                >
                  Evidence
                </h4>

                <div className="flex flex-col gap-2.5 mb-4">
                  {/* File 1 */}
                  <div
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border bg-white hover:bg-gray-50/50"
                    style={{ borderColor: C.geyser }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-jakarta font-semibold text-[13px] sm:text-[13.5px] truncate" style={{ color: C.firefly }}>
                          California veterinary license.pdf
                        </h5>
                        <p className="font-jakarta text-[11.5px] sm:text-[12px]" style={{ color: C.nevada }}>
                          Uploaded Sep 23, 2026 · 1.2 MB
                        </p>
                      </div>
                    </div>
                    <button type="button" className="text-gray-400 hover:text-gray-600 p-1 shrink-0">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* File 2 */}
                  <div
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border bg-white hover:bg-gray-50/50"
                    style={{ borderColor: C.geyser }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-jakarta font-semibold text-[13px] sm:text-[13.5px] truncate" style={{ color: C.firefly }}>
                          CCRT rehabilitation certificate.pdf
                        </h5>
                        <p className="font-jakarta text-[11.5px] sm:text-[12px]" style={{ color: C.nevada }}>
                          Uploaded Sep 23, 2026 · 840 KB
                        </p>
                      </div>
                    </div>
                    <button type="button" className="text-gray-400 hover:text-gray-600 p-1 shrink-0">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dropzone */}
                <div
                  className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-[20px] border border-dashed text-center bg-[#F7F9FA] mb-4"
                  style={{ borderColor: C.towerGray }}
                >
                  <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8 text-[#066879] mb-2" />
                  <h5 className="font-jakarta font-bold text-[14px] sm:text-[14.5px] mb-1" style={{ color: C.firefly }}>
                    Add evidence
                  </h5>
                  <p className="font-jakarta text-[12px] sm:text-[12.5px] text-gray-500 max-w-[360px] mb-3 leading-relaxed">
                    PDF, JPG or PNG up to 20 MB. Never upload passwords or unrelated medical records.
                  </p>
                  <label className="px-4 py-2 bg-white border border-[#DCE5E8] rounded-xl text-[12.5px] sm:text-[13px] font-jakarta font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
                    Choose file
                    <input type="file" className="hidden" />
                  </label>
                </div>

                {/* Final Submit action row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={!submittedAnswer}
                    className={`w-full sm:w-auto px-5 py-3 rounded-xl font-jakarta font-semibold text-[14px] sm:text-[14.5px] transition-all text-center ${
                      submittedAnswer
                        ? "bg-[#066879] text-white hover:brightness-105 cursor-pointer shadow-sm"
                        : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    Submit for review
                  </button>
                  <span className="font-jakarta text-[12.5px] sm:text-[13px] text-center sm:text-left" style={{ color: C.nevada }}>
                    {submittedAnswer
                      ? "Ready to submit! Your update will be processed."
                      : "Finish the open task to submit."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Aside Panel */}
          <div className="flex flex-col gap-4">
            {/* Progress Card */}
            <div
              className="bg-white rounded-[24px] sm:rounded-[28px] border p-5 sm:p-6 flex flex-col items-center text-center shadow-sm"
              style={{ borderColor: C.geyser }}
            >
              <div className="relative w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] flex items-center justify-center mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#E5E7EB"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#066879"
                    strokeWidth="9"
                    strokeDasharray="251.2"
                    strokeDashoffset="75.36"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="font-jakarta font-bold text-[22px] sm:text-[24px] leading-none"
                    style={{ color: C.tarawera }}
                  >
                    70%
                  </span>
                  <span
                    className="font-jakarta font-bold text-[11px] sm:text-[11.5px] mt-1"
                    style={{ color: C.nevada }}
                  >
                    complete
                  </span>
                </div>
              </div>
              <span className="font-jakarta font-medium text-[12.5px] sm:text-[13px]" style={{ color: C.nevada }}>
                Your progress
              </span>
            </div>

            {/* Info Card 1: Private Evidence */}
            <div
              className="bg-white rounded-2xl border p-4 sm:p-4.5 shadow-sm"
              style={{ borderColor: C.geyser }}
            >
              <div className="flex items-center gap-2 mb-1.5" style={{ color: C.tarawera }}>
                <Lock className="w-4 h-4 text-[#066879] shrink-0" />
                <h5 className="font-jakarta font-bold text-[13px] sm:text-[13.5px]">Private evidence</h5>
              </div>
              <p className="font-jakarta text-[12px] sm:text-[12.5px] leading-[1.45]" style={{ color: C.nevada }}>
                Only the verification team sees your documents. They&apos;re never shown on your profile.
              </p>
            </div>

            {/* Info Card 2: Reply Deadline */}
            <div
              className="bg-white rounded-2xl border p-4 sm:p-4.5 shadow-sm"
              style={{ borderColor: C.geyser }}
            >
              <div className="flex items-center gap-2 mb-1.5" style={{ color: C.tarawera }}>
                <Calendar className="w-4 h-4 text-[#066879] shrink-0" />
                <h5 className="font-jakarta font-bold text-[13px] sm:text-[13.5px]">Reply by October 6, 2026</h5>
              </div>
              <p className="font-jakarta text-[12px] sm:text-[12.5px] leading-[1.45]" style={{ color: C.nevada }}>
                We&apos;ll keep your application open until then.
              </p>
            </div>

            {/* Info Card 3: Help / FAQ */}
            <div
              className="bg-white rounded-2xl border p-4 sm:p-4.5 shadow-sm"
              style={{ borderColor: C.geyser }}
            >
              <div className="flex items-center gap-2 mb-1.5" style={{ color: C.tarawera }}>
                <HelpCircle className="w-4 h-4 text-[#066879] shrink-0" />
                <h5 className="font-jakarta font-bold text-[13px] sm:text-[13.5px]">Need help?</h5>
              </div>
              <a
                href="#faq"
                className="inline-flex items-center gap-1 font-jakarta font-semibold text-[13px] sm:text-[13.5px] text-[#066879] hover:underline"
              >
                <span>Verification FAQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
