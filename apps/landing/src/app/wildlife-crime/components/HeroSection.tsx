import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="flex flex-col w-full max-w-[1272px] mx-auto relative px-6 lg:px-0">
      <div className="flex flex-col lg:flex-row justify-between pt-[35.5px]">
        {/* Left Content Area */}
        <div className="flex flex-col w-full lg:w-[672px]">
          {/* Tag */}
          <div className="inline-flex items-center bg-[#EEF8F9] rounded-[20px] px-3 py-1.5 w-fit mt-[48px]">
            <span className="text-[#073B47] font-semibold text-[12px] tracking-[0.04em] leading-[18px]">
              News · Wildlife Crime
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[#073B47] font-extrabold text-[34px] leading-[51px] tracking-[-0.02em] mt-3">
            Wildlife Crime News
          </h1>

          {/* Subtitle */}
          <p className="text-[#5E7076] text-[15px] leading-[24px] mt-4 max-w-[506px]">
            Verified-source reporting on trafficking, poaching, illegal wildlife trade,
            unlawful capture or possession, enforcement actions, prosecutions and
            judgments — with clear source, legal-stage and safety context.
          </p>

          {/* Update Info */}
          <div className="flex items-start gap-2 mt-6">
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1 flex-shrink-0">
              <path d="M5.5 0C2.46243 0 0 2.46243 0 5.5C0 8.53757 2.46243 11 5.5 11C8.53757 11 11 8.53757 11 5.5C11 2.46243 8.53757 0 5.5 0ZM5.5 9.9C3.07386 9.9 1.1 7.92614 1.1 5.5C1.1 3.07386 3.07386 1.1 5.5 1.1C7.92614 1.1 9.9 3.07386 9.9 5.5C9.9 7.92614 7.92614 9.9 5.5 9.9Z" fill="#5E7076"/>
              <path d="M5.5 2.2C5.19624 2.2 4.95 2.44624 4.95 2.75V5.5C4.95 5.80376 5.19624 6.05 5.5 6.05H7.7C8.00376 6.05 8.25 5.80376 8.25 5.5C8.25 5.19624 8.00376 4.95 7.7 4.95H6.05V2.75C6.05 2.44624 5.80376 2.2 5.5 2.2Z" fill="#5E7076"/>
            </svg>
            <p className="text-[#5E7076] text-[12.5px] leading-[18.75px] max-w-[618px]">
              Updated 22 minutes ago. Stories appear only after source, rights, legal-risk, safety, duplication, sensitive-location and child-safety checks.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-[10px] mt-6">
            <button className="bg-[#073B47] text-white font-semibold text-[14px] rounded-[12px] h-[40px] px-[18px]">
              Explore current wildlife-crime stories
            </button>
            <button className="bg-white text-[#102A32] font-semibold text-[14px] rounded-[12px] h-[40px] px-[19px] border border-[#DCE5E8]">
              How source ratings work
            </button>
          </div>

          {/* Disclaimer Banner */}
          <div className="flex items-center gap-[10px] bg-[#FFF5E8] border border-[#C9701A] rounded-[12px] p-4 mt-6">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM8 14.4C4.46538 14.4 1.6 11.5346 1.6 8C1.6 4.46538 4.46538 1.6 8 1.6C11.5346 1.6 14.4 4.46538 14.4 8C14.4 11.5346 11.5346 14.4 8 14.4Z" fill="#C9701A"/>
              <path d="M7.2 4.8H8.8V6.4H7.2V4.8ZM7.2 8H8.8V11.2H7.2V8Z" fill="#C9701A"/>
            </svg>
            <p className="text-[#C9701A] font-semibold text-[12.5px] leading-[20px]">
              An allegation, investigation or charge is not a conviction. Legal status is shown from source-backed records and may change.
            </p>
          </div>
        </div>

        {/* Right Feature Card */}
        <div className="hidden lg:flex w-[560px] h-[462px] relative mt-[30px] rounded-[28px] overflow-hidden shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] group cursor-pointer">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/wildlife-crime/hero-cargo.png" 
              alt="Multi-country ivory trafficking network dismantled" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#073B47]/85"></div>
          </div>

          {/* Tags */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <div className="bg-white/15 border border-white/25 rounded-[6px] px-[9px] py-[5px] backdrop-blur-sm">
              <span className="text-white font-bold text-[10.5px] leading-[15.75px]">
                Regional Customs Enforcement Bureau · Tier 1
              </span>
            </div>
            <div className="bg-white/15 border border-white/25 rounded-[6px] px-[9px] py-[5px] backdrop-blur-sm">
              <span className="text-white font-bold text-[10.5px] leading-[15.75px]">
                Confiscated
              </span>
            </div>
          </div>
          
          <div className="absolute top-3 left-3 z-10 hidden">
            <div className="bg-white/15 border border-white/30 rounded-[7px] px-[10px] py-[6px] backdrop-blur-sm">
              <span className="text-white font-bold text-[11px] leading-[16.5px]">
                Enforcement action
              </span>
            </div>
          </div>

          {/* Content at Bottom */}
          <div className="absolute bottom-0 left-0 w-full p-5 z-10 flex flex-col justify-end">
            <h2 className="text-white font-bold text-[15px] leading-[20.25px]">
              Multi-country ivory trafficking network dismantled in coordinated<br/>customs operation
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
