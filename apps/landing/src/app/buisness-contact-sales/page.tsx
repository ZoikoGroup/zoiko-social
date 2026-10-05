import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import OnThisPageNav from "./components/OnThisPageNav";
import RightRouteSection from "./components/RightRouteSection";
import UseCasesSection from "./components/UseCasesSection";
import WhyUsSection from "./components/WhyUsSection";
import SalesCanHelpSection from "./components/SalesCanHelpSection";
import SalesCantOverrideSection from "./components/SalesCantOverrideSection";
import ContactSalesFormSection from "./components/ContactSalesFormSection";
import AlreadyWorkingSection from "./components/AlreadyWorkingSection";
import FaqSection from "./components/FaqSection";
import ReadyToTalkCtaSection from "./components/ReadyToTalkCtaSection";

export const metadata: Metadata = {
  title: "Contact Sales | Zoiko Social for Business & Organizations",
  description:
    "Talk with Zoiko Social about your business or organization needs. For organizations, professionals, advertisers, agencies and institutions with commercial, scale, rollout or managed-service needs.",
};

/**
 * Business Contact Sales Page
 *
 * Implemented section-by-section exactly matching Figma node 1449:7402
 * ("zoiko-social-buisness-contact-sales").
 *
 * Sections:
 * 1. Hero Section (Heading, actions, disclaimer notice & live floating card previews)
 * 2. On This Page Nav (Sticky anchor navigation with 8 section links)
 * 3. Right Route Section ("Is Sales the right route?" with 8 route cards)
 * 4. Use Cases Section ("How businesses work with us" with 7 dynamic bento grid cards)
 * 5. Why Zoiko Social Section ("Why Zoiko Social for business" with 6 features + 2 photos)
 * 6. What Sales Can Help With ("What Sales can help with" with dog visual + 7 scope items)
 * 7. What Sales Can't Override ("What Sales can't override" dark integrity card matrix & policy links)
 * 8. Contact Sales Form ("Contact Sales" 4-step interactive inquiry form & safety trust card)
 * 9. Already Working With Us ("Already working with us?" with 3 self-serve / support cards)
 * 10. FAQ / Cookie Questions ("Cookie questions" 6 interactive accordion items)
 * 11. Ready To Talk CTA ("Ready to talk?" gradient banner with dual pathways)
 */
export default function BusinessContactSalesPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white selection:bg-[#066879]/15">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. ON THIS PAGE NAV */}
      <OnThisPageNav />

      {/* 3. IS SALES THE RIGHT ROUTE? */}
      <RightRouteSection />

      {/* 4. HOW BUSINESSES WORK WITH US (USE CASES) */}
      <UseCasesSection />

      {/* 5. WHY ZOIKO SOCIAL FOR BUSINESS */}
      <WhyUsSection />

      {/* 6. WHAT SALES CAN HELP WITH */}
      <SalesCanHelpSection />

      {/* 7. WHAT SALES CAN'T OVERRIDE */}
      <SalesCantOverrideSection />

      {/* 8. CONTACT SALES INTERACTIVE FORM */}
      <ContactSalesFormSection />

      {/* 9. ALREADY WORKING WITH US? */}
      <AlreadyWorkingSection />

      {/* 10. FAQ / COOKIE QUESTIONS */}
      <FaqSection />

      {/* 11. READY TO TALK CTA BANNER */}
      <ReadyToTalkCtaSection />
    </div>
  );
}
