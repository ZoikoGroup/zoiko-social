import React from "react";
import Image from "next/image";

export default function InsuranceAndCarePlans() {
  return (
    <div className="relative w-full min-h-[700px] bg-[#1a2d37] flex flex-col justify-between overflow-hidden font-sans">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/market/1.png"
          alt="Background office team caring for pets"
          fill
          priority
          className="object-cover object-center opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071B20E0] via-[#072A328C] to-[#073B474D]" />
      </div>

      {/* Header Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pt-16">
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold tracking-[0.15em] text-white uppercase mb-3">
            MARKET / SERVICES &amp; SUPPLIES
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.1] mb-5">
            Insurance and care-plan options
          </h1>
          <p className="text-base md:text-lg text-[#c2d1d6] font-normal leading-relaxed max-w-3xl">
            Compare pet insurance and care plans using source-approved details,
            coverage options, and costs. No recommendations—just honest
            comparison to help you decide.
          </p>
        </div>
      </div>

      {/* Floating Card Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 translate-y-8">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40">
          <h2 className="text-[#066879] text-xl md:text-2xl font-bold mb-8">
            What you should know
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 relative">
            {/* Column 1 */}
            <div className="flex flex-col relative lg:pr-6">
              <h3 className="text-[#066879] text-base font-bold mb-3">
                Insurance vs care plans
              </h3>
              <p className="text-[#5a6e75] text-sm leading-relaxed">
                Insurance is underwritten coverage. Care plans are wellness
                subscriptions. We keep them clearly distinct.
              </p>
              {/* Divider for desktop */}
              <div className="hidden lg:block absolute right-0 top-1 bottom-1 w-[1px] bg-[#d2dede]" />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col relative lg:pr-6">
              <h3 className="text-[#066879] text-base font-bold mb-3">
                Source-governed data
              </h3>
              <p className="text-[#5a6e75] text-sm leading-relaxed">
                All terms—premiums, deductibles, limits, exclusions—come from
                official sources, not Zoiko opinions.
              </p>
              {/* Divider for desktop */}
              <div className="hidden lg:block absolute right-0 top-1 bottom-1 w-[1px] bg-[#d2dede]" />
            </div>

            {/* Column 3 */}
            <div className="flex flex-col relative lg:pr-6">
              <h3 className="text-[#066879] text-base font-bold mb-3">
                No hidden terms
              </h3>
              <p className="text-[#5a6e75] text-sm leading-relaxed">
                Material terms like waiting periods, exclusions and benefit caps
                appear upfront. We never hide them.
              </p>
              {/* Divider for desktop */}
              <div className="hidden lg:block absolute right-0 top-1 bottom-1 w-[1px] bg-[#d2dede]" />
            </div>

            {/* Column 4 */}
            <div className="flex flex-col relative">
              <h3 className="text-[#066879] text-base font-bold mb-3">
                No guarantee claims
              </h3>
              <p className="text-[#5a6e75] text-sm leading-relaxed">
                We don&apos;t predict claim approval, savings, or coverage of
                your specific pet. Read the full terms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacer inside background layout to accommodate card overhang */}
      <div className="h-24" />
    </div>
  );
}
