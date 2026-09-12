import React from "react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="w-full flex flex-col-reverse lg:flex-row items-center gap-8">
      <div className="w-full lg:flex-1 flex flex-col gap-5">
        <div className="text-teal-950 text-base font-normal font-['Plus_Jakarta_Sans']">
          Communities
        </div>

        <div className="text-cyan-950 text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight tracking-[-0.32px]">
          Training &amp; Behavior communities
        </div>

        <div className="max-w-[664px] text-teal-950 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
          Discover communities where people share advice and experiences
          about animal training and behavior. Refine by species and
          source-governed topics to find a relevant space.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="w-full sm:w-auto h-[50.5px] px-6 bg-cyan-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cyan-900 transition-colors">
            <span className="text-white text-[15px] font-semibold font-['Plus_Jakarta_Sans']">
              Explore training &amp; behavior communities
            </span>
          </div>
          <div className="w-full sm:w-auto h-[50.5px] px-6 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors">
            <span className="text-cyan-950 text-[15px] font-semibold font-['Plus_Jakarta_Sans']">
              Browse all communities
            </span>
          </div>
        </div>

        <div className="max-w-[640px] text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-[18.75px] pt-2">
          Community advice is not the same as veterinary diagnosis or verified
          professional guidance. For urgent safety or health concerns, use
          appropriate qualified help.
        </div>
      </div>

      <div className="w-full lg:w-[507px] shrink-0 h-[220px] sm:h-[320px] rounded-[28px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-zinc-200 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.1)] relative bg-gradient-to-br from-cyan-800 to-orange-500">
        <Image
          src="/communities-training-behavior/dog-training-session.png"
          alt="A dog training session in progress"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
