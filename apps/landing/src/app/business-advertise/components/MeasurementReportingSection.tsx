"use client";

import React from "react";
import {
  Eye,
  MousePointer,
  BarChart3,
  FileSpreadsheet,
  Lock,
} from "lucide-react";
import { C } from "./theme";

const REPORT_FEATURES = [
  {
    title: "Delivery: impressions, reach, frequency",
    icon: Eye,
  },
  {
    title: "Engagement: clicks, profile and event visits",
    icon: MousePointer,
  },
  {
    title: "Spend and budget pacing",
    icon: BarChart3,
  },
  {
    title: "CSV export",
    icon: FileSpreadsheet,
  },
  {
    title: "No individual user data, ever",
    icon: Lock,
  },
];

export default function MeasurementReportingSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px] border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Measurement and reporting
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            See how your campaign performs, with privacy built in.
          </p>
        </div>

        {/* 2-Column Dashboard Mockup & Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6 sm:gap-8 items-start">
          {/* Left Column: Live Campaign Report Card */}
          <div className="rounded-[28px] bg-white border border-[#DCE5E8] overflow-hidden shadow-xs flex flex-col">
            {/* Header Strip */}
            <div className="p-4 sm:p-5 border-b border-[#DCE5E8] flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#EEF8F9] flex items-center justify-center text-[#066879]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-jakarta font-bold text-[16px] text-[#073B47]">
                    Cat Dental Month
                  </h3>
                  <p className="font-jakarta text-[12.5px] text-[#5E7076]">
                    Harbor Point Veterinary Clinic · Sep 21 – Sep 30, 2026
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#FFF5E8] border border-dashed border-[#E88924] text-[12px] font-semibold text-[#7A430B]">
                Example report
              </div>
            </div>

            {/* 4 Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#DCE5E8]">
              <div className="p-3.5 sm:p-4 border-r border-b sm:border-b-0 border-[#DCE5E8] flex flex-col">
                <span className="font-jakarta font-bold text-[11px] sm:text-[12px] text-[#5E7076] uppercase tracking-wider mb-1">
                  Impressions
                </span>
                <span className="font-jakarta font-extrabold text-[20px] sm:text-[24px] text-[#073B47]">
                  48,210
                </span>
              </div>
              <div className="p-3.5 sm:p-4 border-b sm:border-b-0 sm:border-r border-[#DCE5E8] flex flex-col">
                <span className="font-jakarta font-bold text-[11px] sm:text-[12px] text-[#5E7076] uppercase tracking-wider mb-1">
                  Reach
                </span>
                <span className="font-jakarta font-extrabold text-[20px] sm:text-[24px] text-[#073B47]">
                  21,560
                </span>
              </div>
              <div className="p-3.5 sm:p-4 border-r border-[#DCE5E8] flex flex-col">
                <span className="font-jakarta font-bold text-[11px] sm:text-[12px] text-[#5E7076] uppercase tracking-wider mb-1">
                  Clicks
                </span>
                <span className="font-jakarta font-extrabold text-[20px] sm:text-[24px] text-[#073B47]">
                  1,284
                </span>
              </div>
              <div className="p-3.5 sm:p-4 flex flex-col">
                <span className="font-jakarta font-bold text-[11px] sm:text-[12px] text-[#5E7076] uppercase tracking-wider mb-1">
                  Profile visits
                </span>
                <span className="font-jakarta font-extrabold text-[20px] sm:text-[24px] text-[#073B47]">
                  412
                </span>
              </div>
            </div>

            {/* Clicks by Placement Breakdown */}
            <div className="p-5 border-b border-[#DCE5E8] flex flex-col gap-3.5">
              <span className="font-jakarta font-bold text-[13px] text-[#5E7076]">
                Clicks by placement
              </span>

              {/* Placement 1 */}
              <div className="flex items-center gap-3">
                <span className="font-jakarta text-[13px] text-[#102A32] w-24 shrink-0">
                  Home feed
                </span>
                <div className="flex-1 h-3 rounded-full bg-[#F7F9FA] overflow-hidden">
                  <div className="h-full bg-[#066879] rounded-full" style={{ width: "63%" }} />
                </div>
                <span className="font-jakarta font-bold text-[13px] text-[#102A32] w-10 text-right">
                  812
                </span>
              </div>

              {/* Placement 2 */}
              <div className="flex items-center gap-3">
                <span className="font-jakarta text-[13px] text-[#102A32] w-24 shrink-0">
                  Discover
                </span>
                <div className="flex-1 h-3 rounded-full bg-[#F7F9FA] overflow-hidden">
                  <div className="h-full bg-[#066879] rounded-full" style={{ width: "29%" }} />
                </div>
                <span className="font-jakarta font-bold text-[13px] text-[#102A32] w-10 text-right">
                  371
                </span>
              </div>

              {/* Placement 3 */}
              <div className="flex items-center gap-3">
                <span className="font-jakarta text-[13px] text-[#102A32] w-24 shrink-0">
                  Events
                </span>
                <div className="flex-1 h-3 rounded-full bg-[#F7F9FA] overflow-hidden">
                  <div className="h-full bg-[#066879] rounded-full" style={{ width: "8%" }} />
                </div>
                <span className="font-jakarta font-bold text-[13px] text-[#102A32] w-10 text-right">
                  101
                </span>
              </div>
            </div>

            {/* Budget Cap Pacing Progress */}
            <div className="p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[#102A32]">
                  Spent <strong className="font-bold text-[#073B47]">$640.00</strong> of your{" "}
                  <strong className="font-bold text-[#073B47]">$700.00</strong> cap
                </span>
                <span className="font-bold text-[#5E7076]">91%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#F7F9FA] overflow-hidden border border-[#DCE5E8]/40">
                <div className="h-full bg-[#066879] rounded-full" style={{ width: "91%" }} />
              </div>
            </div>
          </div>

          {/* Right Column: Feature Checklist */}
          <div className="rounded-[28px] bg-white border border-[#DCE5E8] p-6 sm:p-7 shadow-xs flex flex-col gap-5">
            <h3 className="font-jakarta font-bold text-[18px] text-[#073B47]">
              What reporting includes
            </h3>

            <div className="flex flex-col gap-3">
              {REPORT_FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="p-3.5 rounded-[12px] border border-[#DCE5E8] flex items-center gap-3 hover:border-[#066879]/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-[#EEF8F9] flex items-center justify-center text-[#066879] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-jakarta font-medium text-[13.5px] text-[#102A32]">
                      {feat.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
