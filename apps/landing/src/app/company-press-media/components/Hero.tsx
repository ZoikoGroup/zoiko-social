import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white w-full">
      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:flex flex-row items-center px-6 xl:px-20 py-[80px] w-full mx-auto gap-12 max-w-[1440px]">
        <div className="flex flex-1 flex-col gap-3 w-full">
          <div className="font-jakarta font-bold text-[12px] text-[#e88924] tracking-[0.5px] uppercase">
            Press &amp; Media
          </div>
          <h1 className="font-jakarta font-extrabold text-[48px] text-[#066879] tracking-[-0.96px] leading-[1.2]">
            News, company facts,<br /> and media resources<br /> from Zoiko Social
          </h1>
          <p className="font-jakarta font-medium text-[20px] text-[#5e7076] leading-[1.6] pt-[12px] max-w-[600px]">
            Find official company information, approved media assets, newsroom updates, and the right contact for press and interview requests.
          </p>
          <div className="flex flex-row gap-4 pt-[20px] pb-[12px]">
            <Link
              href="#"
              className="bg-[#e88924] rounded-xl w-[258px] h-[42px] flex items-center justify-center font-jakarta font-bold text-[14px] text-white text-center hover:bg-[#d67b1f] transition-colors"
            >
              Download Media Kit
            </Link>
            <Link
              href="#"
              className="bg-white border border-[#dce5e8] rounded-xl w-[260px] h-[44px] flex items-center justify-center font-jakarta font-semibold text-[14px] text-[#102a32] text-center hover:bg-gray-50 transition-colors"
            >
              View Brand Assets
            </Link>
          </div>
          <div className="border-t border-[#dce5e8] pt-[12px] mt-[8px]">
            <p className="font-jakarta font-normal text-[13px] text-[#5e7076] leading-[1.4]">
              Official first-party resources from Zoiko Social, a trading name and division of Zoiko Media Corp.
            </p>
          </div>
        </div>
        <div className="relative w-[616px] h-[410px] rounded-[28px] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] shrink-0 overflow-hidden">
          <Image
            alt="Zoiko Social Press and Media"
            src="/company-press-media/hero.png"
            fill
            className="object-cover"
            sizes="616px"
            priority
          />
        </div>
      </div>

      {/* === MOBILE LAYOUT === */}
      <div className="flex flex-col md:hidden px-6 py-[48px] w-full gap-6">
        <div className="flex flex-col gap-3 w-full items-center text-left">
          <div className="font-jakarta font-bold text-[12px] text-[#e88924] tracking-[0.5px] uppercase w-full">
            Press &amp; Media
          </div>
          <h1 className="font-jakarta font-extrabold text-[40px] text-[#066879] tracking-[-0.8px] leading-[1.2] w-full">
            News, company facts, and media resources from Zoiko Social
          </h1>
          <p className="font-jakarta font-medium text-[20px] text-[#5e7076] leading-[1.6] w-full">
            Find official company information, approved media assets, newsroom updates, and the right contact for press and interview requests.
          </p>

          {/* Mobile buttons: teal "Media Inquiry", orange "Download Media Kit", white "View Brand Assets" */}
          <div className="flex flex-col gap-4 pt-[8px] pb-[12px] w-full">
            <Link
              href="#"
              className="bg-[#066879] rounded-[12px] w-full py-[12px] flex items-center justify-center font-jakarta font-semibold text-[14px] text-white text-center hover:bg-[#055361] transition-colors"
            >
              Media Inquiry
            </Link>
            <Link
              href="#"
              className="bg-[#e88924] rounded-[12px] w-full py-[12px] flex items-center justify-center font-jakarta font-bold text-[14px] text-white text-center hover:bg-[#d67b1f] transition-colors"
            >
              Download Media Kit
            </Link>
            <Link
              href="#"
              className="bg-white border border-[#dce5e8] rounded-[12px] w-full py-[12px] flex items-center justify-center font-jakarta font-semibold text-[14px] text-[#102a32] text-center hover:bg-gray-50 transition-colors"
            >
              View Brand Assets
            </Link>
          </div>

          <div className="border-t border-[#dce5e8] pt-[24px] w-full">
            <p className="font-jakarta font-normal text-[13px] text-[#5e7076] leading-[1.4]">
              Official first-party resources from Zoiko Social, a trading name and division of Zoiko Media Corp.
            </p>
          </div>
        </div>

        {/* Mobile hero image – different from desktop */}
        <div className="relative w-full aspect-[342/228] rounded-[28px] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] overflow-hidden">
          <Image
            alt="Newsroom team collaborating on stories and media coverage"
            src="/company-press-media/mobile-hero.png"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
