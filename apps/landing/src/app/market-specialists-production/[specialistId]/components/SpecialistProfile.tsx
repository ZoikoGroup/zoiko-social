import type { SpecialistDetail } from "./data";
import DetailHeader from "./DetailHeader";
import ChecklistSection from "./ChecklistSection";
import InfoSection from "./InfoSection";
import EmergencyBanner from "./EmergencyBanner";

/**
 * Full specialist profile article: header, a 2x2 grid of detail sections
 * (1 column on mobile), and the emergency-care banner.
 *
 * Figma: desktop 584:23618 ("Section - Specialist Detail (UNIQUE: Focused
 * Profile)"), mobile 584:24022 — same content, mobile stacks the detail
 * sections into a single column instead of a 2x2 grid.
 */
export default function SpecialistProfile({ specialist }: { specialist: SpecialistDetail }) {
  const {
    name,
    specialtyIcon,
    specialty,
    bio,
    heroImage,
    heroImageMobile,
    quickFacts,
    areasOfExpertise,
    location,
    referral,
    appointment,
  } = specialist;

  return (
    <article className="flex w-full flex-col items-start gap-12 rounded-[28px] border border-[#dce5e8] bg-white px-6 pb-12 pt-8 lg:gap-12 lg:px-12 lg:pb-24 lg:pt-12">
      <DetailHeader
        name={name}
        specialtyIcon={specialtyIcon}
        specialty={specialty}
        bio={bio}
        heroImage={heroImage}
        heroImageMobile={heroImageMobile}
        quickFacts={quickFacts}
      />

      <div className="grid w-full grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
        <ChecklistSection title="Areas of expertise" items={areasOfExpertise} />
        <InfoSection title="Location & contact" rows={location} actionLabel="Get directions" />
        <ChecklistSection title="Referral process" intro={referral.intro} items={referral.items} />
        <InfoSection title="Appointment information" rows={appointment} />
      </div>

      <EmergencyBanner />
    </article>
  );
}
