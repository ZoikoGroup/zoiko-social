import React from "react";

export default function ConversionBand() {
  return (
    <div className="w-full bg-gradient-to-r from-cyan-950 via-cyan-950 to-cyan-800 rounded-[32px] px-6 py-14 flex flex-col items-center gap-3 text-center">
      <div className="max-w-[530px] text-white text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-10">
        Found a community that fits what you care about?
      </div>

      <div className="max-w-[436px] opacity-90 text-white text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
        Create your Zoiko Social account when you are ready to explore,
        follow, or join according to the community&apos;s access rules.
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3">
        <div className="h-10 px-6 bg-orange-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
          <div className="text-center text-white text-sm font-semibold font-['Plus_Jakarta_Sans']">
            Join Free
          </div>
        </div>

        <div className="h-10 px-6 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/50 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
          <div className="text-center text-white text-sm font-semibold font-['Plus_Jakarta_Sans']">
            Browse All Communities
          </div>
        </div>
      </div>
    </div>
  );
}
