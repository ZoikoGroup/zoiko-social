import Image from "next/image";
import type { QuickFact } from "./data";

interface DetailHeaderProps {
  name: string;
  specialtyIcon: string;
  specialty: string;
  bio: string;
  heroImage: string;
  heroImageMobile: string;
  quickFacts: QuickFact[];
}

/**
 * Photo + name/specialty badge/bio/quick-facts panel at the top of the profile.
 *
 * Figma: desktop 584:23620 ("Detail Header") — photo on the left (fixed
 * width), text content on the right; mobile 584:24024 — a full-width photo
 * above the stacked text content. The two breakpoints use different source
 * photos in Figma, so each renders its own `<Image>` toggled with
 * `hidden`/`lg:hidden` rather than sharing one image.
 */
export default function DetailHeader({
  name,
  specialtyIcon,
  specialty,
  bio,
  heroImage,
  heroImageMobile,
  quickFacts,
}: DetailHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-8 border-b border-[#dce5e8] pb-8 lg:flex-row lg:items-start lg:gap-12 lg:pb-12">
      <div className="h-[300px] w-full shrink-0 overflow-hidden rounded-[28px] lg:hidden">
        <Image
          src={heroImageMobile}
          alt={name}
          width={600}
          height={400}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <div className="hidden h-[300px] w-full shrink-0 overflow-hidden rounded-[28px] lg:block lg:h-[300px] lg:w-[495px]">
        <Image
          src={heroImage}
          alt={name}
          width={495}
          height={300}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
        <h1 className="font-jakarta text-[32px] font-extrabold leading-[51.2px] tracking-[-0.32px] text-[#102a32]">
          {name}
        </h1>

        <span className="rounded-2xl border border-[#dce5e8] bg-[#eef8f9] px-[14px] py-[8px] font-jakarta text-[13px] font-bold uppercase leading-[20.8px] tracking-[0.65px] text-[#066879]">
          {specialtyIcon} {specialty}
        </span>

        <p className="font-jakarta text-[14px] font-normal leading-[23.8px] text-[#102a32]">{bio}</p>

        <div className="flex w-full flex-col gap-3 rounded-[20px] bg-[#f7f9fa] px-4 py-4">
          {quickFacts.map((fact) => (
            <div key={fact.label} className="flex w-full flex-col gap-1">
              <p className="font-jakarta text-[11px] font-bold uppercase leading-[17.6px] tracking-[0.55px] text-[#5e7076]">
                {fact.label}
              </p>
              <p className="font-jakarta text-[14px] font-semibold leading-[22.4px] text-[#102a32]">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
