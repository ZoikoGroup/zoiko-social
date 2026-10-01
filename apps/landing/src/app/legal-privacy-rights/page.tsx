import {
  PrivacyChoicesSection,
  SupportSubNav,
  WhatDoYouWantToDo,
  DoItYourself,
  YourRightsDependOnWhereYouLive,
  CommonPrivacyRights,
  BeforeYouSubmit,
  StartPrivacyRequest,
  HowWeConfirmItsYou,
  TrackYourRequest,
  DeletingYourData,
  GettingACopyOfYourData,
  ActingForSomeoneElse,
  DecisionsAndReviews,
  FrequentlyAskedQuestions,
  ComplexPrivacyQuestion,
} from "./components";

export default function PrivacyRightsPage() {
  return (
    <main>
      <PrivacyChoicesSection />
      <SupportSubNav />
      <WhatDoYouWantToDo />
      <DoItYourself />
      <YourRightsDependOnWhereYouLive />
      <CommonPrivacyRights />
      <BeforeYouSubmit />
      <StartPrivacyRequest />
      <HowWeConfirmItsYou />
      <TrackYourRequest />
      <DeletingYourData />
      <GettingACopyOfYourData />
      <ActingForSomeoneElse />
      <DecisionsAndReviews />
      <FrequentlyAskedQuestions />
      <ComplexPrivacyQuestion />
    </main>
  );
}
