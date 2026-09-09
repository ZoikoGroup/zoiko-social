import React from "react";

export default function MeaningSection() {
  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white px-6 pb-4 pt-10 md:px-[80px] lg:pb-4 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center">
        {/* Top Titles */}
        <div className="text-center">
          <p 
            className="text-xl tracking-widest text-[#066879] md:text-3xl lg:text-4xl lg:leading-[61.20px]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            ζῷον · ζωολογικός
          </p>
          <h2 className="mt-4 font-montserrat text-2xl font-extrabold text-gray-900 md:mt-6 md:text-3xl lg:leading-[52.80px]">
            The Meaning of Zoiko
          </h2>
        </div>

        {/* Cards Row */}
        <div className="mt-12 flex w-full flex-col items-center justify-center gap-6 lg:mt-16 lg:flex-row lg:gap-10">
          {/* Card 1 */}
          <div className="flex h-auto w-full flex-col items-center justify-center rounded-2xl bg-white p-8 text-center outline outline-2 -outline-offset-2 outline-[#E6F0FF] md:h-72 lg:w-[549px]">
            <div 
              className="text-5xl text-[#066879] md:text-6xl lg:leading-[95.20px]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              ζῷον
            </div>
            <div className="mt-4 font-inter text-xl font-bold leading-10 text-gray-900 md:mt-6 md:text-2xl">
              Zōion
            </div>
            <div className="mt-1 font-inter text-sm font-normal leading-7 text-gray-600 md:text-base">
              A living being or animal
            </div>
          </div>

          {/* Plus Sign */}
          <div className="font-inter text-3xl font-bold leading-[54.40px] text-[#066879]">
            +
          </div>

          {/* Card 2 */}
          <div className="flex h-auto w-full flex-col items-center justify-center rounded-2xl bg-white p-8 text-center outline outline-2 -outline-offset-2 outline-[#E6F0FF] md:h-72 lg:w-[549px]">
            <div 
              className="text-5xl text-[#066879] md:text-6xl lg:leading-[95.20px]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              ζωολογικός
            </div>
            <div className="mt-4 font-inter text-xl font-bold leading-10 text-gray-900 md:mt-6 md:text-2xl">
              Zoologikos
            </div>
            <div className="mt-1 font-inter text-sm font-normal leading-7 text-gray-600 md:text-base">
              The study and understanding of animal life
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-16 flex w-full flex-col gap-6 text-left lg:mt-24 lg:w-[900px] lg:gap-8">
          <p className="font-inter text-2xl font-semibold leading-9 text-gray-900 md:text-2xl">
            The name Zoiko is rooted in classical Greek, reflecting the philosophical foundation of the platform.
          </p>
          
          <p className="font-inter text-base font-normal leading-7 text-gray-900">
            Zoiko draws from <span className="font-semibold text-[#066879]"><i>zōion</i></span> (ζῷον), meaning a living being or animal, and <span className="font-semibold text-[#066879]"><i>zoologikos</i></span> (ζωολογικός), meaning the study and understanding of animal life. Together, these origins express a worldview in which animals are not content, commodities, or background subjects, but living systems deserving of knowledge, respect, and stewardship.
          </p>

          <p className="font-inter text-base font-bold leading-7 text-gray-900">
            ZoikoSocial carries this meaning forward into the digital age.
          </p>

          <p className="font-inter text-base font-normal leading-7 text-gray-900">
            Every feature of the platform — from community governance to news verification, from adoption safeguards to professional vetting — is informed by this principle: that animal life matters, and that the systems built around it must be worthy of trust.
          </p>
        </div>
      </div>
    </section>
  );
}
