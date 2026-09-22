const RELATED = [
  { emoji: "🏥", title: "Veterinarians", description: "General practice care" },
  { emoji: "🏢", title: "Clinics", description: "Full-service facilities" },
  { emoji: "🐕‍🦺", title: "Trainers & Groomers", description: "Training and grooming" },
  { emoji: "🚑", title: "Emergency Care", description: "24-hour facilities" },
];

/**
 * "Other professional care" — links to sibling Market categories.
 *
 * Figma: mobile-only, node 637:13178 ("Section - S10: RELATED CARE"). This
 * section does not exist anywhere in the desktop frame (637:12434) — its
 * `get_metadata` tree goes straight from the results/FAQ sections to the
 * footer, with no related-care node at any id. That's confirmed by reading
 * the full desktop metadata dump, not just a missed section, so it's
 * rendered mobile-only (`lg:hidden`) rather than invented for desktop.
 */
export default function RelatedCare() {
  return (
    <section className="w-full bg-white px-6 py-12 lg:hidden">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-6">
        <h2 className="font-jakarta text-[22px] font-extrabold leading-[26px] text-[#102a32]">
          Other professional care
        </h2>
        <div className="flex w-full flex-col items-start gap-6">
          {RELATED.map((item) => (
            <a
              key={item.title}
              href="#"
              className="flex min-h-[180px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-[#dce5e8] bg-white px-6 py-6 text-center"
            >
              <span className="font-jakarta text-[40px] leading-[64px]">{item.emoji}</span>
              <p className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#102a32]">{item.title}</p>
              <p className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
