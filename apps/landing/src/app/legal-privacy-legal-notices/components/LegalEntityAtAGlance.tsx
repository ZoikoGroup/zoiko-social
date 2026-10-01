import React from "react";
import { RefreshCw, Calendar } from "lucide-react";

export default function LegalEntityAtAGlance() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Legal entity at a glance
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Who operates Zoiko Social, from approved corporate records.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Large Card: Responsible Entity Details */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base md:text-lg font-bold text-[#111827]">
                Responsible entity
              </h3>
              <p className="text-xs md:text-sm text-gray-500 font-normal">
                Zoiko Social is a trading name and division of Zoiko Media Corp.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-gray-100 text-xs md:text-sm">
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500 font-normal">
                  Registered legal name
                </span>
                <span className="font-semibold text-[#111827]">
                  Zoiko Media Corp.
                </span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500 font-normal">
                  Incorporated in
                </span>
                <span className="font-semibold text-[#111827]">
                  Delaware, United States
                </span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500 font-normal">
                  Company number
                </span>
                <span className="font-semibold text-[#111827]">
                  File No. 7719-0426 (sample)
                </span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500 font-normal">
                  Registered office
                </span>
                <span className="font-semibold text-[#111827] text-right sm:text-left">
                  1200 Sample Street, Suite 10, Wilmington, DE 19801, USA
                </span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500 font-normal">
                  Business address
                </span>
                <span className="font-semibold text-[#111827] text-right sm:text-left">
                  450 Harbor View Avenue, Floor 12, San Francisco, CA 94111, USA
                </span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500 font-normal">
                  Tax identifiers
                </span>
                <span className="font-semibold text-[#111827]">
                  EIN 00-0000000 (sample) · VAT GB 000 0000 00 (sample)
                </span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-gray-500 font-normal">Legal contact</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#111827]">
                    legal@zoikosocial.example
                  </span>
                  <span className="text-gray-300">·</span>
                  <a
                    href="#contact"
                    className="font-semibold text-[#0A5C6F] hover:underline"
                  >
                    Contact Legal
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* One Source of Truth Card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                <RefreshCw className="w-4 h-4 text-[#0A5C6F]" />
                One source of truth
              </div>
              <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                These details feed the Terms, Privacy Policy and invoices, so
                they always match.
              </p>
            </div>

            {/* Last Verified Card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                <Calendar className="w-4 h-4 text-[#0A5C6F]" />
                Last verified
              </div>
              <p className="text-sm font-semibold text-[#111827]">
                September 20, 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
