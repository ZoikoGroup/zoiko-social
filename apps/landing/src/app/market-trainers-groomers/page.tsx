import type { Metadata } from "next";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import FilterPanel from "./components/FilterPanel";
import TrainerResults from "./components/TrainerResults";
import TrainerDetail from "./components/TrainerDetail";
import Faq from "./components/Faq";
import RelatedCare from "./components/RelatedCare";

export const metadata: Metadata = {
  title: "Trainers & Groomers | Professional Care | Zoiko Social",
  description:
    "Discover trusted dog trainers and groomers in your area. Browse verified professionals, compare services, and find the right fit for your pet.",
};

/**
 * Market > Professional Care > Trainers & Groomers.
 *
 * Figma: desktop node 637:14304 ("zoikoSocial-trainers-groomers-production"),
 * mobile node 637:14770 ("412w light"). One responsive tree — Tailwind's
 * `lg:` breakpoint switches between the mobile single-column layout (filter
 * panel stacked above results, stacked above the detail card) and the
 * desktop two-column layout (filter sidebar + results/detail column).
 *
 * Fidelity notes, confirmed via get_metadata + get_design_context on both
 * frames rather than assumed:
 *  - Hero: desktop headline reads "Training and grooming professionals";
 *    mobile reads the longer "Find training and grooming professionals
 *    with clearer trust signals." — two different literal strings, not a
 *    truncation, both reproduced as-is.
 *  - Trust strip: desktop's four icons are real 36x36 image assets
 *    (downloaded to /public); mobile's icon slot is literal emoji text
 *    (✓ 🔍 📋 ⚖️) inside a Figma text node, with no image node at all.
 *  - Trainer result cards: desktop shows a real photo for all three
 *    trainers; mobile shows a real (differently cropped) photo for David
 *    Chen and Sarah Kim but only the orange-to-teal gradient placeholder
 *    for Jessica Martinez, whose mobile card has no `<img>` node in Figma.
 *    The detail card's photo (also Jessica) follows the same rule: real
 *    photo on desktop, gradient-only on mobile.
 *  - FAQ accordion toggle: a real plus-icon SVG in a circular badge on
 *    desktop; a plain "▼" text glyph with no badge on mobile.
 *  - "Related professional care" (six category links) exists only in the
 *    mobile frame's node tree — the desktop metadata goes straight from
 *    the FAQ section to the footer — so it's rendered mobile-only.
 *
 * The Figma frame has no breadcrumb node on either frame (only the inline
 * "Market / Professional Care" eyebrow inside the hero), and header/footer
 * are already rendered by the root layout, so this page only renders the
 * page-specific sections between them.
 */
export default function TrainersGroomersProductionPage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <section className="w-full bg-white py-12 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-8 px-6 lg:flex-row lg:items-start lg:gap-8 lg:px-[105px]">
          <aside className="w-full shrink-0 lg:w-[240px]">
            <FilterPanel />
          </aside>
          <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-12 lg:gap-16">
            <TrainerResults />
          </div>
        </div>
        
        <div className="mx-auto mt-12 w-full max-w-[1440px] px-6 lg:mt-16 lg:px-[105px]">
          <TrainerDetail />
        </div>
      </section>
      <Faq />
      <RelatedCare />
    </>
  );
}
