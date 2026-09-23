import Image from "next/image";

/**
 * "Share better quality content" — final CTA before the footer.
 *
 * Figma: desktop 732:5468 ("Frame 59" wrapper), mobile 732:5891/732:5892.
 * Same copy and button labels on both, but genuinely different visuals,
 * confirmed via get_design_context on both:
 *  - Desktop: a full-bleed real photo background (node imgSection, a group
 *    photo, downloaded) with a dark `rgba(7,59,71,0.93→0.62)` gradient
 *    overlay and white text.
 *  - Mobile: plain white/page background, no photo, dark `#102a32` heading
 *    text and gray `#5e7076` body text — its node tree has no image
 *    reference at all in this section.
 */
export default function FinalCta() {
  return (
    <section className="w-full bg-[#f7f9fa] px-6 py-12 lg:bg-white lg:px-[105px] lg:py-[80px]">
      <div className="relative mx-auto flex w-full max-w-[1230px] flex-col items-center gap-4 overflow-hidden text-center lg:py-[112px] lg:px-8">
        <div className="absolute inset-0 hidden lg:block">
          <Image src="/premium-enhanced-media-production/final-cta-background.webp" alt="" fill className="object-cover" />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(190deg, rgba(7,59,71,0.93) 18.5%, rgba(7,59,71,0.62) 80.3%)" }}
          />
        </div>

        <div className="relative flex w-full flex-col items-center gap-4 text-center">
          <h2 className="font-jakarta text-[28px] font-extrabold leading-[36.3px] text-[#102a32] lg:text-[36px] lg:leading-[57.6px] lg:text-white">
            Share better quality content
          </h2>
          <p className="max-w-[700px] font-jakarta text-[17px] font-normal leading-[27.2px] text-[#5e7076] lg:text-white">
            Join Premium and upload higher-quality photos and videos to share with your communities.
          </p>
          <div className="flex w-full flex-col items-center gap-4 pt-2 lg:w-auto lg:flex-row lg:flex-wrap lg:justify-center">
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
