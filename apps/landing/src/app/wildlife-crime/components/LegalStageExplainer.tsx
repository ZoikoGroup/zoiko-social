import React from 'react';

const LegalStageExplainer = () => {
  return (
    <section className="w-full max-w-[1272px] mx-auto bg-[#EEF8F9] border border-[#DCE5E8] rounded-[28px] mt-10 p-8 lg:p-10">
      <div className="flex flex-col mb-8">
        <h2 className="text-[#073B47] font-extrabold text-[20px] leading-[30px] tracking-[-0.01em]">
          Legal & enforcement stage explainer
        </h2>
        <p className="text-[#5E7076] text-[13.5px] mt-2">
          Plain-language definitions only — this is not legal advice, and no stage implies the next.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Row 1 */}
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Allegation reported</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">A claim has been reported publicly; not yet confirmed by an investigation.</p>
        </div>
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Investigation confirmed</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">An authority has confirmed an active investigation is underway.</p>
        </div>
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Enforcement action</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">Authorities took a confirmed action — a seizure, raid, or similar — without an individual charge yet.</p>
        </div>

        {/* Row 2 */}
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Charged</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">A person or entity has been formally charged. This is not a finding of guilt.</p>
        </div>
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Case in court</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">Prosecution is actively proceeding through the court system.</p>
        </div>
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Convicted</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">A court has found guilt. May still be subject to appeal.</p>
        </div>

        {/* Row 3 */}
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Acquitted</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">A court found the defendant not guilty.</p>
        </div>
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Case dismissed</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">The case was dismissed before reaching a verdict.</p>
        </div>
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Appeal active</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">A party is actively appealing a prior ruling.</p>
        </div>

        {/* Row 4 */}
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Final judgment</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">The legal process has concluded with no further appeal pending.</p>
        </div>
        <div className="bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl p-4">
          <h3 className="text-[#102A32] font-bold text-[12.5px] mb-1">Status not confirmed</h3>
          <p className="text-[#5E7076] text-[11.5px] leading-[1.5]">No badge shown — we don&apos;t infer a stage without a confirmed source record.</p>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-[#FFF5E8] border border-[#C9701A] rounded-xl p-4 mt-8">
        <p className="text-[#C9701A] font-semibold text-[13px] leading-[1.6]">
          Never infer guilt from a seizure, arrest, investigation, charge, social post, or organization allegation. Public stage labels come from confirmed records — not from headline tone.
        </p>
      </div>
    </section>
  );
};

export default LegalStageExplainer;
