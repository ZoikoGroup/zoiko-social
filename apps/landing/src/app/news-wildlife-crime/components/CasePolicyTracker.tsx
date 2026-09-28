import React from 'react';

const CasePolicyTracker = () => {
  return (
    <section className="w-full max-w-[1272px] mx-auto bg-white border border-[#DCE5E8] rounded-[28px] mt-10 p-8 lg:p-[29px_31px]">
      <div className="flex flex-col mb-10">
        <h2 className="text-[#073B47] font-extrabold text-[20px] leading-[30px] tracking-[-0.01em]">
          Case & policy tracker
        </h2>
        <p className="text-[#5E7076] text-[13.5px] mt-2 max-w-[680px]">
          Only shown for reliable public case or policy objects. Tracking sends alerts on material changes only — never every mention.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Case Tracker */}
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#DCE5E8]">
            <h3 className="text-[#102A32] font-bold text-[15px]">
              Regional ivory smuggling prosecution (previously reported as Prosecution active)
            </h3>
            <button className="mt-4 md:mt-0 bg-white text-[#102A32] font-semibold text-[13px] rounded-[10px] h-[32px] px-4 border border-[#DCE5E8]">
              Track this case
            </button>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#073B47]"></div>
              <span className="text-[#073B47] font-semibold text-[11.5px]">Charged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#073B47]"></div>
              <span className="text-[#073B47] font-semibold text-[11.5px]">Case in court</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5.5" cy="5.5" r="5.5" fill="#E88924"/>
                <path d="M3.5 5.5L5 7L8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[#E88924] font-bold text-[11.5px]">Acquitted</span>
            </div>
          </div>
        </div>

        {/* Policy Tracker */}
        <div className="flex flex-col mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#DCE5E8]">
            <h3 className="text-[#102A32] font-bold text-[15px]">
              Cross-border wildlife trafficking task force (policy)
            </h3>
            <button className="mt-4 md:mt-0 bg-white text-[#102A32] font-semibold text-[13px] rounded-[10px] h-[32px] px-4 border border-[#DCE5E8]">
              Track this policy
            </button>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5.5" cy="5.5" r="5.5" fill="#E88924"/>
                <path d="M3.5 5.5L5 7L8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[#E88924] font-bold text-[11.5px]">Announced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#DCE5E8]"></div>
              <span className="text-[#5E7076] font-semibold text-[11.5px]">Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#DCE5E8]"></div>
              <span className="text-[#5E7076] font-semibold text-[11.5px]">Reviewed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CasePolicyTracker;
