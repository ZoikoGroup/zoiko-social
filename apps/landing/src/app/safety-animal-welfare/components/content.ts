import { APP_LINKS } from "@/lib/app-links";

/**
 * The app has no dedicated welfare-report form yet, so every "Report" action
 * points at the reporting guide in the Safety & Trust docs, as the other
 * landing pages' "Report a concern" links do.
 */
export const REPORT_URL = `${APP_LINKS.safety}#reporting`;

export const IMG = "/safety-animal-welfare/";

export const WHY_IT_MATTERS = [
  {
    icon: "icon-specialist.webp",
    title: "Specialist Review",
    body: "Reports go to trained specialists who understand animal welfare issues deeply.",
  },
  {
    icon: "icon-network.webp",
    title: "Network Access",
    body: "We work with regional animal welfare organizations and authorities.",
  },
  {
    icon: "icon-evidence.webp",
    title: "Evidence Based",
    body: "Your detailed report helps ensure appropriate response and follow-up.",
  },
] as const;

export const CONCERN_TYPES: readonly { title: string; summary: string; examples: readonly string[] }[] = [
  {
    title: "Mistreatment",
    summary: "Intentional harm, abuse, or cruelty toward an animal.",
    examples: [
      "Beating, kicking, or violent physical abuse",
      "Forced fighting or baiting",
      "Poisoning or deliberate injury",
      "Excessive punishment or force",
      "Denial of water or basic care",
    ],
  },
  {
    title: "Neglect",
    summary: "Failure to provide basic care, food, water, shelter, or medical.",
    examples: [
      "Lack of food or clean water for extended periods",
      "Inadequate shelter or exposure to harsh conditions",
      "Untreated injuries or illness",
      "No access to veterinary care",
    ],
  },
  {
    title: "Abandonment",
    summary: "Animal left alone without care, food, or ability to survive.",
    examples: [
      "Animal left in confined space without provisions",
      "Dumped or released in unsafe places",
      "Left without access to shelter or care",
      "Orphaned or separated animals",
    ],
  },
  {
    // The design repeats "Neglect" here; the copy describes exploitation.
    title: "Exploitation",
    summary: "Use of animals for profit or entertainment in harmful ways.",
    examples: [
      "Illegal breeding or trafficking",
      "Sale of animals in unsafe conditions",
      "Animal used in dangerous entertainment",
      "Exploitation for commercial gain",
    ],
  },
  {
    title: "Environmental Hazard",
    summary: "Living conditions that pose serious risk to animal health and safety.",
    examples: [
      "Overcrowded or dangerous housing",
      "Unsafe or contaminated environment",
      "Exposure to toxic substances",
    ],
  },
  {
    title: "Other Concern",
    summary: "Animal welfare issue not listed above.",
    examples: [
      "Describe your concern in detail so our team can properly investigate and route your report appropriately.",
    ],
  },
];

export const SAFE_WAYS = [
  "Document what you’ve observed (safely)",
  "Note location, date, and time",
  "Report through Zoiko’s official channels",
  "Contact local animal welfare authorities",
  "Reach out to established rescue organizations",
  "Call police if you witness active abuse",
] as const;

export const NEVER_DO = [
  "Confront the suspected abuser alone",
  "Trespass on private property",
  "Remove an animal without authorization",
  "Put yourself in physical danger",
  "Delay getting emergency help",
  "Attempt medical care you’re not trained for",
] as const;

export const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "Can I report animal welfare concerns without an account?",
    a: "Yes. You don’t need a Zoiko Social account to report an animal welfare concern. An account lets you follow the status of your report, but it isn’t required to submit one.",
  },
  {
    q: "Is animal welfare reporting really free?",
    a: "Yes. Reporting a welfare concern is always free, and there is no charge for specialist review.",
  },
  {
    q: "What happens after I report?",
    a: "Your report goes into a private review queue, where trained specialists assess it. Depending on what they find, they may take action on the platform, ask for more detail, or route it to the right welfare organization.",
  },
  {
    q: "Will Zoiko contact authorities?",
    a: "Where a report indicates serious harm, our team may refer it to the appropriate animal welfare organization or authority. Zoiko is not an emergency service, so if an animal is in immediate danger, contact your local authorities yourself first.",
  },
  {
    q: "How is my report kept safe?",
    a: "Reports are private and never shown publicly. The person or organization you report is never told who filed it, and only the team reviewing the report can see its details.",
  },
  {
    q: "What if an animal is in immediate danger?",
    a: "Contact your local emergency services, animal control, or animal welfare authority immediately. Moderator review is not a substitute for emergency help. You can report through Zoiko afterwards.",
  },
];
