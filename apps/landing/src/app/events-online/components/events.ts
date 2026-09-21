/**
 * Sample online events for the landing page.
 *
 * Times are written out as the design shows them rather than computed, since
 * the landing site has no event feed to read from. Array order is the order
 * the design lays the cards out in. `startsAt` exists only so choosing a sort
 * has something real to order by.
 */

const IMG = "/events-online/";

export type Trust =
  | "Verified Community"
  | "Verified Professional"
  | "Verified Organization";

export type Status =
  | "upcoming"
  | "starting-soon"
  | "live"
  | "full"
  | "canceled"
  | "rescheduled"
  | "replay";

export type Topic = "fundraiser" | "professional" | "community";

export type OnlineEvent = {
  id: string;
  title: string;
  organizer: string;
  trust: Trust;
  image: string;
  imageAlt: string;
  status: Status;
  /** Bold part of the time line. */
  when: string;
  /** Muted tail of the time line. */
  whenDetail: string;
  /** Struck-through original time, for rescheduled events. */
  previously?: string;
  access: readonly ("Captions" | "Transcript")[];
  /** "Free", a price, or "Donation-backed". */
  price: string;
  topic: Topic;
  today: boolean;
  thisWeek: boolean;
  /** Sort key; lower is sooner. Past events sort last. */
  startsAt: number;
};

export const EVENTS: readonly OnlineEvent[] = [
  {
    id: "backyard-habitat",
    title: "Backyard Wildlife Habitat Workshop",
    organizer: "Urban Habitat Builders",
    trust: "Verified Community",
    image: `${IMG}wildlife-habitat.webp`,
    imageAlt: "A guide leading a group of hikers along a wooded trail",
    status: "upcoming",
    when: "Sat, Jun 14 · 10:00 AM your time",
    whenDetail: "2:00 PM UTC",
    access: ["Captions"],
    price: "Free",
    topic: "community",
    today: false,
    thisWeek: true,
    startsAt: 4,
  },
  {
    id: "feline-body-language",
    title: "Understanding Feline Body Language",
    organizer: "Dr. Amara Okafor, DVM",
    trust: "Verified Professional",
    image: `${IMG}feline-body-language.webp`,
    imageAlt: "A border collie balancing on a training platform",
    status: "starting-soon",
    when: "Today · 7:00 PM your time",
    whenDetail: "11:00 PM UTC",
    access: ["Captions", "Transcript"],
    price: "$15",
    topic: "professional",
    today: true,
    thisWeek: true,
    startsAt: 2,
  },
  {
    id: "flood-response",
    title: "Emergency Shelter Fundraiser: Flood Response",
    organizer: "Coastal Animal Rescue Network",
    trust: "Verified Organization",
    image: `${IMG}flood-fundraiser.webp`,
    imageAlt: "Hands reaching toward rescued puppies behind a fence",
    status: "starting-soon",
    when: "Today · 6:15 PM your time",
    whenDetail: "10:15 PM UTC",
    access: ["Captions"],
    price: "Donation-backed",
    topic: "fundraiser",
    today: true,
    thisWeek: true,
    startsAt: 1,
  },
  {
    id: "foster-meetup",
    title: "Monthly Foster Parent Meetup",
    organizer: "Feline Foster Network",
    trust: "Verified Community",
    image: `${IMG}foster-meetup.webp`,
    imageAlt: "A couple smiling with their foster dog",
    status: "live",
    when: "Live now",
    whenDetail: "Started 12 min ago",
    access: ["Captions"],
    price: "Free",
    topic: "community",
    today: true,
    thisWeek: true,
    startsAt: 0,
  },
  {
    id: "reptile-husbandry",
    title: "Reptile Husbandry 101",
    organizer: "Exotic Animal Care Institute",
    trust: "Verified Professional",
    image: `${IMG}reptile-husbandry.webp`,
    imageAlt: "Two veterinary staff holding a small dog in a clinic",
    status: "full",
    when: "Sun, Jun 15 · 1:00 PM your time",
    whenDetail: "5:00 PM UTC",
    access: ["Captions"],
    price: "$10",
    topic: "professional",
    today: false,
    thisWeek: true,
    startsAt: 5,
  },
  {
    id: "wildlife-corridor",
    title: "Wildlife Corridor Policy Briefing",
    organizer: "Pacific Conservation Trust",
    trust: "Verified Organization",
    image: `${IMG}wildlife-corridor.webp`,
    imageAlt: "Deer crossing a railway line through a forest",
    status: "canceled",
    when: "Was: Mon, Jun 9 · 9:00 AM your time",
    whenDetail: "1:00 PM UTC",
    access: ["Captions"],
    price: "Free",
    topic: "community",
    today: false,
    thisWeek: false,
    startsAt: 99,
  },
  {
    id: "senior-dog",
    title: "Senior Dog Adoption Info Session",
    organizer: "Downtown Humane Society",
    trust: "Verified Organization",
    image: `${IMG}senior-dog.webp`,
    imageAlt: "Two people walking a group of dogs in a park",
    status: "rescheduled",
    when: "New: Thu, Jun 19 · 5:00 PM your time",
    whenDetail: "9:00 PM UTC",
    previously: "Previously: Tue, Jun 17 · 5:00 PM your time",
    access: ["Captions", "Transcript"],
    price: "Free",
    topic: "community",
    today: false,
    thisWeek: false,
    startsAt: 7,
  },
  {
    id: "tnr-training",
    title: "Trap-Neuter-Return Volunteer Training",
    organizer: "City Shelter Volunteers Network",
    trust: "Verified Community",
    image: `${IMG}tnr-training.webp`,
    imageAlt: "Volunteers crouching beside a dog standing on its hind legs",
    status: "replay",
    when: "Ended · Replay available",
    whenDetail: "Recorded Jun 2",
    access: ["Captions", "Transcript"],
    price: "Free",
    topic: "professional",
    today: false,
    thisWeek: false,
    startsAt: 98,
  },
  {
    id: "bird-rescue",
    title: "Bird Rescue First Response Basics",
    organizer: "Coastal Wildlife Shelter",
    trust: "Verified Professional",
    image: `${IMG}bird-rescue.webp`,
    imageAlt: "A rescued fledgling held in cupped hands",
    status: "upcoming",
    when: "Wed, Jun 18 · 11:00 AM your time",
    whenDetail: "3:00 PM UTC",
    access: ["Captions"],
    price: "Free",
    topic: "professional",
    today: false,
    thisWeek: true,
    startsAt: 6,
  },
  {
    id: "intake-health-checks",
    title: "Shelter Intake Health Checks",
    organizer: "Riverbend Veterinary Collective",
    trust: "Verified Professional",
    image: `${IMG}hero-featured.webp`,
    imageAlt: "Veterinary staff examining a dog outdoors",
    status: "upcoming",
    when: "Sat, Jun 21 · 12:00 PM your time",
    whenDetail: "4:00 PM UTC",
    access: ["Captions", "Transcript"],
    price: "Free",
    topic: "professional",
    today: false,
    thisWeek: false,
    startsAt: 8,
  },
];
