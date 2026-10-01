import React from "react";
import Image from "next/image";
import { Activity } from "lucide-react";

export default function SystemStatusBanner() {
  return (
    <section className="w-full bg-white py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl relative rounded-3xl bg-[#073B47] overflow-hidden flex flex-col lg:flex-row items-center justify-between shadow-lg min-h-[198px]">
        
        {/* Left Content Area */}
        <div className="relative z-20 w-full lg:w-[58%] p-8 md:p-10 flex flex-col items-start">
          
          {/* Icon Badge */}
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white mb-5">
            <Activity className="w-5 h-5" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
            Not working for everyone?
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-300 font-normal mb-6 max-w-md leading-relaxed">
            Outages and maintenance are posted on System Status, with every
            update timestamped.
          </p>

          {/* Action Button */}
          <a
            href="/support-developers-system-status"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-lg backdrop-blur-md border border-white/20 transition-all"
          >
            <Activity className="w-4 h-4" />
            Check System Status
          </a>
        </div>

        {/* Image Area */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[55%] overflow-hidden">
          
          {/* Dog Image */}
          <Image
            src="/help/12.png"
            alt="System Status Dog Preview"
            fill
            priority
            className="object-cover object-right"
          />

          {/* Main color mixing layer */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-r
              from-[#073B47] from-[0%]
              via-[#073B47]/90 via-[5%]
              via-[#073B47]/40 via-[10%]
              via-transparent via-[15%]
              to-[#E9B8AE]/20 to-[30%]
            "
          />

          {/* Soft teal glow for smoother transition */}
          <div
            className="
              absolute inset-y-0 left-0 w-[55%]
              bg-gradient-to-r
              from-[#073B47]
              via-[#073B47]/80
              to-transparent
            "
          />

          {/* Warm peach tint on the right */}
          <div
            className="
              absolute inset-y-0 right-0 w-[48%]
              bg-gradient-to-l
              from-[#E9B8AE]/30
              via-[#E9B8AE]/10
              to-transparent
              mix-blend-soft-light
            "
          />

          {/* Subtle overall color blend */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-r
              from-[#073B47]/30
              via-transparent
              to-[#E9B8AE]/10
              mix-blend-color
            "
          />
        </div>
      </div>
    </section>
  );
}