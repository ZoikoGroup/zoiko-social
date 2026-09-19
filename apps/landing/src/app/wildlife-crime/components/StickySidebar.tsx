import React from 'react';

const StickySidebar = () => {
  return (
    <div className="hidden lg:flex flex-col w-[320px] flex-shrink-0 gap-6 sticky top-24 self-start">
      {/* Legal stage at a glance */}
      <div className="bg-white border border-[#DCE5E8] rounded-3xl p-6">
        <h3 className="text-[#102A32] font-extrabold text-[15px] leading-[22px] tracking-[-0.01em] mb-2">
          Legal stage, at a glance
        </h3>
        <p className="text-[#5E7076] text-[12.5px] leading-[1.6] mb-5">
          Each stage is server-recorded, not inferred from a headline.
        </p>

        <div className="flex flex-col gap-3.5">
          <div className="flex items-start gap-3">
            <span className="text-[#102A32] font-bold text-[12.5px] min-w-[60px]">Charged</span>
            <span className="text-[#5E7076] text-[12.5px]">≠ convicted.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#102A32] font-bold text-[12.5px] min-w-[60px] leading-[1.3]">Acquitted /<br/>dismissed</span>
            <span className="text-[#5E7076] text-[12.5px] leading-[1.3]">updates the record — old<br/>snippets don't linger.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#102A32] font-bold text-[12.5px] min-w-[60px] leading-[1.3]">Final<br/>judgment</span>
            <span className="text-[#5E7076] text-[12.5px] leading-[1.3]">is terminal unless an extraordinary<br/>legal update occurs.</span>
          </div>
        </div>

        <a
          href="#legal-explainer"
          className="text-[#066879] font-bold text-[13px] mt-5 inline-block hover:underline"
        >
          See full stage explainer
        </a>
      </div>

      {/* Source Standards */}
      <div className="bg-white border border-[#DCE5E8] rounded-3xl p-6">
        <h3 className="text-[#102A32] font-extrabold text-[15px] leading-[22px] tracking-[-0.01em] mb-2">
          Source Standards
        </h3>
        <p className="text-[#5E7076] text-[12.5px] leading-[1.6]">
          Source rating reflects the publisher against our published standards — not a guarantee of every claim in every story. Organization/advocacy statements are always labeled, never shown as neutral court or authority records.
        </p>
      </div>

      {/* Report something */}
      <div className="bg-white border border-[#DCE5E8] rounded-3xl p-6">
        <h3 className="text-[#102A32] font-extrabold text-[15px] leading-[22px] tracking-[-0.01em] mb-2">
          Report something
        </h3>
        <p className="text-[#5E7076] text-[12.5px] leading-[1.6] mb-5">
          These routes stay separate on purpose.
        </p>

        <div className="flex flex-col gap-2.5">
          <div className="bg-[#F7F9FA] rounded-xl p-3 flex items-start gap-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 flex-shrink-0">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#102A32" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#102A32" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[12px] leading-[1.45] text-[#5E7076]">
              <span className="text-[#102A32] font-bold">Report an inaccuracy</span> A factual or sourcing problem with a specific story.
            </p>
          </div>

          <div className="bg-[#F7F9FA] rounded-xl p-3 flex items-start gap-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 flex-shrink-0">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#102A32" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 11V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V11" stroke="#102A32" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[12px] leading-[1.45] text-[#5E7076]">
              <span className="text-[#102A32] font-bold">Report a wildlife crime / safety concern</span> Confidential intake — never published as a story by default.
            </p>
          </div>

          <div className="bg-[#F7F9FA] rounded-xl p-3 flex items-start gap-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 flex-shrink-0">
              <path d="M12 9V13" stroke="#102A32" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="17.5" r="1.5" fill="#102A32"/>
              <path d="M10.29 3.86001L1.82002 18C1.64539 18.3024 1.55299 18.6453 1.55201 18.9945C1.55103 19.3438 1.64151 19.6872 1.81445 19.9905C1.98738 20.2939 2.23675 20.5468 2.53773 20.7239C2.83871 20.901 3.18082 20.9962 3.53002 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5468 22.0126 20.2939 22.1856 19.9905C22.3585 19.6872 22.449 19.3438 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86001C13.5317 3.56613 13.28 3.32314 12.9804 3.1545C12.6808 2.98587 12.3437 2.89727 12 2.89727C11.6563 2.89727 11.3192 2.98587 11.0196 3.1545C10.72 3.32314 10.4683 3.56613 10.29 3.86001Z" stroke="#102A32" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[12px] leading-[1.45] text-[#5E7076]">
              <span className="text-[#102A32] font-bold">Immediate danger?</span> Contact local authorities directly — Zoiko Social cannot dispatch emergency response.
            </p>
          </div>
        </div>
      </div>

      {/* Why some locations are limited */}
      <div className="bg-white border border-[#DCE5E8] rounded-3xl p-6">
        <h3 className="text-[#102A32] font-extrabold text-[15px] leading-[22px] tracking-[-0.01em] mb-2">
          Why some locations are limited
        </h3>
        <p className="text-[#5E7076] text-[12.5px] leading-[1.6]">
          Exact poaching sites, active enforcement routes, undercover identities, and vulnerable-wildlife holding or release locations are broadened, delayed, or withheld — even when a source mentions them — to avoid enabling trafficking, poaching, or interference with enforcement.
        </p>
      </div>
    </div>
  );
};

export default StickySidebar;
