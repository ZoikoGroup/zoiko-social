import type { Metadata } from "next";
import Hero from "./components/Hero";
import WhyTrust from "./components/WhyTrust";
import CommunityProtection from "./components/CommunityProtection";
import CommunityStories from "./components/CommunityStories";
import BuiltInSafetyFeatures from "./components/BuiltInSafetyFeatures";
import StatsBanner from "./components/StatsBanner";
import HowWeCompare from "./components/HowWeCompare";
import AnimalWelfareGuidelines from "./components/AnimalWelfareGuidelines";
import AnimalWelfareFAQ from "./components/AnimalWelfareFAQ";
import JoinSaferCommunityBanner from "./components/JoinSaferCommunityBanner";

export const metadata: Metadata = {
  title: "Animal Welfare | Trust & Safety | Zoiko Social",
  description:
    "Zoiko Social is built on trust. We protect animals and empower communities to make the difference in the world.",
};

export default function TrustSafetyAnimalWelfarePage() {
  return (
    <div className="bg-white">
      <Hero />
      <WhyTrust />
      <CommunityProtection />
      <CommunityStories />
      <BuiltInSafetyFeatures />
      <StatsBanner />
      <HowWeCompare />
      <AnimalWelfareGuidelines />
      <AnimalWelfareFAQ />
      <JoinSaferCommunityBanner />
    </div>
  );
}
