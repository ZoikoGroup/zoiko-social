import Image from "next/image";

/**
 * "Organization badge showcase".
 * Figma: desktop 732:1402, mobile 732:1661.
 * Desktop: ONE card — a real photo (vet + dog) with a "✓ Verified" pill
 * overlaid top-right, org name/subtitle bottom-left, "Established 2018"
 * bottom-right, orange border + shadow.
 * Mobile: genuinely different content (confirmed via get_metadata/screenshot,
 * not assumed) — TWO stacked cards, an "unverified" state (plain grey
 * placeholder icon, neutral border, no badge pill) and a "verified" state
 * (cream icon placeholder, orange border+shadow, "✓ Verified" pill below the
 * meta text) — a before/after comparison that has no desktop equivalent.
 * The "✓" is a plain typographic checkmark (not a color emoji) — kept as
 * live text.
 * Background: white both breakpoints. Gutter 105px desktop / 16px mobile.
 */
export default function BadgeShowcase() {
  return (
    <section className="w-full bg-white px-4 pb-32 pt-[47px] lg:px-[105px] lg:py-[80px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10 lg:gap-12">
        <h2 className="font-jakarta text-[24px] font-extrabold leading-[28.8px] tracking-[-0.24px] text-[#102a32] lg:text-[32px] lg:leading-[38.4px] lg:tracking-[-0.32px]">
          Organization badge showcase
        </h2>

        {/* Desktop: single photo card */}
        <div className="hidden w-full justify-center lg:flex">
          <div className="flex w-full flex-col items-center gap-[15px] rounded-[28px] border border-[#e88924] bg-white p-8 shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
            <div className="relative h-[318px] w-full overflow-hidden rounded-[20px] bg-[#fff5e8]">
              <Image
                src="/premium-verified-organization/badge-showcase-vet-dog.webp"
                alt="Veterinarian examining a dog at Community Clinic"
                fill
                className="object-cover"
              />
              <div className="absolute right-6 top-6 rounded-xl bg-[#eef8f9] px-[16px] py-[7.5px]">
                <p className="font-jakarta text-[12px] font-bold leading-normal text-[#066879]">✓ Verified</p>
              </div>
            </div>
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="font-jakarta text-[24px] font-bold leading-normal text-[#102a32]">Community Clinic</h3>
                <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076]">
                  Animal health services
                </p>
              </div>
              <p className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#045363]">
                Established 2018
              </p>
            </div>
          </div>
        </div>

        {/* Mobile: two-state comparison cards */}
        <div className="flex w-full flex-col items-start gap-12 lg:hidden">
          <div className="flex w-full flex-col items-center gap-[15px] rounded-[28px] border border-[#dce5e8] bg-white px-8 pb-12 pt-8 shadow-[0px_1px_1px_rgba(7,59,71,0.06)]">
            <div className="size-20 rounded-[20px] bg-[#f7f9fa]" />
            <h3 className="font-jakarta text-[17px] font-bold leading-normal text-[#102a32]">Community Clinic</h3>
            <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076]">
              Animal health services
            </p>
            <p className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">Established 2018</p>
          </div>
          <div className="flex w-full flex-col items-center gap-[15px] rounded-[28px] border border-[#e88924] bg-white p-8 shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
            <div className="size-20 rounded-[20px] bg-[#fff5e8]" />
            <h3 className="font-jakarta text-[17px] font-bold leading-normal text-[#102a32]">Community Clinic</h3>
            <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076]">
              Animal health services
            </p>
            <p className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">Established 2018</p>
            <div className="rounded-xl bg-[#eef8f9] px-4 py-2">
              <p className="font-jakarta text-[12px] font-bold leading-normal text-[#066879]">✓ Verified</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
