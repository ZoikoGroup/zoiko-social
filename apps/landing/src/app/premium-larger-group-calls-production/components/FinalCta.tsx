import Image from "next/image";

/**
 * "Ready to host larger community conversations?" — final CTA before the
 * footer. Figma: desktop 732:4695, mobile 732:5050. Same copy and button
 * labels on both, but genuinely different visuals, confirmed via
 * get_design_context on both:
 *  - Desktop: a full-bleed real photo background (a group-meeting photo,
 *    downloaded) with a dark `rgba(7,59,71,0.93→0.62)` gradient overlay and
 *    white text.
 *  - Mobile: a plain cream/white diagonal gradient background (no photo —
 *    its node tree has no image reference at all in this section), dark
 *    `#102a32` heading text and gray `#5e7076` body text.
 * Horizontal padding 105px desktop / 24px mobile.
 */
export default function FinalCta() {
  return (
    <section className="w-full bg-gradient-to-br from-[#eef8f9] to-white px-6 py-12 lg:bg-none lg:bg-white lg:px-[105px] lg:py-[80px]">
      <div className="relative mx-auto flex w-full max-w-[1182px] flex-col items-center gap-4 overflow-hidden text-center lg:py-[112px] lg:px-8">
        <div className="absolute inset-0 hidden lg:block">
          <Image
            src="/premium-larger-group-calls-production/final-cta-bg-desktop.webp"
            alt=""
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(190deg, rgba(7,59,71,0.93) 18.5%, rgba(7,59,71,0.62) 82.2%)" }}
          />
        </div>

        <div className="relative flex w-full flex-col items-center gap-4 text-center">
          <h2 className="font-jakarta text-[28px] font-extrabold leading-[44.8px] text-[#102a32] lg:text-[32px] lg:leading-[57.6px] lg:text-white">
            Ready to host larger community conversations?
          </h2>
          <p className="max-w-[700px] font-jakarta text-[17px] font-normal leading-[27.2px] text-[#5e7076] lg:text-[17px] lg:text-white">
            Join Premium and unlock bigger group calls with advanced host controls for your community.
          </p>
          <div className="mt-2 flex w-full flex-col items-center gap-4 lg:w-auto lg:flex-row lg:flex-wrap lg:justify-center">
            <button
              type="button"
              className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] px-5 py-[11px] text-center font-jakarta text-[14px] font-semibold text-white lg:w-auto"
            >
              See All Plans
            </button>
            <button
              type="button"
              className="flex min-h-[40px] w-full items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-5 py-[10px] text-center font-jakarta text-[14px] font-semibold text-[#066879] lg:w-auto"
            >
              Learn About Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
