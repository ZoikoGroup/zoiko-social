import React from "react";

export default function ConversionCTA() {
  return (
    <div className="relative w-full bg-cyan-950 rounded-[32px] overflow-hidden px-6 sm:px-10 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div
        className="absolute -right-24 -top-36 size-[380px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232,137,36,0.2) 0%, rgba(232,137,36,0) 70%)",
        }}
      />

      <div className="relative flex flex-col gap-2 max-w-[500px]">
        <div className="text-white text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
          Found a community that fits?
        </div>
        <div className="text-white/80 text-[14.5px] font-normal font-['Plus_Jakarta_Sans'] leading-[21.75px]">
          Create your Zoiko Social account to follow, save, or join according
          to each community&apos;s access rules.
        </div>
      </div>

      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <div className="h-[50.5px] px-6 bg-orange-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
          <span className="text-white text-[15px] font-semibold font-['Plus_Jakarta_Sans']">
            Join Free
          </span>
        </div>
        <div className="h-[50.5px] px-6 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/50 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
          <span className="text-white text-[15px] font-semibold font-['Plus_Jakarta_Sans']">
            Browse All Communities
          </span>
        </div>
      </div>
    </div>
  );
}
