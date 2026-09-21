import type { Metadata } from "next";
import Hero from "./components/Hero";
import WeekendBrowser from "./components/WeekendBrowser";
import SafetyCards from "./components/SafetyCards";
import MoreLinks from "./components/MoreLinks";
import RegionCTA from "./components/RegionCTA";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "This Weekend | Zoiko Social Events",
  description:
    "Browse animal-focused events happening this weekend near you — adoption fairs, trail meetups, training, and fundraisers, matched to your region and local time.",
};

export default function EventsThisWeekendPage() {
  return (
    <div className="min-h-screen" style={{ background: C.panel }}>
      <Hero />
      <WeekendBrowser />
      <SafetyCards />
      <MoreLinks />
      <RegionCTA />
    </div>
  );
}
