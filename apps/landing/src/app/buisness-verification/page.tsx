import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import ChooseVerificationSection from "./components/ChooseVerificationSection";
import WhoCanVerifySection from "./components/WhoCanVerifySection";
import EligibilityCheckerSection from "./components/EligibilityCheckerSection";
import WhatWeCheckSection from "./components/WhatWeCheckSection";
import WhatStaysPrivateSection from "./components/WhatStaysPrivateSection";
import BadgeMeaningSection from "./components/BadgeMeaningSection";
import HowItWorksSection from "./components/HowItWorksSection";
import WorkspacePreviewSection from "./components/WorkspacePreviewSection";
import OrgVerificationSection from "./components/OrgVerificationSection";
import DecisionsSection from "./components/DecisionsSection";
import KeepBadgeCurrentSection from "./components/KeepBadgeCurrentSection";
import VerificationFaqSection from "./components/VerificationFaqSection";
import ReadyToVerifyCtaSection from "./components/ReadyToVerifyCtaSection";

export const metadata: Metadata = {
  title: "Professional & Organization Verification | Zoiko Social",
  description:
    "Verify a professional identity or organization through the checks for your category and region, with clear evidence requests, secure handling and status tracking.",
};

/**
 * Business Verification Page
 *
 * Implemented section-by-section exactly matching Figma node 1449:3807
 * ("zoiko-social-buisness-verification").
 *
 * Sections:
 * 1. Hero Section (Heading, actions, disclaimer & live verification gauge preview card)
 * 2. Choose Your Verification Section (Professional, Organization & Help me choose)
 * 3. Who Can Verify Section (8 category cards & support guidance notice)
 * 4. Check If You Can Verify (Interactive 6-question eligibility checker)
 * 5. What We Check Section (8-area comparison matrix table)
 * 6. What Stays Private Section (6 privacy & security protection areas)
 * 7. What The Badge Means Section (What it means vs doesn't mean & 3 profile previews)
 * 8. How Verification Works (7-step process timeline & review guidance banner)
 * 9. Your Verification Workspace (Live applicant dashboard preview, task action form & upload)
 * 10. Organization Verification Section (5-step org path, claim existing page & verify CTA)
 * 11. Decisions Section (6 application status decision outcomes)
 * 12. Keeping Your Badge Current Section (5 status lifecycle items & change triggers)
 * 13. FAQ Section ("Cookie questions" / Verification Questions accordion)
 * 14. Ready To Verify Section (Gradient CTA banner with verification pathways)
 */
export default function BusinessVerificationPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white selection:bg-[#066879]/15">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CHOOSE YOUR VERIFICATION PATH */}
      <ChooseVerificationSection />

      {/* 3. WHO CAN VERIFY (CATEGORIES) */}
      <WhoCanVerifySection />

      {/* 4. CHECK IF YOU CAN VERIFY (QUIZ) */}
      <EligibilityCheckerSection />

      {/* 5. WHAT WE CHECK (COMPARISON TABLE) */}
      <WhatWeCheckSection />

      {/* 6. WHAT STAYS PRIVATE */}
      <WhatStaysPrivateSection />

      {/* 7. WHAT THE BADGE MEANS */}
      <BadgeMeaningSection />

      {/* 8. HOW VERIFICATION WORKS (7 STEPS) */}
      <HowItWorksSection />

      {/* 9. VERIFICATION WORKSPACE PREVIEW */}
      <WorkspacePreviewSection />

      {/* 10. ORGANIZATION VERIFICATION */}
      <OrgVerificationSection />

      {/* 11. DECISIONS & OUTCOMES */}
      <DecisionsSection />

      {/* 12. KEEPING YOUR BADGE CURRENT */}
      <KeepBadgeCurrentSection />

      {/* 13. FAQ / VERIFICATION QUESTIONS */}
      <VerificationFaqSection />

      {/* 14. READY TO VERIFY CTA */}
      <ReadyToVerifyCtaSection />
    </div>
  );
}
