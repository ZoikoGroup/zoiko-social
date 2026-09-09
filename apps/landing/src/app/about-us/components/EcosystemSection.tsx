import React from 'react';

export default function EcosystemSection() {
  return (
    <section className="w-full bg-gray-50 px-6 md:px-[80px] lg:pb-[57px] lg:pt-[57px]">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center text-center">
        
        {/* Pill */}
        <div className="flex h-11 w-72 items-center justify-center rounded-full bg-[#066879]">
          <span className="font-inter text-sm font-bold uppercase leading-6 tracking-wide text-white">
            Division of Zoiko Media Corp
          </span>
        </div>

        {/* Headings */}
        <h2 className="mt-[44px] font-montserrat text-3xl font-extrabold leading-[52.80px] text-gray-900">
          Part of a Larger Ecosystem
        </h2>
        <p className="mt-[8px] font-inter text-2xl font-semibold leading-9 text-gray-900">
          ZoikoSocial is a trading name and division of Zoiko Media Corp, alongside ZoikoTV.
        </p>

        {/* Cards Row */}
        <div className="mt-[48px] flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:gap-[32px]">
          
          {/* Card 1 */}
          <div className="flex h-[195px] w-full max-w-[450px] flex-col items-center justify-start rounded-2xl border-2 border-[#E6F0FF] bg-white pt-[48px] text-center">
            <h3 className="font-inter text-3xl font-bold leading-[47.60px] text-[#066879]">
              ZoikoSocial
            </h3>
            <p className="mt-[9px] font-inter text-base font-normal leading-7 text-gray-600">
              Global social infrastructure for animal<br />communities
            </p>
          </div>

          {/* Plus Icon */}
          <div className="flex items-center justify-center font-inter text-3xl font-bold leading-[54.40px] text-[#066879]">
            +
          </div>

          {/* Card 2 */}
          <div className="flex h-[195px] w-full max-w-[450px] flex-col items-center justify-start rounded-2xl border-2 border-[#E6F0FF] bg-white pt-[48px] text-center">
            <h3 className="font-inter text-3xl font-bold leading-[47.60px] text-[#066879]">
              ZoikoTV
            </h3>
            <p className="mt-[9px] font-inter text-base font-normal leading-7 text-gray-600">
              Verified news and media platform
            </p>
          </div>

        </div>

        {/* Bottom Text */}
        <p className="mt-[48px] font-inter text-base font-normal leading-7 text-gray-700">
          Together, these platforms form an integrated media and social ecosystem dedicated to animals, the environment, science,<br className="hidden lg:block" />
          and public-interest information.
        </p>
        <p className="mt-[26px] font-inter text-base font-normal leading-7 text-gray-700">
          Zoiko Media Corp operates with institutional standards of governance, editorial independence, and regulatory compliance,<br className="hidden lg:block" />
          ensuring that ZoikoSocial is built to scale responsibly and sustainably.
        </p>
        
      </div>
    </section>
  );
}
