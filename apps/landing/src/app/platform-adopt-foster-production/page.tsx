import type { Metadata } from "next";
import HeroSearchSection from "./components/HeroSearchSection";
import FeaturedAnimalsSection from "./components/FeaturedAnimalsSection";
import AnimalGridSection from "./components/AnimalGridSection";
import ShelterSpotlightSection from "./components/ShelterSpotlightSection";
import AdoptionProcessSection from "./components/AdoptionProcessSection";
import SuccessStoriesSection from "./components/SuccessStoriesSection";
import CTABannerSection from "./components/CTABannerSection";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Adopt & Foster | Find Your Perfect Companion | Zoiko Social",
  description:
    "Browse adoptable animals from trusted shelters and rescues. Discover dogs, cats, and small animals ready for adoption or foster care through verified, safe welfare pathways.",
};

/**
 * Platform > Adopt & Foster (Production)
 *
 * Implemented from Figma node 1087:4962 ("zoikoSocial-platform-adopt-foster-production").
 * Section-by-section implementation with exact typography, colors, layout, and downloaded assets.
 */
export default function PlatformAdoptFosterProductionPage() {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: C.pageBg, color: C.nevada }}
    >
      {/* SECTION 1: SEARCH HERO */}
      <HeroSearchSection />

      {/* SECTION 2: FEATURED ANIMALS */}
      <FeaturedAnimalsSection />

      {/* SECTION 3: ANIMAL GRID WITH TYPE/ADOPTION/AGE FILTERS */}
      <AnimalGridSection />

      {/* SECTION 4: SHELTER SPOTLIGHT */}
      <ShelterSpotlightSection />

      {/* SECTION 5: ADOPTION PROCESS */}
      <AdoptionProcessSection />

      {/* SECTION 6: SUCCESS STORIES */}
      <SuccessStoriesSection />

      {/* SECTION 7: CTA BANNER */}
      <CTABannerSection />
    </div>
  );
}
