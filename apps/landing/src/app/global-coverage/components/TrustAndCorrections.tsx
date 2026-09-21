import React from 'react';

export default function TrustAndCorrections() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20 bg-white">
      <h2 className="text-[20px] font-extrabold text-[#073B47] mb-8">Trust & corrections</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#DCE5E8] rounded-[16px] p-8 flex flex-col justify-start">
          <h3 className="text-[15px] font-extrabold text-[#102A32] mb-3">Source Standards</h3>
          <p className="text-[13.5px] text-[#5E7076] leading-relaxed mb-6">
            Every source carries a rating against our published standards. A rating is publisher-level context — never a guarantee that a specific article is accurate, complete, or current.
          </p>
          <div className="mt-auto pt-2">
            <button className="bg-white border border-[#DCE5E8] rounded-md px-4 py-2 hover:bg-[#F7F9FA] transition">
              <span className="text-[12px] font-bold text-[#073B47] underline decoration-1 underline-offset-4">
                View Source Standards
              </span>
            </button>
          </div>
        </div>
        
        <div className="border border-[#DCE5E8] rounded-[16px] p-8 flex flex-col justify-start">
          <h3 className="text-[15px] font-extrabold text-[#102A32] mb-3">Corrections & retractions</h3>
          <p className="text-[13.5px] text-[#5E7076] leading-relaxed mb-6">
            Material corrections propagate to region feeds, comparison clusters, saved items, share previews, and alerts — never left stale in just one place.
          </p>
          <div className="mt-auto pt-2">
            <button className="bg-white border border-[#DCE5E8] rounded-md px-4 py-2 hover:bg-[#F7F9FA] transition">
              <span className="text-[12px] font-bold text-[#073B47] underline decoration-1 underline-offset-4">
                Report an Inaccuracy
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
