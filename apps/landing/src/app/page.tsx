import HeroSection from "./_home/components/HeroSection";
import StatsSection from "./_home/components/StatsSection";
import FeaturesSection from "./_home/components/FeaturesSection";
import CommunitiesSection from "./_home/components/CommunitiesSection";
import NewsSection from "./_home/components/NewsSection";
import CelebrateSection from "./_home/components/CelebrateSection";
import SafetySection from "./_home/components/SafetySection";
import CTASection from "./_home/components/CTASection";

export default function LandingPage() {
  // The layout already renders the <main> wrapper, so this returns a fragment.
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CommunitiesSection />
      <NewsSection />
      <CelebrateSection />
      <CTASection />
      <SafetySection />
    </>
  );
}
