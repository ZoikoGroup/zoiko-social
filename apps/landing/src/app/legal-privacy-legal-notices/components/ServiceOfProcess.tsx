import React from "react";
import { Info } from "lucide-react";

export default function ServiceOfProcess() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Service of process
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            How formal legal documents must be served.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-base md:text-lg font-bold text-[#111827]">
              Serving Zoiko Media Corp.
            </h3>
          </div>

          <div className="flex flex-col divide-y divide-gray-100 text-xs md:text-sm">
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <span className="text-gray-500 font-normal">
                Registered agent
              </span>
              <span className="font-semibold text-[#111827]">
                Sample Registered Agents LLC
              </span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <span className="text-gray-500 font-normal">Address</span>
              <span className="font-semibold text-[#111827] text-right sm:text-left">
                1200 Sample Street, Suite 10, Wilmington, DE 19801, USA
              </span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <span className="text-gray-500 font-normal">Jurisdictions</span>
              <span className="font-semibold text-[#111827]">
                United States (sample)
              </span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <span className="text-gray-500 font-normal">
                Electronic service
              </span>
              <span className="font-semibold text-[#111827]">Not accepted</span>
            </div>
          </div>

          {/* Alert Callout Box */}
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-normal leading-relaxed">
              Emailing Legal or using this page&apos;s form isn&apos;t a
              substitute for proper service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
