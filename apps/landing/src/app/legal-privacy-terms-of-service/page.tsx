import {
  TermsOfServiceHeader,
  TermsOfService,
  VersionHistory,
  RelatedPolicies,
  TermsOfServiceFAQ,
  QuestionsAboutTheseTerms,
} from "./components";

export default function TermsOfServicePage() {
  return (
    <main>
      <TermsOfServiceHeader />
      <TermsOfService />
      <VersionHistory />
      <RelatedPolicies />
      <TermsOfServiceFAQ />
      <QuestionsAboutTheseTerms />
    </main>
  );
}
