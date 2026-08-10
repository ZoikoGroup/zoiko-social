import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import FeaturesSection from "./components/FeaturesSection";
import CommunitiesSection from "./components/CommunitiesSection";
import NewsSection from "./components/NewsSection";
import CelebrateSection from "./components/CelebrateSection";
import SafetySection from "./components/SafetySection";
import CTASection from "./components/CTASection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CommunitiesSection />
      <NewsSection />
      <CelebrateSection />
      <CTASection />
      <SafetySection />
    </main>
  );
}