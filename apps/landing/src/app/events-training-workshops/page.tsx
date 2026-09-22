import type { Metadata } from "next";
import Hero from "./components/Hero";
import WorkshopsBrowser from "./components/WorkshopsBrowser";
import CommonQuestions from "./components/CommonQuestions";
import { HowItWorks, TrustPanel } from "./components/InfoSections";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Training & Workshops | Zoiko Social Events",
  description:
    "Learn practical animal-care skills from trusted professionals — educational sessions with clear learning outcomes, prerequisites and animal-welfare safeguards.",
};

export default function EventsTrainingWorkshopsPage() {
  return (
    <div className="min-h-screen" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <Hero />
        <WorkshopsBrowser />
        <TrustPanel />
        <HowItWorks />
        <CommonQuestions />
      </div>
    </div>
  );
}
