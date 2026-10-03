import React from "react";
import {
  Camera,
  Bell,
  Search,
  Info,
  Clock,
  CheckCircle2,
  RotateCw,
} from "lucide-react";

export default function ActiveIncidents() {
  return (
    <section id="active-incidents" className="w-full bg-[#F7F9FA] py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Active incidents
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Unplanned problems affecting services right now.
          </p>
        </div>

        {/* Incident Card 1 */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative flex flex-col">
          {/* Left Orange Border Indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D97706]" />

          {/* Card Top Header / Tags */}
          <div className="p-6 md:p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                <Info className="w-3.5 h-3.5 text-gray-500" />
                Identified
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#D97706] border border-[#FDE6D2] text-xs font-medium px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                Partial outage
              </span>
              <span className="text-xs text-gray-400 font-mono">
                INC-2026-0931
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">
                Affected services
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#F0F9FA] text-[#0A5C6F] border border-[#E0F2F4] text-xs font-medium px-3 py-1 rounded-full">
                <Camera className="w-3.5 h-3.5" />
                Photo and video uploads
              </span>
            </div>
          </div>

          {/* Incident Content */}
          <div className="p-6 md:p-8 pt-6 pb-6 flex flex-col">
            <h3 className="text-lg md:text-xl font-bold text-[#111827] mb-2">
              Photo and video uploads failing for some members
            </h3>
            <p className="text-sm text-gray-600 font-normal mb-6">
              Some uploads stop at the processing step and don&apos;t post.
              Photos and videos already posted display normally.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100 items-center">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5" /> Started
                </span>
                <span className="text-sm font-semibold text-[#111827]">
                  13:05 UTC
                </span>
                <span className="text-xs text-gray-400">Sep 30, 2026</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                  <RotateCw className="w-3.5 h-3.5" /> Latest update
                </span>
                <span className="text-sm font-semibold text-[#111827]">
                  14:10 UTC
                </span>
                <span className="text-xs text-gray-400">11 min ago</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5" /> Next update
                </span>
                <span className="text-sm font-semibold text-[#111827]">
                  By 15:00 UTC
                </span>
                <span className="text-xs text-gray-400">
                  Committed by incident team
                </span>
              </div>
              <div className="flex flex-col md:items-end justify-center">
                <a
                  href="#incident-history"
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  View incident details
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Incident Card 2 */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative flex flex-col">
          {/* Left Orange Border Indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D97706]" />

          {/* Card Top Header / Tags */}
          <div className="p-6 md:p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                Monitoring
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#D97706] border border-[#FDE6D2] text-xs font-medium px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                Degraded performance
              </span>
              <span className="text-xs text-gray-400 font-mono">
                INC-2026-0932
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">
                Affected services
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#F0F9FA] text-[#0A5C6F] border border-[#E0F2F4] text-xs font-medium px-3 py-1 rounded-full">
                <Bell className="w-3.5 h-3.5" />
                Notifications
              </span>
            </div>
          </div>

          {/* Incident Content */}
          <div className="p-6 md:p-8 pt-6 pb-6 flex flex-col">
            <h3 className="text-lg md:text-xl font-bold text-[#111827] mb-2">
              Push notifications delayed
            </h3>
            <p className="text-sm text-gray-600 font-normal mb-6">
              Push notifications may arrive late. Email notifications and in-app
              activity are not affected.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100 items-center">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5" /> Started
                </span>
                <span className="text-sm font-semibold text-[#111827]">
                  11:40 UTC
                </span>
                <span className="text-xs text-gray-400">Sep 30, 2026</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                  <RotateCw className="w-3.5 h-3.5" /> Latest update
                </span>
                <span className="text-sm font-semibold text-[#111827]">
                  13:55 UTC
                </span>
                <span className="text-xs text-gray-400">26 min ago</span>
              </div>
              <div className="flex flex-col md:items-end justify-center">
                <a
                  href="#incident-history"
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  View incident details
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* How an incident is reported process banner */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col gap-6">
          <h4 className="text-sm font-bold text-[#111827]">
            How an incident is reported
          </h4>

          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] mb-2 shadow-sm">
                <Search className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-[#111827] mb-0.5">
                Investigating
              </h5>
              <p className="text-[11px] text-gray-400 font-normal">
                Problem reported
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] mb-2 shadow-sm">
                <Info className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-[#111827] mb-0.5">
                Identified
              </h5>
              <p className="text-[11px] text-gray-400 font-normal">
                Cause found, fix underway
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] mb-2 shadow-sm">
                <RotateCw className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-[#111827] mb-0.5">
                Monitoring
              </h5>
              <p className="text-[11px] text-gray-400 font-normal">
                Fix applied, being watched
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#0A5C6F] text-white flex items-center justify-center mb-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-[#111827] mb-0.5">
                Resolved
              </h5>
              <p className="text-[11px] text-gray-400 font-normal">
                Service back to normal
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
