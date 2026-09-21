import React from 'react';

const tableData = [
  { region: 'Africa' },
  { region: 'Asia-Pacific' },
  { region: 'Europe' },
  { region: 'Latin America & Caribbean' },
  { region: 'Middle East & North Africa' },
  { region: 'North America' },
  { region: 'Oceania' },
];

export default function TopicByRegion() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20 bg-white">
      <h2 className="text-[20px] font-extrabold text-[#073B47] mb-2">Topic by region</h2>
      <p className="text-[13.5px] text-[#5E7076] font-normal mb-8">
        Jump straight into a topic within a specific region.
      </p>

      <div className="overflow-x-auto border border-[#DCE5E8] rounded-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F7F9FA]">
              <th className="text-left text-[11px] font-bold text-[#5E7076] uppercase tracking-wider py-4 px-4 border border-[#DCE5E8]">Region</th>
              <th className="text-left text-[11px] font-bold text-[#5E7076] uppercase tracking-wider py-4 px-4 border border-[#DCE5E8]">Animal Welfare</th>
              <th className="text-left text-[11px] font-bold text-[#5E7076] uppercase tracking-wider py-4 px-4 border border-[#DCE5E8]">Conservation</th>
              <th className="text-left text-[11px] font-bold text-[#5E7076] uppercase tracking-wider py-4 px-4 border border-[#DCE5E8]">Wildlife Crime</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx} className="bg-white">
                <td className="py-4 px-4 text-[13.5px] text-[#102A32] border border-[#DCE5E8]">{row.region}</td>
                <td className="py-4 px-4 text-[13.5px] font-bold border border-[#DCE5E8]">
                  <a href="#" className="text-[#066879] underline underline-offset-2 decoration-2 hover:text-[#073B47]">View</a>
                </td>
                <td className="py-4 px-4 text-[13.5px] font-bold border border-[#DCE5E8]">
                  <a href="#" className="text-[#066879] underline underline-offset-2 decoration-2 hover:text-[#073B47]">View</a>
                </td>
                <td className="py-4 px-4 text-[13.5px] font-bold border border-[#DCE5E8]">
                  <a href="#" className="text-[#066879] underline underline-offset-2 decoration-2 hover:text-[#073B47]">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-[#5E7076] mt-4">
        This table is the accessible, always-available equivalent of any visual region browsing — no map dependency for core navigation.
      </p>
    </div>
  );
}
