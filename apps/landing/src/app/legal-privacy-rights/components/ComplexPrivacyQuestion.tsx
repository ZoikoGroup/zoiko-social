import React from "react";
import Link from "next/link";
import { Mail, Accessibility } from "lucide-react";

export default function ComplexPrivacyQuestion() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl">
        {/* Main Dark Teal Banner Card */}
        <div className="w-full bg-gradient-to-r from-[#066879] to-[#045363] rounded-3xl p-8 md:p-14 flex flex-col items-center text-center gap-6 shadow-sm relative overflow-hidden">
          {/* Icon Badge */}
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
            <Mail className="w-5 h-5" />
          </div>

          {/* Heading and Subtitle */}
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              A complex privacy question?
            </h2>
            <p className="text-xs md:text-sm text-white/80 font-normal leading-relaxed">
              For regulator correspondence or anything that doesn&apos;t fit a
              request, contact the privacy team.
            </p>
          </div>

          {/* Buttons Container */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/support-developers-contact-us"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#0A5C6F] text-xs md:text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Contact the privacy team
            </Link>

            <Link
              href="/support-developers-accessibility-support"
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 border border-white/20 text-white text-xs md:text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <Accessibility className="w-4 h-4" />
              Accessibility Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
