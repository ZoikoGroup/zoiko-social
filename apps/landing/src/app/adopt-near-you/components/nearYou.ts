/** The region the page is currently showing listings around. */
export const REGION = "Sacramento, CA area";

/** Adoption listings and foster needs are the two kinds the tabs split on. */
export type Kind = "Adoption" | "Foster";

/**
 * Where the listing stands. Only `available` and `needed` take new interest —
 * the comp greys the action out on the other two.
 */
export type Status = "available" | "needed" | "pending" | "paused";

export const STATUS_LABEL: Record<Status, string> = {
  available: "Available",
  needed: "Foster needed",
  pending: "Application Pending",
  paused: "Paused",
};

export type NearbyListing = {
  id: string;
  name: string;
  /** Species · breed · age, as the comp sets it. */
  breed: string;
  kind: Kind;
  status: Status;
  /** The location line: either in the region, or an approximate distance. */
  where: string;
  /** Miles from the region centre, for the nearest-first sort. */
  miles: number;
  /** Attribute chips. Only some listings carry one in the comp. */
  attributes: readonly string[];
  org: string;
  listedDaysAgo: number;
  image: string;
  alt: string;
};

/** The eight listings in the comp. */
export const LISTINGS: readonly NearbyListing[] = [
  {
    id: "willow",
    name: "Willow",
    breed: "Dog · Labrador Mix · Adult",
    kind: "Adoption",
    status: "available",
    where: "In Sacramento, CA area",
    miles: 0,
    attributes: ["Good with kids"],
    org: "Sacramento Animal Rescue",
    listedDaysAgo: 3,
    image: "/adopt-near-you/willow.webp",
    alt: "A white labrador looking up at the camera.",
  },
  {
    id: "pepper",
    name: "Pepper",
    breed: "Cat · Domestic Shorthair · Senior",
    kind: "Adoption",
    status: "available",
    where: "In Sacramento, CA area",
    miles: 0,
    attributes: [],
    org: "Sacramento Animal Rescue",
    listedDaysAgo: 6,
    image: "/adopt-near-you/pepper.webp",
    alt: "A volunteer holding a cat outdoors.",
  },
  {
    id: "rusty",
    name: "Rusty",
    breed: "Dog · Senior Mixed Breed · Senior",
    kind: "Foster",
    status: "paused",
    where: "In Sacramento, CA area",
    miles: 0,
    attributes: [],
    org: "Sacramento Animal Rescue",
    listedDaysAgo: 15,
    image: "/adopt-near-you/rusty.webp",
    alt: "A brown dog with its tongue out.",
  },
  {
    id: "milo",
    name: "Milo",
    breed: "Cat · Domestic Shorthair · Young Adult",
    kind: "Adoption",
    status: "available",
    where: "About 1 mi from Sacramento, CA area",
    miles: 1,
    attributes: ["Good with dogs"],
    org: "Sacramento Animal Rescue",
    listedDaysAgo: 2,
    image: "/adopt-near-you/milo.webp",
    alt: "Three cats resting together.",
  },
  {
    id: "biscuit",
    name: "Biscuit",
    breed: "Cat · Domestic Shorthair · Senior",
    kind: "Foster",
    status: "needed",
    where: "About 2 mi from Sacramento, CA area",
    miles: 2,
    attributes: [],
    org: "Sacramento Animal Rescue",
    listedDaysAgo: 1,
    image: "/adopt-near-you/biscuit.webp",
    alt: "A cat wearing a yellow bandana.",
  },
  {
    id: "max",
    name: "Max",
    breed: "Dog · Golden Retriever · Senior",
    kind: "Adoption",
    status: "pending",
    where: "About 12 mi from Sacramento, CA area",
    miles: 12,
    attributes: [],
    org: "Golden State Rescue Alliance",
    listedDaysAgo: 9,
    image: "/adopt-near-you/max.webp",
    alt: "A girl hugging a dog beside a fence.",
  },
  {
    id: "ginger",
    name: "Ginger",
    breed: "Rabbit · Mixed breed · Adult",
    kind: "Foster",
    status: "needed",
    where: "About 16 mi from Sacramento, CA area",
    miles: 16,
    attributes: [],
    org: "Golden State Rescue Alliance",
    listedDaysAgo: 5,
    image: "/adopt-near-you/ginger.webp",
    alt: "A white rabbit sitting on grass.",
  },
  {
    id: "coco",
    name: "Coco",
    breed: "Dog · Beagle Mix · Adult",
    kind: "Adoption",
    status: "available",
    where: "About 18 mi from Sacramento, CA area",
    miles: 18,
    attributes: ["Good with kids", "Good with dogs"],
    org: "Golden State Rescue Alliance",
    listedDaysAgo: 4,
    image: "/adopt-near-you/coco.webp",
    alt: "A brown dog with its tongue out.",
  },
];

/** The three photos in the hero collage, each with its distance badge. */
export const HERO_COLLAGE = [
  {
    badge: "In Sacramento, CA area",
    image: "/adopt-near-you/hero-in-sacramento.webp",
    alt: "A volunteer holding a small black and tan puppy.",
  },
  {
    badge: "About 2 mi away",
    image: "/adopt-near-you/hero-2-mi-away.webp",
    alt: "A calico cat sitting in a shelter enclosure.",
  },
  {
    badge: "About 18 mi away",
    image: "/adopt-near-you/hero-18-mi-away.webp",
    alt: "A brown dog with its tongue out.",
  },
] as const;

/** The two verified organizations shown under the results. */
export const ORGANIZATIONS = [
  {
    name: "Sacramento Animal Rescue",
    serviceArea: "Sacramento, CA area",
    species: "Dogs, Cats",
    activeListings: "4 on Zoiko Social",
    logo: "/adopt-near-you/org-sacramento-animal-rescue.webp",
  },
  {
    name: "Golden State Rescue Alliance",
    serviceArea: "Northern California",
    species: "Dogs, Rabbits",
    activeListings: "2 on Zoiko Social",
    logo: "/adopt-near-you/org-golden-state-rescue-alliance.webp",
  },
] as const;

/** The four cards inside the Privacy & safety panel. */
export const PRIVACY_SAFETY = [
  {
    title: "Never a precise address",
    body: "Public discovery shows broad locality or service area, never an exact private foster or home address.",
  },
  {
    title: "Distance is approximate",
    body: '"About X mi" is a discovery aid, not a guarantee of availability, fit, or travel time.',
  },
  {
    title: "Proximity never overrides safety",
    body: "Distance never outranks listing status, source verification, or a Trust & Safety suppression.",
  },
  {
    title: "Report a concern",
    body: "Every listing near you can be reported, whether it's close by or further away.",
  },
] as const;

/** The More filters drawer. Each group is a set of checkboxes in the comp. */
export const FILTER_GROUPS = [
  {
    label: "Age / life stage",
    options: ["Baby", "Young", "Adult", "Senior"],
  },
  {
    label: "Household fit",
    options: ["Good with children", "Good with dogs", "Good with cats"],
  },
] as const;

/** The drawer's three single-choice selects. */
export const SIZE_OPTIONS = ["Any size", "Small", "Medium", "Large"] as const;
export const DISTANCE_OPTIONS = [
  "Any distance in region",
  "Within 5 mi",
  "Within 10 mi",
  "Within 25 mi",
] as const;
export const SOURCE_OPTIONS = [
  "Any verified organization",
  "Sacramento Animal Rescue",
  "Golden State Rescue Alliance",
] as const;

/**
 * The nine questions that close the page. The comp shows every row collapsed,
 * so the answers are written here to match the guidance elsewhere on the page
 * — worth a review from whoever owns the discovery policy copy.
 */
export const FAQS = [
  {
    q: "How does Near You work?",
    a: "You set a region — a city, area, or postal code — and Zoiko Social shows eligible adoption listings and foster needs published by verified organizations serving that area. You can change your region at any time.",
  },
  {
    q: "Do I have to share my device location?",
    a: "No. You can search by region without sharing precise device location. Setting a region manually gives you the same results.",
  },
  {
    q: "Can other users see my exact location?",
    a: "No. Your region is used to filter what you see; it is not published on your profile or shown to organizations browsing the platform.",
  },
  {
    q: "How accurate is the distance shown?",
    a: 'Distance is approximate. "About X mi" is measured between broad localities, not exact addresses, and is a discovery aid rather than a guarantee of travel time.',
  },
  {
    q: "Does Near You include adoption and foster listings?",
    a: "Yes. Both appear together by default, and the All / Adoption / Foster tabs let you narrow to one kind.",
  },
  {
    q: "Why are some nearby animals not shown?",
    a: "A listing may be outside the eligible region, unpublished by its organization, or withheld pending a Trust & Safety review. Proximity never overrides those checks.",
  },
  {
    q: "Can I search another city?",
    a: "Yes. Use Set / Change Region to look at any area you like — you do not need to live there to browse it.",
  },
  {
    q: "Can I get alerts for new nearby listings?",
    a: "Yes. Save this local search and turn on alerts, and you will hear when matching listings are published in your region.",
  },
  {
    q: "Are paid rescues shown first?",
    a: "No. Placement in Near You cannot be bought. Results are ordered by your chosen sort, and verification is independent of advertising, sponsorship, or Premium.",
  },
] as const;
