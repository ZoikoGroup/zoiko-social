
import ConnectVerifiedOrganization from "./components/ConnectVerifiedOrganization";
import FrequentlyAskedQuestions from "./components/FrequentlyAskedQuestions";
import Hero from "./components/hero";
import ManageOrganization from "./components/ManageOrganization";
import SafetyReporting from "./components/SafetyReporting";
import { C } from "./components/theme";
import VerifiedByZoikoNotice from "./components/VerifiedByZoikoNotice";
import VerifiedOrganizations from "./components/VerifiedOrganizations";

export default function VerifiedRescuesSheltersPage() {
  return (
    <main style={{ backgroundColor: C.page }}>
      <Hero />
      <VerifiedByZoikoNotice />
      <VerifiedOrganizations />
      <ManageOrganization />
      <SafetyReporting />
      <FrequentlyAskedQuestions />
      <ConnectVerifiedOrganization />
    </main>
  );
}