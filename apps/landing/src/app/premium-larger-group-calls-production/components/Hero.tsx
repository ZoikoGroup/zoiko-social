import Image from "next/image";

const FREE_AVATARS = [
  "/premium-larger-group-calls-production/avatar-free-1.webp",
  "/premium-larger-group-calls-production/avatar-free-2.webp",
  "/premium-larger-group-calls-production/avatar-free-3.webp",
  "/premium-larger-group-calls-production/avatar-free-4.webp",
  "/premium-larger-group-calls-production/avatar-free-5.webp",
  "/premium-larger-group-calls-production/avatar-free-6.webp",
  "/premium-larger-group-calls-production/avatar-free-7.webp",
  "/premium-larger-group-calls-production/avatar-free-8.webp",
];

const PREMIUM_AVATARS = [
  "/premium-larger-group-calls-production/avatar-premium-1.webp",
  "/premium-larger-group-calls-production/avatar-premium-2.webp",
  "/premium-larger-group-calls-production/avatar-premium-3.webp",
  "/premium-larger-group-calls-production/avatar-premium-4.webp",
  "/premium-larger-group-calls-production/avatar-premium-5.webp",
  "/premium-larger-group-calls-production/avatar-premium-6.webp",
  "/premium-larger-group-calls-production/avatar-premium-7.webp",
  "/premium-larger-group-calls-production/avatar-premium-8.webp",
  "/premium-larger-group-calls-production/avatar-premium-9.webp",
];

const PERSON_EMOJI = "/premium-larger-group-calls-production/emoji-person.webp";

/**
 * Hero — "Capacity comparison". Figma: desktop 732:4419, mobile 732:4779.
 * Genuinely different per breakpoint, confirmed via get_design_context on
 * both section roots (not assumed symmetric):
 *  - Desktop: full-bleed real photo background (a group-photo, downloaded)
 *    with a dark teal gradient overlay and white text; eyebrow label is
 *    orange (#e88924). Capacity comparison cards show REAL avatar photos
 *    (18 distinct downloaded images — confirmed via get_metadata these are
 *    rounded-rectangle image nodes, not text) in a 6-column grid, with a
 *    literal "+40" text badge as the final cell of the Premium card.
 *  - Mobile: plain cream/white diagonal gradient background, dark heading
 *    text, teal eyebrow. Capacity cards use a literal "👤" emoji text glyph
 *    (confirmed via get_metadata node type) repeated in every avatar circle
 *    instead of photos, plus a literal "+" text badge (not "+40") as the
 *    final Premium-card cell. Per the emoji-image rule, the 👤 glyph was
 *    downloaded once (Apple-style artwork, pixel-checked against
 *    get_screenshot) and reused via <Image> rather than left as Unicode
 *    text, since Figma's canvas emoji rendering does not match a Windows
 *    browser's.
 *  - Horizontal padding is 24px on BOTH breakpoints here — confirmed via
 *    get_design_context on both section roots, unlike most other sections
 *    on this page which use 105px on desktop.
 *  - Headline is a single line on desktop but wraps at a narrower width on
 *    mobile (both confirmed as natural wraps at their respective content
 *    widths, not forced Figma line breaks, so no explicit <br /> was added
 *    to the headline). The hero body copy IS a genuine forced multi-line
 *    break on both breakpoints (fixed max-width, short line lengths,
 *    `whitespace-nowrap` in the Figma export) and is reproduced with
 *    explicit line breaks.
 */
export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#eef8f9] to-[#fff5e8] py-12 lg:bg-none lg:bg-[#0a1f24] lg:py-[80px]">
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src="/premium-larger-group-calls-production/hero-bg-desktop.webp"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(7,27,32,0.88) 0%, rgba(7,42,50,0.55) 60%, rgba(7,59,71,0.3) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
        {/* Mobile-only breadcrumb */}
        <p className="mb-3 font-jakarta text-[12px] leading-[19.2px] lg:hidden">
          <span className="text-[#066879]">Home</span>
          <span className="text-[#5e7076]"> / </span>
          <span className="text-[#066879]">Premium</span>
          <span className="text-[#5e7076]"> / Larger Group Calls</span>
        </p>

        <div className="flex flex-col items-start lg:items-center">
          <p className="font-jakarta text-[12px] font-semibold uppercase leading-[19.2px] tracking-[0.96px] text-[#066879] lg:text-center lg:text-[#e88924]">
            Premium · Larger Group Calls
          </p>
          <h1 className="mt-3 font-jakarta text-[28px] font-extrabold leading-[32.2px] tracking-[-0.56px] text-[#102a32] lg:mt-[13px] lg:text-center lg:text-[48px] lg:leading-[59.8px] lg:tracking-[-1.04px] lg:text-white">
            Host bigger community calls.
          </h1>
          <p className="mt-3 font-jakarta text-[17px] font-normal leading-[29.75px] text-[#5e7076] lg:mt-[12px] lg:max-w-[700px] lg:text-center lg:text-[16px] lg:text-white">
            Expand your community conversations with larger participant capacity. Run more
            <br className="hidden lg:block" /> engaging group calls with source-approved host controls and community
            features.
          </p>

          <div className="mt-8 flex w-full flex-col items-start gap-4 lg:mt-[37px] lg:w-auto lg:flex-row lg:flex-wrap lg:justify-center">
            <button
              type="button"
              className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] px-5 py-[11px] text-center font-jakarta text-[14px] font-semibold text-white lg:w-auto"
            >
              Explore Capabilities
            </button>
            <button
              type="button"
              className="flex min-h-[40px] w-full items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-5 py-[10px] text-center font-jakarta text-[14px] font-semibold text-[#066879] lg:w-auto"
            >
              What Changes
            </button>
          </div>

          <div className="mt-9 flex w-full flex-col items-start gap-8 lg:mt-9 lg:flex-row lg:items-stretch lg:justify-center lg:gap-12">
            {/* Free Account card */}
            <div className="flex w-full flex-col items-center gap-3 rounded-[28px] border-2 border-[#dce5e8] bg-white p-8 lg:flex-1 lg:gap-6">
              <p className="font-jakarta text-[14px] font-semibold uppercase leading-[22.4px] tracking-[0.7px] text-[#5e7076] lg:text-[16px] lg:text-[#066879]">
                Free Account
              </p>
              <p className="font-jakarta text-[40px] font-extrabold leading-[64px] text-[#066879] lg:text-[48px]">8</p>
              <p className="font-jakarta text-[15px] font-semibold leading-6 text-[#102a32]">Max Participants</p>
              <p className="text-center font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">
                Basic group calling for smaller communities
              </p>
              <div className="mt-3 grid w-full grid-cols-3 gap-3 lg:grid-cols-6">
                {FREE_AVATARS.map((src) => (
                  <div
                    key={src}
                    className="flex aspect-square items-center justify-center overflow-hidden rounded-full border-2 border-[#066879] bg-[#066879] lg:block lg:border-2"
                  >
                    <Image
                      src="/premium-larger-group-calls-production/emoji-person.webp"
                      alt="participant"
                      width={20}
                      height={32}
                      className="h-[32px] w-[20px] shrink-0 object-contain lg:hidden"
                    />
                    <Image
                      src={src}
                      alt="participant"
                      width={96}
                      height={96}
                      className="hidden h-full w-full object-cover lg:block"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Member card */}
            <div className="flex w-full flex-col items-center gap-3 rounded-[28px] border-2 border-[#dce5e8] bg-white p-8 lg:flex-1 lg:gap-6">
              <p className="font-jakarta text-[14px] font-semibold uppercase leading-[22.4px] tracking-[0.7px] text-[#5e7076] lg:text-[16px] lg:text-[#066879]">
                Premium Member
              </p>
              <p className="font-jakarta text-[37.5px] font-extrabold leading-[64px] text-[#066879] lg:text-[48px]">
                50+
              </p>
              <p className="font-jakarta text-[15px] font-semibold leading-6 text-[#102a32]">Max Participants</p>
              <p className="text-center font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">
                Host larger approved group calls with advanced controls
              </p>
              <div className="mt-3 grid w-full grid-cols-3 gap-3 lg:grid-cols-6">
                {PREMIUM_AVATARS.map((src) => (
                  <div
                    key={src}
                    className="flex aspect-square items-center justify-center overflow-hidden rounded-full border-2 border-[#066879] bg-[#066879] lg:block"
                  >
                    <Image
                      src={PERSON_EMOJI}
                      alt="participant"
                      width={20}
                      height={32}
                      className="h-[32px] w-[20px] shrink-0 object-contain lg:hidden"
                    />
                    <Image
                      src={src}
                      alt="participant"
                      width={96}
                      height={96}
                      className="hidden h-full w-full object-cover lg:block"
                    />
                  </div>
                ))}
                {/* final "+" / "+40" badge cell */}
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-full border-2 border-[#e88924] bg-[#e88924]">
                  <span className="font-jakarta text-[20px] font-bold leading-[32px] text-white lg:hidden">+</span>
                  <span className="hidden font-jakarta text-[12px] font-bold uppercase tracking-[0.96px] text-white lg:block">
                    +40
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
