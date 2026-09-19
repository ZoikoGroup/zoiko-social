import React from 'react';

const regions = [
  { name: 'All Regions', active: true },
  { name: 'Africa', active: false },
  { name: 'Asia-Pacific', active: false },
  { name: 'Europe', active: false },
  { name: 'Latin America & Caribbean', active: false },
  { name: 'Middle East & North Africa', active: false },
  { name: 'North America', active: false },
  { name: 'Oceania', active: false },
];

export default function RegionNavigator() {
  return (
    <div className="mt-16 w-full max-w-[1320px] mx-auto px-6 lg:px-[24px]">
      <h2 className="text-[20px] font-extrabold text-[#073B47] mb-6">Choose a region</h2>
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide items-center">
        {regions.map((region) => (
          <button
            key={region.name}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[13.5px] font-semibold border transition ${
              region.active
                ? 'bg-[#066879] text-white border-[#066879]'
                : 'bg-white text-[#5E7076] border-[#DCE5E8] hover:bg-[#F7F9FA]'
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>
    </div>
  );
}
