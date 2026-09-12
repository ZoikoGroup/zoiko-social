import React from "react";

export default function ConversionBand() {
  return (
    <div className="w-[1232px] h-72 relative bg-gradient-to-r from-cyan-950 via-cyan-950 to-cyan-800 rounded-[32px] overflow-hidden">
      {/* Title */}
      <div className="w-[513.37px] h-16 left-[359.41px] top-[55px] absolute text-center text-white text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-10">
        Found a professional-led community you
        <br />
        want to join?
      </div>

      {/* Subtitle / Description */}
      <div className="w-[459.81px] h-10 left-[386.19px] top-[145px] absolute opacity-90 text-center text-white text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
        Create your Zoiko Social account when you are ready to participate,
        <br />
        follow, or join according to the community&apos;s access rules.
      </div>

      {/* Join Free Button */}
      <div className="w-24 h-10 left-[462.03px] top-[209.50px] absolute bg-orange-500 rounded-xl flex items-center justify-center cursor-pointer">
        <div className="text-center text-white text-sm font-semibold font-['Plus_Jakarta_Sans']">
          Join Free
        </div>
      </div>

      {/* Browse All Communities Button */}
      <div className="w-52 h-10 left-[568.72px] top-[209.50px] absolute rounded-xl outline outline-1 outline-offset-[-1px] outline-white/50 flex items-center justify-center cursor-pointer">
        <div className="text-center text-white text-sm font-semibold font-['Plus_Jakarta_Sans']">
          Browse All Communities
        </div>
      </div>
    </div>
  );
}
