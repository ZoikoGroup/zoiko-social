import type { Metadata } from "next";
import Hero from "./components/Hero";
import NearYouBrowser from "./components/NearYouBrowser";
import StayLocal from "./components/StayLocal";
import {
  EverythingBox,
  MoreLinks,
  RegionCTA,
  SafetyCards,
} from "./components/ClosingSections";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Events Near You | Zoiko Social",
  description:
    "Find animal-focused meetups, workshops, rescue events and fundraisers in your region — matched to the area you set, never your precise location.",
};

export default function EventsNearYouPage() {
  return (
    <div className="min-h-screen" style={{ background: C.panel }}>
      <Hero />
      <NearYouBrowser />
      <StayLocal />
      <EverythingBox />
      <SafetyCards />
      <MoreLinks />
      <RegionCTA />
    </div>
  );
}
