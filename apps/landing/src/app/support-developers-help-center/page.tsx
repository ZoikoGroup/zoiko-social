import {
  HelpCenter,
  PopularArticles,
  BrowseByTopic,
  FixPathSection,
  GetHelpSection,
  SystemStatusBanner,
  BuildingWithZoikoSocial,
  UsingTheHelpCenter,
} from "./components";

export default function HelpCenterPage() {
  return (
    <main>
      <HelpCenter />
      <PopularArticles />
      <BrowseByTopic />
      <FixPathSection />
      <GetHelpSection />
      <SystemStatusBanner />
      <BuildingWithZoikoSocial />
      <UsingTheHelpCenter />
    </main>
  );
}
