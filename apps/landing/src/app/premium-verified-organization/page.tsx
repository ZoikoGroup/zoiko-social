import type { Metadata } from "next";
import Hero from "./components/Hero";
import BadgeShowcase from "./components/BadgeShowcase";
import VerificationTimeline from "./components/VerificationTimeline";
import WhatYouCanDo from "./components/WhatYouCanDo";
import EligibilityRequirements from "./components/EligibilityRequirements";
import PlanComparison from "./components/PlanComparison";
import FinalCta from "./components/FinalCta";

export const metadata: Metadata = {
  title: "Premium Verified Organization | Zoiko Social",
  description:
    "Get a verified organization badge to establish credibility and authority on Zoiko. Show your community that you're a legitimate, authentic organization.",
};

/**
 * Premium > Verified Organization.
 *
 * Figma: desktop node 732:1388 ("zoikoSocial-premium-verified-organization"),
 * mobile node 732:1647 ("412w light"). One responsive tree — Tailwind's
 * `lg:` breakpoint switches layout. Every section exists on both
 * breakpoints with matching intent, but several have confirmed
 * breakpoint-specific visual/content differences documented in their own
 * component files (BadgeShowcase's two-card mobile comparison, and
 * PlanComparison's different plan order/copy per breakpoint).
 *
 * Neither frame's content nodes include a breadcrumb component, and
 * header/footer are already rendered by the root layout, so this page only
 * renders page-specific sections between them.
 */
export default function PremiumVerifiedOrganizationPage() {
  return (
    <>
      <Hero />
      <BadgeShowcase />
      <VerificationTimeline />
      <WhatYouCanDo />
      <EligibilityRequirements />
      <PlanComparison />
      <FinalCta />
    </>
  );
}
