import React from "react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-8">
      <div className="w-full lg:flex-1 flex flex-col gap-5">
        <div className="text-teal-950 text-base font-normal font-['Plus_Jakarta_Sans']">
          Adopt &amp; Foster
        </div>

        <div className="text-cyan-950 text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight tracking-[-0.32px]">
          Find an animal. Start with a trusted source.
        </div>

        <div className="max-w-[664px] text-teal-950 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
          Explore animals listed by verified rescues and shelters, discover foster needs, and use built-in safety guidance to take the next step responsibly.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="w-full sm:w-auto h-[50.5px] px-6 bg-cyan-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cyan-900 transition-colors">
            <span className="text-white text-[15px] font-semibold font-['Plus_Jakarta_Sans']">
              Find Animals
            </span>
          </div>
          <div className="w-full sm:w-auto h-[50.5px] px-6 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors">
            <span className="text-cyan-950 text-[15px] font-semibold font-['Plus_Jakarta_Sans']">
              Explore Foster Needs
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 pt-4">
          <div className="text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-[18.75px]">
            Safety-first adoption and fostering.
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-cyan-800 text-[15px] font-semibold font-['Plus_Jakarta_Sans'] hover:underline">
              How Zoiko Social verifies rescues and shelters
            </span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.41667 9.75L9.20833 5.95833L5.41667 2.16667" stroke="#00808B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[507px] shrink-0 h-[280px] lg:h-[360px] rounded-[28px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-zinc-200 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.1)] relative bg-zinc-100 flex p-4 gap-4">
        {/* Left Column (Willow) */}
        <div className="flex-1 relative rounded-[20px] overflow-hidden">
          <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
            <Image src="/zoiko_social_adopt/willow.png" alt="Willow" fill className="object-cover" />
          </div>
        </div>
        
        {/* Right Column (Bella & Oliver) */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 relative rounded-[20px] overflow-hidden">
            <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
               <Image src="/zoiko_social_adopt/bella.png" alt="Bella" fill className="object-cover" />
            </div>
          </div>
          <div className="flex-1 relative rounded-[20px] overflow-hidden">
             <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
               <Image src="/zoiko_social_adopt/oliver.png" alt="Oliver" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
