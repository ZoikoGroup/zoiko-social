import {
  DeveloperSupport,
  CheckTheseFirst,
  NeverSendSecrets,
  HowARequestWorks,
  RequestDeveloperHelp,
  PlanningALargerIntegration,
  MorePlacesToGetHelp,
  DeveloperSupportQuestions,
} from "./components";

export default function DeveloperSupportPage() {
  return (
    <main>
      <DeveloperSupport />
      <CheckTheseFirst />
      <NeverSendSecrets />
      <HowARequestWorks />
      <RequestDeveloperHelp />
      <PlanningALargerIntegration />
      <MorePlacesToGetHelp />
      <DeveloperSupportQuestions />
    </main>
  );
}
