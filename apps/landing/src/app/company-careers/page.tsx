import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import HeroSection from "./components/HeroSection";
import WhyWorkHereSection from "./components/WhyWorkHereSection";
import TeamsSection from "./components/TeamsSection";
import OpenRolesSection from "./components/OpenRolesSection";
import HowWeHireSection from "./components/HowWeHireSection";
import WorkingPrinciplesSection from "./components/WorkingPrinciplesSection";
import GlobalLocationsSection from "./components/GlobalLocationsSection";
import InclusionAccessibilitySection from "./components/InclusionAccessibilitySection";
import CandidatePrivacySecuritySection from "./components/CandidatePrivacySecuritySection";
import FaqSection from "./components/FaqSection";
import CTABannerSection from "./components/CTABannerSection";
import { C } from "./components/theme";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Careers at Zoiko Social | Build Technology for Animal Communities",
  description:
    "Explore open career opportunities at Zoiko Social. Build technology, systems, safety, content, and operations that support animal lovers, rescues, and organizations worldwide.",
};

export default function CompanyCareersPage() {
  return (
    <div
      className={`${jakarta.className} min-h-screen selection:bg-[#066879]/20`}
      style={{ background: C.white, color: C.nevada }}
    >
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Why Work Here */}
      <WhyWorkHereSection />

      {/* Section 3: Teams / Areas of Work */}
      <TeamsSection />

      {/* Section 4: Open Roles Search & ATS Listings */}
      <OpenRolesSection />

      {/* Section 5: How We Hire */}
      <HowWeHireSection />

      {/* Section 6: Working Principles */}
      <WorkingPrinciplesSection />

      {/* Section 7: Global Locations */}
      <GlobalLocationsSection />

      {/* Section 8: Inclusion & Accessibility */}
      <InclusionAccessibilitySection />

      {/* Section 9: Candidate Privacy & Security */}
      <CandidatePrivacySecuritySection />

      {/* Section 10: Frequently Asked Questions */}
      <FaqSection />

      {/* Section 11: Call to Action Banner */}
      <CTABannerSection />
    </div>
  );
}
