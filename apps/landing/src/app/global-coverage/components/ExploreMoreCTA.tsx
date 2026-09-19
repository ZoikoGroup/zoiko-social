import React from 'react';

export default function ExploreMoreCTA() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-10">
      <div className="bg-[#073B47] rounded-[32px] p-10 md:p-16 text-white flex flex-col items-center justify-center text-center">
        <h2 className="text-[26px] md:text-[32px] font-extrabold mb-4 leading-tight max-w-2xl">
          Explore more coverage from a region that matters to you.
        </h2>
        <p className="text-[13.5px] text-[#DCE5E8] mb-8 max-w-xl">
          Publishable coverage is available in regions across the globe. Select a region to dive deeper into local stories and updates.
        </p>
        <div className="flex gap-4">
          <button className="bg-[#E88924] hover:bg-[#c9701a] text-white px-6 py-3 rounded-xl font-bold transition">
            View Regions
          </button>
          <button className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold transition">
            View Global Journal
          </button>
        </div>
      </div>
    </div>
  );
}
