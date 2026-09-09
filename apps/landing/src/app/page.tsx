import type { Metadata } from "next";
import HeroSection from "./_home/components/HeroSection";
import StatsSection from "./_home/components/StatsSection";
import FeaturesSection from "./_home/components/FeaturesSection";
import CommunitiesSection from "./_home/components/CommunitiesSection";
import NewsSection from "./_home/components/NewsSection";
import CelebrateSection from "./_home/components/CelebrateSection";
import SafetySection from "./_home/components/SafetySection";
import CTASection from "./_home/components/CTASection";

/*
  Home-page metadata. This overrides the title and description set in
  layout.tsx, which stay as the site-wide default for every other route.
*/
export const metadata: Metadata = {
  title: "Zoiko Social | Global Social Network for Animal Lovers",
  description:
    "Join Zoiko Social, the global social network for animal lovers, communities, pets, wildlife, verified animal news, adoption, events and animal welfare.",
};

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
