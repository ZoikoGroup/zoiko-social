import React from "react";
import Hero from "./components/hero";
import { C } from "./components/theme";
import RecentlyListedNotice from "./components/RecentlyListedNotice";
import AdoptionListings from "./components/AdoptionListings";
import NewListingsNotice from "./components/NewListingsNotice";
import HowFreshnessWorks from "./components/HowFreshnessWorks";
import BeforeYouInquire from "./components/BeforeYouInquire";
import KeepExploringSafely from "./components/KeepExploringSafely";
import CommonQuestions from "./components/CommonQuestions";

export default function Page() {
  return (
    <main style={{ backgroundColor: C.page }}>
      <Hero />
      <RecentlyListedNotice />
      <AdoptionListings />
      <NewListingsNotice />
      <HowFreshnessWorks />
      <BeforeYouInquire />
      <KeepExploringSafely />
      <CommonQuestions />
    </main>
  );
}