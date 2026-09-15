/** The badge in the top-left of a card, and the matching filter pill. */
export type Duration = "Short-term" | "Longer-term" | "Medical-capable";

/**
 * Where the need stands. Only `needed` is open to new offers — the comp greys
 * out the action on the other three.
 */
export type Status = "needed" | "review" | "arranged" | "paused";

export type CareLevel =
  | "Routine"
  | "Medication"
  | "Post-operative"
  | "Neonatal / maternity"
  | "Behavior support";

export type Experience =
  | "First-time foster welcome"
  | "Some foster experience"
  | "Experienced foster only";

export type HouseholdFit = "Good with children" | "Good with dogs" | "Good with cats";

export type FosterNeed = {
  id: string;
  name: string;
  /** Species · breed · age, as the comp sets it. */
  breed: string;
  area: string;
  duration: Duration;
  status: Status;
  /** The teal timing line under the location. */
  timing: string;
  /** The organization's own description of the placement. */
  note: string;
  /** What the organization has confirmed it covers. */
  support: string;
  /** Set when the support line is a confirmation rather than a caveat. */
  supportConfirmed: boolean;
  org: string;
  /** Whole days since listing — drives "Listed N days ago" and Recently Listed. */
  listedDaysAgo: number;
  /**
   * Care level and experience, both read off the listing's own description
   * rather than added to it — "Routine care only" is Routine, "Twice-daily
   * medication" after surgery is Medication and Post-operative, and so on.
   * The More filters drawer narrows on these.
   */
  careLevel: readonly CareLevel[];
  experience: Experience;
  /**
   * Household fit, for the drawer's last group. No listing in the comp states
   * whether an animal is good with children, dogs, or cats, so these are empty
   * until the organizations supply them.
   */
  householdFit: readonly HouseholdFit[];
  /** Whether the need falls in the visitor's set region, for the Near You pill. */
  nearYou: boolean;
  image: string;
  alt: string;
};

/** Badge copy for each status, keyed so the card and the filters agree. */
export const STATUS_LABEL: Record<Status, string> = {
  needed: "Foster needed",
  review: "Interest in review",
  arranged: "Placement arranged",
  paused: "Paused",
};

/** The eight foster needs in the comp. */
export const FOSTER_NEEDS: readonly FosterNeed[] = [
  {
    id: "oliver",
    name: "Oliver",
    breed: "Rabbit · Holland Lop · Adult",
    area: "Bristol area",
    duration: "Short-term",
    status: "needed",
    timing: "Needed from Oct 1 · Estimated 2–3 weeks",
    note: "Routine care only. Needs a quiet space while the shelter completes renovations.",
    support: "Food/supplies confirmed",
    supportConfirmed: true,
    org: "Second Chance Animal Shelter",
    listedDaysAgo: 5,
    careLevel: ["Routine"],
    experience: "First-time foster welcome",
    householdFit: [],
    nearYou: false,
    image: "/adopt-animals-needing-foster/oliver.webp",
    alt: "A brown rabbit sitting on grass.",
  },
  {
    id: "daisy",
    name: "Daisy",
    breed: "Guinea Pig · Abyssinian · Young",
    area: "London area",
    duration: "Short-term",
    status: "needed",
    timing: "Needed from Sep 20 · Estimated 2 weeks",
    note: "Must be fostered together with her cage-mate. Routine care only.",
    support: "Food/supplies confirmed",
    supportConfirmed: true,
    org: "Second Chance Animal Shelter",
    listedDaysAgo: 2,
    careLevel: ["Routine"],
    experience: "First-time foster welcome",
    householdFit: [],
    nearYou: false,
    image: "/adopt-animals-needing-foster/daisy.webp",
    alt: "A black guinea pig in long grass.",
  },
  {
    id: "shadow",
    name: "Shadow",
    breed: "Horse · Quarter Horse · Adult",
    area: "Yorkshire, UK area",
    duration: "Longer-term",
    status: "needed",
    timing: "Needed from Oct 10 · Open-ended, estimated 3+ months",
    note: "Groundwork rehabilitation in progress. Experienced handler preferred.",
    support: "Veterinary care confirmed",
    supportConfirmed: true,
    org: "Meadowbrook Sanctuary",
    listedDaysAgo: 8,
    careLevel: ["Behavior support"],
    experience: "Experienced foster only",
    householdFit: [],
    nearYou: false,
    image: "/adopt-animals-needing-foster/shadow.webp",
    alt: "A chestnut horse walking through a sunlit field.",
  },
  {
    id: "biscuit",
    name: "Biscuit",
    breed: "Cat · Domestic Shorthair · Senior",
    area: "Sacramento, CA area",
    duration: "Medical-capable",
    status: "needed",
    timing: "Needed from Sep 25 · Estimated 4–6 weeks recovery",
    note: "Recovering from surgery. Twice-daily medication and a quiet space required.",
    support: "Veterinary care, Expense reimbursement confirmed",
    supportConfirmed: true,
    org: "Sacramento Animal Rescue",
    listedDaysAgo: 1,
    careLevel: ["Medication", "Post-operative"],
    experience: "Some foster experience",
    householdFit: [],
    nearYou: true,
    image: "/adopt-animals-needing-foster/biscuit.webp",
    alt: "A white and tabby cat with blue eyes resting indoors.",
  },
  {
    id: "nugget",
    name: "Nugget",
    breed: "Bird · Cockatiel · Young",
    area: "London area",
    duration: "Short-term",
    status: "review",
    timing: "Needed from Oct 5 · Estimated 3 weeks",
    note: "Routine care. Some interest already received — currently in review.",
    support: "Support: confirm with rescue",
    supportConfirmed: false,
    org: "Second Chance Animal Shelter",
    listedDaysAgo: 4,
    careLevel: ["Routine"],
    experience: "First-time foster welcome",
    householdFit: [],
    nearYou: false,
    image: "/adopt-animals-needing-foster/nugget.webp",
    alt: "A kingfisher perched on a branch.",
  },
  {
    id: "willows-litter",
    name: "Willow's Litter",
    breed: "Dogs · Mixed breed puppies · Baby",
    area: "Manchester area",
    duration: "Medical-capable",
    status: "needed",
    timing: "Needed from Sep 22 · Estimated 6–8 weeks",
    note: "A litter of four requiring bottle-feeding and round-the-clock neonatal care.",
    support: "Food/supplies, Veterinary care confirmed",
    supportConfirmed: true,
    org: "Golden State Rescue Alliance",
    listedDaysAgo: 5,
    careLevel: ["Neonatal / maternity"],
    experience: "Experienced foster only",
    householdFit: [],
    nearYou: false,
    image: "/adopt-animals-needing-foster/willows-litter.webp",
    alt: "A chocolate labrador licking its nose.",
  },
  {
    id: "clover",
    name: "Clover",
    breed: "Rabbit · Mixed breed · Adult",
    area: "Bristol area",
    duration: "Short-term",
    status: "arranged",
    timing: "Placement arranged",
    note: "A foster has already been arranged for Clover.",
    support: "Food/supplies confirmed",
    supportConfirmed: true,
    org: "Second Chance Animal Shelter",
    listedDaysAgo: 12,
    careLevel: ["Routine"],
    experience: "First-time foster welcome",
    householdFit: [],
    nearYou: false,
    image: "/adopt-animals-needing-foster/clover.webp",
    alt: "A brown and white rabbit on a painted green surface.",
  },
  {
    id: "rusty",
    name: "Rusty",
    breed: "Dog · Senior Mixed Breed · Senior",
    area: "Sacramento, CA area",
    duration: "Longer-term",
    status: "paused",
    timing: "Currently paused",
    note: "This foster need is temporarily paused while the organization reassesses care requirements.",
    support: "Veterinary care confirmed",
    supportConfirmed: true,
    org: "Sacramento Animal Rescue",
    listedDaysAgo: 20,
    careLevel: ["Routine"],
    experience: "Some foster experience",
    householdFit: [],
    nearYou: true,
    image: "/adopt-animals-needing-foster/rusty.webp",
    alt: "A senior dog standing in a field at sunrise.",
  },
];

/** The three images in the hero collage, with their own badges. */
export const HERO_COLLAGE = [
  {
    badge: "Short-term",
    caption: "Oliver · Rabbit",
    image: "/adopt-animals-needing-foster/hero-oliver.webp",
    alt: "A volunteer holding a lop-eared rabbit.",
  },
  {
    badge: "Longer-term",
    caption: "Shadow · Horse",
    image: "/adopt-animals-needing-foster/hero-shadow.webp",
    alt: "Two horses standing head to head.",
  },
  {
    badge: "Medical-capable",
    caption: "Biscuit · Cat",
    image: "/adopt-animals-needing-foster/hero-biscuit.webp",
    alt: "A volunteer holding two young kittens.",
  },
] as const;

/** The three assurances under "The rescue or shelter stays in charge". */
export const ASSURANCES = [
  {
    title: "Verified source, always",
    body: "Every public foster need is listed by a verified-source organization. Verification is a trust signal, not a guarantee.",
  },
  {
    title: "Support fields, confirmed by source",
    body: "Food/supplies, veterinary care, transport, and reimbursement are only shown when the organization has confirmed them.",
  },
  {
    title: "Structured, not unqualified messages",
    body: "Offering to foster submits structured, comparable information to the organization — not a cold direct message.",
  },
] as const;

/** The four cards inside the Foster safety panel. */
export const FOSTER_SAFETY = [
  {
    title: "Handoff",
    body: "Handoff location and process are coordinated by the organization — never a private home address shared publicly.",
  },
  {
    title: "Privacy",
    body: "Your household details are shared with the organization only as needed for the foster process, never published publicly.",
  },
  {
    title: "Expenses",
    body: "Confirm what's covered before you commit. We only show reimbursement terms the organization has actually confirmed.",
  },
  {
    title: "Medical",
    body: "Medical or care instructions come from the organization — platform content is never a substitute for veterinary guidance.",
  },
] as const;

/** The More filters drawer. Each group is a set of checkboxes in the comp. */
export const FILTER_GROUPS = [
  {
    label: "Foster duration",
    options: ["Short-term", "Medium-term", "Longer-term", "Open-ended"],
  },
  {
    label: "Care level",
    options: ["Routine", "Medication", "Post-operative", "Neonatal / maternity", "Behavior support"],
  },
  {
    label: "Household fit",
    options: ["Good with children", "Good with dogs", "Good with cats"],
  },
] as const;

/** The Experience needed select, which is a single choice rather than checkboxes. */
export const EXPERIENCE_LEVELS = [
  "Any experience level",
  "First-time foster welcome",
  "Some foster experience",
  "Experienced foster only",
] as const;

/**
 * The ten questions that close the page. The comp shows every row collapsed,
 * so the answers are written here to match the guidance elsewhere on the page
 * — worth a review from whoever owns the foster policy copy.
 */
export const FAQS = [
  {
    q: "What does it mean to foster an animal?",
    a: "Fostering means giving an animal temporary care in your home while the rescue or shelter continues to look after its placement. The organization remains responsible for the animal; you provide day-to-day care for an agreed period.",
  },
  {
    q: "How long does fostering last?",
    a: "It depends entirely on the need. Some are a couple of weeks while a shelter completes work on its building; others are open-ended. Every listing states the expected timing, and the organization confirms it with you before a placement begins.",
  },
  {
    q: "Can I foster for only a few days or weeks?",
    a: "Yes. Short-term needs are listed separately and are often only two to three weeks. Use the Short-term filter to see just those.",
  },
  {
    q: "Who pays for food and veterinary care?",
    a: "That varies by organization and is set out on each listing. Food/supplies, veterinary care, and expense reimbursement are only shown as confirmed when the organization has confirmed them — confirm the details directly before you commit.",
  },
  {
    q: "Do I need experience?",
    a: "Not for most routine placements. Some needs — neonatal litters, post-operative recovery, or behavior rehabilitation — ask for specific experience, and those listings say so. You can filter by experience level under More filters.",
  },
  {
    q: "Can I foster if I have children or pets?",
    a: "Often, yes. Household fit is part of each listing, and you can filter for animals noted as good with children, dogs, or cats. The organization makes the final call based on the individual animal.",
  },
  {
    q: "Are foster animals listed by verified rescues and shelters?",
    a: "Yes. Only verified-source organizations can list public foster needs on Zoiko Social. Verification is a trust signal about the organization; it is not a guarantee about an individual animal or placement.",
  },
  {
    q: "Will my address be public?",
    a: "No. Your household details go to the organization only as needed for the foster process, and handoff is coordinated through them. A private home address is never shared publicly on the platform.",
  },
  {
    q: "How do I offer to foster?",
    a: "Open a foster need and submit a structured offer. It sends the organization comparable information about your availability and household rather than an unqualified direct message, so they can assess offers fairly.",
  },
  {
    q: "What if a foster need is no longer available?",
    a: "Listings show their current state — interest in review, placement arranged, or paused — so you can see at a glance. Those stay visible for context but no longer accept new offers.",
  },
] as const;
