/**
 * Sample local events for the landing page.
 *
 * The landing site has no event feed or visitor location, so the region is
 * fixed to what the design shows. Every count on the page — the hero stats,
 * group totals and map clusters — is derived from this list, so nothing
 * claims more events than it can show.
 */

const IMG = "/events-near-you/";

export const REGION = "Austin, TX";
/** Last day of "Today & this week". */
export const WEEK_END = "2026-09-27";
/** Saturday and Sunday of the coming weekend. */
export const WEEKEND = ["2026-09-26", "2026-09-27"] as const;
/** Last day of the 30-day window. */
export const WINDOW_END = "2026-10-22";

/**
 * Broad areas, never venues. `x`/`y` place the pin on the map artwork as a
 * percentage of its width and height.
 */
export const AREAS = {
  "East Austin": { x: 25.1, y: 29.7 },
  "North Loop": { x: 71.0, y: 23.7 },
  Central: { x: 54.2, y: 48.1 },
  "South Austin": { x: 41.4, y: 63.6 },
  "Manor Rd corridor": { x: 74.4, y: 71.5 },
} as const;

export type Area = keyof typeof AREAS;

export type Tag = { label: string; tone: "verified" | "neutral" | "warm" };

export type Category = "rescue" | "training" | "fundraiser" | "family" | "accessible";

export type LocalEvent = {
  id: string;
  title: string;
  blurb: string;
  /** ISO date, used for ordering, grouping and the date filters. */
  date: string;
  /** Short label for the list card: a weekday this week, a date after. */
  when: string;
  price: string;
  format: "In person" | "Hybrid" | "Online";
  area: Area;
  tags: readonly Tag[];
  categories: readonly Category[];
  organizer: string;
  /** Organizer has passed verification. */
  verified: boolean;
  /** Hosted by a community rather than an organization. */
  community: boolean;
  image: string;
  imageAlt: string;
  /** Present on the "Recommended" picks, which get a full card instead of a list row. */
  rec?: {
    /** Position in "Recommended"; the design does not order them by time. */
    rank: number;
    reason: string;
    /** Which icon explains the reason. */
    because: "region" | "community";
    dateLabel: string;
    time: string;
    initials: string;
  };
};

const VERIFIED: Tag = { label: "Verified", tone: "verified" };
const FUNDRAISER: Tag = { label: "Fundraiser", tone: "warm" };
const neutral = (label: string): Tag => ({ label, tone: "neutral" });

/** In date order. */
export const EVENTS: readonly LocalEvent[] = [
  {
    id: "foster-meet-greet",
    title: "Foster Family Meet & Greet",
    blurb: "Meet current foster families near North Loop.",
    date: "2026-09-23",
    when: "Wed",
    price: "Free",
    format: "In person",
    area: "North Loop",
    tags: [VERIFIED],
    categories: ["rescue", "family"],
    organizer: "Feline Foster Network",
    verified: true,
    community: true,
    image: `${IMG}foster-meet-greet.webp`,
    imageAlt: "A person holding a black puppy",
  },
  {
    id: "leash-reactive-walk",
    title: "Leash-Reactive Dog Walk Group",
    blurb: "A quiet, structured walk near Lady Bird Lake.",
    date: "2026-09-24",
    when: "Thu",
    price: "Free",
    format: "In person",
    area: "Central",
    tags: [neutral("Community-hosted")],
    categories: ["training"],
    organizer: "Lady Bird Lake Walkers",
    verified: false,
    community: true,
    image: `${IMG}leash-reactive-walk.webp`,
    imageAlt: "A woman walking two dogs past a glass building",
  },
  {
    id: "kids-storytime",
    title: "Kids & Critters Storytime",
    blurb: "Animal-themed stories with a licensed handler present.",
    date: "2026-09-25",
    when: "Fri",
    price: "Free",
    format: "In person",
    area: "Central",
    tags: [neutral("Guardian required")],
    categories: ["family"],
    organizer: "Central Library Friends",
    verified: false,
    community: false,
    image: `${IMG}kids-storytime.webp`,
    imageAlt: "A person standing by a lake beside a parked bicycle",
  },
  {
    id: "barn-cat-drive",
    title: "Barn Cat Program Supply Drive",
    blurb: "Drop off feed and bedding; tour the barn cat intake space.",
    date: "2026-09-26",
    when: "Sat",
    price: "Donation",
    format: "In person",
    area: "Manor Rd corridor",
    tags: [FUNDRAISER],
    categories: ["rescue", "fundraiser"],
    organizer: "Barn Cat Coalition",
    verified: true,
    community: false,
    image: `${IMG}barn-cat-drive.webp`,
    imageAlt: "Two kittens resting in straw",
    rec: { rank: 3, reason: "In your region", because: "region", dateLabel: "Sat, Sep 26", time: "10:00 AM", initials: "BC" },
  },
  {
    id: "adoption-fair",
    title: "Paws & Purpose Adoption Fair",
    blurb: "Meet dogs and cats from three partner shelters this Saturday.",
    date: "2026-09-26",
    when: "Sat",
    price: "Free",
    format: "In person",
    area: "East Austin",
    tags: [{ label: "Verified Organizer", tone: "verified" }, neutral("Free")],
    categories: ["rescue", "family"],
    organizer: "Hill Country Humane",
    verified: true,
    community: false,
    image: `${IMG}adoption-fair.webp`,
    imageAlt: "Husky puppies snuggled together",
    rec: { rank: 1, reason: "In your region", because: "region", dateLabel: "Sat, Sep 26", time: "1:00 PM", initials: "HH" },
  },
  {
    id: "basic-obedience",
    title: "Basic Obedience for Rescue Dogs",
    blurb: "A certified trainer covers recall and leash manners fundamentals.",
    date: "2026-09-26",
    when: "Sat",
    price: "Free",
    format: "In person",
    area: "South Austin",
    tags: [VERIFIED, neutral("Accessible")],
    categories: ["training", "accessible"],
    organizer: "South Austin Trail Alliance",
    verified: true,
    community: true,
    image: `${IMG}basic-obedience.webp`,
    imageAlt: "A whippet in a harness at a training class",
    rec: { rank: 2, reason: "From a community you follow", because: "community", dateLabel: "Sat, Sep 26", time: "4:00 PM", initials: "SA" },
  },
  {
    id: "wildlife-rehab",
    title: "Wildlife Rescue: Intro to Rehab Volunteering",
    blurb: "Licensed rehabbers cover intake basics.",
    date: "2026-09-27",
    when: "Sun",
    price: "Free",
    format: "Hybrid",
    area: "Central",
    tags: [VERIFIED, neutral("Hybrid")],
    categories: ["rescue", "training"],
    organizer: "Central Texas Wildlife Center",
    verified: true,
    community: false,
    image: `${IMG}wildlife-rehab.webp`,
    imageAlt: "A woman feeding a wallaby",
  },
  {
    id: "sanctuary-5k",
    title: "5K for the Sanctuary",
    blurb: "A flat, dog-friendly course benefiting the equine sanctuary.",
    date: "2026-10-04",
    when: "Oct 4",
    price: "$20",
    format: "In person",
    area: "South Austin",
    tags: [FUNDRAISER],
    categories: ["fundraiser", "family"],
    organizer: "Equine Haven Sanctuary",
    verified: false,
    community: false,
    image: `${IMG}sanctuary-5k.webp`,
    imageAlt: "A man tending donkeys in a farmyard",
  },
  {
    id: "adoption-weekend",
    title: "Fall Adoption Weekend",
    blurb: "Three shelters, one lot, dozens of animals ready to meet you.",
    date: "2026-10-10",
    when: "Oct 10",
    price: "Free",
    format: "In person",
    area: "Central",
    tags: [VERIFIED, neutral("Family-friendly")],
    categories: ["rescue", "family"],
    organizer: "Paws & Purpose Coalition",
    verified: true,
    community: false,
    image: `${IMG}adoption-weekend.webp`,
    imageAlt: "A woman hugging a dog in a shelter kennel",
  },
];

/** Hero stats, all counted from EVENTS. */
export const STATS = {
  events: EVENTS.length,
  verifiedOrganizers: new Set(EVENTS.filter((e) => e.verified).map((e) => e.organizer)).size,
  communities: new Set(EVENTS.filter((e) => e.community).map((e) => e.organizer)).size,
};
