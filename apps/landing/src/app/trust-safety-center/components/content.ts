import { APP_LINKS } from "@/lib/app-links";

export const IMG = "/trust-safety-center/";

export const HERO_STATS = [
  { value: "2.1M+", label: "Members Trusting Us Daily" },
  { value: "99%", label: "Harmful Content Removed" },
  { value: "18h", label: "Average Response Time" },
] as const;

export const PILLARS = [
  {
    icon: "icon-policies",
    title: "Transparent Policies",
    body: "We publish our rules clearly and explain the reasoning behind them. No hidden rules or surprise enforcement.",
  },
  {
    icon: "icon-human",
    title: "Human Moderation",
    body: "AI helps us identify issues, but people make the final calls. Context and nuance matter in every decision.",
  },
  {
    icon: "icon-accountability",
    title: "Published Accountability",
    body: "We release monthly transparency reports showing exactly how we enforce rules and where we can improve.",
  },
  {
    icon: "icon-appeals",
    title: "Fair Appeals",
    body: "Disagree with our decision? You can appeal and get a fresh review from a different moderator with a full explanation.",
  },
] as const;

export const JOURNEY = [
  {
    image: "journey-listen",
    alt: "A woman presenting to colleagues in a bright office",
    title: "Listen Deeply",
    body: "We start by understanding what keeps people feeling safe online. We talk to users, researchers, and child-safety experts. Their insights shape everything.",
  },
  {
    image: "journey-build",
    alt: "A team reviewing documents together around a table",
    title: "Build Thoughtfully",
    body: "We design systems with clarity and fairness first. Every moderation rule, appeal process, and safety feature is reviewed by multiple teams to prevent bias.",
  },
  {
    image: "journey-improve",
    alt: "Colleagues applauding a presenter in a library",
    title: "Improve Constantly",
    body: "We measure, publish, and act on what we learn. If we’re not living up to our standards, we say so and fix it—publicly.",
  },
] as const;

export const EVIDENCE = [
  { value: "24h", label: "Maximum Response Time for Reports (Target)" },
  { value: "100%", label: "Appeal Access for Eligible Users" },
] as const;

/**
 * Pages with their own landing route link there; the rest point at the app's
 * Safety & Trust guide and help centre, which cover them.
 */
export const HELP = [
  {
    icon: "icon-standards",
    title: "Community Standards",
    body: "The complete rulebook. What’s allowed, what’s not, and why we care about these boundaries.",
    href: "/safety-community-standards",
  },
  {
    icon: "icon-under-18",
    title: "Protecting Under-18s",
    body: "Our specific commitment to young people and families. Safety features, resources, and support.",
    href: APP_LINKS.safety,
  },
  {
    icon: "icon-report",
    title: "Report a Concern",
    body: "Found something troubling? Report it directly. We’ll review it quickly and take action if needed.",
    href: "/safety-report-concern",
  },
  {
    icon: "icon-appeals-help",
    title: "Appeals",
    body: "Disagree with a decision? You have the right to appeal and get a fresh review with a full explanation.",
    href: "/safety-appeals",
  },
  {
    icon: "icon-transparency",
    title: "Transparency Reports",
    body: "Our monthly accountability publication. See exactly how we enforce rules and what we’re working to improve.",
    href: APP_LINKS.safety,
  },
  {
    icon: "icon-education",
    title: "Education & Guides",
    body: "Learn about digital citizenship, online safety, and how to be a responsible community member.",
    href: APP_LINKS.docs,
  },
] as const;

export const IMPACT = [
  { value: "12K+", label: "Communities Built & Thriving" },
  { value: "500K+", label: "Reports Reviewed & Acted Upon" },
  { value: "78%", label: "Member Trust Score" },
  { value: "2 yrs", label: "Without Major Security Incident" },
] as const;

export const REPORT_STEPS = [
  { title: "You Report", body: "Submit your concern in-app with just a few clicks" },
  { title: "We Review", body: "Our team investigates within 24 hours" },
  { title: "We Act", body: "If we find a violation, we take action" },
  { title: "You’re Informed", body: "We tell you the outcome (if appropriate)" },
  { title: "You Can Appeal", body: "Disagree? Appeal and get a fresh review" },
] as const;

export const COMMITMENTS = [
  {
    title: "No Selling Your Report",
    body: "Your report data is never used for marketing, sold, or shared with third parties without legal authority.",
  },
  {
    title: "Privacy Protected",
    body: "We keep your identity safe. You can report anonymously, and we have zero tolerance for retaliation.",
  },
  {
    title: "Transparent Results",
    body: "We tell you what action was taken (when appropriate) so you know we listened and acted.",
  },
  {
    title: "Continuous Improvement",
    body: "We use your reports to find gaps in our policies and systems, then we fix them publicly.",
  },
] as const;
