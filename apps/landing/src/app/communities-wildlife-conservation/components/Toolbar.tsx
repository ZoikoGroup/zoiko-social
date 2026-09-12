import React from "react";

export default function Toolbar() {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 pb-5 border-b border-zinc-200">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
        {/* Search Input */}
        <div className="w-full sm:w-96 h-10 px-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center gap-2.5">
          <svg width="15" height="16" viewBox="0 0 14.94 16.0027" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M6.8475 11.7363C9.25408 11.7363 11.205 9.78542 11.205 7.37884C11.205 4.97226 9.25408 3.02134 6.8475 3.02134C4.44092 3.02134 2.49 4.97226 2.49 7.37884C2.49 9.78542 4.44092 11.7363 6.8475 11.7363Z" stroke="#102A32" strokeWidth="1.25"/>
            <path d="M13.0717 13.6034L10.3643 10.896" stroke="#102A32" strokeWidth="1.25"/>
          </svg>
          <input
            type="text"
            placeholder="Search wildlife & conservation communities"
            className="w-full bg-transparent text-sm font-normal font-['Plus_Jakarta_Sans'] text-neutral-500 placeholder:text-neutral-500 outline-none"
          />
        </div>

        {/* Filters + Sort share a row on mobile, matching the mobile frame */}
        <div className="flex items-center justify-between sm:justify-start sm:contents">
          <FiltersButton />
          <div className="sm:hidden">
            <SortDropdown />
          </div>
        </div>
      </div>

      {/* Sort Dropdown (desktop: pinned to the far right) */}
      <div className="hidden sm:flex">
        <SortDropdown />
      </div>
    </div>
  );
}

function FiltersButton() {
  return (
    <div className="h-9 px-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 3.75H12.5" stroke="#102A32" strokeWidth="1.25"/>
        <path d="M5.625 5C6.31536 5 6.875 4.44036 6.875 3.75C6.875 3.05964 6.31536 2.5 5.625 2.5C4.93464 2.5 4.375 3.05964 4.375 3.75C4.375 4.44036 4.93464 5 5.625 5Z" stroke="#102A32" strokeWidth="1.25"/>
        <path d="M2.5 7.5H12.5" stroke="#102A32" strokeWidth="1.25"/>
        <path d="M10 8.75C10.6904 8.75 11.25 8.19036 11.25 7.5C11.25 6.80964 10.6904 6.25 10 6.25C9.30964 6.25 8.75 6.80964 8.75 7.5C8.75 8.19036 9.30964 8.75 10 8.75Z" stroke="#102A32" strokeWidth="1.25"/>
        <path d="M2.5 11.25H12.5" stroke="#102A32" strokeWidth="1.25"/>
        <path d="M6.25 12.5C6.94036 12.5 7.5 11.9404 7.5 11.25C7.5 10.5596 6.94036 10 6.25 10C5.55964 10 5 10.5596 5 11.25C5 11.9404 5.55964 12.5 6.25 12.5Z" stroke="#102A32" strokeWidth="1.25"/>
      </svg>
      <span className="text-teal-950 text-sm font-semibold font-['Plus_Jakarta_Sans']">
        Filters
      </span>
    </div>
  );
}

function SortDropdown() {
  return (
    <div className="flex items-center gap-1.5 cursor-pointer">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.33301 3.5H11.6663M2.33301 7H8.16634M2.33301 10.5H5.83301" stroke="#5E7076" strokeWidth="1.16667"/>
      </svg>
      <span className="text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5">
        Sort: Relevance
      </span>
    </div>
  );
}
