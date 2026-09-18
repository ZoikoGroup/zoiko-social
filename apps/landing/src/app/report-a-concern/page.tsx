import CommonQuestions from "./components/CommonQuestions";
import EvidencePrivacy from "./components/EvidencePrivacy";
import Hero from "./components/Hero";
import HowReportingWorks from "./components/HowReportingWorks";
import OtherHelp from "./components/OtherHelp";
import StartReport from "./components/StartReport";
import UrgentHelp from "./components/UrgentHelp";
import WhatCanIReport from "./components/WhatCanIReport";
import { C } from "./components/theme";

export default function ReportAConcernPage() {
  return (
    <main style={{ backgroundColor: C.page }}>
      <Hero />
      <UrgentHelp />
      <WhatCanIReport />
      <HowReportingWorks />
      <EvidencePrivacy />
      <StartReport />
      <OtherHelp />
      <CommonQuestions />
    </main>
  );
}