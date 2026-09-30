import React from "react";
import Image from "next/image";
import {
  Activity,
  Layers,
  Wrench,
  History,
  HelpCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function SystemStatusHero() {
  return (
    <div className="relative w-full min-h-[580px] bg-[#064E52] to-[#066879] flex flex-col items-center justify-start overflow-hidden font-sans pt-12 pb-24">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/system/1.png"
          alt="System Status Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#061B1A]/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-7xl mx-auto w-full">
        {/* Top Header & Action Buttons Row */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#BFE3E8] uppercase mb-2">
              SUPPORT & DEVELOPERS
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
              System Status
            </h1>
            <p className="text-sm md:text-base text-gray-200 font-normal">
              Live health of Zoiko Social services. Every update is timestamped.
            </p>
          </div>

          {/* Right Top Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#073B478C] hover:bg-white/20 backdrop-blur-md border border-[#FFFFFF73] text-white text-xs font-medium transition-all"
            >
              <History className="w-3.5 h-3.5 text-gray-200" />
              <span>View incident history</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#073B478C] hover:bg-white/20 backdrop-blur-md border border-[#FFFFFF73] text-white text-xs font-medium transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-gray-200" />
              <span>Get help</span>
            </a>
          </div>
        </div>

        {/* Navigation Filter Pills */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start w-full gap-3 mb-8">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF1A] hover:bg-white/20 backdrop-blur-md border border-[#FFFFFF1A] text-white text-xs font-medium transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-gray-200" />
            <span>Incidents</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF1A] hover:bg-white/20 backdrop-blur-md border border-[#FFFFFF1A] text-white text-xs font-medium transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-gray-200" />
            <span>Services</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF1A] hover:bg-white/20 backdrop-blur-md border border-[#FFFFFF1A] text-white text-xs font-medium transition-all"
          >
            <Wrench className="w-3.5 h-3.5 text-gray-200" />
            <span>Maintenance</span>
          </a>
        </div>

        {/* Status Card Banner */}
        <div className="w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
          {/* Left Side Info */}
          <div className="flex flex-col items-start w-full lg:w-3/5">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shadow-sm shrink-0">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#D97706] to-[#D97706]/50" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight">
                2 active incidents affecting 2 services
              </h2>
            </div>
            <p className="text-sm text-gray-500 font-normal mb-4">
              Uploads and notifications are affected. Everything else is
              running.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-6">
              <span>Last updated Sep 30, 2026, 14:20 UTC (1 min ago)</span>
              <span className="inline-flex items-center gap-1 bg-[#E0F2F4] text-[#0A5C6F] font-medium px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Current
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#B45309] border border-[#FDE6D2] font-medium px-2.5 py-0.5 rounded-full">
                Sample data
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#"
                className="flex items-center gap-2 bg-[#0A5C6F] hover:bg-[#084A59] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors shadow-sm"
              >
                View active incidents
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                Refresh status
              </a>
            </div>
          </div>

          {/* Right Side Metrics List */}
          <div className="w-full lg:w-2/5 flex flex-col gap-4 lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                <Activity className="w-4 h-4 text-[#0A5C6F]" />
                <span>Active incidents</span>
              </div>
              <span className="text-base font-bold text-[#111827]">2</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                <Layers className="w-4 h-4 text-[#0A5C6F]" />
                <span>Services affected</span>
              </div>
              <span className="text-base font-bold text-[#111827]">2</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                <Wrench className="w-4 h-4 text-[#0A5C6F]" />
                <span>Maintenance windows</span>
              </div>
              <span className="text-base font-bold text-[#111827]">2</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 font-normal">
              Counts from the current status snapshot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
