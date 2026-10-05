"use client";

import React, { useState } from "react";
import {
  Lock,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Mail,
  Smartphone,
  Video,
  Check,
  Send,
} from "lucide-react";
import { C } from "./theme";

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  workEmail: string;
  role: string;
  contactMethod: "Email" | "Phone" | "Video meeting";
  phone: string;
  // Step 2
  orgName: string;
  orgCategory: string;
  orgSize: string;
  website: string;
  // Step 3
  needs: string[];
  timeline: string;
  notes: string;
  // Step 4
  policyAgreed: boolean;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  workEmail: "",
  role: "",
  contactMethod: "Email",
  phone: "",
  orgName: "",
  orgCategory: "Veterinary Clinic",
  orgSize: "6-25 people",
  website: "",
  needs: ["Organization scale"],
  timeline: "Within 30 days",
  notes: "",
  policyAgreed: false,
};

const STEPS = [
  { id: 1, label: "About you" },
  { id: 2, label: "Organization" },
  { id: 3, label: "Your needs" },
  { id: 4, label: "Review and send" },
];

export default function ContactSalesFormSection() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [inquiryRef, setInquiryRef] = useState<string>("ZS-SALES-849201");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!form.firstName.trim()) newErrors.firstName = "First name is required";
      if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!form.workEmail.trim() || !form.workEmail.includes("@")) {
        newErrors.workEmail = "Please enter a valid work email";
      }
      if (!form.role.trim()) newErrors.role = "Role or title is required";
    } else if (step === 2) {
      if (!form.orgName.trim()) newErrors.orgName = "Organization name is required";
    } else if (step === 4) {
      if (!form.policyAgreed) {
        newErrors.policyAgreed = "Please confirm you understand our policy boundaries";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) {
      setInquiryRef(`ZS-SALES-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      setIsSubmitted(true);
    }
  };

  const toggleNeed = (need: string) => {
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }));
  };

  return (
    <section id="contact-sales" className="w-full bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading */}
        <div className="max-w-[720px] mb-8 sm:mb-12">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[36px] leading-[1.15] tracking-[-0.01em]"
            style={{ color: C.tarawera }}
          >
            Contact Sales
          </h2>
          <p
            className="font-jakarta font-normal text-[14px] sm:text-[17px] leading-[1.6] mt-2"
            style={{ color: C.nevada }}
          >
            Four short steps. Phone is optional.
          </p>
        </div>

        {/* 2-Column Layout: Steps Progress & Safety Info on Left, Interactive Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Progress Sidebar & "Keep it safe" card */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
            
            {/* Step Progress List (scrollable row on mobile, column on desktop) */}
            <div
              className="p-2 sm:p-2.5 bg-white rounded-2xl sm:rounded-[20px] border shadow-xs"
              style={{ borderColor: C.geyser }}
            >
              <ol className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {STEPS.map((s) => {
                  const isActive = currentStep === s.id;
                  const isCompleted = currentStep > s.id;

                  return (
                    <li
                      key={s.id}
                      className={`flex items-center gap-2.5 sm:gap-3.5 px-3 py-2 sm:px-3.5 sm:py-3 rounded-xl transition-colors shrink-0 ${
                        isActive
                          ? "bg-[#EEF8F9]"
                          : isCompleted
                          ? "hover:bg-gray-50"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-jakarta font-bold text-[12px] sm:text-[13px] shrink-0 transition-colors ${
                          isActive
                            ? "bg-[#066879] text-white"
                            : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "border border-[#DCE5E8] bg-white text-[#5E7076]"
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.id}
                      </div>
                      <span
                        className={`font-jakarta text-[13px] sm:text-[14.5px] leading-tight whitespace-nowrap ${
                          isActive
                            ? "font-bold text-[#073B47]"
                            : isCompleted
                            ? "font-semibold text-[#073B47]"
                            : "text-[#5E7076]"
                        }`}
                      >
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* "Keep it safe" Trust Card */}
            <div
              className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-[20px] border"
              style={{ borderColor: C.geyser }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4.5 h-4.5 text-[#073B47]" />
                <h3
                  className="font-jakarta font-bold text-[14px] sm:text-[15px] leading-tight"
                  style={{ color: C.tarawera }}
                >
                  Keep it safe
                </h3>
              </div>

              <ul className="flex flex-col gap-2.5 font-jakarta text-[12.5px] sm:text-[13.5px] text-[#5E7076]">
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[#066879] shrink-0 mt-0.5" />
                  <span>No passwords or credentials</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[#066879] shrink-0 mt-0.5" />
                  <span>No member data or safety reports</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[#066879] shrink-0 mt-0.5" />
                  <span>No verification documents</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Multi-Step Interactive Form Box (8 cols) */}
          <div
            className="lg:col-span-8 bg-white rounded-[22px] sm:rounded-[28px] border p-5 sm:p-7 lg:p-9 shadow-[0px_10px_35px_rgba(7,59,71,0.06)]"
            style={{ borderColor: C.geyser }}
          >
            {isSubmitted ? (
              /* Success View */
              <div className="py-8 sm:py-10 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 sm:mb-5">
                  <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>
                <h3
                  className="font-jakarta font-extrabold text-[22px] sm:text-[28px] leading-tight"
                  style={{ color: C.tarawera }}
                >
                  Inquiry received!
                </h3>
                <p
                  className="font-jakarta text-[14px] sm:text-[16px] leading-[1.6] max-w-[500px] mt-2 mb-6"
                  style={{ color: C.nevada }}
                >
                  Thank you, {form.firstName}. A member of our commercial team will review your
                  inquiry and contact you via {form.contactMethod.toLowerCase()} within 1 business
                  day.
                </p>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#EEF8F9] border border-[#066879]/20 text-left w-full max-w-[480px] text-[13px] sm:text-[13.5px] font-jakarta">
                  <div className="font-bold text-[#073B47] mb-1">Inquiry Reference:</div>
                  <div className="font-mono text-[#066879] text-xs">
                    {inquiryRef}
                  </div>
                  <div className="mt-2 text-[#5E7076]">
                    Routing: {form.orgCategory} · {form.needs.join(", ")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                    setForm(INITIAL_FORM);
                  }}
                  className="mt-6 sm:mt-8 px-6 py-3 sm:py-2.5 rounded-xl border border-gray-300 font-jakarta font-semibold text-sm text-[#073B47] hover:bg-gray-50 w-full sm:w-auto"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              /* Form Container */
              <form onSubmit={handleSubmit} noValidate>
                {/* STEP 1: ABOUT YOU */}
                {currentStep === 1 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div>
                      <h3
                        className="font-jakarta font-bold text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em]"
                        style={{ color: C.tarawera }}
                      >
                        About you
                      </h3>
                      <p
                        className="font-jakarta text-[13.5px] sm:text-[14px] leading-normal mt-1"
                        style={{ color: C.nevada }}
                      >
                        So the right person can reply.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
                      <div>
                        <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                          First name (required)
                        </label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879]"
                          style={{ borderColor: C.geyser }}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1 font-jakarta">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                          Last name (required)
                        </label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879]"
                          style={{ borderColor: C.geyser }}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1 font-jakarta">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
                      <div>
                        <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                          Work email (required)
                        </label>
                        <input
                          type="email"
                          value={form.workEmail}
                          onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
                          className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879]"
                          style={{ borderColor: C.geyser }}
                        />
                        <p className="text-[#5E7076] text-[12.5px] sm:text-[13px] mt-1.5 font-jakarta">
                          Independent professionals can use any email.
                        </p>
                        {errors.workEmail && (
                          <p className="text-red-500 text-xs mt-1 font-jakarta">{errors.workEmail}</p>
                        )}
                      </div>

                      <div>
                        <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                          Role or title (required)
                        </label>
                        <input
                          type="text"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879]"
                          style={{ borderColor: C.geyser }}
                        />
                        {errors.role && (
                          <p className="text-red-500 text-xs mt-1 font-jakarta">{errors.role}</p>
                        )}
                      </div>
                    </div>

                    {/* How should we contact you */}
                    <div>
                      <label className="block font-jakarta font-bold text-[14px] text-[#102A32] mb-2.5">
                        How should we contact you?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { label: "Email", icon: <Mail className="w-4 h-4" /> },
                          { label: "Phone", icon: <Smartphone className="w-4 h-4" /> },
                          { label: "Video meeting", icon: <Video className="w-4 h-4" /> },
                        ].map((m) => {
                          const isSelected = form.contactMethod === m.label;
                          return (
                            <button
                              key={m.label}
                              type="button"
                              onClick={() =>
                                setForm({ ...form, contactMethod: m.label as FormData["contactMethod"] })
                              }
                              className={`flex items-center gap-2.5 py-3 px-3.5 sm:px-4 rounded-xl border font-jakarta text-[14px] transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#EEF8F9] border-[#066879] text-[#102A32] ring-1 ring-[#066879]"
                                  : "bg-white border-[#DCE5E8] text-[#102A32] hover:border-[#A9B8BD]"
                              }`}
                            >
                              {isSelected ? (
                                <span className="w-4 h-4 rounded-full border-[4px] border-[#066879] bg-white shrink-0" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border border-gray-300 bg-white shrink-0" />
                              )}
                              <span className="text-[#073B47] shrink-0">{m.icon}</span>
                              <span className="font-semibold truncate">{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Phone (optional) */}
                    <div>
                      <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879]"
                        style={{ borderColor: C.geyser }}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: ORGANIZATION */}
                {currentStep === 2 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div>
                      <h3
                        className="font-jakarta font-bold text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em]"
                        style={{ color: C.tarawera }}
                      >
                        Organization details
                      </h3>
                      <p
                        className="font-jakarta text-[13.5px] sm:text-[14px] leading-normal mt-1"
                        style={{ color: C.nevada }}
                      >
                        Help us understand your entity and category.
                      </p>
                    </div>

                    <div>
                      <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                        Organization or Business name (required)
                      </label>
                      <input
                        type="text"
                        value={form.orgName}
                        onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                        className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879]"
                        style={{ borderColor: C.geyser }}
                      />
                      {errors.orgName && (
                        <p className="text-red-500 text-xs mt-1 font-jakarta">{errors.orgName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
                      <div>
                        <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                          Organization type / Category
                        </label>
                        <select
                          value={form.orgCategory}
                          onChange={(e) => setForm({ ...form, orgCategory: e.target.value })}
                          className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14px] sm:text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879] bg-white"
                          style={{ borderColor: C.geyser }}
                        >
                          <option value="Rescue or Shelter">Rescue or Shelter</option>
                          <option value="Veterinary Clinic">Veterinary Clinic / Hospital</option>
                          <option value="Animal Welfare Nonprofit">Animal Welfare Nonprofit</option>
                          <option value="Pet Brand or Retailer">Pet Brand or Retailer</option>
                          <option value="Advertising Agency">Advertising Agency</option>
                          <option value="Academic or Research">Academic or Research Institution</option>
                          <option value="Independent Professional">Independent Professional</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                          Team size / Locations
                        </label>
                        <select
                          value={form.orgSize}
                          onChange={(e) => setForm({ ...form, orgSize: e.target.value })}
                          className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14px] sm:text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879] bg-white"
                          style={{ borderColor: C.geyser }}
                        >
                          <option value="1-5 people">1–5 people (single location)</option>
                          <option value="6-25 people">6–25 people (1–3 locations)</option>
                          <option value="26-100 people">26–100 people (regional network)</option>
                          <option value="100+ people">100+ people (national or enterprise)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                        Website or social presence (optional)
                      </label>
                      <input
                        type="url"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879]"
                        style={{ borderColor: C.geyser }}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: YOUR NEEDS */}
                {currentStep === 3 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div>
                      <h3
                        className="font-jakarta font-bold text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em]"
                        style={{ color: C.tarawera }}
                      >
                        Your needs
                      </h3>
                      <p
                        className="font-jakarta text-[13.5px] sm:text-[14px] leading-normal mt-1"
                        style={{ color: C.nevada }}
                      >
                        Select all that apply to your rollout or project.
                      </p>
                    </div>

                    <div>
                      <label className="block font-jakarta font-bold text-[14px] text-[#102A32] mb-3">
                        Primary areas of interest:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        {[
                          "Organization scale",
                          "Multi-region advertising",
                          "Verification & credentials",
                          "Directory presence",
                          "API & technical integrations",
                          "Custom billing & procurement",
                        ].map((need) => {
                          const isChecked = form.needs.includes(need);
                          return (
                            <button
                              key={need}
                              type="button"
                              onClick={() => toggleNeed(need)}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border font-jakarta text-[13px] sm:text-[13.5px] text-left transition-all cursor-pointer ${
                                isChecked
                                  ? "bg-[#EEF8F9] border-[#066879] text-[#066879] font-bold"
                                  : "bg-white border-[#DCE5E8] text-[#102A32] hover:border-[#A9B8BD]"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                                  isChecked
                                    ? "bg-[#066879] border-[#066879] text-white"
                                    : "border-gray-300 bg-white"
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span>{need}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                        Expected timeline
                      </label>
                      <select
                        value={form.timeline}
                        onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                        className="w-full h-[46px] px-4 rounded-xl border text-gray-900 font-jakarta text-[14px] sm:text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879] bg-white"
                        style={{ borderColor: C.geyser }}
                      >
                        <option value="Within 30 days">Immediate (within 30 days)</option>
                        <option value="Next 1-3 months">Next 1–3 months</option>
                        <option value="Exploring options">Exploring options / future planning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-jakarta font-semibold text-[13px] text-[#5E7076] mb-1.5">
                        Tell us about your goals (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full p-3.5 sm:p-4 rounded-xl border text-gray-900 font-jakarta text-[14px] sm:text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#066879]/20 focus:border-[#066879]"
                        style={{ borderColor: C.geyser }}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW AND SEND */}
                {currentStep === 4 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div>
                      <h3
                        className="font-jakarta font-bold text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em]"
                        style={{ color: C.tarawera }}
                      >
                        Review and send
                      </h3>
                      <p
                        className="font-jakarta text-[13.5px] sm:text-[14px] leading-normal mt-1"
                        style={{ color: C.nevada }}
                      >
                        Confirm your summary details before submission.
                      </p>
                    </div>

                    {/* Summary Card */}
                    <div className="p-4 sm:p-4.5 rounded-2xl bg-[#F7F9FA] border border-[#DCE5E8] space-y-2.5 sm:space-y-3 font-jakarta text-[13px] sm:text-[13.5px]">
                      <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2 gap-1">
                        <span className="text-[#5E7076]">Contact:</span>
                        <span className="font-bold text-[#073B47]">
                          {form.firstName} {form.lastName} ({form.role})
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2 gap-1">
                        <span className="text-[#5E7076]">Email:</span>
                        <span className="font-medium text-[#073B47] break-all">{form.workEmail}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2 gap-1">
                        <span className="text-[#5E7076]">Preferred route:</span>
                        <span className="font-semibold text-[#066879]">{form.contactMethod}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2 gap-1">
                        <span className="text-[#5E7076]">Organization:</span>
                        <span className="font-bold text-[#073B47]">{form.orgName || "Not specified"}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2 gap-1">
                        <span className="text-[#5E7076]">Category & Size:</span>
                        <span className="font-medium text-[#073B47]">
                          {form.orgCategory} · {form.orgSize}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-[#5E7076]">Interest areas:</span>
                        <span className="font-semibold text-[#073B47] sm:text-right">
                          {form.needs.length > 0 ? form.needs.join(", ") : "General inquiry"}
                        </span>
                      </div>
                    </div>

                    {/* Policy Acknowledgment */}
                    <div className="p-3.5 sm:p-4 rounded-xl border border-[#DCE5E8] bg-white">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.policyAgreed}
                          onChange={(e) => setForm({ ...form, policyAgreed: e.target.checked })}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#066879] focus:ring-[#066879]"
                        />
                        <span className="font-jakarta text-[12.5px] sm:text-[13px] leading-relaxed text-[#5E7076]">
                          I understand that Sales cannot override verification standards, Advertising
                          Review decisions, content moderation, or animal welfare policies.
                        </span>
                      </label>
                      {errors.policyAgreed && (
                        <p className="text-red-500 text-xs mt-1.5 font-jakarta pl-7">
                          {errors.policyAgreed}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Controls / Buttons */}
                <div className="pt-5 sm:pt-6 mt-6 sm:mt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3 sm:py-2.5 rounded-xl border border-gray-200 font-jakarta font-semibold text-[14px] text-[#073B47] hover:bg-gray-50 transition-colors w-full sm:w-auto"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 sm:py-2.5 rounded-xl font-jakarta font-semibold text-[15px] text-white shadow-xs hover:shadow-md transition-all duration-200 w-full sm:w-auto"
                      style={{ backgroundColor: C.mosque }}
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-3 rounded-xl font-jakarta font-bold text-[15px] text-white shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                      style={{ backgroundColor: C.mosque }}
                    >
                      <span>Submit inquiry</span>
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
