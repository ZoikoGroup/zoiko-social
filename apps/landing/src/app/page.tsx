import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import HeroSection from "./home/HeroSection";
import FeaturesSection from "./home/FeaturesSection";
import CommunitiesSection from "./home/CommunitiesSection";
import NewsSection from "./home/NewsSection";
import CelebrateSection from "./home/CelebrateSection";
import CTASection from "./home/CTASection";
import SafetySection from "./home/SafetySection";
import { C } from "./home/theme";

/*
  The home page is set in Plus Jakarta Sans, which the root layout does not
  load (it loads Montserrat and Inter for the other routes). Loading it here
  scopes the font to this page instead of changing the site-wide layout.
*/
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-jakarta",
});

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
      className={jakarta.className}
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
