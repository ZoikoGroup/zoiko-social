import type { Metadata } from "next";
import Hero from "./components/Hero";
import SearchSection from "./components/SearchSection";
import SpecialistProfile from "./[specialistId]/components/SpecialistProfile";
import { SPECIALIST_DETAILS } from "./[specialistId]/components/data";

export const metadata: Metadata = {
  title: "Specialists | Professional Care | Zoiko Social",
  description: "Find verified veterinary specialists in dermatology, oncology, orthopedics, and more.",
};

/**
 * Market > Professional Care > Specialists.
 *
 * Figma: desktop node 584:23395, mobile node 584:23824 ("412w light").
 * One responsive tree — Tailwind's `lg:` breakpoint switches between the
 * mobile single-column layout and the desktop sidebar+form layout; the two
 * frames' headline copy differs by design, so both variants are rendered
 * and toggled with `hidden`/`lg:hidden` rather than picking one string.
 *
 * The Figma frame also embeds a "Section - Specialist Detail (UNIQUE:
 * Focused Profile)" directly below the search/list section, before the
 * footer (desktop node 584:23618, mobile node 584:24022) — the same
 * `SpecialistProfile` used on the `[specialistId]` detail route, rendered
 * inline here with Dr. Rachel Morrison's data since she's the only profile
 * the design provides.
 *
 * The site header/footer come from the root layout (src/app/layout.tsx),
 * so this page only renders the page-specific content.
 */
export default function MarketSpecialistsProductionPage() {
  const featuredSpecialist = SPECIALIST_DETAILS["dr-rachel-morrison"];

  return (
    <>
      <Hero />
      <SearchSection />
      <section className="w-full bg-white py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
          <SpecialistProfile specialist={featuredSpecialist} />
        </div>
      </section>
    </>
  );
}
