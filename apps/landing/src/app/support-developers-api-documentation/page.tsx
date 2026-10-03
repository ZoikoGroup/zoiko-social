import {
  ApiDocumentation,
  GettingStarted,
  ApiCatalog,
  CoreConcepts,
  EventsSdkTools,
  WhenARequestFails,
  Changelog,
  NotRespondingCard,
  DocumentationQuestions,
} from "./components";

export default function ApiDocumentationPage() {
  return (
    <main>
      <ApiDocumentation />
      <GettingStarted />
      <ApiCatalog />
      <CoreConcepts />
      <EventsSdkTools />
      <WhenARequestFails />
      <Changelog />
      <NotRespondingCard />
      <DocumentationQuestions />
    </main>
  );
}
