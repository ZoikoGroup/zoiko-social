import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "../components/Breadcrumb";
import SpecialistProfile from "./components/SpecialistProfile";
import { SPECIALIST_DETAILS } from "./components/data";

interface SpecialistDetailPageProps {
  params: Promise<{ specialistId: string }>;
}

export async function generateMetadata({ params }: SpecialistDetailPageProps): Promise<Metadata> {
  const { specialistId } = await params;
  const specialist = SPECIALIST_DETAILS[specialistId];

  if (!specialist) {
    return { title: "Specialist not found | Zoiko Social" };
  }

  return {
    title: `${specialist.name} | ${specialist.specialty} | Zoiko Social`,
    description: specialist.bio,
  };
}

export function generateStaticParams() {
  return Object.keys(SPECIALIST_DETAILS).map((specialistId) => ({ specialistId }));
}

/**
 * Market > Professional Care > Specialists > [specialist] focused profile.
 *
 * Figma: desktop node 584:23618, mobile node 584:24022 ("Section -
 * Specialist Detail (UNIQUE: Focused Profile)"). Linked from the "View
 * profile" button on each `SpecialistCard` in the listing page.
 *
 * Only Dr. Rachel Morrison's content exists in the Figma frame; other
 * specialist ids 404 via `notFound()` until their detail data is added to
 * `SPECIALIST_DETAILS`.
 *
 * The site header/footer come from the root layout (src/app/layout.tsx), so
 * this page only renders the page-specific content.
 */
export default async function SpecialistDetailPage({ params }: SpecialistDetailPageProps) {
  const { specialistId } = await params;
  const specialist = SPECIALIST_DETAILS[specialistId];

  if (!specialist) {
    notFound();
  }

  return (
    <>
      <Breadcrumb current={specialist.name} />
      <section className="w-full bg-white py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
          <SpecialistProfile specialist={specialist} />
        </div>
      </section>
    </>
  );
}
