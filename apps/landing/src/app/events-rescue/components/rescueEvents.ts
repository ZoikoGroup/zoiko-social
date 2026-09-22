/**
 * Sample rescue events for the landing page, as the design lists them.
 *
 * The landing site has no event feed, so these are fixed. Whether a card
 * offers RSVP, a waitlist or a join request is derived from the data.
 */

const IMG = "/events-rescue/";

export type EventType = "adoption" | "drive" | "foster" | "community";
export type Species = "dogs" | "cats" | "small" | "multiple";

export const EVENT_TYPES: readonly { id: EventType; label: string }[] = [
  { id: "adoption", label: "Adoption day" },
  { id: "drive", label: "Rescue drive" },
  { id: "foster", label: "Foster support" },
  { id: "community", label: "Community gathering" },
];

export const SPECIES: readonly { id: Species; label: string }[] = [
  { id: "dogs", label: "Dogs" },
  { id: "cats", label: "Cats" },
  { id: "small", label: "Small animals" },
  { id: "multiple", label: "Multiple species" },
];

export const PARTICIPATION = ["Meet & greet", "Volunteer / hands-on", "Donation drop-off", "Observation only"] as const;
export type Participation = (typeof PARTICIPATION)[number];

export const TYPE_TILES: readonly { id: EventType; label: string; image: string }[] = [
  { id: "adoption", label: "Adoption Days", image: `${IMG}type-adoption-days.webp` },
  { id: "drive", label: "Rescue Drives", image: `${IMG}type-rescue-drives.webp` },
  { id: "foster", label: "Foster Support", image: `${IMG}type-foster-support.webp` },
  { id: "community", label: "Community Gatherings", image: `${IMG}type-community-gatherings.webp` },
];

type Photo = { src: string; alt: string };

export type RescueEvent = {
  id: string;
  title: string;
  /** Date badge on the photo, exactly as the design prints it. */
  badge: { top: string; day: string };
  when: string;
  /** Orange line explaining why it's suggested. */
  reason?: string;
  /** Small "UPDATED" label above the title. */
  updated?: boolean;
  venue: string;
  /** Whether adoptable animals are at the event; the first tag. */
  adoptable: boolean;
  participation: Participation;
  organizer: string;
  /** Independent hosts show a plain pill without the verified mark. */
  independent?: boolean;
  fundraiser?: boolean;
  /** Undefined for open drop-offs with no RSVP limit. */
  filled?: number;
  capacity?: number;
  /** The organizer approves each attendee instead of taking RSVPs. */
  approval?: boolean;
  type: EventType;
  species: Species;
  /** The design uses a different photo in each section. */
  photos: { featured?: Photo; all: Photo; upcoming?: Photo };
  /** Copy for the RSVP popup; events without it RSVP in the app. */
  rsvp?: { details: string; rules: readonly string[] };
};

export const EVENTS: readonly RescueEvent[] = [
  {
    id: "weekend-adoption",
    title: "Weekend Adoption Day at Riverside Park",
    badge: { top: "SAT", day: "3" },
    when: "Sat, Oct 3 · 11:00 AM",
    reason: "Because you follow Sacramento Animal Rescue",
    venue: "Public venue",
    adoptable: true,
    participation: "Meet & greet",
    organizer: "Sacramento Animal Rescue",
    filled: 38,
    capacity: 60,
    type: "adoption",
    species: "multiple",
    photos: {
      featured: { src: `${IMG}featured-weekend-adoption.webp`, alt: "A woman offering a treat to two dogs at a park" },
      all: { src: `${IMG}all-weekend-adoption.webp`, alt: "A man holding a puppy at an outdoor event" },
      upcoming: { src: `${IMG}up-weekend-adoption.webp`, alt: "An Australian shepherd puppy lying in the grass" },
    },
    rsvp: {
      details: "Sat, Oct 3 · 11:00 AM–3:00 PM PT · Riverside Park, Sacramento, CA area",
      rules: [
        "Adoptable dogs and cats present with organization handlers — meet-and-greet only.",
        "Personal pets welcome on-leash, with handler discretion near adoptable animals.",
      ],
    },
  },
  {
    id: "winter-drive",
    title: "Winter Supply Donation Drive",
    badge: { top: "OCT", day: "6" },
    when: "Tue, Oct 6 · 4:00 PM",
    venue: "Public venue",
    adoptable: false,
    participation: "Donation drop-off",
    organizer: "Golden State Rescue Alliance",
    type: "drive",
    species: "multiple",
    photos: {
      all: { src: `${IMG}all-winter-drive.webp`, alt: "A volunteer sweeping a barn beside cows" },
      upcoming: { src: `${IMG}up-winter-drive.webp`, alt: "A ginger cat asleep on a blanket" },
    },
  },
  {
    id: "foster-orientation",
    title: "Foster Volunteer Orientation",
    badge: { top: "OCT", day: "9" },
    when: "Fri, Oct 9 · 6:00 PM",
    reason: "Because you follow Second Chance Animal Shelter",
    venue: "Shared with attendees only",
    adoptable: false,
    participation: "Volunteer / hands-on",
    organizer: "Second Chance Animal Shelter",
    filled: 11,
    capacity: 25,
    type: "foster",
    species: "multiple",
    photos: {
      all: { src: `${IMG}all-foster-orientation.webp`, alt: "A volunteer in a blue shirt with a dog on a leash" },
      upcoming: { src: `${IMG}up-foster-orientation.webp`, alt: "A golden retriever puppy in a collar" },
    },
  },
  {
    id: "second-chance-fair",
    title: "Second Chance Community Adoption Fair",
    badge: { top: "OCT", day: "12" },
    when: "Mon, Oct 12 · 10:00 AM",
    venue: "Public venue",
    adoptable: true,
    participation: "Meet & greet",
    organizer: "Second Chance Animal Shelter",
    fundraiser: true,
    filled: 19,
    capacity: 50,
    type: "adoption",
    species: "dogs",
    photos: {
      all: { src: `${IMG}all-second-chance-fair.webp`, alt: "Hands reaching toward puppies behind a fence" },
      upcoming: { src: `${IMG}up-second-chance-fair.webp`, alt: "A smiling beagle" },
    },
  },
  {
    id: "transport-meetup",
    title: "Rescue Transport Volunteer Meetup",
    badge: { top: "OCT", day: "15" },
    when: "Thu, Oct 15 · 5:30 PM",
    venue: "Approximate area",
    adoptable: true,
    participation: "Volunteer / hands-on",
    organizer: "Golden State Rescue Alliance",
    filled: 6,
    capacity: 12,
    approval: true,
    type: "drive",
    species: "dogs",
    photos: {
      all: { src: `${IMG}all-transport-meetup.webp`, alt: "A husky in the back of a car greeting a volunteer" },
      upcoming: { src: `${IMG}up-transport-meetup.webp`, alt: "A chocolate Labrador licking its nose" },
    },
  },
  {
    id: "rescue-picnic",
    title: "Rescue Community Picnic & Meet-Up",
    badge: { top: "OCT", day: "18" },
    when: "Sun, Oct 18 · 12:00 PM",
    venue: "Public venue",
    adoptable: false,
    participation: "Observation only",
    organizer: "Independent host (community member)",
    independent: true,
    filled: 40,
    capacity: 40,
    type: "community",
    species: "dogs",
    photos: {
      all: { src: `${IMG}rescue-picnic.webp`, alt: "A corgi and a terrier running together" },
      upcoming: { src: `${IMG}rescue-picnic.webp`, alt: "A corgi and a terrier running together" },
    },
  },
  {
    id: "senior-spotlight",
    title: "Senior Pet Adoption Spotlight Day",
    badge: { top: "OCT", day: "21" },
    when: "Wed, Oct 21 · 3:00 PM",
    updated: true,
    venue: "Public venue",
    adoptable: true,
    participation: "Meet & greet",
    organizer: "Sacramento Animal Rescue",
    filled: 14,
    capacity: 30,
    type: "adoption",
    species: "dogs",
    photos: {
      all: { src: `${IMG}all-senior-spotlight.webp`, alt: "A golden retriever holding a flower in its mouth" },
    },
  },
  {
    id: "foster-supply",
    title: "Foster Supply & Enrichment Drive",
    badge: { top: "OCT", day: "24" },
    when: "Sat, Oct 24 · 1:00 PM",
    venue: "Public venue",
    adoptable: false,
    participation: "Donation drop-off",
    organizer: "Meadowbrook Sanctuary",
    fundraiser: true,
    type: "foster",
    species: "small",
    photos: {
      all: { src: `${IMG}all-foster-supply.webp`, alt: "A puppy wrapped in a blanket being petted" },
    },
  },
];

export type Action = "rsvp" | "waitlist" | "request";

export function actionOf(e: RescueEvent): Action {
  if (e.capacity !== undefined && e.filled !== undefined && e.filled >= e.capacity) return "waitlist";
  if (e.approval) return "request";
  return "rsvp";
}
