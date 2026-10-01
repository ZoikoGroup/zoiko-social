import React from "react";
import {
  FileText,
  CheckCircle2,
  GitBranch,
  Calendar,
  RotateCcw,
  Globe,
  Bell,
  Building2,
} from "lucide-react";

export default function TermsOfServiceHeader() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-12">
        {/* Top Section with Title/Info and Version Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-between">
          {/* Left Side: Category, Title, Description, and Entity Notice */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A5C6F]">
                Legal & Privacy
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#073B47] tracking-tight">
                Terms of Service
              </h1>
              <p className="text-sm md:text-base text-gray-500 font-normal leading-relaxed pt-1">
                These Terms govern your use of Zoiko Social. Read them together
                with the policies and service-specific terms linked throughout.
              </p>
            </div>

            {/* Entity Agreement Box */}
            <div className="w-full flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEF8F9] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-[#0A5C6F]" />
              </div>
              <p className="text-xs md:text-sm text-gray-700 font-normal">
                Agreement with{" "}
                <span className="font-bold text-[#111827]">
                  Zoiko Media Corp.
                </span>{" "}
                Zoiko Social is a trading name and division of Zoiko Media Corp.
              </p>
            </div>
          </div>

          {/* Right Side: Version Details Card */}
          <div className="lg:col-span-5 w-full bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
            {/* Card Header (Dark Top) */}
            <div className="bg-[#073B47] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-white">
                  Current version
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#EEF8F9] text-[#073B47] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0A5C6F]" />
                Current
              </div>
            </div>

            {/* Version Attributes */}
            <div className="p-6 flex flex-col gap-4 text-xs md:text-sm bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <GitBranch className="w-4 h-4 text-[#0A5C6F]" />
                  <span>Version</span>
                </div>
                <span className="font-bold text-[#111827]">v2.4</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <Calendar className="w-4 h-4 text-[#0A5C6F]" />
                  <span>Effective</span>
                </div>
                <span className="font-bold text-[#111827]">
                  September 1, 2026
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <RotateCcw className="w-4 h-4 text-[#0A5C6F]" />
                  <span>Last updated</span>
                </div>
                <span className="font-bold text-[#111827]">
                  September 24, 2026
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <Globe className="w-4 h-4 text-[#0A5C6F]" />
                  <span>Applies to</span>
                </div>
                <span className="font-bold text-[#111827]">
                  All regions, with{" "}
                  <a
                    href="#"
                    className="underline text-[#0A5C6F] hover:text-[#073B47]"
                  >
                    regional terms
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner: Update Notice */}
        <div className="w-full bg-[#FEF3C7]/40 border border-amber-200/60 rounded-3xl p-6 flex items-start md:items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-white border border-amber-200/60 flex items-center justify-center shrink-0 shadow-sm">
            <Bell className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-[#111827]">
              Updated Terms take effect October 15, 2026
            </span>
            <span className="text-xs text-gray-600 font-normal">
              Version 3.0 clarifies Market seller rules and adds Events
              fundraising terms.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
