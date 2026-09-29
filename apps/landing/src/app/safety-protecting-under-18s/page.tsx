import type { Metadata } from "next";
import Hero from "./components/Hero";
import SafetyForEveryone from "./components/SafetyForEveryone";
import SupportWhenYouNeedIt from "./components/SupportWhenYouNeedIt";
import HowWeProtect from "./components/HowWeProtect";
import DataStats from "./components/DataStats";
import WhatWeDontTolerate from "./components/WhatWeDontTolerate";
import JoinSafeCommunity from "./components/JoinSafeCommunity";
import FactVsFiction from "./components/FactVsFiction";
import FaqSection from "./components/FaqSection";
import AccountabilityBanner from "./components/AccountabilityBanner";

export const metadata: Metadata = {
  title: "Protecting Under-18s | Trust & Safety | Zoiko Social",
  description:
    "At Zoiko Social, we're committed to protecting young people through clear rules, accessible support, and transparent moderation. You belong here.",
};

export default function ProtectingUnder18sPage() {
  return (
    <div className="bg-white">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Safety for Everyone */}
      <SafetyForEveryone />

      {/* Desktop: Support When You Need It */}
      <div className="hidden sm:block">
        <SupportWhenYouNeedIt />
      </div>

      {/* 3. How We Protect Young People */}
      <HowWeProtect />

      {/* Desktop: We Back This Up With Data */}
      <div className="hidden sm:block">
        <DataStats />
      </div>

      {/* 4. What We Don't Tolerate */}
      <WhatWeDontTolerate />

      {/* Mobile: We Back This Up With Data */}
      <div className="block sm:hidden">
        <DataStats />
      </div>

      {/* Mobile: Support When You Need It */}
      <div className="block sm:hidden">
        <SupportWhenYouNeedIt />
      </div>

      {/* Desktop: Join a Safe Community */}
      <div className="hidden sm:block">
        <JoinSafeCommunity />
      </div>

      {/* 5. Separating Fact From Fiction */}
      <FactVsFiction />

      {/* 6. FAQ (Desktop: Frequently asked questions | Mobile: Common Questions) */}
      <FaqSection />

      {/* Mobile: Join a Safe Community */}
      <div className="block sm:hidden">
        <JoinSafeCommunity />
      </div>

      {/* 7. Accountability Banner */}
      <AccountabilityBanner />
    </div>
  );
}
