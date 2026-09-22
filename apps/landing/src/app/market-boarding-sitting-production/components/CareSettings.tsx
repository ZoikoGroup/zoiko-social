import Image from "next/image";

const CARE_TYPES = [
  {
    emoji: "🏢",
    title: "Facility boarding",
    description: "Professional facility with group or individual boarding",
    image: "/market-boarding-sitting-production/boarding-facility-dog-in-grass.webp",
    alt: "Woman with her dog outdoors, representing facility boarding",
  },
  {
    emoji: "🏡",
    title: "Home-based sitting",
    description: "In-home care in a pet sitter's residence",
    image: "/market-boarding-sitting-production/home-sitting-golden-retriever-couch.webp",
    alt: "Pet sitter with a golden retriever on a couch at home",
  },
  {
    emoji: "👤",
    title: "Drop-in visits",
    description: "Regular visits to your home during the day",
    image: "/market-boarding-sitting-production/drop-in-visit-puppy-kitchen.webp",
    alt: "Pet sitter feeding a puppy during a drop-in visit",
  },
];

/**
 * "What type of care are you looking for?" — three care-type cards.
 *
 * Figma: desktop 637:12468 — each card shows a real photo above the title,
 * uniform white background with a `#dce5e8` border on all three cards;
 * mobile 637:12897 — the mobile frame drops the photos entirely and shows
 * a centered emoji-prefixed title + description instead (confirmed via
 * get_metadata + get_design_context on the mobile section, which has no
 * image node at all here). The mobile frame also highlights the first
 * card ("Facility boarding") with an orange `#e88924` background/border
 * and white text, while the other two stay white with dark/gray text —
 * this selected-state treatment only exists on the mobile frame; the
 * desktop card background/border is identical (white/`#dce5e8`) across
 * all three cards, so it's forced back to that via explicit `lg:` classes.
 */
export default function CareSettings() {
  return (
    <section className="w-full bg-[#f7f9fa] py-12 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-6 px-6 lg:gap-8 lg:px-[105px]">
        <h2 className="font-jakarta text-[24px] font-extrabold leading-[40px] text-[#102a32] lg:hidden">
          What type of care are you
          <br />
          looking for?
        </h2>
        <h2 className="hidden font-jakarta text-[32px] font-extrabold leading-[51.2px] text-[#102a32] lg:block">
          What type of care are you looking for?
        </h2>

        <div className="flex w-full flex-col items-start gap-4 lg:flex-row lg:gap-4">
          {CARE_TYPES.map((care, index) => {
            const isFeatured = index === 0;
            return (
              <div
                key={care.title}
                className={`flex w-full flex-col items-start gap-4 rounded-[20px] border-2 p-6 lg:h-[333px] lg:justify-between lg:border-[#dce5e8] lg:bg-white ${
                  isFeatured ? "border-[#e88924] bg-[#e88924]" : "border-[#dce5e8] bg-white"
                }`}
              >
                <div className="flex w-full flex-col items-center gap-2 text-center lg:hidden">
                  <p
                    className={`font-jakarta text-[18px] font-bold ${isFeatured ? "text-white" : "text-[#102a32]"}`}
                  >
                    {care.emoji} {care.title}
                  </p>
                  <p
                    className={`font-jakarta text-[13px] font-normal ${
                      isFeatured ? "text-white" : "text-[#5e7076]"
                    }`}
                  >
                    {care.description}
                  </p>
                </div>

                <div className="hidden h-[205px] w-full overflow-hidden rounded-2xl lg:block">
                  <Image
                    src={care.image}
                    alt={care.alt}
                    width={700}
                    height={410}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hidden flex-col items-start gap-2 lg:flex">
                  <p className="font-jakarta text-[18px] font-bold text-[#102a32]">{care.title}</p>
                  <p className="font-jakarta text-[13px] font-normal text-[#102a32]">{care.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
