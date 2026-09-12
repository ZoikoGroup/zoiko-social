import React from "react";

export default function SearchFilters() {
  return (
    <div className="w-full flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="flex flex-col gap-1.5 flex-1 sm:max-w-[560px]">
          <label className="text-cyan-950 text-[13px] font-bold font-['Plus_Jakarta_Sans']">
            Search
          </label>
          <div className="h-[46px] px-[18px] bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center gap-2.5">
            <svg width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M7.79167 13.4583C10.7752 13.4583 13.1917 11.0419 13.1917 8.05833C13.1917 5.07478 10.7752 2.65833 7.79167 2.65833C4.80812 2.65833 2.39167 5.07478 2.39167 8.05833C2.39167 11.0419 4.80812 13.4583 7.79167 13.4583Z" stroke="#5E7076" strokeWidth="1.41667"/>
              <path d="M14.6083 14.875L11.925 12.1917" stroke="#5E7076" strokeWidth="1.41667" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search Training & Behavior communities"
              className="w-full bg-transparent text-sm font-normal font-['Plus_Jakarta_Sans'] text-neutral-500 placeholder:text-neutral-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 sm:w-[220px]">
          <label className="text-cyan-950 text-[13px] font-bold font-['Plus_Jakarta_Sans']">
            Species
          </label>
          <div className="h-[46px] px-[18px] bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center cursor-pointer">
            <span className="text-neutral-500 text-sm font-normal font-['Plus_Jakarta_Sans']">
              Any species
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-1.5 w-[148px]">
          <label className="text-cyan-950 text-[13px] font-bold font-['Plus_Jakarta_Sans']">
            Sort
          </label>
          <div className="h-[47px] px-[18px] bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center cursor-pointer">
            <span className="text-cyan-950 text-[13.5px] font-normal font-['Plus_Jakarta_Sans']">
              Relevance
            </span>
          </div>
        </div>

        <div className="h-[47px] px-5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors shrink-0">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 3.75H8.75M2.5 7.5H12.5M2.5 11.25H6.875" stroke="#102A32" strokeWidth="1.25" strokeLinecap="round"/>
            <path d="M10.625 5.125C11.3844 5.125 12 4.50939 12 3.75C12 2.99061 11.3844 2.375 10.625 2.375C9.86561 2.375 9.25 2.99061 9.25 3.75C9.25 4.50939 9.86561 5.125 10.625 5.125Z" stroke="#102A32" strokeWidth="1.25"/>
            <path d="M5.625 12.625C6.38439 12.625 7 12.0094 7 11.25C7 10.4906 6.38439 9.875 5.625 9.875C4.86561 9.875 4.25 10.4906 4.25 11.25C4.25 12.0094 4.86561 12.625 5.625 12.625Z" stroke="#102A32" strokeWidth="1.25"/>
          </svg>
          <span className="text-cyan-950 text-[13.5px] font-bold font-['Plus_Jakarta_Sans'] whitespace-nowrap">
            More filters
          </span>
        </div>
      </div>
    </div>
  );
}
