import Image from "next/image";

/**
 * Hero — eyebrow, headline, description, and two CTA buttons.
 *
 * Figma: desktop 732:5125, mobile 732:5552. Both share the copy and button
 * labels ("See the Difference" / "What Changes"), but differ in real,
 * confirmed ways rather than being naive mirrors:
 *  - Mobile has a literal breadcrumb text node ("Home / Premium / Enhanced
 *    Media", node 732:5554) that desktop's frame does not contain at all —
 *    confirmed by reading both get_design_context outputs in full — so it's
 *    rendered mobile-only.
 *  - Desktop has a 3-photo collage (node 746:1779, real `<img>` sources,
 *    downloaded to /public) sitting beside the copy; mobile's hero has no
 *    image node anywhere in its tree, so the collage is desktop-only.
 *  - Backgrounds differ: desktop section (732:5125) is flat solid white per
 *    get_design_context (a plain white fill, no gradient); mobile is a warm
 *    cream/white diagonal gradient. Confirmed by re-checking
 *    get_design_context directly on the section root — not assumed from the
 *    photo collage's own (unrelated) gradient fills.
 *  - Headline wraps differently: desktop is one line, mobile is two explicit
 *    lines ("Higher-quality photo and" / "video.") — reproduced with a
 *    breakpoint-scoped `<br />`.
 */
export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-[#fff5e8] to-white px-6 py-12 lg:bg-none lg:bg-white lg:px-[80px] lg:py-[96px]">
      {/* Mobile layout */}
      <div className="flex w-full flex-col items-start gap-3 lg:hidden">
        <p className="font-jakarta text-[12px] leading-[19.2px] text-[#5e7076]">
          <span className="text-[#066879]">Home</span>
          <span> / </span>
          <span className="text-[#066879]">Premium</span>
          <span> / Enhanced Media</span>
        </p>
        <p className="font-jakarta text-[12px] font-semibold uppercase leading-[19.2px] tracking-[0.96px] text-[#066879]">
          Premium · Enhanced Media
        </p>
        <h1 className="font-jakarta text-[28px] font-extrabold leading-[32.2px] tracking-[-0.56px] text-[#102a32]">
          Higher-quality photo and
          <br />
          video.
        </h1>
        <p className="font-jakarta text-[17px] font-normal leading-[29.75px] text-[#5e7076]">
          Share photos and videos with enhanced quality capabilities. Premium uploads support higher-resolution
          content with improved processing and playback quality across approved devices and networks.
        </p>
        <div className="mt-2 flex w-full flex-col items-start gap-4">
          <button
            type="button"
            className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] px-5 py-[11px] text-center font-jakarta text-[14px] font-semibold text-white"
          >
            See the Difference
          </button>
          <button
            type="button"
            className="flex min-h-[40px] w-full items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-5 py-[10px] text-center font-jakarta text-[14px] font-semibold text-[#066879]"
          >
            What Changes
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="mx-auto hidden w-full max-w-[1440px] items-start gap-[11px] lg:flex">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[11px]">
          <p className="font-jakarta text-[12px] font-semibold uppercase leading-[19.2px] tracking-[0.96px] text-[#066879]">
            Premium · Enhanced Media
          </p>
          <h1 className="font-jakarta text-[48px] font-extrabold leading-[59.8px] tracking-[-1.04px] text-[#102a32]">
            Higher-quality photo and video.
          </h1>
          <p className="max-w-[700px] pt-1 font-jakarta text-[17px] font-normal leading-[29.75px] text-[#5e7076]">
            Share photos and videos with enhanced quality capabilities. Premium uploads support higher-resolution
            content with improved processing and playback quality across approved devices and networks.
          </p>
          <div className="flex flex-wrap items-start gap-4 pt-[37px]">
            <button
              type="button"
              className="flex h-[47px] w-[188px] items-center justify-center rounded-xl bg-[#066879] px-5 py-[11px] text-center font-jakarta text-[14px] font-semibold text-white"
            >
              See the Difference
            </button>
            <button
              type="button"
              className="flex h-[47px] w-[160px] items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-5 py-[10px] text-center font-jakarta text-[14px] font-semibold text-[#066879]"
            >
              What Changes
            </button>
          </div>
        </div>

        <div className="grid h-[360px] w-[492px] shrink-0 grid-cols-2 grid-rows-2 gap-3 rounded-[28px] border border-[#dce5e8] bg-white p-4 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.1)]">
          <div className="col-start-1 row-span-2 overflow-hidden rounded-xl border border-[#dce5e8]">
            <Image
              src="/premium-enhanced-media-production/hero-collage-photo-1.webp"
              alt=""
              width={230}
              height={324}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="col-start-2 row-start-1 overflow-hidden rounded-xl border border-[#dce5e8]">
            <Image
              src="/premium-enhanced-media-production/hero-collage-photo-2.webp"
              alt=""
              width={230}
              height={81}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="col-start-2 row-start-2 overflow-hidden rounded-xl border border-[#dce5e8]">
            <Image
              src="/premium-enhanced-media-production/hero-collage-photo-3.webp"
              alt=""
              width={230}
              height={233}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
