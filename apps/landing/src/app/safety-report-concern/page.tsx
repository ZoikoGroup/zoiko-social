import type { Metadata } from "next";
import Hero from "./components/Hero";
import WhyReportingMatters from "./components/WhyReportingMatters";
import WhatCanYouReport from "./components/WhatCanYouReport";
import HowReportingWorks from "./components/HowReportingWorks";
import AccessibilityAcrossPlans from "./components/AccessibilityAcrossPlans";
import CommunityVoices from "./components/CommunityVoices";
import SafetyResponsibility from "./components/SafetyResponsibility";

export const metadata: Metadata = {
  title: "Safety / Report a Concern | Zoiko Social",
  description:
    "Flag content or behavior that worries you. Reporting is free and available without an account — help us keep Zoiko Social safe for everyone.",
};

export default function SafetyReportConcernPage() {
  return (
    <div className="bg-white">
      <Hero />
      <WhyReportingMatters />
      <WhatCanYouReport />
      <HowReportingWorks />
      <AccessibilityAcrossPlans />
      <CommunityVoices />
      <SafetyResponsibility />
    </div>
  );
}
