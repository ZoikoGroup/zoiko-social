import React from "react";
import type { Metadata } from "next";

import HeroSection from "./components/HeroSection";
import SubNavStrip from "./components/SubNavStrip";
import WhyAdvertiseSection from "./components/WhyAdvertiseSection";
import WhoCanAdvertiseSection from "./components/WhoCanAdvertiseSection";
import CanIAdvertiseSection from "./components/CanIAdvertiseSection";
import CampaignObjectivesSection from "./components/CampaignObjectivesSection";
import WhereAdsAppearSection from "./components/WhereAdsAppearSection";
import AudiencesPrivacySection from "./components/AudiencesPrivacySection";
import TrustWelfareSafetySection from "./components/TrustWelfareSafetySection";
import GetVerificationReadySection from "./components/GetVerificationReadySection";
import HowAdvertisingWorksSection from "./components/HowAdvertisingWorksSection";
import MeasurementReportingSection from "./components/MeasurementReportingSection";
import BudgetBillingSection from "./components/BudgetBillingSection";
import ChooseHowToStartSection from "./components/ChooseHowToStartSection";
import AdvertisingFaqSection from "./components/AdvertisingFaqSection";
import ReadyToAdvertiseCtaSection from "./components/ReadyToAdvertiseCtaSection";

export const metadata: Metadata = {
  title: "Advertise on Zoiko Social — Reach Animal Communities with Trust",
  description:
    "Promote approved products, services, organizations, education and events in a community built around animals, with clear labeling, verified advertisers and welfare-first review.",
};

/**
 * Business Advertise Page
 *
 * Implemented section-by-section matching Figma node 1451:2
 * ("Updated Zoiko Social" - business-advertise).
 *
 * Sections:
 * 1. Hero Section (Headline, CTA buttons, background & live Ads Manager preview card)
 * 2. Not here to advertise? (Quick navigation strip to verification, directory, press, etc.)
 * 3. Why advertise on Zoiko Social (6-card bento grid with imagery and animal welfare guarantees)
 * 4. Who can advertise (7 categorized eligibility cards with status badges)
 * 5. Can I advertise? (Interactive 4-question wizard with dynamic path recommendations)
 * 6. Campaign objectives (8-objective selector with dynamic optimization badges)
 * 7. Where ads appear (3 realistic mockups: Home feed, Discover, Events)
 * 8. Audiences and privacy (Interactive audience builder & allowed vs. prohibited policies)
 * 9. Trust, welfare and brand safety (What advertising never buys & prohibited ad categories)
 * 10. Get verification ready (4-step timeline & verification prompt)
 * 11. How advertising works (6-step process & campaign review notice)
 * 12. Measurement and reporting (Live report dashboard with impressions, placements & budget cap)
 * 13. Budget and billing (6 pricing transparency and safe billing cards)
 * 14. Choose how to get started (5 onboarding paths: Self-serve, Assisted, Verify, Review, Directory)
 * 15. Cookie questions (6 interactive accordion FAQs)
 * 16. Ready to reach animal lovers? (Gradient CTA banner)
 */
export default function BusinessAdvertisePage() {
  return (
    <div className="w-full min-h-screen bg-white font-sans text-[#102A32] selection:bg-[#066879] selection:text-white">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. NOT HERE TO ADVERTISE STRIP */}
      <SubNavStrip />

      {/* 3. WHY ADVERTISE (BENTO GRID) */}
      <WhyAdvertiseSection />

      {/* 4. WHO CAN ADVERTISE (ELIGIBILITY) */}
      <WhoCanAdvertiseSection />

      {/* 5. CAN I ADVERTISE? (INTERACTIVE ASSESSMENT) */}
      <CanIAdvertiseSection />

      {/* 6. CAMPAIGN OBJECTIVES */}
      <CampaignObjectivesSection />

      {/* 7. WHERE ADS APPEAR (PLACEMENTS MOCKUP) */}
      <WhereAdsAppearSection />

      {/* 8. AUDIENCES AND PRIVACY */}
      <AudiencesPrivacySection />

      {/* 9. TRUST, WELFARE AND BRAND SAFETY */}
      <TrustWelfareSafetySection />

      {/* 10. GET VERIFICATION READY */}
      <GetVerificationReadySection />

      {/* 11. HOW ADVERTISING WORKS */}
      <HowAdvertisingWorksSection />

      {/* 12. MEASUREMENT AND REPORTING */}
      <MeasurementReportingSection />

      {/* 13. BUDGET AND BILLING */}
      <BudgetBillingSection />

      {/* 14. CHOOSE HOW TO GET STARTED */}
      <ChooseHowToStartSection />

      {/* 15. FAQ / COOKIE QUESTIONS */}
      <AdvertisingFaqSection />

      {/* 16. READY TO REACH CTA BANNER */}
      <ReadyToAdvertiseCtaSection />
    </div>
  );
}
