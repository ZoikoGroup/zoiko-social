import {
  LegalNotices,
  LegalEntityAtAGlance,
  Copyright,
  TrademarksAndBrand,
  ThirdPartyMarksAndContent,
  IntellectualPropertyComplaints,
  OpenSourceAndSoftwareNotices,
  RegulatoryAndRegionalNotices,
  FormalLegalCommunications,
  ServiceOfProcess,
  GovernmentAndLawEnforcementRequests,
  CorporateChanges,
  NoticeVersions,
  MoreFromLegalAndPrivacy,
  LegalInformationQuestions,
} from "./components";

export default function LegalNoticesPage() {
  return (
    <main>
      <LegalNotices />
      <LegalEntityAtAGlance />
      <Copyright />
      <TrademarksAndBrand />
      <ThirdPartyMarksAndContent />
      <IntellectualPropertyComplaints />
      <OpenSourceAndSoftwareNotices />
      <RegulatoryAndRegionalNotices />
      <FormalLegalCommunications />
      <ServiceOfProcess />
      <GovernmentAndLawEnforcementRequests />
      <CorporateChanges />
      <NoticeVersions />
      <MoreFromLegalAndPrivacy />
      <LegalInformationQuestions />
    </main>
  );
}
