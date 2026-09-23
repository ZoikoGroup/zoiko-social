const RELATED = [
  { emoji: "🏥", title: "Veterinarians", description: "General practice vets" },
  { emoji: "🔬", title: "Specialists", description: "Dermatology, cardiology" },
  { emoji: "🚑", title: "Emergency Care", description: "24-hour facilities" },
  { emoji: "🏢", title: "Clinics", description: "Full-service facilities" },
  { emoji: "🛏️", title: "Boarding & Sitting", description: "Pet care services" },
  { emoji: "🥗", title: "Nutrition", description: "Food & supplies" },
];

/**
 * "Related professional care" — links to sibling Market categories.
 *
 * Figma: mobile-only, node 637:15104 ("Section - S8: RELATED CATEGORIES").
 * This section does not exist anywhere in the desktop frame (637:14304) —
 * its `get_metadata` tree goes straight from the FAQ section (S7) to the
 * footer, with no related-categories node at any id, confirmed by reading
 * the full desktop metadata dump end to end. So it's rendered mobile-only
 * (`lg:hidden`) rather than invented for desktop, matching the same pattern
 * used on the sibling boarding-sitting page's "Other professional care"
 * section.
 */
export default function RelatedCare() {
  return (
    <section className="w-full bg-white px-6 py-12 lg:hidden">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-6">
        <h2 className="font-jakarta text-[32px] font-extrabold leading-[51.2px] text-[#102a32]">
          Related professional care
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
