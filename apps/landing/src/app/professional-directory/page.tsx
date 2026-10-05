import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import StickyNavSection from "./components/StickyNavSection";
import VerificationExplainerSection from "./components/VerificationExplainerSection";
import BrowseCategoriesSection from "./components/BrowseCategoriesSection";
import DirectoryListingsSection from "./components/DirectoryListingsSection";
import PracticesTeamsSection from "./components/PracticesTeamsSection";
import HowVerificationWorksSection from "./components/HowVerificationWorksSection";
import SavedSection from "./components/SavedSection";
import ForProfessionalsSection from "./components/ForProfessionalsSection";
import TrustSafetyNoticeSection from "./components/TrustSafetyNoticeSection";
import FaqSection from "./components/FaqSection";

export const metadata: Metadata = {
  title: "Professional Directory | Verified Animal-Care Professionals | Zoiko Social",
  description:
    "Find verified animal-care professionals with confidence. Search vets, trainers, groomers, behaviorists, nutritionists, and caregivers with clear verification and practice details.",
};

/**
 * Professional Directory Page
 *
 * Implemented section-by-section from Figma node 1414:2665
 * ("zoiko-social-professional-directory").
 *
 * Sections:
 * 1. Hero Search & Preview Section
 * 2. Sticky Subnav Section ("On this page")
 * 3. Meaning of Verification Explainer Section
 * 4. Browse by Category Section (6 core service areas)
 * 5. Main Directory Listings & Multi-dimensional Filter Section
 * 6. Practices & Teams Section
 * 7. 5-Step Verification Process Section
 * 8. Saved Professionals Section
 * 9. For Animal-Care Professionals Pathways Section
 * 10. Trust & Safety Report Notice Section
 * 11. Frequently Asked Questions Section
 */
export default function ProfessionalDirectoryPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* 1. HERO SEARCH & PREVIEW */}
      <HeroSection />

      {/* 2. STICKY SUB-NAVIGATION */}
      <StickyNavSection />

      {/* 3. WHAT VERIFIED PROFESSIONAL MEANS */}
      <VerificationExplainerSection />

      {/* 4. BROWSE BY CATEGORY */}
      <BrowseCategoriesSection />

      {/* 5. DIRECTORY LISTINGS & FILTERS */}
      <DirectoryListingsSection />

      {/* 6. PRACTICES AND TEAMS */}
      <PracticesTeamsSection />

      {/* 7. HOW VERIFICATION WORKS (5 STEPS) */}
      <HowVerificationWorksSection />

      {/* 8. SAVED SECTION */}
      <SavedSection />

      {/* 9. FOR ANIMAL-CARE PROFESSIONALS */}
      <ForProfessionalsSection />

      {/* 10. TRUST & SAFETY NOTICE */}
      <TrustSafetyNoticeSection />

      {/* 11. FAQ ACCORDION */}
      <FaqSection />
    </div>
  );
}
