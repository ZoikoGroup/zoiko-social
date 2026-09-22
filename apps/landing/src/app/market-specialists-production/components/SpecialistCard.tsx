import Image from "next/image";
import Link from "next/link";

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  location: string;
  species: string;
  description: string;
}

function initialsFor(name: string): string {
  const parts = name.replace(/^Dr\.?\s*/i, "").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
}

/**
 * A single specialist result card.
 *
 * Figma: desktop 584:23510 ("Article - Card 1") — avatar left, content
 * middle, a narrow column of stacked actions on the right; mobile
 * 584:23919 — the same content stacked in a single column, with the two
 * actions full-width at the bottom instead of a side column.
 *
 * Mobile shows a diagonal gradient circle with the specialist's initials
 * instead of the avatar photo (matches how the Figma canvas actually
 * renders the mobile card, 584:23919); desktop keeps the photo (584:23510).
 */
export default function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const { id, name, specialty, avatar, location, species, description } = specialist;

  return (
    <article className="flex w-full flex-col items-start gap-6 rounded-[20px] border border-[#dce5e8] bg-white p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8">
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] font-jakarta text-[22px] font-extrabold text-white lg:hidden"
        style={{ backgroundImage: "linear-gradient(135deg, #D9920A 0%, #066879 100%)" }}
      >
        {initialsFor(name)}
      </div>
      <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-[28px] lg:block">
        <Image src={avatar} alt={name} width={80} height={80} className="h-full w-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#102a32]">{name}</h3>
          <span className="rounded-xl border border-[#dce5e8] bg-[#eef8f9] px-[10px] py-[4px] font-jakarta text-[11px] font-semibold uppercase leading-[17.6px] tracking-[0.55px] text-[#066879]">
            {specialty}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-jakarta text-[13px] leading-[20.8px] text-[#5e7076]">✓ Verified</span>
          <span className="font-jakarta text-[13px] leading-[20.8px] text-[#5e7076]">📍 {location}</span>
          <span className="font-jakarta text-[13px] leading-[20.8px] text-[#5e7076]">{species}</span>
        </div>

        <p className="pt-2 font-jakarta text-[13px] leading-[20.8px] text-[#102a32]">{description}</p>
      </div>

      <div className="flex w-full flex-row gap-2 lg:w-auto lg:min-w-[106px] lg:flex-col lg:items-center">
        <button
          type="button"
          className="flex-1 rounded-xl border border-[#dce5e8] bg-[#f7f9fa] px-4 py-[10px] text-center font-jakarta text-[12px] font-semibold text-[#102a32] lg:w-full lg:flex-none"
        >
          Compare
        </button>
        <Link
          href={`/market-specialists-production/${id}`}
          className="flex-1 rounded-xl bg-[#066879] px-4 py-[10px] text-center font-jakarta text-[13px] font-semibold text-white lg:w-full lg:flex-none"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
