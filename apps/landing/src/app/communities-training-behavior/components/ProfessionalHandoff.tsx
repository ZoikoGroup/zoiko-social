import React from "react";

export default function ProfessionalHandoff() {
  return (
    <div className="w-full bg-white outline outline-1 outline-dashed outline-offset-[-1px] outline-zinc-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5">
      <div className="size-11 bg-cyan-50 rounded-xl flex items-center justify-center shrink-0">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.0007 10.9993C13.0257 10.9993 14.6673 9.35773 14.6673 7.33268C14.6673 5.30764 13.0257 3.66602 11.0007 3.66602C8.97561 3.66602 7.33398 5.30764 7.33398 7.33268C7.33398 9.35773 8.97561 10.9993 11.0007 10.9993Z" stroke="#073B47" strokeWidth="1.83333"/>
          <path d="M3.66602 18.334C3.66602 14.6673 6.96602 12.834 10.9993 12.834C15.0327 12.834 18.3327 14.6673 18.3327 18.334" stroke="#073B47" strokeWidth="1.83333" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="text-teal-950 text-[15px] font-bold font-['Plus_Jakarta_Sans'] leading-[22.5px]">
          Looking for professionally run communities?
        </div>
        <div className="text-gray-500 text-[13px] font-normal font-['Plus_Jakarta_Sans'] leading-[19.5px]">
          Zoiko Social has a separate Professional Communities destination.
          Professional status is governed separately from Training &amp;
          Behavior purpose.
        </div>
      </div>

      <div className="w-full sm:w-auto h-[41px] px-5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors shrink-0">
        <span className="text-cyan-950 text-sm font-semibold font-['Plus_Jakarta_Sans']">
          Explore Professional Communities
        </span>
      </div>
    </div>
  );
}
