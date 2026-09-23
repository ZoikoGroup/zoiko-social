import Image from "next/image";

const TRUST_ITEMS = [
  {
    icon: "/trainers-groomers-production/icon-verified-professionals.webp",
    emoji: "✓",
    title: "Verified professionals",
    body: "Identity and background verified through our process.",
  },
  {
    icon: "/trainers-groomers-production/icon-manual-search-first.webp",
    emoji: "🔍",
    title: "Manual search first",
    body: "Location permission never required. You control your search.",
  },
  {
    icon: "/trainers-groomers-production/icon-clear-contact-info.webp",
    emoji: "📋",
    title: "Clear contact info",
    body: "Real phone numbers and websites. No sign-in walls.",
  },
  {
    icon: "/trainers-groomers-production/icon-honest-marketplace.webp",
    emoji: "⚖️",
    title: "Honest marketplace",
    body: "No fake reviews, ratings, or social proof.",
  },
];

/**
 * "Why trust Zoiko's listings?" — four trust cards.
 *
 * Figma: desktop 637:14330 — each card icon is a real 36x36 image asset
 * (nodes 662:2042/45/48/51, `rounded-rectangle` type with an `<img>` src in
 * `get_design_context`, not text — confirmed a genuine vector/image icon,
 * downloaded and used here); mobile 637:14796 — the same icon slot is
 * instead a literal emoji character inside a plain text node (confirmed via
 * get_design_context: `<p>✓</p>`, `<p>🔍</p>`, `<p>📋</p>`, `<p>⚖️</p>` at
 * 32px, no image node at all on mobile). So desktop renders the downloaded
 * icon images and mobile renders the literal emoji text, matching what each
 * breakpoint's own Figma frame actually contains.
 */
export default function TrustStrip() {
  return (
    <section className="w-full bg-[#f7f9fa] pb-12 pt-[47px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-6 px-6 lg:gap-[47.99px] lg:px-[105px]">
        <h2 className="font-jakarta text-[24px] font-extrabold leading-[32px] text-[#102a32] lg:text-[32px] lg:leading-[51.2px]">
          Why trust Zoiko&rsquo;s listings?
        </h2>

        <div className="flex w-full flex-col items-start gap-4 lg:grid lg:grid-cols-4 lg:gap-6">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex w-full flex-col items-center gap-[7.4px] rounded-[20px] border border-[#dce5e8] bg-white px-6 pb-6 pt-[23px] text-center"
            >
              <span className="hidden h-9 w-9 items-center justify-center lg:flex">
                <Image src={item.icon} alt="" width={36} height={36} className="h-full w-full object-contain" />
              </span>
              <span className="font-jakarta text-[32px] leading-[51.2px] text-[#102a32] lg:hidden">
                {item.emoji}
              </span>
              <p className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#102a32]">{item.title}</p>
              <p className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
