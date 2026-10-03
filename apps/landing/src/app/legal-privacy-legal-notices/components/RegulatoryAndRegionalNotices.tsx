"use client"
import React, { useState } from "react";
import { Info, ChevronDown } from "lucide-react";

export default function RegulatoryAndRegionalNotices() {
  const [region, setRegion] = useState("");

  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Regulatory and regional notices
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Only notices that apply where you are, when required.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Card: Region Selector */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">
                Region
              </label>
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="" disabled>
                    Choose a region
                  </option>
                  <option value="us">United States</option>
                  <option value="eu">European Union</option>
                  <option value="uk">United Kingdom</option>
                  <option value="in">India</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>

            <p className="text-xs text-gray-400 font-normal">
              No region selected shows only general notices.
            </p>
          </div>

          {/* Right Card: Regional Notices Display */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-[#0A5C6F]" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-base md:text-lg font-bold text-[#111827]">
                No regional notices shown yet
              </h3>
              <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                Choose a region to see any registrations, licenses or consumer
                notices that apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
