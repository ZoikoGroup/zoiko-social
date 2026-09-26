/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-[#f7f9fa] w-full">
      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:block mx-auto px-6 xl:px-20 py-[48px] max-w-[1440px]">
        {/* Banner Card */}
        <div className="relative rounded-[24px] overflow-hidden px-[48px] py-[76px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden rounded-[24px]">
            <img
              src="/company-press-media/cta-bg.png"
              alt=""
              aria-hidden
              className="absolute h-[238.22%] left-0 max-w-none top-[-58.22%] w-full"
            />
          </div>
          {/* Dark Gradient Overlay */}
          <div
            className="absolute inset-0 rounded-[24px]"
            style={{
              backgroundImage:
                "linear-gradient(101.97deg, rgba(7,59,71,0.9) 35%, rgba(7,59,71,0.45) 85%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-6 max-w-[600px]">
            <h2 className="text-white text-[36px] font-extrabold font-jakarta leading-tight tracking-[-0.36px]">
              Ready to cover Zoiko Social?
            </h2>
            <p className="text-white/95 text-[17px] font-jakarta leading-[1.65]">
              Get official facts, media assets, interview access, and story ideas from our newsroom.
            </p>
            <div className="flex flex-wrap gap-6 mt-2">
              <Link
                href="#"
                className="bg-white border border-[#dce5e8] text-[#066879] font-bold font-jakarta text-[14px] px-6 py-3 rounded-[12px] hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Start Media Inquiry
              </Link>
              <Link
                href="#"
                className="border border-[#dce5e8] text-white font-bold font-jakarta text-[14px] px-6 py-3 rounded-[12px] hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                Download Media Kit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* === MOBILE LAYOUT === */}
      <div className="md:hidden flex flex-col items-start px-[24px] py-[96px] w-full">
        <div 
          className="flex flex-col gap-[16px] items-center px-[48px] pt-[47px] pb-[48px] rounded-[28px] w-full shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)]"
          style={{ backgroundImage: "linear-gradient(135deg, rgb(6, 104, 121) 0%, rgb(4, 83, 99) 100%)" }}
        >
          {/* Content */}
          <div className="flex flex-col items-center w-full">
            <h2 className="text-white text-[28px] font-extrabold font-jakarta leading-[33.6px] tracking-[-0.28px] text-center">
              Ready to cover<br/>Zoiko Social?
            </h2>
          </div>
          <div className="flex flex-col items-center w-full">
            <p className="text-[#5e7076] text-[17px] font-jakarta leading-[28px] text-center">
              Get official facts, media<br/>assets, interview access, and<br/>story ideas from our<br/>newsroom.
            </p>
          </div>
          <div className="flex flex-col gap-[16px] items-center justify-center pt-[8px] w-full">
            <Link
              href="#"
              className="w-full bg-white text-[#066879] font-bold font-jakarta text-[14px] py-[12px] rounded-[12px] text-center hover:bg-gray-50 transition-colors"
            >
              Start Media Inquiry
            </Link>
            <Link
              href="#"
              className="w-full bg-white border border-[#dce5e8] text-[#066879] font-bold font-jakarta text-[14px] py-[12px] rounded-[12px] text-center hover:bg-gray-50 transition-colors"
            >
              Download Media Kit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
