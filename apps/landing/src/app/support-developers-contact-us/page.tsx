import type { Metadata } from "next";
import Hero from "./components/Hero";
import BeforeYouContact from "./components/BeforeYouContact";
import SpecialistTeams from "./components/SpecialistTeams";
import ContactRequest from "./components/ContactRequest";
import WaysToReachUs from "./components/WaysToReachUs";
import UrgentSafetyBand from "./components/UrgentSafetyBand";
import WhatWeAskFor from "./components/WhatWeAskFor";
import AfterYouSend from "./components/AfterYouSend";
import BusinessPress from "./components/BusinessPress";
import ContactFaq from "./components/ContactFaq";

export const metadata: Metadata = {
  title: "Contact Us | Support & Developers | Zoiko Social",
  description:
    "Tell us what you need and we'll point you to the right team — quick self-serve answers, specialist teams, a guided contact request, and what to expect after you send it.",
};

/**
 * Support & Developers > Contact Us.
 *
 * Figma: desktop frame "zoiko social-Support & Developers-contact-us"
 * (1440w, node 1274:2426) and its mobile counterpart (412w, node 1274:3285).
 * Section order, copy, and backgrounds follow the desktop frame end to end:
 *   Hero ("Contact Us" heading, intro copy, "Start contact request" CTA,
 *   Search Help Center / Check System Status / Specialist teams links) →
 *   Before you contact ("Quicker answers first" — Help Center / System
 *   Status link-out cards) → Specialist teams (Accessibility / Integrations
 *   / API reference / Tips from members, 4-card grid) → Contact request
 *   ("Start a contact request" — 5-step progress rail + step 1 reason-
 *   picker form) → Urgent / safety band (dark teal "Someone in danger?"
 *   panel) → What we ask for ("Keep private details out" — 5 "never
 *   include" reminder cards) → After you send (5-stage status tracker:
 *   Submitted, Received, With a team, Waiting on you, Closed) →
 *   Business/press (render-gated "Partnerships or press?" panel) → Contact
 *   questions (FAQ accordion with a "Start a discussion" photo card).
 *
 * "Ways to reach us" (node 1274:3618) exists ONLY on the mobile frame, with
 * no desktop counterpart at all — three channel cards (Web request / Live
 * chat / Phone support) with hours, languages and needs. It's rendered here
 * as its own `lg:hidden` component (WaysToReachUs) positioned between
 * ContactRequest and UrgentSafetyBand to match the mobile frame's vertical
 * order; it never appears at the `lg:` breakpoint, so it doesn't affect the
 * desktop layout at all.
 *
 * The frame's own header (search bar, tab nav, Join Free) and footer
 * mockups are already reproduced by the root layout, so this page only
 * renders the page-specific sections between them. Every breakpoint is
 * handled by Tailwind responsive classes within these same components —
 * there is no separate mobile page. Photos, icons and every small
 * glyph/emoji used across the frame were exported to
 * /public/support&developers-contact-us as compressed .webp assets (never
 * rendered as live Unicode icons/emoji).
 *
 * Judgment calls, made because the Figma frame doesn't define this content
 * or behavior:
 *  - Photo re-audit: only the Hero photo is genuinely the SAME source image
 *    at both breakpoints (confirmed by matching Figma asset hash, not just
 *    layer name — both nodes resolve to the identical exported PNG). Help
 *    Center, System Status (both in "Before you contact"), the
 *    urgent/safety band, and Business/press each have a DISTINCT mobile
 *    photo in Figma — same layer name as their desktop counterpart (e.g.
 *    "photo-1583511655857-d19b40a7a54e") but a different exported asset
 *    hash and, on inspection, a visibly different photo (e.g. a dog outdoors
 *    on desktop vs. a bulldog puppy on a blue background on mobile for the
 *    safety band). Each of those four sections now ships a dedicated
 *    `-mobile` asset, gated `lg:hidden`/`hidden lg:block` alongside the
 *    existing desktop <Image>, matching the pattern used throughout
 *    community-forums. FAQ has no photo at all on the mobile frame, so its
 *    photo card stays desktop-only (`hidden lg:block`, unchanged).
 *  - "Ways to reach us" (mobile-only, see above) ships its Hours/Languages/
 *    Needs rows and approved-channel label as unresolved `{{merge_tag}}`
 *    template placeholders in Figma rather than literal copy. Rendering the
 *    raw `{{...}}` tokens would look broken, so plausible resting-state
 *    copy was written instead — see the comment in WaysToReachUs.tsx.
 *  - "Contact request" ships only step 1 of the 5-step wizard ("Reason");
 *    steps 2–5 are static progress-rail labels with no interactive
 *    multi-step form wired up, matching the Figma frame's own scope.
 *  - "Business/press" is marked "Shown only if an approved route exists" in
 *    Figma (render-gated). This route has no real approval/permission state
 *    to gate on, so it renders unconditionally, same as the "render-gated"
 *    sections on other support&developers pages.
 *  - "Contact questions" (FAQ) ships only the collapsed question rows (a
 *    "+" toggle, no expanded state), so the answers are written to match
 *    the page's own copy rather than pulled verbatim — see ContactFaq.tsx.
 *    Mobile also drops the photo card and adds a one-line "Before you write
 *    in." sub-heading not present on desktop; both are reproduced exactly
 *    as scoped per breakpoint.
 */
export default function SupportDevelopersContactUsPage() {
  return (
    <>
      <Hero />
      <BeforeYouContact />
      <SpecialistTeams />
      <ContactRequest />
      <WaysToReachUs />
      <UrgentSafetyBand />
      <WhatWeAskFor />
      <AfterYouSend />
      <BusinessPress />
      <ContactFaq />
    </>
  );
}
