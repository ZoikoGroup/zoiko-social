import React from "react";
import Image from "next/image";

export default function EmergencyBanner() {
  return (
    <div className="w-full min-h-[450px] bg-white py-16 px-4 md:px-8 font-sans flex items-center justify-center">
      <div className="max-w-7xl w-full relative rounded-3xl overflow-hidden shadow-sm border border-[#DCE5E8]">
        {/* Background Image using Next.js Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/emergency/bg.png"
            alt="Support group background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark teal overlay to match the image style and text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#073B47E5] to-[#073B4773] mix-blend-multiply" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-8 md:p-14 text-center text-white space-y-4 flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            You matter. Get help now.
          </h1>

          <p className="text-xs md:text-sm text-gray-100 max-w-xl leading-relaxed">
            If you&apos;re in crisis, alone, or scared—you are not alone. Help
            is available right now. Free. Confidential. 24/7.
          </p>

          <div className="pt-2 text-xs md:text-sm font-semibold tracking-wide text-white flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>Call 988</span>
            <span className="text-teal-300">•</span>
            <span>Text 741741</span>
            <span className="text-teal-300">•</span>
            <span>Call 911</span>
            <span className="text-teal-300">•</span>
            <span>Visit suicidepreventionlifeline.org</span>
          </div>
        </div>
      </div>
    </div>
  );
}
