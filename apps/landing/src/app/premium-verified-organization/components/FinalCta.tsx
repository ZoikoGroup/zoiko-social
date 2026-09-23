import Image from "next/image";

/**
 * "Establish organizational trust" — final CTA before the footer.
 * Figma: desktop 768:72, mobile 732:1815.
 * Desktop: full-bleed real photo background with a dark
 * `rgba(7,59,71,0.93→0.62)` gradient overlay, white text.
 * Mobile: plain `#f7f9fa` background (no photo — confirmed no image
 * reference in mobile's node tree), dark `#102a32` heading, `#5e7076` body.
 */
export default function FinalCta() {
  return (
    <section className="w-full bg-[#f7f9fa] px-4 pb-12 pt-[47px] lg:bg-white lg:px-[105px] lg:py-[80px]">
      <div className="relative mx-auto flex w-full max-w-[1230px] flex-col items-center gap-4 overflow-hidden text-center lg:py-[80px]">
        <div className="absolute inset-0 hidden lg:block">
          <Image
            src="/premium-verified-organization/final-cta-background.webp"
            alt=""
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(189deg, rgba(7,59,71,0.93) 18.5%, rgba(7,59,71,0.62) 82.2%)",
            }}
          />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center gap-4 text-center">
          <h2 className="font-jakarta text-[24px] font-extrabold leading-[28.8px] tracking-[-0.24px] text-[#102a32] lg:text-[32px] lg:leading-[57.6px] lg:tracking-normal lg:text-white">
            Establish organizational trust
          </h2>
          <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076] lg:max-w-[508px] lg:text-[17px] lg:leading-[27.2px] lg:text-white/[0.86]">
            Verified organization badges are available with Premium+ plans.
          </p>
          <button
            type="button"
            className="mt-2 flex min-h-[40px] items-center justify-center rounded-xl bg-[#e88924] px-8 py-5 text-center font-jakarta text-[16px] font-bold text-white lg:mt-4 lg:px-5 lg:py-[11px] lg:text-[14px] lg:font-semibold"
          >
            Apply Now
          </button>
        </div>
      </div>
    </section>
  );
}
