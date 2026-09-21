/**
 * Sample upcoming events for the landing page.
 *
 * The landing site has no event feed or visitor location, so the region and
 * the 30-day window are fixed to what the design shows. Every count and group
 * on the page is derived from this list, so nothing claims more events than
 * it can show.
 */

const IMG = "/events-upcoming/";

export const REGION = "Austin, TX";
/** First day of the window; date filters count from here. */
export const WINDOW_START = "2026-09-21";
/** Last day of "This week". */
export const WEEK_END = "2026-09-27";
/** Last day of the 30-day window. */
export const WINDOW_END = "2026-10-21";
export const WINDOW_END_LABEL = "October 21";

export type Tag = { label: string; tone: "verified" | "neutral" | "warm" };

export type Category = "rescue" | "training" | "fundraiser" | "family" | "accessible";

export type UpcomingEvent = {
  id: string;
  title: string;
  blurb: string;
  /** ISO date, used for ordering, grouping and the date filters. */
  date: string;
  dateLabel: string;
  time: string;
  /** "Free" or a price. */
  price: string;
  format: "In person" | "Hybrid" | "Online";
  tags: readonly Tag[];
  categories: readonly Category[];
  /** 150×190 photo for the list card. */
  image: string;
  imageAlt: string;
  /** 44px thumbnail; present on the events in the hero strip. */
  thumb?: string;
  /** Short two-line title for the hero strip. */
  stripTitle?: string;
  /** Present on the "Recommended for you" picks. */
  rec?: {
    /** Position in "Recommended for you"; the design does not list them by date. */
    rank: number;
    reason: string;
    tags: readonly Tag[];
    blurb: string;
    organizer: string;
    initials: string;
    image: string;
    imageAlt: string;
  };
};

const VERIFIED: Tag = { label: "Verified", tone: "verified" };
const VERIFIED_ORG: Tag = { label: "Verified Organizer", tone: "verified" };
const neutral = (label: string): Tag => ({ label, tone: "neutral" });

/** In date order. */
export const EVENTS: readonly UpcomingEvent[] = [
  {
    id: "trail-cleanup",
    title: "South Austin Trail Cleanup & Dog Meetup",
    blurb: "Clear trails, then let the dogs mingle at the overlook.",
    date: "2026-09-26",
    dateLabel: "Sat, Sep 26",
    time: "9:00 AM",
    price: "Free",
    format: "In person",
    tags: [VERIFIED],
    categories: ["family"],
    image: `${IMG}trail-cleanup.webp`,
    imageAlt: "Chalk cliffs above a misty beach",
    thumb: `${IMG}thumb-trail-cleanup.webp`,
    stripTitle: "South Austin Trail Cleanup",
  },
  {
    id: "leash-reactive-walk",
    title: "Leash-Reactive Dog Walk Group",
    blurb: "A quiet, structured walk for dogs still building confidence.",
    date: "2026-09-26",
    dateLabel: "Sat, Sep 26",
    time: "3:30 PM",
    price: "Free",
    format: "In person",
    tags: [neutral("Community-hosted")],
    categories: ["training"],
    image: `${IMG}leash-reactive-walk.webp`,
    imageAlt: "A steaming cup of tea beside pink flowers",
  },
  {
    id: "foster-intro",
    title: "Intro to Foster Care: What to Expect",
    blurb: "Intake, supplies and support, explained by a coordinator.",
    date: "2026-10-01",
    dateLabel: "Thu, Oct 1",
    time: "6:30 PM",
    price: "Free",
    format: "Online",
    tags: [neutral("Online")],
    categories: ["rescue", "training"],
    image: `${IMG}foster-intro-card.webp`,
    imageAlt: "A Ferris wheel against a blue sky",
    thumb: `${IMG}thumb-foster-intro.webp`,
    stripTitle: "Intro to Foster Care Online",
    rec: {
      rank: 2,
      reason: "Because you saved “Foster Care” topic",
      tags: [neutral("Online"), neutral("Professional-led")],
      blurb: "A foster coordinator walks through intake, supplies and support.",
      organizer: "Austin Cares Network",
      initials: "AC",
      image: `${IMG}foster-intro.webp`,
      imageAlt: "A waterfall falling onto mossy rocks",
    },
  },
  {
    id: "supply-drive",
    title: "Fall Supply Drive & Barn Tour",
    blurb: "Drop off feed and bedding, then walk the barn cat intake space.",
    date: "2026-10-03",
    dateLabel: "Sat, Oct 3",
    time: "10:00 AM",
    price: "Free",
    format: "In person",
    tags: [VERIFIED],
    categories: ["rescue"],
    image: `${IMG}supply-drive.webp`,
    imageAlt: "Forested hills under low mist",
    rec: {
      rank: 1,
      reason: "Because you follow Hill Country Humane",
      tags: [VERIFIED_ORG, neutral("Free")],
      blurb: "Drop off feed and bedding, then walk the barn cat intake space.",
      organizer: "Hill Country Humane",
      initials: "HH",
      image: `${IMG}supply-drive.webp`,
      imageAlt: "Forested hills under low mist",
    },
  },
  {
    id: "sanctuary-5k",
    title: "5K for the Sanctuary",
    blurb: "A flat, dog-friendly course benefiting the equine sanctuary.",
    date: "2026-10-04",
    dateLabel: "Sun, Oct 4",
    time: "8:00 AM",
    price: "$20",
    format: "In person",
    tags: [{ label: "Fundraiser", tone: "warm" }],
    categories: ["fundraiser", "family"],
    image: `${IMG}sanctuary-5k.webp`,
    imageAlt: "Succulents growing in a glass terrarium",
  },
  {
    id: "adoption-weekend",
    title: "Fall Adoption Weekend",
    blurb: "Three shelters, one lot, dozens of animals ready to meet you.",
    date: "2026-10-10",
    dateLabel: "Sat, Oct 10",
    time: "11:00 AM",
    price: "Free",
    format: "In person",
    tags: [VERIFIED, neutral("Family-friendly")],
    categories: ["rescue", "family"],
    image: `${IMG}adoption-weekend-card.webp`,
    imageAlt: "Snow-covered mountain ridges",
    thumb: `${IMG}thumb-adoption-weekend.webp`,
    stripTitle: "Fall Adoption Weekend",
    rec: {
      rank: 3,
      reason: `Matches your region: ${REGION}`,
      tags: [VERIFIED_ORG, neutral("Family-friendly")],
      blurb: "Three shelters, one lot — dogs, cats and small animals ready for adoption.",
      organizer: "Paws & Purpose Coalition",
      initials: "PP",
      image: `${IMG}adoption-weekend.webp`,
      imageAlt: "Hands holding a bunch of dark grapes",
    },
  },
  {
    id: "sanctuary-open-day",
    title: "Wildlife Sanctuary Open Day",
    blurb: "Step-free trails; licensed rehabbers on site for Q&A.",
    date: "2026-10-18",
    dateLabel: "Sun, Oct 18",
    time: "10:00 AM",
    price: "$10",
    format: "In person",
    tags: [neutral("Professional-led"), neutral("Accessible")],
    categories: ["rescue", "accessible"],
    image: `${IMG}sanctuary-open-day.webp`,
    imageAlt: "A calm sea at dusk",
    thumb: `${IMG}thumb-sanctuary-open-day.webp`,
    stripTitle: "Wildlife Sanctuary Open Day",
  },
];

/** "This week" for the first seven days, then the month name. */
export function groupOf(e: UpcomingEvent): string {
  if (e.date <= WEEK_END) return "This week";
  return new Date(`${e.date}T12:00:00`).toLocaleString("en-US", { month: "long" });
}
