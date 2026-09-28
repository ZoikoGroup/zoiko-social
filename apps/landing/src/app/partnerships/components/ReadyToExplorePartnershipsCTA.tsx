import React from "react";
import Image from "next/image";

export default function ReadyToExplorePartnershipsCTA() {
  return (
    <div className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 font-sans flex items-center justify-center">
      <div className="max-w-7xl w-full">
        {/* Banner Card with Background Image */}
        <div className="relative w-full rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col justify-center min-h-[400px]">
          {/* Background Image & Dark Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/partnerships/bg.png"
              alt="People collaborating in a meeting"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#07323B]/95 via-[#07323B]/80 to-[#07323B]/40" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-xl space-y-6">
            {/* Heading & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                Ready to explore partnerships?
              </h1>
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                Let&apos;s talk about what collaboration could mean for your
                community and mission.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#"
                className="bg-white hover:bg-[#F0F2F3] text-[#1a2d37] font-semibold text-xs md:text-sm py-3.5 px-6 rounded-2xl shadow-sm transition-all text-center"
              >
                Start Partnership Inquiry
              </a>
              <a
                href="#"
                className="bg-transparent hover:bg-white/10 text-white border border-white/40 font-semibold text-xs md:text-sm py-3.5 px-6 rounded-2xl transition-all text-center"
              >
                Schedule a Discussion
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
