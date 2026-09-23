import type { Metadata } from "next";
import Hero from "./components/Hero";
import HostCapabilities from "./components/HostCapabilities";
import ScopeWhatChanges from "./components/ScopeWhatChanges";
import Progression from "./components/Progression";
import AccountAccessBanner from "./components/AccountAccessBanner";
import PlanComparison from "./components/PlanComparison";
import FinalCta from "./components/FinalCta";

export const metadata: Metadata = {
  title: "Premium Larger Group Calls | Zoiko Social",
  description:
    "Expand your community conversations with larger participant capacity. Run more engaging group calls with source-approved host controls and community features.",
};

/**
 * Premium > Larger Group Calls.
 *
 * Figma: desktop node 732:4417 ("zoikoSocial-premium-larger-group-calls-production"),
 * mobile node 732:4777 ("412w light"). One responsive tree — Tailwind's
 * `lg:` breakpoint switches layout; two sections are mobile-only because
 * their content genuinely does not exist on the desktop frame at all
 * (confirmed by reading both get_metadata dumps end to end, not assumed):
 *  - "What you can and cannot do" (ScopeWhatChanges) — mobile-only, no
 *    equivalent node anywhere in desktop's tree.
 *  - "Check your call access" (AccountAccessBanner) — mobile-only, no
 *    equivalent node anywhere in desktop's tree.
 * Every other section (Hero, HostCapabilities, Progression, PlanComparison,
 * FinalCta) exists on both breakpoints with matching copy, but each has
 * confirmed breakpoint-specific visual differences documented in its own
 * component file (backgrounds, real photos vs. emoji glyphs, padding).
 *
 * Neither frame's content nodes include a separate breadcrumb component —
 * the mobile "Home / Premium / Larger Group Calls" line lives inside the
 * Hero section itself (reproduced there, mobile-only) — and header/footer
 * are already rendered by the root layout, so this page only renders
 * page-specific sections between them.
 */
export default function PremiumLargerGroupCallsProductionPage() {
  return (
    <>
      <Hero />
      <HostCapabilities />
      <ScopeWhatChanges />
      <Progression />
      <AccountAccessBanner />
      <PlanComparison />
      <FinalCta />
    </>
  );
}
