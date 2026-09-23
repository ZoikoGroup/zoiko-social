import Image from "next/image";

/**
 * Hero — "Build trust with your community."
 * Figma: desktop 732:1389, mobile 732:1648.
 * Desktop: two-column layout, heading/copy/CTAs on the left (max content
 * width 611px) and a photo (617x289, rounded-2xl) on the right.
 * Mobile: single column, no photo at all (confirmed via get_metadata — the
 * mobile section node has no image child), heading/copy manually line-broken
 * per Figma's text node runs.
 * Gutter: 105px desktop / 16px mobile, both on the section element itself
 * (single-element mx-auto + px pattern not needed here since content isn't
 * separately max-width constrained beyond max-w-[1280px]).
 * Background: #f7f9fa (grey/97) on both breakpoints.
 */
export default function Hero() {
  return (
    <section className="w-full bg-[#f7f9fa] px-4 py-12 lg:flex lg:items-start lg:px-[105px] lg:py-[80px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-[11.3px] lg:mx-0 lg:w-[611px] lg:shrink-0 lg:gap-3">
        <p className="font-jakarta text-[12px] font-semibold uppercase tracking-[0.96px] text-[#e88924]">
          Premium+ · Verified Organization Profile
        </p>
        <h1 className="font-jakarta text-[28px] font-extrabold leading-[33.6px] tracking-[-0.56px] text-[#102a32] lg:text-[48px] lg:leading-[57.6px] lg:tracking-[-0.96px]">
          <span className="lg:hidden">
            Build trust with your
            <br />
            community.
          </span>
          <span className="hidden lg:inline">Build trust with your community.</span>
        </h1>
        <p className="pt-[8.7px] font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076] lg:w-[579px] lg:pt-2">
          Get a verified organization badge to establish credibility and authority. Show your
          community that you&apos;re a legitimate, authentic organization on Zoiko.
        </p>
        <div className="flex w-full flex-wrap items-start gap-4 pt-[20.7px] lg:pt-5">
          <button
            type="button"
            className="flex items-center justify-center rounded-xl bg-[#066879] px-5 py-[13px] text-center font-jakarta text-[14px] font-bold text-white"
          >
            Learn more
          </button>
          <button
            type="button"
            className="flex items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-5 py-3 text-center font-jakarta text-[14px] font-bold text-[#102a32]"
          >
            See eligibility
          </button>
        </div>
      </div>

      <div className="relative mt-8 hidden h-[289px] w-[617px] shrink-0 overflow-hidden rounded-2xl lg:ml-auto lg:mt-0 lg:block">
        <Image
          src="/premium-verified-organization/hero-community-hands.webp"
          alt="Community volunteers joining hands"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
