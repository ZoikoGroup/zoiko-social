const TRUST_ITEMS = [
  {
    emoji: "✓",
    title: "Verified providers",
    body: "Identity verified. We do not verify specific training methods, insurance, or licensing.",
  },
  {
    emoji: "🔒",
    title: "Your privacy first",
    body: "Home addresses and access information are private. Share only what's needed.",
  },
  {
    emoji: "🐾",
    title: "Animal welfare",
    body: "Trust signals are about reliability, not guarantees. Always vet providers carefully.",
  },
  {
    emoji: "💬",
    title: "Honest marketplace",
    body: "No fake reviews, ratings, or fake availability. Just verified providers and clear info.",
  },
];

/**
 * "We protect your pet and your privacy" trust strip.
 *
 * Figma: desktop 637:12488 — four items in a single row, plain titles with
 * no emoji ("Verified providers"); mobile 637:12918 — the same four items
 * stacked in a single column, but each title is prefixed with an emoji
 * ("✓ Verified providers", "🔒 Your privacy first", "🐾 Animal welfare",
 * "💬 Honest marketplace" — confirmed via get_metadata on both frames,
 * where the desktop text nodes read "Verified providers" etc. with no
 * emoji at all). The emoji prefix is therefore mobile-only and hidden at
 * `lg:` so desktop keeps its plain titles.
 */
export default function TrustPrivacyStrip() {
  return (
    <section className="w-full bg-white px-0 pb-10 lg:px-[105px] lg:pb-14">
      <div className="mx-auto w-full max-w-[1280px] rounded-[28px] bg-[#eef8f9] p-6 lg:p-12">
        <div className="flex w-full flex-col items-start gap-4 lg:gap-4">
          <h2 className="font-jakarta text-[18px] font-bold leading-[28.8px] text-[#066879] lg:text-[20px] lg:leading-[32px]">
            We protect your pet and your privacy
          </h2>
          <div className="flex w-full flex-col items-start gap-4 lg:flex-row lg:items-stretch">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex w-full flex-1 flex-col items-start gap-[7px] rounded-[20px] border-l-[3px] border-[#066879] bg-white p-4"
              >
                <h3 className="font-jakarta text-[14px] font-bold leading-[22.4px] text-[#066879]">
                  <span className="lg:hidden">{item.emoji} </span>
                  {item.title}
                </h3>
                <p className="font-jakarta text-[13px] font-normal leading-[19.5px] text-[#5e7076]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
