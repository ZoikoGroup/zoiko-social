import type { Metadata } from "next";
import Hero from "./components/Hero";
import MeetupsBrowser from "./components/MeetupsBrowser";
import CommonQuestions from "./components/CommonQuestions";
import { BrowseAnotherWay, TrustPanel } from "./components/InfoSections";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Community Meetups | Zoiko Social",
  description:
    "Meet animal lovers around shared interests — casual, community-centered gatherings built around animals, shared interests, and responsible participation.",
};

export default function EventsCommunityMeetupsPage() {
  return (
    <div className="min-h-screen" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <Hero />
        <MeetupsBrowser />
        <TrustPanel />
        <BrowseAnotherWay />
        <CommonQuestions />
      </div>
    </div>
  );
}
