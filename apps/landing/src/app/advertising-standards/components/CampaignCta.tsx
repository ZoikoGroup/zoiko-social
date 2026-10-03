"use client";

import React from "react";
import Link from "next/link";

export default function CampaignCta() {
  return (
    <section className="w-full bg-[#F7F9FA] py-10 sm:py-14 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[105px]">
        <div className="w-full rounded-[20px] sm:rounded-[28px] overflow-hidden bg-gradient-to-br from-[#066879] to-[#045363] px-5 py-10 sm:px-12 sm:py-16 text-center text-white flex flex-col items-center justify-center shadow-lg">
          {/* Top Icon Badge */}
          <div className="w-11 h-11 rounded-xl bg-white/12 flex items-center justify-center mb-4 text-[#CFE6EA]">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-3xl lg:text-[36px] font-extrabold text-white tracking-[-0.01em] font-['Plus_Jakarta_Sans',sans-serif] mb-2.5 sm:mb-3">
            Ready to build your campaign?
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-[17px] text-[#CFE6EA] font-normal font-['Plus_Jakarta_Sans',sans-serif] max-w-xl mb-6 sm:mb-8">
            Check the basics, then start in Ads Manager.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/for-business/advertise"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#066879] hover:bg-[#F7F9FA] text-sm sm:text-[15px] font-semibold transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-[#066879]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>Advertise on Zoiko Social</span>
            </Link>

            <Link
              href="/for-business/campaign-review"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/25 text-white text-sm sm:text-[15px] font-semibold transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Campaign Review</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
