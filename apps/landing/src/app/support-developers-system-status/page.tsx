import {
  SystemStatusHero,
  ActiveIncidents,
  TransparentBanner,
  UnderstandingOurStatus,
  ServiceStatusPage,
  GetStatusUpdates,
  PlannedMaintenance,
  IncidentHistory,
  StillHavingTrouble,
  QuestionsAboutThisPage,
} from "./components";

export default function SystemStatusPage() {
  return (
    <main>
      <SystemStatusHero />
      <ActiveIncidents />
      <TransparentBanner />
      <UnderstandingOurStatus />
      <ServiceStatusPage />
      <GetStatusUpdates />
      <PlannedMaintenance />
      <IncidentHistory />
      <StillHavingTrouble />
      <QuestionsAboutThisPage />
    </main>
  );
}
