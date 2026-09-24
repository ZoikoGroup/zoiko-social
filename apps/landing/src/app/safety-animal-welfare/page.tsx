import type { Metadata } from "next";
import Hero from "./components/Hero";
import WhyItMatters from "./components/WhyItMatters";
import UrgencyGuide from "./components/UrgencyGuide";
import ConcernTypes from "./components/ConcernTypes";
import SafetyGuidelines from "./components/SafetyGuidelines";
import Resources from "./components/Resources";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";

export const metadata: Metadata = {
  title: "Animal Welfare Concerns | Zoiko Social Safety",
  description:
    "Report suspected animal mistreatment or neglect. Reporting is free, available without an account, and reviewed by trained animal welfare specialists.",
};

export default function SafetyAnimalWelfarePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <WhyItMatters />
      <UrgencyGuide />
      <ConcernTypes />
      <SafetyGuidelines />
      <Resources />
      <FAQ />
      <CTA />
    </div>
  );
}
