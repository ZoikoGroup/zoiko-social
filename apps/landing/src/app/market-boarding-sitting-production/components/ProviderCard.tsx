import Image from "next/image";

export interface Provider {
  id: string;
  name: string;
  careType: string;
  location: string;
  tags: string[];
  image: string;
  imageAlt: string;
}

/**
 * A single provider result card.
 *
 * Figma: desktop 637:12544 — the card header is a real photo of the
 * facility/sitter; mobile 637:12974 — the same slot renders as an
 * orange-to-teal diagonal gradient (`#e88924 -> #066879`) with no photo at
 * all (confirmed via get_screenshot + get_design_context on the mobile
 * results section — this mirrors the photo/placeholder lesson from the
 * sibling specialists-detail page), so the two are rendered as genuinely
 * different treatments rather than approximated to one.
 */
export default function ProviderCard({ provider }: { provider: Provider }) {
  const { name, careType, location, tags, image, imageAlt } = provider;

  return (
    <article className="flex w-full flex-col items-start overflow-hidden rounded-[20px] border border-[#dce5e8] bg-white lg:w-[calc((100%-64px)/3)]">
      <div
        className="h-[180px] w-full lg:hidden"
        style={{ backgroundImage: "linear-gradient(135deg, #e88924 0%, #066879 100%)" }}
      />
      <div className="hidden h-[180px] w-full overflow-hidden lg:block">
        <Image src={image} alt={imageAlt} width={900} height={420} className="h-full w-full object-cover" />
      </div>

      <div className="flex w-full flex-col items-start gap-4 p-6">
        <div className="flex w-full items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
            <h3 className="font-jakarta text-[18px] font-bold leading-[28.8px] text-[#102a32]">{name}</h3>
            <span className="rounded-xl border border-[#e88924] bg-[#fff5e8] px-[10px] py-[4px] font-jakarta text-[11px] font-bold uppercase tracking-[0.55px] text-[#e88924]">
              {careType}
            </span>
          </div>
          <span className="shrink-0 rounded bg-[#eef8f9] px-2 py-[3.5px] font-jakarta text-[12px] font-semibold leading-[19.2px] text-[#066879]">
            ✓ Verified
          </span>
        </div>

        <p className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">📍 {location}</p>

        <div className="flex w-full flex-wrap items-start gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-[#dce5e8] bg-[#f7f9fa] px-2 py-1 font-jakarta text-[11px] font-semibold uppercase tracking-[0.33px] text-[#5e7076]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex w-full flex-col items-start gap-3 border-t border-[#dce5e8] pt-4">
          <button
            type="button"
            className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] px-4 py-[10px] text-center font-jakarta text-[13px] font-semibold text-white"
          >
            View details
          </button>
          <button
            type="button"
            className="flex min-h-[40px] w-full items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-4 py-[10px] text-center font-jakarta text-[13px] font-semibold text-[#066879]"
          >
            Contact
          </button>
        </div>
      </div>
    </article>
  );
}
