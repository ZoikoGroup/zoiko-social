/**
 * Sample weekend events for the landing page.
 *
 * The landing site has no event feed or visitor location, so the region and
 * weekend are fixed to what the design shows. Every count on the page is
 * derived from this list, so nothing claims more events than it can show.
 */

const IMG = "/events-this-weekend/";

export const REGION = "Austin, TX";
export const WEEKEND_LABEL = "Sep 26–27";

export type Day = "sat" | "sun";

export const DAYS: readonly { id: Day; label: string; short: string; date: string }[] = [
  { id: "sat", label: "Saturday, September 26", short: "Sat, Sep 26", date: "2026-09-26" },
  { id: "sun", label: "Sunday, September 27", short: "Sun, Sep 27", date: "2026-09-27" },
];

export type Tag = { label: string; tone: "verified" | "neutral" | "warm" };

export type Category = "rescue" | "training" | "fundraiser" | "family" | "accessible";

export type WeekendEvent = {
  id: string;
  title: string;
  blurb: string;
  day: Day;
  time: string;
  /** "Free", a price, or "Donation". */
  price: string;
  format: "In person" | "Hybrid" | "Online";
  tags: readonly Tag[];
  categories: readonly Category[];
  image: string;
  imageAlt: string;
  /** Present only on the "Starting soon" picks. */
  featured?: {
    organizer: string;
    initials: string;
    /** 52px thumbnail for the hero's quick look. */
    thumb: string;
    badge?: string;
  };
};

const VERIFIED_ORG: Tag = { label: "Verified Organizer", tone: "verified" };
const VERIFIED: Tag = { label: "Verified", tone: "verified" };
const FUNDRAISER: Tag = { label: "Fundraiser", tone: "warm" };
const COMMUNITY: Tag = { label: "Community-hosted", tone: "neutral" };

export const EVENTS: readonly WeekendEvent[] = [
  {
    id: "trail-cleanup",
    title: "South Austin Trail Cleanup & Dog Meetup",
    blurb: "Clear trails alongside fellow dog owners, then let the pups mingle at the overlook.",
    day: "sat",
    time: "9:00 AM",
    price: "Free",
    format: "In person",
    tags: [VERIFIED_ORG, { label: "Free", tone: "neutral" }],
    categories: ["family"],
    image: `${IMG}trail-cleanup.webp`,
    imageAlt: "Volunteers gathered outdoors for a trail cleanup",
    featured: {
      organizer: "South Austin Trail Alliance",
      initials: "SA",
      thumb: `${IMG}thumb-trail-cleanup.webp`,
      badge: "Starts in 2 hours",
    },
  },
  {
    id: "adoption-fair",
    title: "Paws & Purpose Adoption Fair",
    blurb: "Meet dogs and cats from three partner shelters; donations support surgery costs.",
    day: "sat",
    time: "1:00 PM",
    price: "Donation",
    format: "In person",
    tags: [VERIFIED_ORG, FUNDRAISER],
    categories: ["rescue", "fundraiser", "family"],
    image: `${IMG}adoption-fair.webp`,
    imageAlt: "Dogs and cats at an adoption fair with volunteers",
    featured: {
      organizer: "Hill Country Humane",
      initials: "HH",
      thumb: `${IMG}thumb-adoption-fair.webp`,
    },
  },
  {
    id: "wildlife-rehab",
    title: "Wildlife Rescue: Intro to Rehab Volunteering",
    blurb: "Licensed rehabbers walk through intake basics before the fall admission season.",
    day: "sun",
    time: "10:30 AM",
    price: "Free",
    format: "Hybrid",
    tags: [
      { label: "Professional-led", tone: "neutral" },
      { label: "Hybrid", tone: "neutral" },
    ],
    categories: ["rescue", "training"],
    image: `${IMG}wildlife-rehab.webp`,
    imageAlt: "Wildlife rehabilitation volunteers handling equipment",
    featured: {
      organizer: "Central Texas Wildlife Center",
      initials: "CT",
      thumb: `${IMG}thumb-wildlife-rehab.webp`,
    },
  },
  {
    id: "foster-meet-greet",
    title: "Foster Family Meet & Greet",
    blurb: "Meet current foster families and ask about kitten season pairing.",
    day: "sat",
    time: "11:00 AM",
    price: "Free",
    format: "In person",
    tags: [VERIFIED],
    categories: ["rescue", "family"],
    image: `${IMG}foster-meet-greet.webp`,
    imageAlt: "A bowl of raspberries on a table",
  },
  {
    id: "leash-reactive-walk",
    title: "Leash-Reactive Dog Walk Group",
    blurb: "A quiet, structured walk for dogs still building confidence.",
    day: "sat",
    time: "3:30 PM",
    price: "Free",
    format: "In person",
    tags: [COMMUNITY],
    categories: ["training"],
    image: `${IMG}leash-reactive-walk.webp`,
    imageAlt: "Whitewashed hillside buildings and a windmill",
  },
  {
    id: "barn-cat-drive",
    title: "Barn Cat Program Supply Drive",
    blurb: "Drop off feed and bedding; tour the barn cat intake space.",
    day: "sat",
    time: "10:00 AM",
    price: "Donation",
    format: "In person",
    tags: [FUNDRAISER],
    categories: ["rescue", "fundraiser"],
    image: `${IMG}barn-cat-drive.webp`,
    imageAlt: "Star trails over a night sky",
  },
  {
    id: "basic-obedience",
    title: "Basic Obedience for Rescue Dogs",
    blurb: "A certified trainer covers recall and leash manners fundamentals.",
    day: "sat",
    time: "4:00 PM",
    price: "$15",
    format: "In person",
    tags: [VERIFIED, { label: "Accessible", tone: "neutral" }],
    categories: ["training", "accessible"],
    image: `${IMG}basic-obedience.webp`,
    imageAlt: "A person in a scarf looking out at the sea",
  },
  {
    id: "senior-dog-social",
    title: "Senior Dog Sunday Social",
    blurb: "A calm gathering for older dogs and the people who love them.",
    day: "sun",
    time: "9:00 AM",
    price: "Free",
    format: "In person",
    tags: [VERIFIED],
    categories: ["family"],
    image: `${IMG}senior-dog-social.webp`,
    imageAlt: "A tractor working a hay field",
  },
  {
    id: "bird-body-language",
    title: "Reading the Room: Bird Body Language",
    blurb: "An avian behaviorist explains stress and comfort signals.",
    day: "sun",
    time: "11:00 AM",
    price: "Free",
    format: "Online",
    tags: [{ label: "Online", tone: "neutral" }],
    categories: ["training"],
    image: `${IMG}bird-body-language.webp`,
    imageAlt: "A wooden pier stretching out to sea",
  },
  {
    id: "sanctuary-5k",
    title: "5K for the Sanctuary",
    blurb: "A flat, dog-friendly course benefiting the equine sanctuary.",
    day: "sun",
    time: "8:00 AM",
    price: "$20",
    format: "In person",
    tags: [FUNDRAISER],
    categories: ["fundraiser", "family"],
    image: `${IMG}sanctuary-5k.webp`,
    imageAlt: "The dashboard of a vintage car",
  },
  {
    id: "chicken-keepers",
    title: "Backyard Chicken Keepers Meetup",
    blurb: "Swap coop designs and predator-proofing tips over coffee.",
    day: "sun",
    time: "1:00 PM",
    price: "Free",
    format: "In person",
    tags: [COMMUNITY, { label: "Family-friendly", tone: "neutral" }],
    categories: ["family"],
    image: `${IMG}chicken-keepers.webp`,
    imageAlt: "A woman in warm sunlight",
  },
];
