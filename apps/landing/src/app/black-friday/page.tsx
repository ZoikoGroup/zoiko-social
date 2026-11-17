import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import SaleMarquee from "./components/SaleMarquee";
import FindYourCorner from "./components/FindYourCorner";
import ProfessionalCare from "./components/ProfessionalCare";
import FeaturedCommunities from "./components/FeaturedCommunities";
import StatsBar from "./components/StatsBar";
import CommunitiesEverywhere from "./components/CommunitiesEverywhere";
import ResponsibilitySection from "./components/ResponsibilitySection";
import ConnectWays from "./components/ConnectWays";
import PricingSection from "./components/PricingSection";
import CtaSection from "./components/CtaSection";
import FaqSection from "./components/FaqSection";

export const metadata: Metadata = {
  title: "Black Friday Deals 2026 – Save 30% | Zoiko Social",
  description:
    "Celebrate Black Friday with Zoiko Social! Save 30% on eligible Creator and Business tools for the first year and connect with a community built for animal lovers.",
};

export default function BlackFridayPage() {
  return (
    <div className="overflow-x-hidden bg-white font-jakarta">
      <HeroSection />
      <SaleMarquee />
      <FindYourCorner />
      <ProfessionalCare />
      <FeaturedCommunities />
      <div className="pt-20">
        <StatsBar />
      </div>
      <CommunitiesEverywhere />
      <ResponsibilitySection />
      <ConnectWays />
      <PricingSection />
      <CtaSection />
      <FaqSection />
    </div>
  );
}
