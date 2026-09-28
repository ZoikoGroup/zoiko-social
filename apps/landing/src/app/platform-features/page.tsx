import type { Metadata } from "next";
import Hero from "./components/Hero";
import BuiltForEveryChallenge from "./components/BuiltForEveryChallenge";
import ExplorePlatformCapabilities from "./components/ExplorePlatformCapabilities";
import CapabilityMatrix from "./components/CapabilityMatrix";
import HowZoikoWorksForYou from "./components/HowZoikoWorksForYou";
import OrganizingEventsMadeSimple from "./components/OrganizingEventsMadeSimple";
import WorksWithYourTools from "./components/WorksWithYourTools";
import RealImpactRealNumbers from "./components/RealImpactRealNumbers";
import SafetyTrustBuiltIn from "./components/SafetyTrustBuiltIn";
import PremiumFeatures from "./components/PremiumFeatures";
import ExploreFullPlatform from "./components/ExploreFullPlatform";
import Faq from "./components/Faq";
import CTA from "./components/CTA";

export const metadata: Metadata = {
  title: "Platform Features | Zoiko Social",
  description:
    "Discover what Zoiko Social can do — communities, events, safety tools, and premium capabilities built for animal lovers, rescuers, advocates, and professionals.",
};

/**
 * Platform > Features overview.
 *
 * Figma: desktop frame "zoiko Social-platform-features" (1440w light,
 * node 1087:3102) and its mobile counterpart (412w light, node
 * 1087:3689). Section order, copy, and backgrounds follow the desktop
 * frame end to end:
 *   Hero ("Discover what Zoiko Social can do" + stat bar) → Built for
 *   every challenge (3 problem/solution cards) → Explore Platform
 *   Capabilities (category tabs + capability grid) → Platform
 *   Capabilities at a Glance (Free/Premium/Organizer comparison table) →
 *   How Zoiko Social Works for You (3 audience workflow cards) →
 *   Organizing Events Made Simple (workflow steps + product photo) →
 *   Works with your tools (5 compatibility badges) → Real impact, real
 *   numbers (4 stat cards) → Safety & Trust Built In (dark teal panel) →
 *   Premium Features for More Impact (orange-outlined panel) → Explore
 *   the Full Zoiko Social Platform (cross-links) → FAQ → Ready to Make a
 *   Difference? (closing CTA).
 *
 * The frame's own header (search bar, tab nav, Join Free) and footer
 * mockups are already reproduced by the root layout, so this page only
 * renders the page-specific sections between them. Every breakpoint is
 * handled by Tailwind responsive classes within these same components —
 * there is no separate mobile page. Photos and icons were exported to
 * /public/platform-features (hero and CTA backgrounds, the event-
 * coordination photo, and the 12 small feature/tool/audience icons).
 *
 * Two judgment calls, made because the Figma frame doesn't define this
 * content: "Explore Platform Capabilities" only ships the expanded state
 * for its first tab ("Community & Profiles"), so the other three category
 * pills render statically rather than with fabricated panels; and the FAQ
 * accordion only ships its collapsed question rows, so the expanded
 * answers are written to match the page's own copy (see Faq.tsx).
 */
export default function PlatformFeaturesPage() {
  return (
    <>
      <Hero />
      <BuiltForEveryChallenge />
      <ExplorePlatformCapabilities />
      <CapabilityMatrix />
      <HowZoikoWorksForYou />
      <OrganizingEventsMadeSimple />
      <WorksWithYourTools />
      <RealImpactRealNumbers />
      <SafetyTrustBuiltIn />
      <PremiumFeatures />
      <ExploreFullPlatform />
      <Faq />
      <CTA />
    </>
  );
}
