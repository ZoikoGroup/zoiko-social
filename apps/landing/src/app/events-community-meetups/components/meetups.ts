/**
 * Sample community meetups for the landing page.
 *
 * The landing site has no event feed, so these are fixed. Every count on the
 * page, and whether a card offers RSVP, a waitlist or a join request, is
 * derived from this list.
 */

const IMG = "/events-community-meetups/";

export type Interest =
  | "dog-walking"
  | "cat-owners"
  | "birdwatching"
  | "horse-lovers"
  | "reptiles"
  | "rescue-support"
  | "new-pet-owners"
  | "senior-pets";

export const INTERESTS: readonly { id: Interest; label: string; image?: string }[] = [
  { id: "dog-walking", label: "Dog Walking", image: `${IMG}interest-dog-walking.webp` },
  { id: "cat-owners", label: "Cat Owners", image: `${IMG}interest-cat-owners.webp` },
  { id: "birdwatching", label: "Birdwatching", image: `${IMG}interest-birdwatching.webp` },
  // Blank in the design, so no photo.
  { id: "horse-lovers", label: "Horse Lovers" },
  { id: "reptiles", label: "Reptile Enthusiasts", image: `${IMG}interest-reptiles.webp` },
  { id: "rescue-support", label: "Rescue Support", image: `${IMG}interest-rescue-support.webp` },
  { id: "new-pet-owners", label: "New Pet Owners", image: `${IMG}interest-new-pet-owners.webp` },
  { id: "senior-pets", label: "Senior Pet Support", image: `${IMG}interest-senior-pets.webp` },
];

export type Animals = "welcome" | "optional" | "people-only";
export type Age = "all" | "adults" | "guardian";

export const ANIMAL_LABELS: Record<Animals, string> = {
  welcome: "Animals welcome",
  optional: "Animals optional",
  "people-only": "People-only",
};

export const AGE_LABELS: Record<Age, string> = {
  all: "All ages",
  adults: "Adults only",
  guardian: "Guardian required",
};

export type Meetup = {
  id: string;
  title: string;
  /** Date badge on the photo, exactly as the design prints it. */
  badge: { top: string; day: string };
  /** "Sun, Sep 28 · 9:00 AM" */
  when: string;
  recurrence?: "Weekly" | "Monthly";
  /** What the listing reveals about the venue before you join. */
  venue: "Public venue" | "Approximate area" | "Shared after approval" | "Shared with attendees only";
  format: "In person" | "Hybrid";
  animals: Animals;
  age: Age;
  organizer: string;
  /** The community the meetup belongs to, when it has one. */
  community?: string;
  filled: number;
  capacity: number;
  /** The host approves each attendee instead of taking RSVPs. */
  approval?: boolean;
  interests: readonly Interest[];
  image: string;
  imageAlt: string;
  /** Alternate photo used in "Recurring series". */
  seriesImage?: string;
  seriesImageAlt?: string;
};

/** In the design's "Recommended" order. */
export const MEETUPS: readonly Meetup[] = [
  {
    id: "dog-walk",
    title: "Sunday Morning Dog Walk & Social",
    badge: { top: "SUN", day: "28" },
    when: "Sun, Sep 28 · 9:00 AM",
    recurrence: "Weekly",
    venue: "Public venue",
    format: "In person",
    animals: "welcome",
    age: "all",
    organizer: "Golden Retriever Guardians",
    community: "Golden Retriever Guardians",
    filled: 18,
    capacity: 25,
    interests: ["dog-walking"],
    image: `${IMG}dog-walk.webp`,
    imageAlt: "A basset hound trotting across a lawn",
    seriesImage: `${IMG}series-dog-walk.webp`,
    seriesImageAlt: "A woman walking several dogs through a park",
  },
  {
    id: "cat-owner-circle",
    title: "New Cat Owner Support Circle",
    badge: { top: "OCT", day: "3" },
    when: "Sat, Oct 3 · 2:00 PM",
    recurrence: "Monthly",
    venue: "Public venue",
    format: "In person",
    animals: "people-only",
    age: "all",
    organizer: "Sacramento Animal Rescue",
    community: "Sacramento Animal Rescue",
    filled: 9,
    capacity: 20,
    interests: ["cat-owners", "new-pet-owners"],
    image: `${IMG}cat-owner-circle-woman.webp`,
    imageAlt: "A woman and a tabby cat at a table with a houseplant",
    seriesImage: `${IMG}series-cat-owner-circle-man.webp`,
    seriesImageAlt: "A tabby cat perched on a bearded man's shoulder",
  },
  {
    id: "birdwatching-walk",
    title: "Birdwatching Walk for Beginners",
    badge: { top: "OCT", day: "5" },
    when: "Mon, Oct 5 · 7:30 AM",
    venue: "Approximate area",
    format: "In person",
    animals: "people-only",
    age: "all",
    organizer: "Community Wildlife Educators Network",
    community: "Community Wildlife Educators Network",
    filled: 11,
    capacity: 15,
    interests: ["birdwatching"],
    image: `${IMG}birdwatching-walk.webp`,
    imageAlt: "Three people with binoculars on a woodland path",
  },
  {
    id: "senior-pet-support",
    title: "Senior Pet Support Meetup",
    badge: { top: "OCT", day: "8" },
    when: "Thu, Oct 8 · 6:00 PM",
    recurrence: "Monthly",
    venue: "Public venue",
    format: "In person",
    animals: "optional",
    age: "all",
    organizer: "Sacramento Animal Rescue",
    filled: 15,
    capacity: 15,
    interests: ["senior-pets"],
    image: `${IMG}senior-pet-support-sofa.webp`,
    imageAlt: "Two women on a sofa with a beagle",
    seriesImage: `${IMG}series-senior-pet-support-wheelchair.webp`,
    seriesImageAlt: "A man hugging an older dog in a wheeled harness",
  },
  {
    id: "reptile-social",
    title: "Reptile Enthusiasts Social",
    badge: { top: "OCT", day: "11" },
    when: "Sun, Oct 11 · 1:00 PM",
    venue: "Shared after approval",
    format: "In person",
    animals: "welcome",
    age: "adults",
    organizer: "Independent host (community member)",
    filled: 6,
    capacity: 12,
    approval: true,
    interests: ["reptiles"],
    image: `${IMG}reptile-social.webp`,
    imageAlt: "A lizard basking on a rock",
  },
  {
    id: "foster-volunteer",
    title: "Foster Volunteer Welcome Meetup",
    badge: { top: "OCT", day: "14" },
    when: "Wed, Oct 14 · 6:30 PM",
    recurrence: "Monthly",
    venue: "Shared with attendees only",
    format: "In person",
    animals: "people-only",
    age: "adults",
    organizer: "Second Chance Animal Shelter",
    community: "Second Chance Animal Shelter",
    filled: 7,
    capacity: 20,
    interests: ["rescue-support"],
    image: `${IMG}foster-volunteer.webp`,
    imageAlt: "A man holding a puppy at an outdoor café",
    seriesImage: `${IMG}series-foster-volunteer.webp`,
    seriesImageAlt: "Volunteers in matching shirts at a meeting",
  },
  {
    id: "horse-lovers",
    title: "Horse Lovers Trail Meetup",
    badge: { top: "OCT", day: "18" },
    when: "Sun, Oct 18 · 10:00 AM",
    venue: "Approximate area",
    format: "In person",
    animals: "welcome",
    age: "guardian",
    organizer: "Meadowbrook Sanctuary",
    community: "Meadowbrook Sanctuary",
    filled: 5,
    capacity: 10,
    interests: ["horse-lovers"],
    image: `${IMG}horse-lovers.webp`,
    imageAlt: "A woman in a sun hat nuzzling a horse",
  },
  {
    id: "puppy-playdate",
    title: "Puppy Socialization Playdate",
    badge: { top: "OCT", day: "21" },
    when: "Wed, Oct 21 · 5:30 PM",
    recurrence: "Weekly",
    venue: "Public venue",
    format: "In person",
    animals: "welcome",
    age: "all",
    organizer: "Golden State Rescue Alliance",
    community: "Golden State Rescue Alliance",
    filled: 20,
    capacity: 20,
    interests: ["new-pet-owners"],
    image: `${IMG}puppy-playdate.webp`,
    imageAlt: "A fluffy puppy held on someone's lap",
    seriesImage: `${IMG}series-puppy-playdate.webp`,
    seriesImageAlt: "A chocolate Labrador licking its nose",
  },
];

export type Action = "rsvp" | "waitlist" | "request";

export function actionOf(m: Meetup): Action {
  if (m.filled >= m.capacity) return "waitlist";
  if (m.approval) return "request";
  return "rsvp";
}
