import type { Metadata } from "next";
import HeroSection from "./home/HeroSection";
import FeaturesSection from "./home/FeaturesSection";
import CommunitiesSection from "./home/CommunitiesSection";
import NewsSection from "./home/NewsSection";
import CelebrateSection from "./home/CelebrateSection";
import CTASection from "./home/CTASection";
import SafetySection from "./home/SafetySection";
import { C } from "./home/theme";

/*
  Home-page metadata. This overrides the title and description set in
  layout.tsx, which stay as the site-wide default for every other route.
*/
export const metadata: Metadata = {
  title: "Zoiko Social | Global Social Network for Animal Lovers ",
  description:
    "Join Zoiko Social, the global social network for animal lovers, communities, pets, wildlife, verified animal news, adoption, events and animal welfare.",
};

export default function LandingPage() {
  // The layout already renders the <main> wrapper, so this only sets the
  // page's own background and base text colour.
  return (
    <div
      className="font-jakarta"
      style={{ background: C.page, color: C.muted }}
    >
      <HeroSection />
      <FeaturesSection />
      <CommunitiesSection />
      <NewsSection />
      <CelebrateSection />
      <CTASection />
      <SafetySection />
    </div>
  );
}
