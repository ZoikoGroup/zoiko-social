"use client"
import React, { useState } from "react";

export default function StartPartnershipInquiryForm() {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    yourName: "",
    workEmail: "",
    partnershipPathInterest: "",
    mission: "",
    partnershipIdea: "",
    agreedToPrivacy: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 font-sans text-[#1a2d37] flex items-center justify-center">
      <div className="max-w-7xl w-full space-y-8">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Start a partnership inquiry
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            Tell us about your organization and what partnership with Zoiko
            Social could mean for your community.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-[#DCE5E8]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Organization Name & Organization Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-[#1a2d37]">
                  Organization name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F4F6F7] border border-[#DCE5E8] rounded-xl px-4 py-3 text-sm text-[#1a2d37] focus:outline-none focus:ring-2 focus:ring-[#066879]/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-[#1a2d37]">
                  Organization type *
                </label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F4F6F7] border border-[#DCE5E8] rounded-xl px-4 py-3 text-sm text-[#5a6e75] focus:outline-none focus:ring-2 focus:ring-[#066879]/30 transition-all"
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  <option value="rescue">Rescue & Shelters</option>
                  <option value="welfare">Welfare & Research</option>
                  <option value="corporate">Corporate Partners</option>
                  <option value="tech">Tech & Content</option>
                </select>
              </div>
            </div>

            {/* Row 2: Your Name & Work Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-[#1a2d37]">
                  Your name *
                </label>
                <input
                  type="text"
                  name="yourName"
                  value={formData.yourName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F4F6F7] border border-[#DCE5E8] rounded-xl px-4 py-3 text-sm text-[#1a2d37] focus:outline-none focus:ring-2 focus:ring-[#066879]/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-semibold text-[#1a2d37]">
                  Work email *
                </label>
                <input
                  type="email"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F4F6F7] border border-[#DCE5E8] rounded-xl px-4 py-3 text-sm text-[#1a2d37] focus:outline-none focus:ring-2 focus:ring-[#066879]/30 transition-all"
                />
              </div>
            </div>

            {/* Row 3: Partnership Path Interest */}
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-semibold text-[#1a2d37]">
                Partnership path interest *
              </label>
              <select
                name="partnershipPathInterest"
                value={formData.partnershipPathInterest}
                onChange={handleChange}
                required
                className="w-full bg-[#F4F6F7] border border-[#DCE5E8] rounded-xl px-4 py-3 text-sm text-[#5a6e75] focus:outline-none focus:ring-2 focus:ring-[#066879]/30 transition-all"
              >
                <option value="" disabled>
                  Select...
                </option>
                <option value="integration">Integration & Access</option>
                <option value="content">Content & Visibility</option>
                <option value="alliance">Strategic Alliance</option>
              </select>
            </div>

            {/* Row 4: Tell us about your mission */}
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-semibold text-[#1a2d37]">
                Tell us about your mission (in 1–2 sentences) *
              </label>
              <textarea
                name="mission"
                rows={3}
                placeholder="What does your organization do?"
                value={formData.mission}
                onChange={handleChange}
                required
                className="w-full bg-[#F4F6F7] border border-[#DCE5E8] rounded-xl p-4 text-sm text-[#1a2d37] placeholder-[#A0ABAF] focus:outline-none focus:ring-2 focus:ring-[#066879]/30 transition-all resize-none"
              />
            </div>

            {/* Row 5: Describe your partnership idea */}
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-semibold text-[#1a2d37]">
                Describe your partnership idea *
              </label>
              <textarea
                name="partnershipIdea"
                rows={4}
                placeholder="What kind of partnership are you interested in? What problem does it solve?"
                value={formData.partnershipIdea}
                onChange={handleChange}
                required
                className="w-full bg-[#F4F6F7] border border-[#DCE5E8] rounded-xl p-4 text-sm text-[#1a2d37] placeholder-[#A0ABAF] focus:outline-none focus:ring-2 focus:ring-[#066879]/30 transition-all resize-none"
              />
              <p className="text-[11px] text-[#8C989C]">Max 1000 characters</p>
            </div>

            {/* Row 6: Checkbox Agreement */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                name="agreedToPrivacy"
                id="agreedToPrivacy"
                checked={formData.agreedToPrivacy}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4 rounded border-[#DCE5E8] text-[#066879] focus:ring-[#066879]/30"
              />
              <label
                htmlFor="agreedToPrivacy"
                className="text-xs md:text-sm text-[#5a6e75] leading-relaxed"
              >
                I agree to the{" "}
                <a href="#" className="text-[#066879] underline font-medium">
                  Privacy Notice
                </a>{" "}
                and understand my data will be used to discuss partnership
                opportunities. *
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#066879] hover:bg-[#055563] text-white font-medium text-sm py-3.5 px-6 rounded-2xl shadow-sm transition-all"
              >
                Start Partnership Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
