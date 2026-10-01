import type { Metadata } from "next";
import Hero from "./components/Hero";
import NoteOfficialSources from "./components/NoteOfficialSources";
import BrowseTopics from "./components/BrowseTopics";
import RecentDiscussions from "./components/RecentDiscussions";
import KnowWhosAnswering from "./components/KnowWhosAnswering";
import StartADiscussion from "./components/StartADiscussion";
import KeepItPublicSafe from "./components/KeepItPublicSafe";
import WhenToGoOfficial from "./components/WhenToGoOfficial";
import ReportBand from "./components/ReportBand";
import FollowTopics from "./components/FollowTopics";
import ForumFaq from "./components/ForumFaq";

export const metadata: Metadata = {
  title: "Community Forums | Support & Developers | Zoiko Social",
  description:
    "Ask questions, share tips and learn from other Zoiko Social members — browse topics, start a discussion, and find out when to go straight to an official answer.",
};

/**
 * Support & Developers > Community Forums.
 *
 * Figma: desktop frame "zoiko-social-Support & Developers-Community
 * Forums" (1440w, node 1274:6154) and its mobile counterpart (412w, node
 * 1274:7314). Section order, copy, and backgrounds follow the desktop
 * frame end to end:
 *   Hero + Search ("Community Forums" heading, search box, sample post
 *   previews) → Note - Official sources (dark teal band: "Need an official
 *   answer?" + Help Center / API Documentation / Developer Support / System
 *   Status / Contact Us pill links) → Browse topics (6-topic card grid) →
 *   Recent discussions
 *   (topic filter pills + 8-item discussion list) → Know who's answering
 *   (Community post / Official reference / Verified role label cards) →
 *   Start a discussion (post composer + Similar discussions / Official
 *   answers aside) → Keep it public-safe (5 "never post" reminders) →
 *   Some questions need an official answer (8-card routing grid) → Report
 *   band (dark teal "See something harmful?" panel) → Follow the topics
 *   you love (render-gated topic-follow panel) → Forum questions (FAQ
 *   accordion with a "Start a discussion" photo card).
 *
 * The frame's own header (search bar, tab nav, Join Free) and footer
 * mockups are already reproduced by the root layout, so this page only
 * renders the page-specific sections between them. Every breakpoint is
 * handled by Tailwind responsive classes within these same components —
 * there is no separate mobile page. Photos, icons and every small
 * glyph/emoji used across the frame were exported to
 * /public/support&developers-community-forums as compressed .webp assets
 * (never rendered as live Unicode icons/emoji).
 *
 * Judgment calls, made because the Figma frame doesn't define this
 * content or behavior:
 *  - "Recent discussions" topic filter pills and "Start a discussion" /
 *    "Search" controls are static (no client-side filtering or form
 *    submission wired up) — the Figma frame only specifies their resting
 *    visual state.
 *  - "Follow the topics you love" is marked "render-gated" in Figma
 *    (shown only if forum notifications are approved). This route has no
 *    real auth/permission state to gate on, so it renders unconditionally,
 *    same as platform-features' gated sections.
 *  - "Forum questions" (FAQ) ships only the collapsed question rows (a
 *    "+" toggle with no expanded state), so the answers are written to
 *    match the page's own copy rather than pulled verbatim from the
 *    design — see ForumFaq.tsx.
 */
export default function SupportDevelopersCommunityForumsPage() {
  return (
    <>
      <Hero />
      <NoteOfficialSources />
      <BrowseTopics />
      <RecentDiscussions />
      <KnowWhosAnswering />
      <StartADiscussion />
      <KeepItPublicSafe />
      <WhenToGoOfficial />
      <ReportBand />
      <FollowTopics />
      <ForumFaq />
    </>
  );
}
