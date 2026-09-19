import React from 'react';

const EvidenceLegend = () => {
  return (
    <section className="w-full max-w-[1272px] mx-auto bg-[#F7F9FA] rounded-[28px] mt-10 p-8 lg:p-[40px_28px]">
      <h2 className="text-[#073B47] font-extrabold text-[19px] leading-[28.5px] tracking-[-0.01em] mb-6">
        How to read evidence labels
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1 */}
        <div className="bg-white border border-[#DCE5E8] rounded-[10px] p-3 flex flex-col sm:flex-row gap-3">
          <div className="bg-[#FFF5E8] rounded-md px-2 py-1 h-fit flex-shrink-0">
            <span className="text-[#C9701A] font-bold text-[10.5px]">Official enforcement record</span>
          </div>
          <p className="text-[#5E7076] text-[12px] leading-[1.5]">Highest process authority for that enforcement action — still not proof of guilt.</p>
        </div>

        <div className="bg-white border border-[#DCE5E8] rounded-[10px] p-3 flex flex-col sm:flex-row gap-3">
          <div className="bg-[#FFF5E8] rounded-md px-2 py-1 h-fit flex-shrink-0">
            <span className="text-[#C9701A] font-bold text-[10.5px]">Court filing</span>
          </div>
          <p className="text-[#5E7076] text-[12px] leading-[1.5]">A filing or claim — not a final judgment.</p>
        </div>

        {/* Row 2 */}
        <div className="bg-white border border-[#DCE5E8] rounded-[10px] p-3 flex flex-col sm:flex-row gap-3">
          <div className="bg-[#FFF5E8] rounded-md px-2 py-1 h-fit flex-shrink-0">
            <span className="text-[#C9701A] font-bold text-[10.5px]">Court judgment</span>
          </div>
          <p className="text-[#5E7076] text-[12px] leading-[1.5]">Jurisdiction and date shown; appeal status noted when known.</p>
        </div>

        <div className="bg-white border border-[#DCE5E8] rounded-[10px] p-3 flex flex-col sm:flex-row gap-3">
          <div className="bg-[#FFF5E8] rounded-md px-2 py-1 h-fit flex-shrink-0">
            <span className="text-[#C9701A] font-bold text-[10.5px]">Law or regulation</span>
          </div>
          <p className="text-[#5E7076] text-[12px] leading-[1.5]">Legal/policy context — not proof of any specific incident.</p>
        </div>

        {/* Row 3 */}
        <div className="bg-white border border-[#DCE5E8] rounded-[10px] p-3 flex flex-col sm:flex-row gap-3">
          <div className="bg-[#FFF5E8] rounded-md px-2 py-1 h-fit flex-shrink-0">
            <span className="text-[#C9701A] font-bold text-[10.5px]">Intergovernmental report</span>
          </div>
          <p className="text-[#5E7076] text-[12px] leading-[1.5]">Scope and date attributed to the issuing body.</p>
        </div>

        <div className="bg-white border border-[#DCE5E8] rounded-[10px] p-3 flex flex-col sm:flex-row gap-3">
          <div className="bg-[#FFF5E8] rounded-md px-2 py-1 h-fit flex-shrink-0">
            <span className="text-[#C9701A] font-bold text-[10.5px]">Organization report</span>
          </div>
          <p className="text-[#5E7076] text-[12px] leading-[1.5]">Labeled as the organization&apos;s own statement, never shown as a court or authority finding.</p>
        </div>

        {/* Row 4 */}
        <div className="bg-white border border-[#DCE5E8] rounded-[10px] p-3 flex flex-col sm:flex-row gap-3">
          <div className="bg-[#FFF5E8] rounded-md px-2 py-1 h-fit flex-shrink-0">
            <span className="text-[#C9701A] font-bold text-[10.5px]">Investigative reporting</span>
          </div>
          <p className="text-[#5E7076] text-[12px] leading-[1.5]">Attributed to the publisher; confidential sourcing explained if the publisher discloses it.</p>
        </div>

        <div className="bg-white border border-[#DCE5E8] rounded-[10px] p-3 flex flex-col sm:flex-row gap-3">
          <div className="bg-[#FFF5E8] rounded-md px-2 py-1 h-fit flex-shrink-0">
            <span className="text-[#C9701A] font-bold text-[10.5px]">Multi-source reporting</span>
          </div>
          <p className="text-[#5E7076] text-[12px] leading-[1.5]">Coverage drawn from more than one independent outlet.</p>
        </div>
      </div>
    </section>
  );
};

export default EvidenceLegend;
