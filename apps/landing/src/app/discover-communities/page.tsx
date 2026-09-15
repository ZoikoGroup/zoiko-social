import {
  DiscoverCommunitiesHero,
  RecommendedCommunitiesSection,
  SpeciesHubsSection,
  PurposeCollectionsSection,
  LocalCommunitiesSection,
  AllCommunitiesSection,
  TrustAndSafetySection,
  CommonQuestionsSection,
} from "./components";

export default function CommunitiesPage() {
  return (
    <main>
      <DiscoverCommunitiesHero />
      <RecommendedCommunitiesSection />
      <SpeciesHubsSection />
      <PurposeCollectionsSection />
      <LocalCommunitiesSection />
      <AllCommunitiesSection />
      <TrustAndSafetySection />
      <CommonQuestionsSection />
    </main>
  );
}
