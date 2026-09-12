import React from "react";
import Image from "next/image";

export default function HeroImageSection() {
  return (
    <div className="relative w-full min-h-[420px] sm:min-h-[380px] lg:h-[414px] rounded-[32px] overflow-hidden">
      <Image
        src="/communities-wildlife-conservation/wildlife,forest,mist.png"
        alt="Misty forest wildlife"
        fill
        priority
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(100deg, rgba(7,59,71,0.9) 35%, rgba(7,59,71,0.45) 85%)",
        }}
      />

      <div className="relative flex flex-col justify-center gap-4 px-6 sm:px-10 py-10 max-w-[640px] min-h-[420px] sm:min-h-[380px] lg:h-full">
        <div className="h-7 px-3 bg-white/[0.18] rounded-[20px] inline-flex items-center justify-center self-start">
          <span className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] tracking-[0.48px]">
            COMMUNITIES
          </span>
        </div>

        <div className="text-white text-2xl sm:text-3xl lg:text-[34px] font-extrabold font-['Plus_Jakarta_Sans'] leading-[1.3] lg:leading-[51px] tracking-[-0.68px]">
          Wildlife &amp; Conservation communities
        </div>

        <div className="text-[#eef6f7] text-sm sm:text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
          Follow wildlife and conservation work around the world through
          communities organized by source-governed species, conservation
          context, and available broad geography.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-auto h-11 px-5 bg-orange-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
            <span className="text-white text-sm font-semibold font-['Plus_Jakarta_Sans']">
              Explore communities
            </span>
          </div>
          <div className="w-full sm:w-auto h-11 px-5 bg-white/[0.12] rounded-xl outline outline-1 outline-offset-[-1px] outline-white/40 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
            <span className="text-white text-sm font-semibold font-['Plus_Jakarta_Sans']">
              Browse all communities
            </span>
          </div>
        </div>

        <div className="flex max-w-[640px] bg-white/[0.14] rounded-xl p-4 gap-3">
          <div className="size-[15px] shrink-0 mt-0.5">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.875 6.875H3.125C2.43464 6.875 1.875 7.43464 1.875 8.125V11.875C1.875 12.5654 2.43464 13.125 3.125 13.125H11.875C12.5654 13.125 13.125 12.5654 13.125 11.875V8.125C13.125 7.43464 12.5654 6.875 11.875 6.875Z" stroke="#F1F8F9" strokeWidth="1.25"/>
              <path d="M4.375 6.875V4.375C4.375 3.5462 4.70424 2.75134 5.29029 2.16529C5.87634 1.57924 6.6712 1.25 7.5 1.25C8.3288 1.25 9.12366 1.57924 9.70971 2.16529C10.2958 2.75134 10.625 3.5462 10.625 4.375V6.875" stroke="#F1F8F9" strokeWidth="1.25"/>
            </svg>
          </div>
          <div className="text-[#f1f8f9] text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Community purpose does not automatically establish official,
            professional, scientific, nonprofit, government, or verified
            status. Sensitive wildlife locations and unsafe interaction
            guidance are never exposed or promoted through discovery.
          </div>
        </div>
      </div>
    </div>
  );
}
