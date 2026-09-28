import type { Metadata } from "next";
import Hero from "./components/Hero";
import WhyPremium from "./components/WhyPremium";
import Pricing from "./components/Pricing";
import SuccessStories from "./components/SuccessStories";
import WhoUses from "./components/WhoUses";
import GetStarted from "./components/GetStarted";
import SeeInAction from "./components/SeeInAction";
import ComparisonTable from "./components/ComparisonTable";
import MemberSupport from "./components/MemberSupport";
import Faq from "./components/Faq";
import TrustPrivacy from "./components/TrustPrivacy";

export const metadata: Metadata = {
  title: "Premium Plans | Zoiko Social",
  description:
    "Premium features for your lifestyle. Ad-free experience, advanced privacy, professional verification, and more — from $9.99/month with a 7-day free trial.",
};

/**
 * Premium > Plans (pricing overview).
 *
 * Figma: desktop frame "zoikoSocial-platform-premium-plans-production"
 * (1440w light). Section order, copy, and backgrounds follow that frame
 * end to end:
 *   Hero → Why Go Premium? (8 capability cards) → Simple, Transparent
 *   Pricing → Premium Success Stories → Who Uses Premium? → Get Started
 *   in 3 Simple Steps → See Premium in Action → Free vs Premium
 *   comparison table → Premium Member Support → FAQ → Trust, Privacy &
 *   Security CTA.
 *
 * The frame's own header (search bar, tab nav, Join Free) and footer
 * mockups are already reproduced by the root layout, so this page only
 * renders the page-specific sections between them. Photos and icons were
 * exported to /public/platform-premium-plans-production and are placed
 * per section: hero background, the 8 card photos, the 36px audience
 * icons, the 60px support icons, the "See Premium in Action" photo, and
 * the dark Trust & Security panel background.
 */
export default function PlatformPremiumPlansProductionPage() {
  return (
    <>
      <Hero />
      <WhyPremium />
      <Pricing />
      <SuccessStories />
      <WhoUses />
      <GetStarted />
      <SeeInAction />
      <ComparisonTable />
      <MemberSupport />
      <Faq />
      <TrustPrivacy />
    </>
  );
}
