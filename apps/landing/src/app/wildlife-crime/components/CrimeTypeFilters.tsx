import React from 'react';

const CrimeTypeFilters = () => {
  const filters = [
    { label: "All Wildlife Crime", active: true },
    { label: "Illegal Wildlife Trade", active: false },
    { label: "Poaching", active: false },
    { label: "Unlawful Capture/Possession", active: false },
    { label: "Seizures & Interdictions", active: false },
    { label: "Investigations & Charges", active: false },
    { label: "Courts & Judgments", active: false },
    { label: "Enforcement Policy", active: false },
  ];

  return (
    <div className="w-full max-w-[1272px] mx-auto px-6 lg:px-0 mt-[102px]">
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter, index) => (
          <button
            key={index}
            className={`h-[34px] rounded-full px-4 border text-[13px] font-semibold flex items-center justify-center transition-colors ${
              filter.active
                ? 'bg-[#073B47] text-white border-[#073B47]'
                : 'bg-white text-[#5E7076] border-[#DCE5E8] hover:border-[#073B47] hover:text-[#073B47]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DCE5E8] py-4 mt-8">
        <button className="flex items-center gap-2 bg-white border border-[#DCE5E8] rounded-xl h-[37px] px-4 hover:bg-gray-50">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 4.375H12.5M4.375 7.5H10.625M6.25 10.625H8.75" stroke="#102A32" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[#102A32] font-semibold text-[13.5px]">More filters</span>
        </button>
        
        <div className="flex items-center gap-2 mt-4 sm:mt-0 cursor-pointer group">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:opacity-80">
            <path d="M4.08333 9.91667L7 12.8333L9.91667 9.91667M7 12.8333V1.16667M9.91667 4.08333L7 1.16667L4.08333 4.08333" stroke="#5E7076" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[#5E7076] font-semibold text-[13px] group-hover:text-[#073B47]">
            Sort: Relevant & Recent
          </span>
        </div>
      </div>
    </div>
  );
};

export default CrimeTypeFilters;
