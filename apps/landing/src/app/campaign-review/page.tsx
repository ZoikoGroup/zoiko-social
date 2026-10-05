import React from "react";
import type { Metadata } from "next";

import HeroSection from "./components/HeroSection";
import CurrentStandardsStrip from "./components/CurrentStandardsStrip";
import PrinciplesSection from "./components/PrinciplesSection";
import HowReviewWorksSection from "./components/HowReviewWorksSection";
import StatusMeaningsSection from "./components/StatusMeaningsSection";
import YourCampaignsSection from "./components/YourCampaignsSection";
import ProvidingEvidenceSection from "./components/ProvidingEvidenceSection";
import FixAndResubmitSection from "./components/FixAndResubmitSection";
import RestrictedApprovalSection from "./components/RestrictedApprovalSection";
import AfterLaunchSection from "./components/AfterLaunchSection";
import ReconsiderationSection from "./components/ReconsiderationSection";
import NotificationsDeadlinesSection from "./components/NotificationsDeadlinesSection";
import CookieQuestionsSection from "./components/CookieQuestionsSection";
import PlanNextCampaignCtaSection from "./components/PlanNextCampaignCtaSection";

export const metadata: Metadata = {
  title: "Campaign Review — Zoiko Social Ads Manager",
  description:
    "Track ad review decisions, resolve campaign issues, submit evidence, and resubmit eligible campaigns under Zoiko Social's current Advertising Standards.",
};

/**
 * Campaign Review Page
 *
 * Implemented section-by-section matching Figma node 1449:2
 * ("Updated Zoiko Social" - campaign-review).
 *
 * Sections:
 * 1. Hero Section (Headline, CTAs, Live Campaign Review Preview card)
 * 2. Current Standards Strip (version 3.2, effective dates, version change notes)
 * 3. How we review every campaign (8 foundational principles)
 * 4. How review works (8-step process & review turnaround illustration)
 * 5. What each status means (12 standardized statuses across review lifecycle)
 * 6. Your campaigns (Interactive review dashboard with 11 campaigns, filters, search, tabs)
 * 7. Providing evidence (Required proof vs. what Zoiko Social never asks for)
 * 8. Fix and resubmit (Version 1 vs Version 2 visual diff comparison & step flow)
 * 9. Restricted approval (Conditional clearance checklist & policy links)
 * 10. After launch (Post-launch change triggers and safety notices)
 * 11. Ask for reconsideration (Reconsideration request form & independent review guidelines)
 * 12. Notifications and deadlines (Alert preferences & action deadline timeline)
 * 13. Cookie questions (6 interactive accordion FAQs)
 * 14. Plan your next campaign (Gradient CTA banner)
 */
export default function CampaignReviewPage() {
  return (
    <div className="w-full min-h-screen bg-white font-sans text-[#102A32] selection:bg-[#066879] selection:text-white">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CURRENT STANDARDS STRIP */}
      <CurrentStandardsStrip />

      {/* 3. HOW WE REVIEW EVERY CAMPAIGN (8 PRINCIPLES) */}
      <PrinciplesSection />

      {/* 4. HOW REVIEW WORKS (WORKFLOW & TIMELINE) */}
      <HowReviewWorksSection />

      {/* 5. WHAT EACH STATUS MEANS (12 STATUSES) */}
      <StatusMeaningsSection />

      {/* 6. YOUR CAMPAIGNS (DASHBOARD & DATA TABLE) */}
      <YourCampaignsSection />

      {/* 7. PROVIDING EVIDENCE (6 CARDS) */}
      <ProvidingEvidenceSection />

      {/* 8. FIX AND RESUBMIT (VERSION COMPARISON) */}
      <FixAndResubmitSection />

      {/* 9. RESTRICTED APPROVAL */}
      <RestrictedApprovalSection />

      {/* 10. AFTER LAUNCH (POST-LAUNCH MONITORS) */}
      <AfterLaunchSection />

      {/* 11. ASK FOR RECONSIDERATION (FORM & GUIDELINES) */}
      <ReconsiderationSection />

      {/* 12. NOTIFICATIONS AND DEADLINES */}
      <NotificationsDeadlinesSection />

      {/* 13. COOKIE QUESTIONS (FAQ ACCORDIONS) */}
      <CookieQuestionsSection />

      {/* 14. PLAN YOUR NEXT CAMPAIGN (CTA BANNER) */}
      <PlanNextCampaignCtaSection />
    </div>
  );
}
