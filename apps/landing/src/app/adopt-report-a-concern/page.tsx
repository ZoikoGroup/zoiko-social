import CommonQuestions from "./components/CommonQuestions";
import EvidencePrivacy from "./components/EvidencePrivacy";
import Hero from "./components/Hero";
import HowReportingWorks from "./components/HowReportingWorks";
import OtherHelp from "./components/OtherHelp";
import StartReport from "./components/StartReport";
import UrgentHelp from "./components/UrgentHelp";
import WhatCanIReport from "./components/WhatCanIReport";
import { C } from "./components/theme";
import { ReportFormProvider } from "./components/ReportFormContext";

export default function ReportAConcernPage() {
  return (
    <ReportFormProvider>
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
    </ReportFormProvider>
  );
}