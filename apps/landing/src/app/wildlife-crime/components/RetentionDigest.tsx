import React from 'react';

const RetentionDigest = () => {
  return (
    <section className="w-full max-w-[1272px] mx-auto bg-gradient-to-br from-[#073B47] to-[#0C2F38] rounded-[32px] mt-10 p-8 lg:p-[36px_40px] flex flex-col lg:flex-row lg:items-center justify-between">
      <div className="flex flex-col mb-6 lg:mb-0">
        <h2 className="text-white font-extrabold text-[21px] leading-[31.5px] tracking-[-0.01em]">
          Follow calmly, not anxiously.
        </h2>
        <p className="text-white/90 text-[13px] leading-[19.5px] mt-2 max-w-[417px]">
          Follow Wildlife Crime and choose a cadence. You'll only hear about material case or policy changes — never every mention, comment, or reaction.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center justify-between px-[18px] py-[11px] bg-white/12 border border-white/40 rounded-xl h-[39px] w-[186px] cursor-pointer">
          <span className="text-white text-[13.5px] leading-[15px]">Weekly digest</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <button className="bg-[#E88924] text-white font-semibold text-[14px] rounded-xl h-[38px] px-6 transition-colors hover:bg-[#c9701a]">
          Save preference
        </button>
      </div>
    </section>
  );
};

export default RetentionDigest;
