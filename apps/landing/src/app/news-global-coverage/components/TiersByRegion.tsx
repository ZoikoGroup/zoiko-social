import React from 'react';

const tableData = [
  { region: 'Africa', t1: 'High', t2: 'High', t3: 'High' },
  { region: 'Asia-Pacific', t1: 'High', t2: 'High', t3: 'High' },
  { region: 'Europe', t1: 'High', t2: 'High', t3: 'High' },
  { region: 'Latin America & Caribbean', t1: 'High', t2: 'High', t3: 'High' },
  { region: 'Middle East & North Africa', t1: 'High', t2: 'High', t3: 'High' },
  { region: 'North America', t1: 'High', t2: 'High', t3: 'High' },
  { region: 'Oceania', t1: 'High', t2: 'High', t3: 'High' },
];

export default function TiersByRegion() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20 bg-white">
      <h2 className="text-[20px] font-extrabold text-[#073B47] mb-2">Tiers by region</h2>
      <p className="text-[13.5px] text-[#5E7076] font-normal mb-8">
        Distribution of active sources across our validation tiers.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-[11px] font-bold text-[#5E7076] uppercase tracking-wider py-4 border-b border-[#DCE5E8]">Region</th>
              <th className="text-left text-[11px] font-bold text-[#5E7076] uppercase tracking-wider py-4 border-b border-[#DCE5E8]">Tier 1 (Core)</th>
              <th className="text-left text-[11px] font-bold text-[#5E7076] uppercase tracking-wider py-4 border-b border-[#DCE5E8]">Tier 2 (Primary)</th>
              <th className="text-left text-[11px] font-bold text-[#5E7076] uppercase tracking-wider py-4 border-b border-[#DCE5E8]">Tier 3 (Local)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-[#F7F9FA]" : "bg-white"}>
                <td className="py-4 px-2 text-[13.5px] text-[#102A32] border-b border-[#DCE5E8]">{row.region}</td>
                <td className="py-4 px-2 text-[13.5px] font-bold text-[#066879] border-b border-[#DCE5E8]">{row.t1}</td>
                <td className="py-4 px-2 text-[13.5px] font-bold text-[#066879] border-b border-[#DCE5E8]">{row.t2}</td>
                <td className="py-4 px-2 text-[13.5px] font-bold text-[#066879] border-b border-[#DCE5E8]">{row.t3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-[#5E7076] mt-4">
        * Tier designations reflect source validation status as defined in our Methodology v1.4.
      </p>
    </div>
  );
}
