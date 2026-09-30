import type { Metadata } from "next";
import {
  CTA,
  Commitments,
  EvidenceBasedTrust,
  Hero,
  HowWeBuildTrust,
  ImpactStats,
  ReportFlow,
  ThisIsTrust,
  TrustJourney,
  WhereToFindHelp,
} from "./components/Sections";

export const metadata: Metadata = {
  title: "Trust & Safety Center | Zoiko Social",
  description:
    "How Zoiko Social builds trust: transparent policies, human moderation, published accountability, and fair appeals — plus where to find help.",
};

export default function TrustSafetyCenterPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <HowWeBuildTrust />
      <TrustJourney />
      <EvidenceBasedTrust />
      <WhereToFindHelp />
      <ThisIsTrust />
      <ImpactStats />
      <ReportFlow />
      <Commitments />
      <CTA />
    </div>
  );
}
