import type { Metadata } from "next";
import Hero from "./components/Hero";
import NoteHowWeHandle from "./components/NoteHowWeHandle";
import Topics from "./components/Topics";
import SearchHelp from "./components/SearchHelp";
import VerifiedCapabilities from "./components/VerifiedCapabilities";
import KnownIssues from "./components/KnownIssues";
import ReportBarrier from "./components/ReportBarrier";
import OtherWaysToGetHelp from "./components/OtherWaysToGetHelp";
import AccessibilityReports from "./components/AccessibilityReports";
import AccessibilityFaq from "./components/AccessibilityFaq";

export const metadata: Metadata = {
  title: "Accessibility Support | Support & Developers | Zoiko Social",
  description:
    "Get help using Zoiko Social in the way that works for you, or tell us about something that's in your way — guides, known issues, a barrier report form, and formal accessibility reports.",
};

/**
 * Support & Developers > Accessibility Support.
 *
 * Figma: desktop frame "zoiko social-Support & Developers-accessibility-support"
 * (1440w, node 1274:4079) and its mobile counterpart (412w, node 1274:5143).
 * Section order, copy, and backgrounds follow the desktop frame end to end:
 *   Hero ("Accessibility Support" heading, intro copy, Find accessibility
 *   help / Report a barrier link cards, Help Center / Contact Us / System
 *   Status related-support pills, bottom photo strip) → Note (How we handle
 *   your request) → Help by task
 *   (6-card task grid: Reading and viewing, Moving around, Posting and
 *   messaging, Photos/video/audio, Forms and sign-in, Notifications and
 *   alerts) → Search accessibility help (search box, on the Athens Gray
 *   panel background) → Known issues and workarounds (status filter pills +
 *   4-item issue list, same panel background as Search — desktop combines
 *   both into a single Figma frame, node 1274:4550) → Report a barrier
 *   (4-step progress rail + step 1 "What were you trying to do?" task-
 *   picker form) → Other ways to get help (Contact Us / Help Center /
 *   System Status 3-card grid) → Accessibility reports (VPAT® conformance
 *   report list, "Published only when approved") → Accessibility questions
 *   (FAQ accordion with a "Report a barrier" photo card on desktop).
 *
 * "What's been tested" (node 1274:5450) exists ONLY on the mobile frame,
 * with no desktop counterpart at all (confirmed by searching the desktop
 * frame's full text content for any of this section's copy or its
 * `{{merge_tag}}` fields — none found). It's rendered here as its own
 * `lg:hidden` component (VerifiedCapabilities), positioned between Search
 * accessibility help and Known issues and workarounds to match the mobile
 * frame's vertical order (mobile Section 05 SEARCH → 06 VERIFIED
 * CAPABILITIES → 07 KNOWN ISSUES); it never appears at the `lg:` breakpoint,
 * so it doesn't affect the desktop layout at all — same pattern as
 * "Ways to reach us" on the contact-us page.
 *
 * The frame's own header (search bar, tab nav, Join Free) and footer
 * mockups are already reproduced by the root layout, so this page only
 * renders the page-specific sections between them. Every breakpoint is
 * handled by Tailwind responsive classes within these same components —
 * there is no separate mobile page. Photos, icons and every small
 * glyph/emoji used across the frame were exported to
 * /public/support&developers-accessibility-support as compressed .webp
 * assets (never rendered as live Unicode icons/emoji).
 *
 * Judgment calls, made because the Figma frame doesn't define this content
 * or behavior:
 *  - Photo audit (done up front this time, not as a second pass): every
 *    photo-bearing section — Hero's bottom strip, Help by task's 6 cards,
 *    and Other ways to get help's 3 cards — has a DISTINCT mobile photo set
 *    in Figma, confirmed by different exported asset hashes AND different
 *    downloaded file sizes for every single pair (never assumed identical
 *    from a matching layer name or crop). The Hero strip additionally
 *    differs in COUNT, not just content: desktop shows 4 tiles, mobile
 *    shows 2. Each of those sections now ships dedicated `-mobile` assets,
 *    gated `lg:hidden` / `hidden lg:block` alongside the existing desktop
 *    `<Image>`, matching the pattern used throughout community-forums and
 *    contact-us. The FAQ photo card exists only on the desktop frame (the
 *    mobile frame drops it entirely, same as ContactFaq.tsx), so it ships
 *    `hidden lg:block` with no mobile counterpart at all. Icons/glyphs were
 *    verified per icon the same way; the vast majority resolve to the exact
 *    same asset hash at both breakpoints and are reused as a single file.
 *  - "What's been tested" (mobile-only, see above) ships its
 *    approved-statement, product-area, platform, tested-with, last-checked
 *    and limitations fields as unresolved `{{merge_tag}}` template
 *    placeholders in Figma rather than literal copy. Rendering the raw
 *    `{{...}}` tokens would look broken, so plausible resting-state copy
 *    was written instead — see the comment in VerifiedCapabilities.tsx.
 *  - "Accessibility reports" ships literal report titles/covers/dates on
 *    desktop but the same fields as `{{merge_tag}}` placeholders on mobile;
 *    both breakpoints render the desktop frame's literal copy — see the
 *    comment in AccessibilityReports.tsx.
 *  - "Report a barrier" ships only step 1 of the 4-step wizard ("What were
 *    you trying to do?"); steps 2-4 are static progress-rail labels with no
 *    interactive multi-step form wired up, matching the Figma frame's own
 *    scope (same judgment call as ContactRequest.tsx on the contact-us
 *    page).
 *  - "Accessibility questions" (FAQ) ships only the collapsed question rows
 *    (a "+" toggle with no expanded state), so the answers are written to
 *    match the page's own copy rather than pulled verbatim from the design
 *    — see AccessibilityFaq.tsx. Mobile also drops the photo card and adds
 *    a one-line "Quick answers." sub-heading not present on desktop; both
 *    are reproduced exactly as scoped per breakpoint.
 */
export default function SupportDevelopersAccessibilitySupportPage() {
  return (
    <>
      <Hero />
      <NoteHowWeHandle />
      <Topics />
      <SearchHelp />
      <VerifiedCapabilities />
      <KnownIssues />
      <ReportBarrier />
      <OtherWaysToGetHelp />
      <AccessibilityReports />
      <AccessibilityFaq />
    </>
  );
}
