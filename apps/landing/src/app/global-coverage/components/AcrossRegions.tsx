import React from 'react';

export default function AcrossRegions() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20 bg-[#F7F9FA] py-16 rounded-[32px]">
      <h2 className="text-[22px] font-extrabold text-[#073B47] mb-2">Across regions</h2>
      <p className="text-[13.5px] text-[#5E7076] font-normal mb-8">
        The same issue, reported from more than one region — clustered by canonical story, not keyword coincidence.
      </p>

      <div className="bg-white border border-[#DCE5E8] rounded-[28px] p-8">
        <h3 className="text-[17px] font-extrabold text-[#073B47] mb-2">
          International wildlife trafficking task force draws regional coverage
        </h3>
        <p className="text-[12.5px] text-[#5E7076] mb-8">
          Coverage from three regions on the same announced initiative. Material corrections propagate to every card in this cluster.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#DCE5E8] rounded-[12px] p-5 flex flex-col">
            <span className="inline-block bg-[#EEF8F9] text-[#073B47] text-[11px] font-bold px-3 py-1 rounded-md self-start mb-4">
              Asia-Pacific
            </span>
            <h4 className="text-[13.5px] font-bold text-[#102A32] leading-snug mb-4">
              Regional customs bureaus align on new trafficking task force
            </h4>
            <div className="mt-auto">
              <p className="text-[12px] text-[#5E7076] mb-1">Regional Customs Enforcement Bureau · Tier 1</p>
              <p className="text-[11px] text-[#5E7076]">Published 2 days ago</p>
            </div>
          </div>
          
          <div className="border border-[#DCE5E8] rounded-[12px] p-5 flex flex-col">
            <span className="inline-block bg-[#EEF8F9] text-[#073B47] text-[11px] font-bold px-3 py-1 rounded-md self-start mb-4">
              Africa
            </span>
            <h4 className="text-[13.5px] font-bold text-[#102A32] leading-snug mb-4">
              Cross-border enforcement cooperation expands to new corridor
            </h4>
            <div className="mt-auto">
              <p className="text-[12px] text-[#5E7076] mb-1">Continental Wildlife Enforcement Wire · Tier 1</p>
              <p className="text-[11px] text-[#5E7076]">Published 1 day ago</p>
            </div>
          </div>

          <div className="border border-[#DCE5E8] rounded-[12px] p-5 flex flex-col">
            <span className="inline-block bg-[#EEF8F9] text-[#073B47] text-[11px] font-bold px-3 py-1 rounded-md self-start mb-4">
              Europe
            </span>
            <h4 className="text-[13.5px] font-bold text-[#102A32] leading-snug mb-4">
              EU-linked agencies confirm participation in trafficking task force
            </h4>
            <div className="mt-auto">
              <p className="text-[12px] text-[#5E7076] mb-1">European Policy Desk · Tier 2</p>
              <p className="text-[11px] text-[#5E7076]">Published 6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
