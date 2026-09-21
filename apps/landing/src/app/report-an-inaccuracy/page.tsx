import Hero from "./components/Hero";
import WhatWouldYouLikeToDo from "./components/WhatWouldYouLikeToDo";
import HowCorrectionsWork from "./components/HowCorrectionsWork";
import EditorialCorrectionReport from "./components/EditorialCorrectionReport";
import TrackExistingCase from "./components/TrackExistingCase";
import TrustAndPrivacy from "./components/TrustAndPrivacy";

export default function ReportAnInaccuracyPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FA] pb-20 font-jakarta">
      <Hero />
      <WhatWouldYouLikeToDo />
      <HowCorrectionsWork />
      <EditorialCorrectionReport />
      <TrackExistingCase />
      <TrustAndPrivacy />
    </main>
  );
}
