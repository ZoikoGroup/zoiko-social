import type { Metadata } from "next";
import Hero from "./components/Hero";
import UpcomingBrowser from "./components/UpcomingBrowser";
import KeepPlanning from "./components/KeepPlanning";
import {
  EverythingBox,
  FollowCTA,
  MoreLinks,
  TrustCards,
} from "./components/ClosingSections";

export const metadata: Metadata = {
  title: "Upcoming Events | Zoiko Social",
  description:
    "Plan what you want to show up for next — community gatherings, rescue events, workshops, fundraisers and online sessions over the next 30 days.",
};

export default function EventsUpcomingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <UpcomingBrowser />
      <KeepPlanning />
      <EverythingBox />
      <TrustCards />
      <MoreLinks />
      <FollowCTA />
    </div>
  );
}
