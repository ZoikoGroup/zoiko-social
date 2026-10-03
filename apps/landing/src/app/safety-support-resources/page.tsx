import type { Metadata } from "next";
import ResourceSearch from "./components/ResourceSearch";
import PathToHealing from "./components/PathToHealing";
import ProfessionalCare from "./components/ProfessionalCare";
import FindAccessHelp from "./components/FindAccessHelp";
import Costs from "./components/Costs";
import WellnessTools from "./components/WellnessTools";
import FindHelpNow from "./components/FindHelpNow";
import OnlineTherapy from "./components/OnlineTherapy";
import CTA from "./components/CTA";

export const metadata: Metadata = {
  title: "Support Resources | Zoiko Social Safety",
  description:
    "Curated resources for mental health, wellness, and community support — therapy options, crisis lines, support groups, costs, and self-care tools.",
};

export default function SafetySupportResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResourceSearch>
        <PathToHealing />
        <ProfessionalCare />
        <FindAccessHelp />
        <Costs />
        <WellnessTools />
        <FindHelpNow />
        <OnlineTherapy />
      </ResourceSearch>
      <CTA />
    </div>
  );
}
