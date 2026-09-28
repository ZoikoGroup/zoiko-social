import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import HeroSection from "./components/HeroSection";
import PurposeSnapshotSection from "./components/PurposeSnapshotSection";
import WhatZoikoSocialIsSection from "./components/WhatZoikoSocialIsSection";
import WhatMakesDifferentSection from "./components/WhatMakesDifferentSection";
import BuiltForAudiencesSection from "./components/BuiltForAudiencesSection";
import TrustByDesignSection from "./components/TrustByDesignSection";
import GlobalLocalSection from "./components/GlobalLocalSection";
import LifeEventsSection from "./components/LifeEventsSection";
import ZoikoEcosystemSection from "./components/ZoikoEcosystemSection";
import CommitmentBannerSection from "./components/CommitmentBannerSection";
import FaqSection from "./components/FaqSection";
import CTABannerSection from "./components/CTABannerSection";
import { C } from "./components/theme";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "About Zoiko Social | A Social Network Built Around Animal Life",
  description:
    "Zoiko Social is a global social infrastructure for animal lovers, professionals, organizations, and communities — combining communication, verified information, adoption, events, commerce, and coordination in a purpose-built environment.",
};

export default function CompanyAboutPage() {
  return (
    <div
      className={`${jakarta.className} min-h-screen w-full overflow-x-hidden selection:bg-[#066879]/20`}
      style={{ background: C.white, color: C.nevada }}
    >
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Purpose Snapshot */}
      <PurposeSnapshotSection />

      {/* Section 3: What Zoiko Social Is */}
      <WhatZoikoSocialIsSection />

      {/* Section 4: What Makes It Different */}
      <WhatMakesDifferentSection />

      {/* Section 5: Built for Three Audiences */}
      <BuiltForAudiencesSection />

      {/* Section 6: Trust by Design */}
      <TrustByDesignSection />

      {/* Section 7: Global & Local */}
      <GlobalLocalSection />

      {/* Section 8: Life Events & Rituals */}
      <LifeEventsSection />

      {/* Section 9: Zoiko Ecosystem */}
      <ZoikoEcosystemSection />

      {/* Section 10: Commitment Banner */}
      <CommitmentBannerSection />

      {/* Section 11: Frequently Asked Questions */}
      <FaqSection />

      {/* Section 12: CTA Banner */}
      <CTABannerSection />
    </div>
  );
}
