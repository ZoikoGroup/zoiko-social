import {
  EmergencyGuidance,
  TypesOfEmergencies,
  QuickDecisionGuide,
  GetHelpInYourRegion,
  PreventionEarlyWarningSigns,
  RecoveryTimeline,
  SupportingTheHelpers,
  EmotionalSupportPathways,
  FrequentlyAskedQuestions,
  EmergencyBanner,
} from "./components";

export default function EmergencyGuidancePage() {
  return (
    <main>
      <EmergencyGuidance />
      <TypesOfEmergencies />
      <QuickDecisionGuide />
      <GetHelpInYourRegion />
      <PreventionEarlyWarningSigns />
      <RecoveryTimeline />
      <SupportingTheHelpers />
      <EmotionalSupportPathways />
      <FrequentlyAskedQuestions />
      <EmergencyBanner />
    </main>
  );
}
