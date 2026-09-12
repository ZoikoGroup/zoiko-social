import React from "react";

export default function HeroSection() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Mobile-only breadcrumb (desktop frame omits it) */}
      <div className="sm:hidden text-teal-950 text-sm font-semibold font-['Plus_Jakarta_Sans']">
        Home
      </div>

      {/* Mobile-only context pill (desktop frame omits it) */}
      <div className="sm:hidden h-7 px-3 bg-slate-100 rounded-full inline-flex items-center justify-center self-start">
        <span className="text-cyan-950 text-xs font-bold font-['Plus_Jakarta_Sans']">
          Communities
        </span>
      </div>

      <div className="max-w-[640px] text-cyan-950 text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-[1.35] sm:leading-[51px]">
        Find communities for fostering, rescue, and adoption.
      </div>

      <div className="max-w-[620px] text-teal-950 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
        Explore Zoiko Social communities focused on fostering, animal rescue,
        and adoption support, with purpose and species context shown from
        approved data.
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto h-11 px-5 bg-cyan-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cyan-900 transition-colors">
          <div className="text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] underline leading-5 text-center">
            Explore rescue &amp; adoption communities
          </div>
        </div>

        <div className="w-full sm:w-auto h-11 px-5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors">
          <div className="text-teal-950 text-sm font-semibold font-['Plus_Jakarta_Sans'] underline leading-5">
            Browse all communities
          </div>
        </div>

        <div className="text-cyan-800 text-sm font-semibold font-['Plus_Jakarta_Sans'] underline leading-5 cursor-pointer">
          Looking to adopt an animal now? Go to Adopt →
        </div>
      </div>

      <div className="max-w-[620px] bg-cyan-50 rounded-xl p-4 flex gap-3">
        <div className="size-4 shrink-0 mt-0.5">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.875 6.875H3.125C2.43464 6.875 1.875 7.43464 1.875 8.125V11.875C1.875 12.5654 2.43464 13.125 3.125 13.125H11.875C12.5654 13.125 13.125 12.5654 13.125 11.875V8.125C13.125 7.43464 12.5654 6.875 11.875 6.875Z" stroke="#066879" strokeWidth="1.25"/>
            <path d="M4.375 6.875V4.375C4.375 3.5462 4.70424 2.75134 5.29029 2.16529C5.87634 1.57924 6.6712 1.25 7.5 1.25C8.3288 1.25 9.12366 1.57924 9.70971 2.16529C10.2958 2.75134 10.625 3.5462 10.625 4.375V6.875" stroke="#066879" strokeWidth="1.25"/>
          </svg>
        </div>
        <div className="text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
          These communities support connection and coordination. They do not
          guarantee emergency response, animal availability, adoption
          approval, veterinary care, legal ownership, or successful
          placement.
        </div>
      </div>
    </div>
  );
}
