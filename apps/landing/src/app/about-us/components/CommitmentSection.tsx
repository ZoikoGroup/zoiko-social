import React from 'react';

export default function CommitmentSection() {
  return (
    <section 
      className="w-full px-6 pb-[52px] pt-[49px] md:px-[80px]"
      style={{ background: 'linear-gradient(135deg, #0168FD 0%, #0186DE 54%, #01B5AC 100%)' }}
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center text-center">
        
        {/* Title */}
        <h2 className="font-montserrat text-3xl mb-3 font-extrabold leading-[81.60px] text-white">
          Our Commitment
        </h2>

        {/* Subtitle */}
        <p className="mt-[-12px] font-inter text-2xl mb-3 font-semibold leading-9 text-white">
          ZoikoSocial is committed to building technology that serves <br className="hidden md:block" />
          life rather than exploiting attention
        </p>

        {/* Cards */}
        <div className="mt-[23px] flex w-full flex-col gap-[26px]">
          {/* Card 1 */}
          <div className="flex h-[80px] w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-[5px]">
            <p className="font-inter text-xl leading-8 text-white">
              <span className="font-light">We believe social platforms can be </span>
              <span className="font-bold">safe without being sterile</span>
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex h-[80px] w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-[5px]">
            <p className="font-inter text-xl leading-8 text-white">
              <span className="font-light">We believe they can be </span>
              <span className="font-bold">global without being generic</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex h-[80px] w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-[5px]">
            <p className="font-inter text-xl leading-8 text-white">
              <span className="font-light">We believe they can be </span>
              <span className="font-bold">powerful without being harmful</span>
            </p>
          </div>
        </div>

        {/* Bottom Paragraph */}
        <p className="mt-[28px] font-inter text-xl font-medium leading-8 text-white/90">
          Our mission is to provide the digital infrastructure through which animal communities can grow, protect,<br className="hidden md:block" />
          and support life — today and for generations to come.
        </p>

        {/* Buttons */}
        <div className="mt-[50px] flex flex-col items-center justify-center gap-[24px] md:flex-row">
          <button className="flex h-[56px] w-[240px] items-center justify-center rounded-xl bg-white transition-colors hover:bg-gray-50">
            <span className="font-inter text-lg font-bold text-[#0189DA]">
              Join ZoikoSocial
            </span>
          </button>
          
          <button className="flex h-[64px] items-center justify-center border-b-2 border-transparent px-4 transition-colors hover:border-white/50">
            <span className="font-inter text-base font-semibold leading-7 text-white">
              Get in Touch
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
