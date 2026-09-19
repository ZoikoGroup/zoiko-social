import React from 'react';

export default function CoverageSnapshot() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mt-20 mb-20 bg-[#F7F9FA]">
      <h2 className="text-[22px] font-extrabold text-[#073B47] mb-2 leading-[33px] tracking-[-0.01em]">
        Coverage snapshot
      </h2>
      <p className="text-[13.5px] text-[#5E7076] font-normal mb-8">
        Descriptive signals, not a claim of completeness.
      </p>
      
      <div className="bg-[#EEF8F9] rounded-[28px] py-10 px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-4">
        <div>
          <div className="text-[26px] font-extrabold text-[#073B47]">7</div>
          <div className="text-[12px] text-[#5E7076]">Active coverage regions</div>
        </div>
        <div>
          <div className="text-[26px] font-extrabold text-[#073B47]">42</div>
          <div className="text-[12px] text-[#5E7076]">Distinct eligible sources</div>
        </div>
        <div>
          <div className="text-[26px] font-extrabold text-[#073B47]">11</div>
          <div className="text-[12px] text-[#5E7076]">Languages represented</div>
        </div>
        <div>
          <div className="text-[26px] font-extrabold text-[#073B47]">18 min</div>
          <div className="text-[12px] text-[#5E7076]">Since last material update</div>
        </div>
      </div>
      
      <p className="text-[12px] text-[#5E7076] max-w-3xl">
        "Active regions" means regions with publishable coverage in the current window — not every region of the world. 
        Story and source counts reflect canonical, non-duplicate entries. Methodology v1.4, generated moments ago.
      </p>
    </div>
  );
}
