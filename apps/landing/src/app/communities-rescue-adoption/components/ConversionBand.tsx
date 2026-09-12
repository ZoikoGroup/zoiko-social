import React from "react";

export default function ConversionBand() {
  return (
    <div className="w-full bg-gradient-to-r from-cyan-950 via-cyan-950 to-cyan-800 rounded-[32px] px-6 py-14 flex flex-col items-center gap-3 text-center">
      <div className="max-w-[520px] text-white text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-10">
        Found a community you want to be part of?
      </div>

      <div className="max-w-[460px] opacity-90 text-white text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
        Create your Zoiko Social account when you are ready to participate,
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

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20 w-full max-w-[380px] justify-center">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 7.5C8.88071 7.5 10 6.38071 10 5C10 3.61929 8.88071 2.5 7.5 2.5C6.11929 2.5 5 3.61929 5 5C5 6.38071 6.11929 7.5 7.5 7.5Z" stroke="#FDEEE0" strokeWidth="1.25"/>
          <path d="M2.5 13.125C2.5 10.625 5 9.375 7.5 9.375C10 9.375 12.5 10.625 12.5 13.125" stroke="#FDEEE0" strokeWidth="1.25"/>
        </svg>
        <span className="text-white text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
          Ready to browse adoptable animals?
        </span>
        <span className="text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] underline leading-5 cursor-pointer">
          Go to Adopt
        </span>
      </div>
    </div>
  );
}
