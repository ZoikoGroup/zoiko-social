import Image from "next/image";

export interface Trainer {
  id: string;
  name: string;
  location: string;
  experience: string;
  tags: string[];
  desktopImage: string;
  desktopImageAlt: string;
  mobileImage: string | null;
  mobileImageAlt?: string;
}

/**
 * A single trainer/groomer result card.
 *
 * Figma: desktop 637:14405 ("S4: RESULTS") — every card shows a real
 * 140x140 photo to the left of its content; mobile 637:14867 — cards are
 * stacked with a full-width 200px-tall photo above the content, EXCEPT the
 * first card (Jessica Martinez), whose mobile photo slot is an empty node
 * with only the orange-to-teal gradient background and no `<img>` at all
 * (confirmed via get_design_context + get_screenshot on 637:14875/637:14876
 * — cards 2 and 3 on mobile do have real `<img>` children). So Jessica
 * renders the gradient placeholder on mobile while David and Sarah render
 * their (mobile-specific, differently cropped) photos — reproduced exactly
 * per breakpoint rather than forcing all three cards to match.
 */
export default function TrainerCard({ trainer }: { trainer: Trainer }) {
  const { name, location, experience, tags, desktopImage, desktopImageAlt, mobileImage, mobileImageAlt } = trainer;

  return (
    <article className="flex w-full flex-col items-start gap-4 rounded-[20px] border border-[#dce5e8] bg-white p-6 lg:flex-row lg:items-start lg:gap-6">
      <div
        className="h-[200px] w-full shrink-0 overflow-hidden rounded-[20px] lg:h-[140px] lg:w-[140px]"
        style={{ backgroundImage: "linear-gradient(135deg, #066879 0%, #e88924 100%)" }}
      >
        {mobileImage ? (
          <Image
            src={mobileImage}
            alt={mobileImageAlt ?? ""}
            width={600}
            height={316}
            className="h-full w-full object-cover lg:hidden"
          />
        ) : null}
        <Image
          src={desktopImage}
          alt={desktopImageAlt}
          width={280}
          height={280}
          className={`hidden h-full w-full object-cover lg:block`}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
        <div className="flex w-full items-center gap-3">
          <h3 className="font-jakarta text-[18px] font-bold leading-[28.8px] text-[#102a32]">{name}</h3>
          <span className="rounded bg-[#eef8f9] px-2 py-[3.5px] font-jakarta text-[12px] font-semibold leading-[19.2px] text-[#066879]">
            ✓ Verified
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">📍 {location}</span>
          <span className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">{experience}</span>
        </div>

        <div className="flex w-full flex-wrap items-start gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-xl border border-[#dce5e8] bg-[#eef8f9] px-[10px] py-1 font-jakarta text-[11px] font-semibold uppercase tracking-[0.55px] text-[#066879]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex w-full items-start gap-2 pt-1 lg:hidden">
          <button
            type="button"
            className="flex min-h-[40px] flex-1 items-center justify-center rounded-xl bg-[#066879] px-3 py-[12px] text-center font-jakarta text-[13px] font-semibold text-white"
          >
            View profile
          </button>
          <button
            type="button"
            className="flex min-h-[40px] flex-1 items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-3 py-[11px] text-center font-jakarta text-[13px] font-semibold text-[#066879]"
          >
            Contact
          </button>
        </div>
      </div>

      <div className="hidden w-[140px] shrink-0 flex-col items-start gap-2 lg:flex">
        <button
          type="button"
          className="flex min-h-[36px] w-[140px] items-center justify-center rounded-xl bg-[#066879] px-4 py-[10px] text-center font-jakarta text-[13px] font-semibold text-white"
        >
          View profile
        </button>
        <button
          type="button"
          className="flex min-h-[37px] w-full items-center justify-center rounded-xl border border-[#dce5e8] bg-[#f7f9fa] px-4 py-[11px] text-center font-jakarta text-[12px] font-semibold text-[#102a32]"
        >
          Contact
        </button>
      </div>
    </article>
  );
}
