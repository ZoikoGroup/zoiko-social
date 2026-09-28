import {
  PartnershipsSection,
  WhoWePartnerWith,
  RecommendedPartnershipPaths,
  WhatMakesAstrongFit,
  HowPartnershipWorks,
  TrustAndGovernanceBoundaries,
  StartPartnershipInquiryForm,
  WhatHappensNext,
  FrequentlyAskedQuestions,
  ReadyToExplorePartnershipsCTA,
} from "./components";

export default function PartnershipsPage() {
  return (
    <main>
      <PartnershipsSection />
      <WhoWePartnerWith />
      <RecommendedPartnershipPaths />
      <WhatMakesAstrongFit />
      <HowPartnershipWorks />
      <TrustAndGovernanceBoundaries />
      <StartPartnershipInquiryForm />
      <WhatHappensNext />
      <FrequentlyAskedQuestions />
      <ReadyToExplorePartnershipsCTA />
    </main>
  );
}
