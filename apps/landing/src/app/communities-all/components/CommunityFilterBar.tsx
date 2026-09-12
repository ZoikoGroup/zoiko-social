import React from "react";

export default function CommunityFilterBar() {
  return (
    <div className="w-full max-w-[1232px] min-h-[4rem] py-3 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
      {/* Left side: Filters and Sort controls */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Filter Button */}
        <button className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-slate-200 transition-colors inline-flex justify-start items-center gap-2">
          {/* SVG Filter/Sliders Icon */}
          <svg
            className="w-4 h-4 text-slate-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span className="text-slate-900 text-sm font-semibold font-['Plus_Jakarta_Sans']">
            Filters
          </span>
        </button>

        {/* Sort Dropdown */}
        <div className="inline-flex justify-start items-center gap-3">
          <label
            htmlFor="sort-communities"
            className="text-slate-500 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5"
          >
            Sort
          </label>
          <div className="relative">
            <select
              id="sort-communities"
              className="appearance-none pl-4 pr-10 py-2.5 bg-white rounded-xl border border-gray-200 text-slate-900 text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest</option>
              <option value="alphabetical">A - Z</option>
            </select>
            {/* Custom Dropdown Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-900">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Results Count */}
      <div className="flex items-center">
        <span className="text-slate-500 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
          15 communities
        </span>
      </div>
    </div>
  );
}
