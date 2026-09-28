import { appUrl } from "@/lib/app-links";

export const IMG = "/safety-support-resources/";

/** External links open in a new tab; in-page anchors and tel:/sms: don't. */
export function externalProps(href: string) {
  return /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export const SAMHSA = { label: "1-800-662-4357", href: "tel:+18006624357" };
export const DIAL_211 = { label: "211", href: "tel:211" };
export const PSYCHOLOGY_TODAY = "https://www.psychologytoday.com/us/therapists";
export const SEVEN_CUPS = "https://www.7cups.com";

// ── Hero search ─────────────────────────────────────────────────────────────

export const CATEGORIES = ["Mental Health", "Crisis Support", "Community", "Wellness"] as const;
export type Category = (typeof CATEGORIES)[number];

/** The "Recommended resources" cards, which the hero search and chips filter. */
export const RESOURCES: readonly {
  icon: string;
  title: string;
  body: string;
  category: Category;
  tags: readonly string[];
  action: string;
  href: string;
}[] = [
  {
    icon: "icon-crisis-text",
    title: "Crisis Text Line",
    body: "Text HOME to 741741 for free, confidential crisis support from trained counselors.",
    category: "Crisis Support",
    tags: ["Crisis Support", "Free", "24/7"],
    action: "Text 741741",
    href: "sms:741741?&body=HOME",
  },
  {
    icon: "icon-therapy",
    title: "Therapy & Counseling",
    body: "Find licensed therapists specializing in depression, anxiety, trauma, and more.",
    category: "Mental Health",
    tags: ["Mental Health", "Professional"],
    action: "Browse",
    href: "#professional-care",
  },
  {
    icon: "icon-meditation",
    title: "Meditation & Mindfulness",
    body: "Apps and guided sessions for stress relief, better sleep, and daily calm.",
    category: "Wellness",
    tags: ["Wellness", "Digital"],
    action: "Explore",
    href: "#wellness-tools",
  },
  {
    icon: "icon-support-groups",
    title: "Support Groups",
    body: "Connect with others who understand. Local and online groups for specific challenges.",
    category: "Community",
    tags: ["Community", "Peer Support"],
    action: "Find",
    href: appUrl("/communities"),
  },
  {
    icon: "icon-peer",
    title: "Peer Counseling",
    body: "Talk with trained peers who have experienced similar challenges and recovery.",
    category: "Community",
    tags: ["Community", "Free"],
    action: "Connect",
    href: SEVEN_CUPS,
  },
];

// ── Find your path to healing ───────────────────────────────────────────────

export const PATHS = [
  {
    image: "path-professional",
    alt: "A therapist shaking hands with a client in a bright office",
    title: "Professional Help",
    body: "Licensed therapists, counselors, and psychiatrists. One-on-one care tailored to your needs.",
  },
  {
    image: "path-support-groups",
    alt: "A support group talking together in a circle of chairs",
    title: "Support Groups",
    body: "Connect with people who understand. Shared experiences, collective wisdom, community.",
  },
  {
    image: "path-wellness",
    alt: "A woman sitting cross-legged on the grass in a park",
    title: "Wellness & Self-Care",
    body: "Meditation, exercise, journaling, nutrition. Build habits that support your mental health daily.",
  },
  {
    image: "path-online",
    alt: "A person on a video call with a therapist on a laptop",
    title: "Online Platforms",
    body: "Apps, virtual therapy, digital support. Get help on your schedule, from anywhere.",
  },
] as const;

// ── Professional mental health care ─────────────────────────────────────────

type Approach = { title: string; body: string; action: string };

/** Only Individual Therapy is written out in the design; the other tabs follow its pattern. */
export const THERAPY_TABS: readonly { label: string; approaches: readonly [Approach, Approach, Approach] }[] = [
  {
    label: "Individual Therapy",
    approaches: [
      {
        title: "Cognitive Behavioral Therapy (CBT)",
        body: "Evidence-based approach. Works with anxiety, depression, trauma. Focuses on thoughts and behaviors. Typically 12–20 sessions.",
        action: "Find CBT Therapist",
      },
      {
        title: "Psychodynamic Therapy",
        body: "Explores root causes. Works with deeper patterns, past experiences. Longer-term, deeper exploration.",
        action: "Find Therapist",
      },
      {
        title: "Acceptance & Commitment (ACT)",
        body: "Focuses on values and acceptance. Works with anxiety, chronic pain, depression. Practical, actionable.",
        action: "Find ACT Specialist",
      },
    ],
  },
  {
    label: "Family Therapy",
    approaches: [
      {
        title: "Family Systems Therapy",
        body: "Looks at the family as a whole. Helps with conflict, communication, and roles that affect everyone.",
        action: "Find Family Therapist",
      },
      {
        title: "Structural Family Therapy",
        body: "Reshapes how family members relate. Sets healthier boundaries and routines. Often short-term.",
        action: "Find Therapist",
      },
      {
        title: "Functional Family Therapy",
        body: "Evidence-based support for families with teens facing behavioral challenges. Builds trust and motivation.",
        action: "Find FFT Specialist",
      },
    ],
  },
  {
    label: "Couples Therapy",
    approaches: [
      {
        title: "Gottman Method",
        body: "Research-based. Builds friendship, manages conflict, and deepens connection. Uses practical exercises.",
        action: "Find Gottman Therapist",
      },
      {
        title: "Emotionally Focused Therapy (EFT)",
        body: "Focuses on emotional bonds and attachment. Helps partners break negative cycles and reconnect.",
        action: "Find EFT Therapist",
      },
      {
        title: "Integrative Behavioral Couple Therapy",
        body: "Combines acceptance and change. Helps partners understand differences and communicate better.",
        action: "Find Therapist",
      },
    ],
  },
  {
    label: "Child/Teen Therapy",
    approaches: [
      {
        title: "Play Therapy",
        body: "Helps younger children express feelings through play. Builds coping skills in a safe, familiar way.",
        action: "Find Play Therapist",
      },
      {
        title: "Trauma-Focused CBT (TF-CBT)",
        body: "Evidence-based support for children and teens after trauma. Involves caregivers in the process.",
        action: "Find TF-CBT Therapist",
      },
      {
        title: "Dialectical Behavior Therapy (DBT)",
        body: "Teaches emotion regulation and distress tolerance. Often used for teens with intense emotions.",
        action: "Find DBT Specialist",
      },
    ],
  },
];

export const APPROACH_ICONS = ["icon-cbt", "icon-psychodynamic", "icon-act"] as const;

// ── How to find & access help ───────────────────────────────────────────────

export const STEPS = [
  {
    title: "Identify what you need",
    items: [
      "What’s most pressing? (Anxiety, grief, trauma, addiction, etc.)",
      "What format appeals to you? (Individual, group, online)",
      "What’s your budget? (Free, sliding scale, insured)",
      "What’s your availability? (Flexible, evenings, weekends)",
    ],
  },
  {
    title: "Find providers/resources",
    items: [
      "Use provider directories (Psychology Today, TherapyDen)",
      "Check with your insurance for covered therapists",
      "Ask for referrals from friends, doctors, employers",
      "Call community mental health centers for free/low-cost options",
    ],
  },
  {
    title: "Reach out & schedule",
    items: [
      "Call, email, or use their intake form",
      "Ask about availability, costs, insurance",
      "Request a first session (many offer free consultations)",
      "Note: Good providers might have wait lists (worth the wait)",
      "Confirm date/time and any prep needed",
    ],
  },
  {
    title: "Have your first session",
    items: [
      "Prepare: Write down goals and concerns beforehand",
      "Be honest about your history and current struggles",
      "Ask questions about their approach and expertise",
      "Discuss confidentiality and what to expect next",
      "It’s okay to try a few providers before finding the right fit",
    ],
  },
] as const;

// ── Costs & financial assistance ────────────────────────────────────────────

export const COSTS = [
  {
    title: "Therapist (In-Person)",
    price: "$75–200",
    body: "Per 50-minute session. Can be less ($20–40) at community mental health centers. Many therapists offer sliding scales based on income.",
  },
  {
    title: "Online Therapy",
    price: "$60–120",
    body: "Per week (subscription model). Monthly: $200–500. Some offer free first week. Often cheaper than in-person.",
  },
  {
    title: "Support Groups",
    price: "Free–$50",
    body: "Most free or by donation. Specialized groups may charge $5–50/month. Online groups often cheaper than in-person.",
  },
] as const;

// ── Wellness tools & self-care practices ────────────────────────────────────

/**
 * Buttons go to the first tool each card names. Journaling and Creative
 * Expression name none, so they point at Zoiko communities, where people share
 * that kind of practice.
 */
export const WELLNESS = [
  {
    image: "wellness-meditation",
    alt: "A person meditating at sunset",
    title: "Meditation & Mindfulness",
    lead: "Apps:",
    body: "Calm, Headspace, Insight Timer, 10% Happier | Reduces anxiety, improves focus, builds emotional awareness. Start with 5 minutes.",
    action: "Try Free Trials",
    href: "https://www.calm.com",
  },
  {
    image: "wellness-movement",
    alt: "A row of dumbbells in a bright gym",
    title: "Movement & Exercise",
    lead: "Tools:",
    body: "Yoga (Down Dog app), Running (Strava), Dance (Just Dance) | Releases endorphins, reduces stress, improves sleep. Any movement counts.",
    action: "Find Activity",
    href: "https://www.downdogapp.com",
  },
  {
    image: "wellness-journaling",
    alt: "A person writing in a notebook on a sofa",
    title: "Journaling & Reflection",
    lead: "Prompts:",
    body: "Gratitude, processing emotions, goal-setting | Free, private, powerful. Pen and paper or digital journals. Structured or freeform.",
    action: "Journal Now",
    href: appUrl("/communities"),
  },
  {
    image: "wellness-creative",
    alt: "Colour swatches and a sketchbook of painted shapes",
    title: "Creative Expression",
    lead: "Options:",
    body: "Art, music, writing, crafting | Expresses what words can’t. No talent needed. Therapeutic process, not product.",
    action: "Get Started",
    href: appUrl("/communities"),
  },
  {
    image: "wellness-sleep",
    alt: "A woman asleep in bed beside an alarm clock",
    title: "Sleep Hygiene",
    lead: "Apps:",
    body: "Sleep Cycle, Calm Sleep Stories, White Noise | Better sleep = better mood, immunity, resilience. Foundational for healing.",
    action: "Sleep Better",
    href: "https://www.sleepcycle.com",
  },
  {
    image: "wellness-nutrition",
    alt: "A bowl of salad, eggs and avocado on a wooden table",
    title: "Nutrition & Hydration",
    lead: "Tools:",
    body: "MyFitnessPal, Yazio, meal planning apps | Nutrition affects mood and energy. Small dietary changes = big impacts.",
    action: "Learn More",
    href: "https://www.myfitnesspal.com",
  },
] as const;

// ── Find help right now ─────────────────────────────────────────────────────

export const HELP_NOW = [
  {
    icon: "icon-call",
    title: "Call SAMHSA",
    body: "1-800-662-4357 — Free, 24/7, connects you to local services.",
    href: SAMHSA.href,
  },
  {
    icon: "icon-online",
    title: "Try Online Therapy",
    body: "BetterHelp, Talkspace — Match with therapist in 24 hours.",
    href: "#online-therapy",
  },
  {
    icon: "icon-group",
    title: "Join Support Group",
    body: "7 Cups, local groups — Start tonight. Free or low-cost.",
    href: SEVEN_CUPS,
  },
  {
    icon: "icon-community",
    title: "Visit Community Center",
    body: "Dial 211 — Finds local mental health services by zip code.",
    href: DIAL_211.href,
  },
] as const;

// ── Online therapy & digital support ────────────────────────────────────────

export const ONLINE_THERAPY = [
  {
    image: "online-betterhelp",
    alt: "A woman on a video session with a therapist at her desk",
    name: "BetterHelp",
    body: "Licensed therapists, chat/video/phone. Match with therapist in 24 hours. Messaging available daily.",
    price: "From $60–90/week",
    href: "https://www.betterhelp.com",
  },
  {
    image: "online-talkspace",
    alt: "A hand holding a phone showing a video call with an older man",
    name: "Talkspace",
    body: "Video therapy, messaging with therapist. Personalized care plans. Psychiatrist available for medication.",
    price: "From $68–122/week",
    href: "https://www.talkspace.com",
  },
  {
    image: "online-mdlive",
    alt: "A man gesturing during a video session on a laptop",
    name: "MDLive Therapy",
    body: "Licensed therapists, video sessions. Insurance-friendly. Same-day scheduling available.",
    price: "From $60–150/session",
    href: "https://www.mdlive.com",
  },
  {
    image: "online-ginger",
    alt: "A laptop showing an online therapy sign-up page",
    name: "Ginger",
    body: "Therapists, coaches, psychiatrists. Real-time chat option. Lifestyle guidance included.",
    price: "From $40/month",
    // Ginger merged into Headspace; its old domain redirects there.
    href: "https://www.headspace.com",
  },
  {
    image: "online-teladoc",
    alt: "A person on a video visit with a clinician on a laptop",
    name: "TelaDoc",
    body: "Virtual visits with psychiatrists and therapists. Works with many insurance plans. Prescription available.",
    price: "Varies by insurance",
    href: "https://www.teladochealth.com",
  },
  {
    image: "online-anima",
    alt: "A laptop showing an AI therapy chat",
    name: "Anima",
    body: "AI-supported therapy chat. Affordable, available 24/7. Supplement to professional care.",
    price: "From $5/month",
    // No confirmed official site; a search is safer than guessing a domain.
    href: "https://www.google.com/search?q=Anima+AI+therapy+app",
  },
] as const;
