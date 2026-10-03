import type { Metadata } from "next";
import Hero from "./components/Hero";
import FeaturedEvent from "./components/FeaturedEvent";
import BrowseByCategory from "./components/BrowseByCategory";
import WhatAreEvents from "./components/WhatAreEvents";
import TrustAndTransparency from "./components/TrustAndTransparency";
import HostAnEvent from "./components/HostAnEvent";
import ClosingCTA from "./components/ClosingCTA";

export const metadata: Metadata = {
  title: "Events | Zoiko Social",
  description:
    "Find adoption drives, rescue fundraisers, training workshops, community gatherings, and animal welfare events hosted by trusted organizations in your area.",
};

export default function PlatformEventsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturedEvent />
      <BrowseByCategory />
      <WhatAreEvents />
      <TrustAndTransparency />
      <HostAnEvent />
      <ClosingCTA />
    </div>
  );
}
