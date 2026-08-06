import React from 'react';

export default function GlobalPerspectiveSection() {
  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white px-6 py-16 md:px-[80px] lg:pb-[57px] lg:pt-[126px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col lg:flex-row lg:items-start lg:gap-[36px]">
        
        {/* Left Content */}
        <div className="flex w-full flex-col lg:w-[600px]">
          <h2 className="font-montserrat text-3xl font-extrabold leading-[52.80px] text-gray-900">
            Global Perspective, Local Care
          </h2>
          <h3 className="mt-[62px] font-inter text-2xl font-semibold leading-9 text-gray-900">
            Animal welfare is a global concern that manifests<br className="hidden lg:block" /> locally.
          </h3>
          <p className="mt-[25px] font-inter text-base font-normal leading-7 text-gray-900">
            ZoikoSocial is built to operate across borders while respecting local laws,<br className="hidden lg:block" />
            cultures, and practices. The platform supports multi-language access,<br className="hidden lg:block" />
            regional moderation, and location-aware community discovery.
          </p>
          <p className="mt-[27px] font-inter text-base font-normal leading-7 text-gray-900">
            Local communities can coordinate care, organize events, respond to<br className="hidden lg:block" />
            emergencies, and support adoption efforts, while remaining connected to<br className="hidden lg:block" />
            global conversations around conservation, climate impact, veterinary<br className="hidden lg:block" />
            science, and policy.
          </p>
          
          <div className="mt-[24px] h-[112px] w-full rounded-xl border-l-4 border-[#066879] bg-[#E6F0FF] pl-[28px] pt-[29px] lg:w-[600px]">
            <p className="font-inter text-xl font-semibold leading-8 text-[#066879]">
              This dual focus ensures that global awareness<br className="hidden lg:block" />
              translates into local action.
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div className="mt-12 flex w-full flex-col items-center lg:mt-0 lg:w-[582px]">
          <img 
            src="/images/global-care.png" 
            alt="Global Perspective, Local Care" 
            className="h-auto w-full object-contain lg:h-[546px] lg:w-[582px]"
          />
          <p className="mt-[10px] text-center font-inter text-base font-semibold leading-6 text-gray-600">
            Communities worldwide, connected through ZoikoSocial
          </p>
        </div>

      </div>
    </section>
  );
}
