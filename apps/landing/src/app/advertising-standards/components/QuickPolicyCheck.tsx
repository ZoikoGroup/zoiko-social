"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function QuickPolicyCheck() {
  const [advertisingType, setAdvertisingType] = useState("Veterinary services");
  const [advertiserType, setAdvertiserType] = useState("A professional");
  const [isVerified, setIsVerified] = useState("Yes");
  const [audience, setAudience] = useState("Adults only");
  const [hasClaims, setHasClaims] = useState("Yes");
  const [usingLists, setUsingLists] = useState("No");

  // Determine dynamic guidance based on user selections
  const getReviewStatus = () => {
    if (advertisingType === "Live animal sales" || advertisingType === "Cruelty or illegal trade") {
      return {
        badge: "Prohibited",
        badgeBg: "bg-[#FFF1F2]",
        badgeBorder: "border-[#FDA4AF]",
        badgeText: "text-[#E11D48]",
        iconColor: "text-[#E11D48]",
        message: "Live animal sales and trading cannot be advertised on Zoiko Social. Adoption occurs exclusively through verified rescues.",
        linkText: "See Section 2.1",
        linkTarget: "#standards-2-1",
      };
    }
    if (advertisingType === "Veterinary services" || hasClaims === "Yes" || advertisingType === "Pet insurance") {
      return {
        badge: "Special review likely",
        badgeBg: "bg-[#FFF5E8]",
        badgeBorder: "border-[#E88924]",
        badgeText: "text-[#073B47]",
        iconColor: "text-[#E88924]",
        message: "Expect extra review for veterinary services, claims evidence. Have your evidence ready.",
        linkText: "See what's needed",
        linkTarget: "#standards-7",
      };
    }
    if (isVerified === "Not yet") {
      return {
        badge: "Verification required",
        badgeBg: "bg-[#EEF8F9]",
        badgeBorder: "border-[#066879]",
        badgeText: "text-[#073B47]",
        iconColor: "text-[#066879]",
        message: "Advertisers must complete Professional or Organization Verification before any campaign can run.",
        linkText: "Learn about verification",
        linkTarget: "#standards-3",
      };
    }
    return {
      badge: "Standard review",
      badgeBg: "bg-[#F0FDF4]",
      badgeBorder: "border-[#86EFAC]",
      badgeText: "text-[#166534]",
      iconColor: "text-[#166534]",
      message: "This category is generally allowed. Standard compliance review will verify sponsored labeling and copy.",
      linkText: "View general standards",
      linkTarget: "#standards-1",
    };
  };

  const status = getReviewStatus();

  return (
    <section id="quick-check" className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[105px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#073B47] tracking-[-0.01em] font-['Plus_Jakarta_Sans',sans-serif] mb-2 sm:mb-3">
            Quick policy check
          </h2>
          <p className="text-sm sm:text-base lg:text-[17px] text-[#5E7076] font-normal font-['Plus_Jakarta_Sans',sans-serif]">
            Six questions before you build your campaign.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Form: 6 Questions (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#DCE5E8] rounded-[20px] sm:rounded-[28px] p-4 sm:p-8 shadow-[0px_1px_2px_rgba(7,59,71,0.06)]">
            <div className="flex flex-col gap-6">
              {/* Question 1 & 2 Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Q1 */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="q1-select" className="text-[13px] font-semibold text-[#5E7076] font-['Plus_Jakarta_Sans',sans-serif]">
                    What are you advertising?
                  </label>
                  <div className="relative">
                    <select
                      id="q1-select"
                      aria-label="What are you advertising?"
                      value={advertisingType}
                      onChange={(e) => setAdvertisingType(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#DCE5E8] rounded-xl px-4 py-3 pr-9 text-sm sm:text-[15px] font-normal text-[#102A32] hover:border-[#066879] focus:outline-none focus:ring-1 focus:ring-[#066879] cursor-pointer"
                    >
                      <option value="Veterinary services">Veterinary services</option>
                      <option value="Pet food and treats">Pet food and treats</option>
                      <option value="Grooming and care">Grooming and care</option>
                      <option value="Rescue awareness">Rescue awareness</option>
                      <option value="Pet insurance">Pet insurance</option>
                      <option value="Fundraising">Fundraising</option>
                      <option value="Supplements">Supplements</option>
                      <option value="Live animal sales">Live animal sales</option>
                      <option value="Other animal products">Other animal products</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5E7076]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Q2 */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="q2-select" className="text-[13px] font-semibold text-[#5E7076] font-['Plus_Jakarta_Sans',sans-serif]">
                    Who is advertising?
                  </label>
                  <div className="relative">
                    <select
                      id="q2-select"
                      aria-label="Who is advertising?"
                      value={advertiserType}
                      onChange={(e) => setAdvertiserType(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#DCE5E8] rounded-xl px-4 py-3 pr-9 text-sm sm:text-[15px] font-normal text-[#102A32] hover:border-[#066879] focus:outline-none focus:ring-1 focus:ring-[#066879] cursor-pointer"
                    >
                      <option value="A professional">A professional</option>
                      <option value="An organization / charity">An organization / charity</option>
                      <option value="A commercial business">A commercial business</option>
                      <option value="An agency for a client">An agency for a client</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5E7076]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 3 & 4 Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Q3 */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="q3-select" className="text-[13px] font-semibold text-[#5E7076] font-['Plus_Jakarta_Sans',sans-serif]">
                    Is the advertiser verified?
                  </label>
                  <div className="relative">
                    <select
                      id="q3-select"
                      aria-label="Is the advertiser verified?"
                      value={isVerified}
                      onChange={(e) => setIsVerified(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#DCE5E8] rounded-xl px-4 py-3 pr-9 text-sm sm:text-[15px] font-normal text-[#102A32] hover:border-[#066879] focus:outline-none focus:ring-1 focus:ring-[#066879] cursor-pointer"
                    >
                      <option value="Yes">Yes</option>
                      <option value="In progress">In progress</option>
                      <option value="Not yet">Not yet</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5E7076]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Q4 */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="q4-select" className="text-[13px] font-semibold text-[#5E7076] font-['Plus_Jakarta_Sans',sans-serif]">
                    Who&apos;s the audience?
                  </label>
                  <div className="relative">
                    <select
                      id="q4-select"
                      aria-label="Who is the audience?"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#DCE5E8] rounded-xl px-4 py-3 pr-9 text-sm sm:text-[15px] font-normal text-[#102A32] hover:border-[#066879] focus:outline-none focus:ring-1 focus:ring-[#066879] cursor-pointer"
                    >
                      <option value="Adults only">Adults only</option>
                      <option value="All ages">All ages</option>
                      <option value="Under 18">Under 18</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5E7076]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 5 & 6 Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Q5 */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="q5-select" className="text-[13px] font-semibold text-[#5E7076] font-['Plus_Jakarta_Sans',sans-serif]">
                    Any health, welfare or price claims?
                  </label>
                  <div className="relative">
                    <select
                      id="q5-select"
                      aria-label="Any health, welfare or price claims?"
                      value={hasClaims}
                      onChange={(e) => setHasClaims(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#DCE5E8] rounded-xl px-4 py-3 pr-9 text-sm sm:text-[15px] font-normal text-[#102A32] hover:border-[#066879] focus:outline-none focus:ring-1 focus:ring-[#066879] cursor-pointer"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5E7076]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Q6 */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="q6-select" className="text-[13px] font-semibold text-[#5E7076] font-['Plus_Jakarta_Sans',sans-serif]">
                    Using your own customer lists?
                  </label>
                  <div className="relative">
                    <select
                      id="q6-select"
                      aria-label="Using your own customer lists?"
                      value={usingLists}
                      onChange={(e) => setUsingLists(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#DCE5E8] rounded-xl px-4 py-3 pr-9 text-sm sm:text-[15px] font-normal text-[#102A32] hover:border-[#066879] focus:outline-none focus:ring-1 focus:ring-[#066879] cursor-pointer"
                    >
                      <option value="No">No</option>
                      <option value="Yes (consented opt-in)">Yes (consented opt-in)</option>
                      <option value="Yes (purchased list)">Yes (purchased list)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5E7076]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Aside: Dynamic Results & Advice (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Review Status Card */}
            <div className="bg-white border border-[#DCE5E8] rounded-[28px] p-6 sm:p-7 flex flex-col gap-4 shadow-sm">
              <div className="inline-flex">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.badgeBg} ${status.badgeBorder} ${status.badgeText}`}
                >
                  <span className={`w-2 h-2 rounded-full bg-current ${status.iconColor}`} />
                  {status.badge}
                </span>
              </div>

              <p className="text-sm sm:text-[16px] leading-[25px] text-[#102A32] font-normal font-['Plus_Jakarta_Sans',sans-serif]">
                {status.message}
              </p>

              <div>
                <a
                  href={status.linkTarget}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#066879] hover:bg-[#055765] text-white text-sm font-semibold transition-colors"
                >
                  <span>{status.linkText}</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Advisory Notice Box with Dashed Border */}
            <div className="bg-[#F7F9FA] border border-dashed border-[#A9B8BD] rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-5 h-5 mt-0.5 text-[#5E7076] flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs sm:text-[13px] leading-[20px] text-[#5E7076] font-normal font-['Plus_Jakarta_Sans',sans-serif]">
                This is a quick guide, not an approval or legal advice. Every
                campaign still goes through Campaign Review.
              </p>
            </div>

            {/* Banner Image with Gradient */}
            <div className="relative w-full h-[180px] sm:h-[200px] rounded-[28px] overflow-hidden bg-gradient-to-br from-[#066879] to-[#E88924] shadow-sm">
              <Image
                src="/advertising-standards/quick-check-cat.png"
                alt="Animal welfare focus"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
