import type { Metadata } from "next";
import Hero from "./components/Hero";
import EventBrowser from "./components/EventBrowser";
import TrustSignals from "./components/TrustSignals";
import SafetySection from "./components/SafetySection";
import FollowTopics from "./components/FollowTopics";
import FAQ from "./components/FAQ";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Online Events | Zoiko Social",
  description:
    "Join animal-focused events from anywhere — live workshops, community sessions, fundraisers, and rescue events with clear organizers, times, and safety expectations.",
};

export default function EventsOnlinePage() {
  return (
    <div className="min-h-screen" style={{ background: C.page }}>
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <Hero />
        <EventBrowser />
        <TrustSignals />
        <SafetySection />
        <FollowTopics />
        <FAQ />
      </div>
    </div>
  );
}
