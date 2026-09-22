import type { Metadata } from "next";
import Hero from "./components/Hero";
import CareSettings from "./components/CareSettings";
import TrustPrivacyStrip from "./components/TrustPrivacyStrip";
import CareFeaturesFilter from "./components/CareFeaturesFilter";
import ProviderResults from "./components/ProviderResults";
import Faq from "./components/Faq";
import RelatedCare from "./components/RelatedCare";

export const metadata: Metadata = {
  title: "Boarding & Sitting | Professional Care | Zoiko Social",
  description:
    "Explore verified care options for while you're away. Facility-based boarding, home-based sitting, or drop-in care — with clear information about what each provider offers.",
};

/**
 * Market > Services & Supplies > Boarding & Sitting.
 *
 * Figma: desktop node 637:12434 ("zoiko-market-boarding-sitting-production"),
 * mobile node 637:12869 ("412w light"). One responsive tree — Tailwind's
 * `lg:` breakpoint switches between the mobile single-column layout and the
 * desktop layout; copy is identical between the two frames here (unlike the
 * specialists page), but several visual details genuinely differ per
 * breakpoint and are reproduced as such rather than approximated to one:
 *  - Hero: desktop has a plain white background with a teal search button;
 *    mobile has a warm gradient background with an orange search button.
 *  - Care settings cards: desktop shows real photos for each care type;
 *    mobile shows emoji icons instead (matches how the Figma canvas
 *    actually renders each breakpoint, not just a reflow).
 *  - Provider result cards: desktop shows real facility/sitter photos;
 *    mobile shows an orange-to-teal gradient placeholder in the same slot
 *    (confirmed via get_screenshot on both frames — this mirrors the
 *    lesson learned on the sibling specialists-detail page).
 *
 * The Figma frame has no breadcrumb strip on either frame, and its own
 * header/footer mockups are reproduced by the root layout already, so this
 * page only renders the page-specific sections between them.
 */
export default function MarketBoardingSittingProductionPage() {
  return (
    <>
      <Hero />
      <CareSettings />
      <TrustPrivacyStrip />
      <section className="w-full bg-[#f7f9fa] py-12 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 lg:px-[105px]">
          <CareFeaturesFilter />
          <ProviderResults />
        </div>
      </section>
      <Faq />
      <RelatedCare />
    </>
  );
}
