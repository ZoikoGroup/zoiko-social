import React from "react";
import Image from "next/image";

export default function EmergencyGuidance() {
  return (
    <div className="w-full min-h-screen bg-white py-16 px-4 md:px-12 font-sans text-[#1a2d37] flex items-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text & Button */}
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-[52px] font-bold text-[#066879] tracking-tight leading-tight">
            Emergency Guidance
          </h1>

          <p className="text-[#102A32] text-sm md:text-[18px] leading-relaxed max-w-xl">
            If someone on Zoiko is in danger, if you witness an emergency, or if
            you&apos;re in crisis yourself—get help immediately. This page tells
            you exactly what to do.
          </p>

          <div className="pt-2">
            <a
              href="#"
              className="inline-block px-6 py-3.5 rounded-xl bg-[#066879] hover:bg-[#055563] text-white font-medium text-sm transition-colors shadow-sm text-center"
            >
              Report Emergency
            </a>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="lg:col-span-6 relative w-full h-[320px] md:h-[480px] rounded-3xl overflow-hidden">
          <Image
            src="/emergency/1.png"
            alt="Emergency medical responders"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
