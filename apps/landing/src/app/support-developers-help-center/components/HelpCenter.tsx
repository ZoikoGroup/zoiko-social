import React from "react";
import Image from "next/image";
import { Search, Globe, Mail, Activity, ShieldCheck } from "lucide-react";

export default function HelpCenter() {
  return (
    <div className="relative w-full h-[500px] bg-[#064E52] to-[#066879] flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/help/1.png"
          alt="Help Center Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#061B1A]/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto w-full">
        {/* Subheading */}
        <span className="text-[11px] font-bold tracking-[0.2em] text-[#BFE3E8] uppercase mb-2">
          SUPPORT & DEVELOPERS
        </span>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
          Help Center
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-200 mb-8 font-normal">
          Answers, guides and fixes for everything on Zoiko Social.
        </p>

        {/* Search Section */}
        <div className="w-full max-w-2xl flex flex-col items-start mb-8">
          <label className="text-xs font-medium text-gray-300 mb-2">
            Search the Help Center
          </label>
          <div className="relative w-full flex items-center bg-white rounded-[18px] shadow-lg p-1.5">
            <div className="pl-4 pr-2 text-gray-400 flex items-center">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="For example: reset my password"
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none px-1"
            />
            <a
              href="#"
              className="flex items-center justify-center gap-2 bg-[#066879] hover:bg-[#084A59] text-white text-sm font-medium px-6 py-2.5 rounded-[12px] transition-colors ml-2"
            >
              <Search className="w-4 h-4" />
              Search
            </a>
          </div>
        </div>

        {/* Action Pills / Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Browse topics */}
          <a
            href="#browse-topics"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF1A] hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition-all"
          >
            <div className="h-8 w-8 flex items-center justify-center bg-white rounded-full">
              <Globe className="w-3.5 h-3.5 text-[#066879]" />
            </div>
            <span>Browse topics</span>
          </a>

          {/* Contact Us */}
          <a
            href="/support-developers-contact-us"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF1A] hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition-all"
          >
            <div className="h-8 w-8 flex items-center justify-center bg-white rounded-full">
              <Mail className="w-3.5 h-3.5 text-[#066879]" />
            </div>
            <span>Contact Us</span>
          </a>

          {/* System Status */}
          <a
            href="/support-developers-system-status"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF1A] hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition-all"
          >
            <div className="h-8 w-8 flex items-center justify-center bg-white rounded-full">
              <Activity className="w-3.5 h-3.5 text-[#066879]" />
            </div>
            <span>System Status</span>
          </a>

          {/* Accessibility Support */}
          <a
            href="/support-developers-accessibility-support"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF1A] hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition-all"
          >
            <div className="h-8 w-8 flex items-center justify-center bg-white rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#066879]" />
            </div>
            <span>Accessibility Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
