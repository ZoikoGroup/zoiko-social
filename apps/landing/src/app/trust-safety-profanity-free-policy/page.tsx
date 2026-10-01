import type { Metadata } from "next";
import Hero from "./components/Hero";
import CommunityImpact from "./components/CommunityImpact";
import HowModerationWorks from "./components/HowModerationWorks";
import WhatWeProtect from "./components/WhatWeProtect";
import NotCensorship from "./components/NotCensorship";
import TestimonialQuote from "./components/TestimonialQuote";
import LanguageGuidelines from "./components/LanguageGuidelines";
import CoreValues from "./components/CoreValues";
import Accountability from "./components/Accountability";
import NextSteps from "./components/NextSteps";

export const metadata: Metadata = {
  title: "Profanity-Free Policy | Trust & Safety | Zoiko Social",
  description:
    "A welcoming home for respectful conversation. Thoughtful moderation, clear rules, and a community built on respect.",
};

export default function ProfanityFreePolicyPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero */}
      <div className="order-1">
        <Hero />
      </div>

      {/* 2. Community Impact */}
      <div className="order-2">
        <CommunityImpact />
      </div>

      {/* 3. How Moderation Works */}
      <div className="order-3">
        <HowModerationWorks />
      </div>

      {/* 4/5. Responsive Order:
          Desktop: WhatWeProtect (order-4) -> NotCensorship (order-5)
          Mobile:  NotCensorship (order-4) -> WhatWeProtect (order-5)
      */}
      <div className="order-5 sm:order-4">
        <WhatWeProtect />
      </div>

      <div className="order-4 sm:order-5">
        <NotCensorship />
      </div>

      {/* 6. Testimonial Quote */}
      <div className="order-6">
        <TestimonialQuote />
      </div>

      {/* 7. Language Guidelines (Mobile only) */}
      <div className="order-7 sm:hidden">
        <LanguageGuidelines />
      </div>

      {/* 8. Core Values */}
      <div className="order-8">
        <CoreValues />
      </div>

      {/* 9. Accountability */}
      <div className="order-9">
        <Accountability />
      </div>

      {/* 10. Next Steps */}
      <div className="order-10">
        <NextSteps />
      </div>
    </div>
  );
}
