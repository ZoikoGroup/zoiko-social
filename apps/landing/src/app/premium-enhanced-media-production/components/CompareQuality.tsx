import Image from "next/image";

const BULLET_TEXT_CLASS = "font-jakarta text-[15px] font-normal leading-[20.8px] lg:text-[15px]";

/**
 * "Compare media quality" — Free vs. Premium side-by-side example cards.
 *
 * Figma: desktop 732:5140, mobile 732:5567 (Container 732:5144 / 732:5571).
 * Section background is `#f7f9fa` on BOTH breakpoints (confirmed via
 * get_design_context on both section roots — not the app-default white).
 * Structurally the same two cards on both breakpoints, but two confirmed
 * differences:
 *  - The example photos are genuinely different images per breakpoint (not
 *    just cropped) — desktop shows a phone-in-hand shot for both columns,
 *    mobile shows a starfield nebula for "Standard" and an office meeting
 *    for "Premium". Confirmed via get_design_context + get_screenshot on
 *    both nodes, all four downloaded separately.
 *  - Only the desktop Premium card carries a highlighted `border-[#066879]`
 *    (node 732:5163); the desktop Standard card and BOTH mobile cards have
 *    no border at all, just the drop shadow — confirmed by the literal
 *    absence of a `border` class in get_design_context for those three
 *    cards. Not applied uniformly.
 */
export default function CompareQuality() {
  return (
    <section className="w-full bg-[#f7f9fa] py-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
        <h2 className="font-jakarta text-[28px] font-extrabold leading-[38.4px] text-[#102a32] lg:text-[36px] lg:leading-[45.8px]">
          Compare media quality
        </h2>

        <div className="mt-6 flex w-full flex-col gap-8 lg:mt-[38px] lg:flex-row lg:justify-center lg:gap-8">
          {/* Standard card */}
          <div className="flex w-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0px_8px_24px_0px_rgba(7,59,71,0.1)] lg:flex-1">
            <div className="border-b border-[#dce5e8] bg-[#f7f9fa] px-6 py-[23px] lg:bg-white lg:pl-4 lg:pr-6 lg:pt-[23.5px]">
              <p className="font-jakarta text-[14px] font-bold leading-[22.4px] text-[#102a32] lg:text-[20px]">
                Free Account Standard Quality
              </p>
            </div>
            <div
              className="relative aspect-[600/450] w-full"
              style={{ backgroundImage: "linear-gradient(135deg, rgba(6,104,121,0.1) 0%, rgba(232,137,36,0.08) 100%)" }}
            >
              <Image
                src="/premium-enhanced-media-production/compare-standard-mobile.webp"
                alt=""
                fill
                className="object-cover lg:hidden"
              />
              <Image
                src="/premium-enhanced-media-production/compare-standard-desktop.webp"
                alt=""
                fill
                className="hidden object-cover lg:block"
              />
            </div>
            <div className="flex flex-col gap-0 p-6 text-[#5e7076]">
              {["Standard resolution", "Optimized compression", "Approved device support", "Adaptive playback"].map(
                (item) => (
                  <div key={item} className="flex items-start gap-3 py-3">
                    <span className="font-jakarta text-[13px] font-extrabold leading-[20.8px]">•</span>
                    <span className={BULLET_TEXT_CLASS}>{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Premium card */}
          <div className="flex w-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0px_8px_24px_0px_rgba(7,59,71,0.1)] lg:flex-1 lg:border lg:border-[#066879]">
            <div className="border-b border-[#dce5e8] bg-[#f7f9fa] px-6 py-[23px] lg:bg-white lg:pl-4 lg:pr-6 lg:pt-[23.5px]">
              <p className="font-jakarta text-[14px] font-bold leading-[22.4px] text-[#102a32] lg:text-[20px]">
                Premium Enhanced Quality
              </p>
            </div>
            <div
              className="relative aspect-[600/450] w-full"
              style={{ backgroundImage: "linear-gradient(135deg, rgba(6,104,121,0.1) 0%, rgba(232,137,36,0.08) 100%)" }}
            >
              <Image
                src="/premium-enhanced-media-production/compare-premium-mobile.webp"
                alt=""
                fill
                className="object-cover lg:hidden"
              />
              <Image
                src="/premium-enhanced-media-production/compare-premium-desktop.webp"
                alt=""
                fill
                className="hidden object-cover lg:block"
              />
            </div>
            <div className="flex flex-col gap-0 p-6 text-[#066879]">
              {["Higher resolution uploads", "Enhanced processing", "Premium device support", "Better quality playback"].map(
                (item) => (
                  <div key={item} className="flex items-start gap-3 py-3">
                    <span className="font-jakarta text-[13px] font-extrabold leading-[20.8px]">✓</span>
                    <span className={BULLET_TEXT_CLASS}>{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
