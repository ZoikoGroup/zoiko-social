import React from "react";

export default function HeroSection() {
  return (
    <div className="w-[1232px] h-80 relative">
      <div className="w-[600px] h-24 left-0 top-[17.50px] absolute justify-center text-cyan-950 text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-[51px]">
        Find professional-led animal
        <br />
        communities.
      </div>

      <div className="w-[588px] h-11 left-0 top-[124.50px] absolute justify-center text-teal-950 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
        Explore communities associated with vets, trainers, and shelters, with
        operator
        <br />
        context shown from approved Zoiko Social data.
      </div>

      <div className="w-[260px] h-11 left-0 top-[189.50px] absolute bg-cyan-800 rounded-xl flex items-center justify-center">
        <div className="text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] underline leading-5">
          Explore professional communities
        </div>
      </div>

      <div className="w-[200px] h-11 left-[274.41px] top-[189.50px] absolute bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center">
        <div className="text-teal-950 text-sm font-semibold font-['Plus_Jakarta_Sans'] underline leading-5">
          Browse all communities
        </div>
      </div>

      <div className="w-[620px] h-16 left-0 top-[248.50px] absolute bg-cyan-50 rounded-xl">
        <div className="size-3.5 left-[14px] top-[14px] absolute flex items-center justify-center">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="6" width="10" height="7" rx="1" stroke="#155E75" strokeWidth="1.25"/>
            <path d="M3 6V4C3 2.34315 4.34315 1 6 1C7.65685 1 9 2.34315 9 4V6" stroke="#155E75" strokeWidth="1.25" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="w-[556.42px] h-9 left-[36px] top-[14px] absolute justify-center text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
          Professional labels describe operator context. They do not
          automatically mean Zoiko Social
          <br />
          has verified credentials, endorsed advice, or created a
          professional-client relationship.
        </div>
      </div>
    </div>
  );
}
