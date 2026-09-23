import Image from "next/image";

const DESKTOP_TIERS = [
  { image: "/premium-enhanced-media-production/tier-mobile-desktop.webp", title: "Mobile", body: "1080×1080 photos. Free & Premium." },
  { image: "/premium-enhanced-media-production/tier-premium-desktop.webp", title: "Premium", body: "4K photos. Premium members only." },
  { image: "/premium-enhanced-media-production/tier-video-desktop.webp", title: "Video", body: "1080p video, 10 min limit. Premium only." },
];

const MOBILE_TIERS = [
  {
    image: "/premium-enhanced-media-production/tier-mobile-optimized-mobile.webp",
    emojiSrc: "/premium-enhanced-media-production/emoji-mobile-optimized.webp",
    emojiAlt: "📱",
    title: "Mobile Optimized",
    subtitle: "Standard quality for quick sharing",
    items: ["Standard resolution", "Compressed format", "Fast upload"],
    highlight: false,
  },
  {
    image: "/premium-enhanced-media-production/tier-premium-quality-mobile.webp",
    emojiSrc: "/premium-enhanced-media-production/emoji-premium-quality.webp",
    emojiAlt: "⭐",
    title: "Premium Quality",
    subtitle: "Enhanced quality experience (Premium)",
    items: ["Higher resolution", "Better quality output", "Optimized playback"],
    highlight: true,
  },
  {
    image: null,
    emojiSrc: "/premium-enhanced-media-production/emoji-video-enhanced.webp",
    emojiAlt: "🎬",
    title: "Video Enhanced",
    subtitle: "Approved video quality options",
    items: ["Higher frame rates", "Enhanced processing", "Quality options"],
    highlight: false,
  },
];

/**
 * "Media quality tiers" — desktop and mobile use genuinely different card
 * designs for the same concept, confirmed via get_metadata + get_design_context
 * on both (732:496 desktop vs. 732:5611 mobile), not assumed symmetric:
 *  - Section background: desktop root (732:492) is `#f7f9fa`; mobile root
 *    (732:5608) has NO bg class at all (falls through to the page's white),
 *    confirmed by the literal absence of a `bg-*` token on that node — not
 *    the same color on both breakpoints.
 *  - Desktop: 3 plain photo cards (real downloaded images), each with just a
 *    heading and one description line, uniform `#dce5e8` border.
 *  - Mobile: 3 richer cards with a large emoji, a heading, a subtitle, and a
 *    3-item bullet list with `○` markers. The middle "Premium Quality" card
 *    has a highlighted `#e88924` (orange) 2px border; the other two use
 *    `#dce5e8`. The third mobile card ("Video Enhanced") has NO image node
 *    at all in Figma (confirmed: its image container has no `<img>`, only
 *    the gradient background) — reproduced as a gradient placeholder rather
 *    than inventing a photo.
 *  - The 📱⭐🎬 headings are literal Unicode text in Figma's text nodes, but
 *    Figma's canvas renders them with Apple's emoji artwork, not the OS
 *    emoji font a browser would substitute — see EnhancedCapabilities.tsx
 *    for the full explanation. The matching Apple-style images were
 *    downloaded (codepoints 1f4f1, 2b50, 1f3ac) and pixel-checked against
 *    get_screenshot for each glyph node, so these render pixel-identical to
 *    Figma instead of depending on the visitor's OS emoji rendering.
 */
export default function MediaTiers() {
  return (
    <section className="w-full bg-white py-12 lg:bg-[#f7f9fa] lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
        <h2 className="font-jakarta text-[28px] font-extrabold leading-[38.4px] text-[#102a32] lg:text-[36px] lg:leading-[45.8px]">
          Media quality tiers
        </h2>

        {/* Desktop */}
        <div className="mt-8 hidden gap-6 lg:mt-[38px] lg:flex lg:justify-center">
          {DESKTOP_TIERS.map((tier) => (
            <div
              key={tier.title}
              className="flex w-[394px] flex-col overflow-hidden rounded-[20px] border border-[#dce5e8] bg-white shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
            >
              <div className="relative h-[200px] w-full">
                <Image src={tier.image} alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-4 px-6 pb-10 pt-6">
                <p className="font-jakarta text-[17px] font-bold leading-normal text-[#066879]">{tier.title}</p>
                <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076]">{tier.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="mt-8 flex flex-col gap-6 lg:hidden">
          {MOBILE_TIERS.map((tier) => (
            <div
              key={tier.title}
              className={`flex w-full flex-col overflow-hidden rounded-[20px] border-2 bg-white ${
                tier.highlight ? "border-[#e88924]" : "border-[#dce5e8]"
              }`}
            >
              <div
                className="relative flex h-[180px] w-full items-center justify-center"
                style={{ backgroundImage: "linear-gradient(135deg, rgba(6,104,121,0.08) 0%, rgba(232,137,36,0.05) 100%)" }}
              >
                {tier.image && <Image src={tier.image} alt="" fill className="object-cover" />}
              </div>
              <div
                className={`flex flex-col items-center gap-3 px-6 pb-6 pt-[23px] text-center ${
                  tier.highlight ? "bg-gradient-to-br from-[rgba(232,137,36,0.05)] to-[rgba(232,137,36,0.02)]" : ""
                }`}
              >
                <Image src={tier.emojiSrc} alt={tier.emojiAlt} width={48} height={48} className="h-12 w-12" />
                <p
                  className={`font-jakarta text-[17px] font-bold leading-[27.2px] ${
                    tier.highlight ? "text-[#e88924]" : "text-[#102a32]"
                  }`}
                >
                  {tier.title}
                </p>
                <p className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">{tier.subtitle}</p>
                <div className="flex w-full flex-col items-start pt-1">
                  {tier.items.map((item) => (
                    <div key={item} className="flex w-full items-center gap-2 py-[7.6px]">
                      <span className="font-jakarta text-[12px] leading-[19.2px] text-[#5e7076]">○</span>
                      <span className="font-jakarta text-[12px] leading-[19.2px] text-[#5e7076]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
