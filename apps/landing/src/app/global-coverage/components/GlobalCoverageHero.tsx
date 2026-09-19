import React from 'react';
import Image from 'next/image';

export default function GlobalCoverageHero() {
  return (
    <section className="relative w-full rounded-[28px] overflow-hidden bg-[#073B47] text-white mt-6 min-h-[380px] flex flex-col justify-center">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/global-coverage/image_1.png" 
          alt="Zebras in water" 
          fill 
          className="object-cover opacity-60"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#073B47] via-[#073B47]/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-2xl px-10 pt-12 pb-6">
        <span className="inline-block bg-white/10 border border-white/10 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full mb-6">
          News · Global Coverage
        </span>
        <h1 className="text-[32px] md:text-[42px] font-extrabold leading-[1.1] mb-4 tracking-tight">
          Animal news across the<br/>regions we cover.
        </h1>
        <p className="text-[#DCE5E8] text-[15px] mb-8 font-medium max-w-xl leading-relaxed">
          Explore verified-source reporting on animal welfare, conservation, rescue, policy, and wildlife crime across Zoiko Social's active coverage regions.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-[#E88924] hover:bg-[#c9701a] text-white px-6 py-2.5 rounded-[10px] font-bold transition text-[14px]">
            Explore regions
          </button>
          <button className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-6 py-2.5 rounded-[10px] font-bold transition text-[14px]">
            Follow Global Coverage
          </button>
        </div>
      </div>

      <div className="relative z-10 px-10 pb-10 mt-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[12px] p-4 max-w-[600px] flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-shrink-0">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <p className="text-[12px] text-white/90 leading-tight">
            Coverage depth varies by region, language, and source availability. We don't claim exhaustive reporting in every country.
          </p>
        </div>
      </div>
    </section>
  );
}
