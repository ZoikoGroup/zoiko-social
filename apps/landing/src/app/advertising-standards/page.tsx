import React from "react";
import type { Metadata } from "next";
import Hero from "./components/Hero";
import PolicyVersionStrip from "./components/PolicyVersionStrip";
import QuickPolicyCheck from "./components/QuickPolicyCheck";
import WhatYouCanAdvertise from "./components/WhatYouCanAdvertise";
import TheStandards from "./components/TheStandards";
import CookieQuestions from "./components/CookieQuestions";
import CampaignCta from "./components/CampaignCta";

export const metadata: Metadata = {
  title: "Advertising Standards — Zoiko Social",
  description:
    "Ads on Zoiko Social come from verified, animal-aligned advertisers. They're clearly labeled, follow welfare and safety rules, respect privacy, and stay separate from verified news and adoption.",
};

export default function AdvertisingStandardsPage() {
  return (
    <div className="w-full min-h-screen bg-white font-sans text-[#102A32] selection:bg-[#066879] selection:text-white">
      <Hero />
      <PolicyVersionStrip />
      <QuickPolicyCheck />
      <WhatYouCanAdvertise />
      <TheStandards />
      <CookieQuestions />
      <CampaignCta />
    </div>
  );
}
