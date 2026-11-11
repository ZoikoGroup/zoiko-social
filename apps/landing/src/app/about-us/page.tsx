import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import WhoWeAreSection from "./components/WhoWeAreSection";
import WhatWeBuildSection from "./components/WhatWeBuildSection";
import PrinciplesSection from "./components/PrinciplesSection";
import LocationsSection from "./components/LocationsSection";
import StatsSection from "./components/StatsSection";
import TrustSection from "./components/TrustSection";
import WorkWithUsSection from "./components/WorkWithUsSection";
import FaqSection from "./components/FaqSection";
import CTASection from "./components/CTASection";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "About ZoikoSocial | Trusted Social Network for Animals",
  description:
   " Discover ZoikoSocial, a trusted social network connecting animal lovers worldwide. Engage, share, and join a safe, verified community focused on animals.",
};

export default function AboutUs2Page() {
  return (
    <div
      className="font-jakarta"
      style={{ background: C.page, color: C.muted }}
    >
      <HeroSection />
      <WhoWeAreSection />
      <WhatWeBuildSection />
      <PrinciplesSection />
      <LocationsSection />
      <StatsSection />
      <TrustSection />
      <WorkWithUsSection />
      <FaqSection />
      <CTASection />
    </div>
  );
}
