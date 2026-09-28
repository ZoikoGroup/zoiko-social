import React from 'react';

export default function TrendsAndExpectations() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20 bg-white">
      <h2 className="text-[20px] font-extrabold text-[#073B47] mb-8">Trend & expectations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#DCE5E8] rounded-[16px] p-6 flex flex-col justify-start">
          <h3 className="text-[13.5px] font-extrabold text-[#102A32] mb-2">Local translation</h3>
          <p className="text-[12.5px] text-[#5E7076]">
            We expect an increase in Tier 3 source availability in Latin America over the next quarter, which will require additional translation capacity for localized reports.
          </p>
        </div>
        
        <div className="border border-[#DCE5E8] rounded-[16px] p-6 flex flex-col justify-start">
          <h3 className="text-[13.5px] font-extrabold text-[#102A32] mb-2">Directional sentiment</h3>
          <p className="text-[12.5px] text-[#5E7076]">
            Initial signals suggest a shift toward cross-border enforcement cooperation in the Asia-Pacific region, likely resulting in clustered coverage in the coming weeks.
          </p>
        </div>
      </div>
    </div>
  );
}
