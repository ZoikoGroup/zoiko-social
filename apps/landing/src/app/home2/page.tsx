import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CommunitiesSection from "./components/CommunitiesSection";
import NewsSection from "./components/NewsSection";
import CelebrateSection from "./components/CelebrateSection";
import CTASection from "./components/CTASection";
import SafetySection from "./components/SafetySection";
import { C } from "./components/theme";

/*
  The home2 comps are set in Plus Jakarta Sans, which the root layout does not
  load (it loads Montserrat and Inter for the existing pages). Loading it here
  scopes the font to this route instead of changing the site-wide layout.
*/
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Zoiko Social | Global Social Network for Animal Lovers",
  description:
    "Join Zoiko Social, the global social network for animal lovers, communities, pets, wildlife, verified animal news, adoption, events and animal welfare.",
};

export default function Home2Page() {
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
