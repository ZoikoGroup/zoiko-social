import type { Metadata } from "next";
import Hero from "./components/Hero";
import RescueBrowser from "./components/RescueBrowser";
import CommonQuestions from "./components/CommonQuestions";
import { RepresentRescue, TrustPanel } from "./components/InfoSections";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Rescue Events | Zoiko Social Events",
  description:
    "Support rescue efforts in person — adoption days, rescue drives, shelter gatherings, and foster-support events from verified rescue organizations.",
};

export default function EventsRescuePage() {
  return (
    <div className="min-h-screen" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <Hero />
        <RescueBrowser />
        <TrustPanel />
        <RepresentRescue />
        <CommonQuestions />
      </div>
    </div>
  );
}
