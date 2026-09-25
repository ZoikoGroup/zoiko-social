import {
  InsuranceAndCarePlans,
  PlanComparisonTable,
  MentalHealthInsuranceMatters,
  FindingInNetworkProviders,
  ApplyingForInsurance,
  MakingTheMostOfYourInsurance,
  FrequentlyAskedQuestions,
} from "./components";

export default function MarketInsuranceCarePage() {
  return (
    <main>
      <InsuranceAndCarePlans />
      <PlanComparisonTable />
      <MentalHealthInsuranceMatters />
      <FindingInNetworkProviders />
      <ApplyingForInsurance />
      <MakingTheMostOfYourInsurance />
      <FrequentlyAskedQuestions />
    </main>
  );
}
