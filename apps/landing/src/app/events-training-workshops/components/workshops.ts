/**
 * Sample workshops for the landing page, as the design lists them.
 *
 * The landing site has no event feed, so these are fixed. Whether a card
 * offers Register, a waitlist or a join request is derived from the data.
 */

const IMG = "/events-training-workshops/";

export type Level = "Introductory" | "Intermediate" | "Advanced" | "Professional-only";
export type Participation = "Low-risk hands-on" | "Lecture / demo" | "Guided observation" | "Controlled practical";
export type Mode = "In-person" | "Online" | "Hybrid";
export type AnimalPresence = "attendee" | "demo" | "none";

export const LEVELS: readonly Level[] = ["Introductory", "Intermediate", "Advanced", "Professional-only"];
export const PARTICIPATION: readonly Participation[] = [
  "Low-risk hands-on",
  "Lecture / demo",
  "Guided observation",
  "Controlled practical",
];
export const MODES: readonly Mode[] = ["In-person", "Online", "Hybrid"];
export const ANIMAL_PRESENCE: readonly { id: AnimalPresence; label: string }[] = [
  { id: "attendee", label: "Attendee animals allowed" },
  { id: "demo", label: "Demo animals only" },
  { id: "none", label: "No animals" },
];

export const LEARNING_TYPES: readonly { label: string; image: string }[] = [
  { label: "Behavior & Training", image: `${IMG}type-behavior-training.webp` },
  { label: "Care Education", image: `${IMG}type-care-education.webp` },
  { label: "Grooming & Handling", image: `${IMG}type-grooming-handling.webp` },
  { label: "Rescue & Foster Skills", image: `${IMG}type-rescue-foster.webp` },
  { label: "Enrichment", image: `${IMG}type-enrichment.webp` },
  { label: "Community Safety", image: `${IMG}type-community-safety.webp` },
  { label: "Professional Education", image: `${IMG}type-professional-education.webp` },
  { label: "First Aid Awareness", image: `${IMG}type-first-aid.webp` },
];

type Photo = { src: string; alt: string };

export type Workshop = {
  id: string;
  title: string;
  /** Date badge on the photo, exactly as the design prints it. */
  badge: { top: string; day: string };
  /** "Sat, Oct 3 · 10:00 AM" */
  when: string;
  mode: Mode;
  /** Orange line explaining why it's suggested; present on the recommended picks. */
  reason?: string;
  level: Level;
  participation: Participation;
  instructor: string;
  filled: number;
  capacity: number;
  /** The organizer approves each attendee instead of taking registrations. */
  approval?: boolean;
  animals: AnimalPresence;
  /** Learning types this workshop belongs to, matching LEARNING_TYPES labels. */
  types: readonly string[];
  /** The design uses a different photo in each section. */
  photos: { recommended?: Photo; all: Photo; upcoming?: Photo };
};

export const WORKSHOPS: readonly Workshop[] = [
  {
    id: "calm-handling",
    title: "Calm Handling & Leash Basics",
    badge: { top: "SAT", day: "3" },
    when: "Sat, Oct 3 · 10:00 AM",
    mode: "In-person",
    reason: "Because you follow Golden Retriever Guardians",
    level: "Introductory",
    participation: "Low-risk hands-on",
    instructor: "Jordan Reyes",
    filled: 14,
    capacity: 20,
    animals: "attendee",
    types: ["Behavior & Training", "Grooming & Handling"],
    photos: {
      recommended: { src: `${IMG}rec-calm-handling.webp`, alt: "Hands holding a dog's paw" },
      all: { src: `${IMG}all-calm-handling.webp`, alt: "Hands holding a dog's paw" },
      upcoming: { src: `${IMG}up-calm-handling.webp`, alt: "A couple sitting in the woods with their dog" },
    },
  },
  {
    id: "pet-first-aid",
    title: "Pet First Aid Awareness",
    badge: { top: "OCT", day: "6" },
    when: "Tue, Oct 6 · 6:30 PM",
    mode: "Online",
    reason: "Popular with new pet owners",
    level: "Introductory",
    participation: "Lecture / demo",
    instructor: "Dr. Amara Cole",
    filled: 48,
    capacity: 100,
    animals: "demo",
    types: ["First Aid Awareness", "Care Education"],
    photos: {
      recommended: { src: `${IMG}rec-pet-first-aid-bandage.webp`, alt: "A dog's paw being bandaged" },
      all: { src: `${IMG}all-pet-first-aid-vets.webp`, alt: "Veterinary staff bandaging a dog's leg" },
      upcoming: { src: `${IMG}up-pet-first-aid.webp`, alt: "A dog's paw being bandaged" },
    },
  },
  {
    id: "safe-grooming",
    title: "Safe Grooming Tool Use for Owners",
    badge: { top: "OCT", day: "9" },
    when: "Fri, Oct 9 · 5:00 PM",
    mode: "In-person",
    level: "Introductory",
    participation: "Guided observation",
    instructor: "Priya Anand",
    filled: 9,
    capacity: 15,
    animals: "demo",
    types: ["Grooming & Handling"],
    photos: {
      all: { src: `${IMG}all-safe-grooming.webp`, alt: "A groomer brushing a small white dog" },
      upcoming: { src: `${IMG}up-safe-grooming.webp`, alt: "Clippers trimming a pet's nails" },
    },
  },
  {
    id: "foster-intake",
    title: "Foster Intake & Documentation Basics",
    badge: { top: "OCT", day: "12" },
    when: "Mon, Oct 12 · 7:00 PM",
    mode: "Online",
    reason: "Because you follow Second Chance Animal Shelter",
    level: "Introductory",
    participation: "Lecture / demo",
    instructor: "Second Chance Animal Shelter",
    filled: 22,
    capacity: 40,
    animals: "none",
    types: ["Rescue & Foster Skills"],
    photos: {
      recommended: { src: `${IMG}rec-foster-intake.webp`, alt: "A golden retriever puppy in a collar" },
      all: { src: `${IMG}all-foster-intake.webp`, alt: "A dog resting its paw in someone's hand" },
      upcoming: { src: `${IMG}up-foster-intake.webp`, alt: "A woman and a girl holding a puppy" },
    },
  },
  {
    id: "cat-enrichment",
    title: "Enrichment Ideas for Indoor Cats",
    badge: { top: "OCT", day: "15" },
    when: "Thu, Oct 15 · 6:00 PM",
    mode: "Hybrid",
    level: "Introductory",
    participation: "Lecture / demo",
    instructor: "Independent host (community member)",
    filled: 17,
    capacity: 30,
    animals: "none",
    types: ["Enrichment"],
    photos: {
      all: { src: `${IMG}all-cat-enrichment.webp`, alt: "Three cats sitting on a dresser" },
      upcoming: { src: `${IMG}up-cat-enrichment.webp`, alt: "Cats in a room with a cat tree" },
    },
  },
  {
    id: "dog-park-safety",
    title: "Community Dog-Park Safety Basics",
    badge: { top: "OCT", day: "17" },
    when: "Sat, Oct 17 · 9:00 AM",
    mode: "In-person",
    level: "Introductory",
    participation: "Guided observation",
    instructor: "Golden State Rescue Alliance",
    filled: 25,
    capacity: 25,
    animals: "attendee",
    types: ["Community Safety"],
    photos: {
      all: { src: `${IMG}all-dog-park-safety.webp`, alt: "Dogs running across a dirt park" },
      upcoming: { src: `${IMG}up-dog-park-safety.webp`, alt: "A person writing on paper at a desk" },
    },
  },
  {
    id: "controlled-restraint",
    title: "Controlled Restraint Techniques for Veterinary Assistants",
    badge: { top: "OCT", day: "20" },
    when: "Tue, Oct 20 · 1:00 PM",
    mode: "In-person",
    level: "Professional-only",
    participation: "Controlled practical",
    instructor: "Dr. Amara Cole",
    filled: 4,
    capacity: 8,
    approval: true,
    animals: "demo",
    types: ["Professional Education", "Grooming & Handling"],
    photos: {
      all: { src: `${IMG}all-controlled-restraint.webp`, alt: "Two veterinary assistants holding a small dog" },
    },
  },
  {
    id: "puppy-socialization",
    title: "Puppy Socialization Fundamentals",
    badge: { top: "OCT", day: "22" },
    when: "Thu, Oct 22 · 5:30 PM",
    mode: "In-person",
    reason: "Because you follow Golden Retriever Guardians",
    level: "Introductory",
    participation: "Low-risk hands-on",
    instructor: "Jordan Reyes",
    filled: 16,
    capacity: 16,
    animals: "attendee",
    types: ["Behavior & Training"],
    photos: {
      recommended: { src: `${IMG}rec-puppy-socialization.webp`, alt: "A woman in a knit hat holding a small white dog" },
      all: { src: `${IMG}all-puppy-socialization.webp`, alt: "A cavalier puppy on a picnic blanket" },
    },
  },
];

export type Action = "register" | "waitlist" | "request";

export function actionOf(w: Workshop): Action {
  if (w.filled >= w.capacity) return "waitlist";
  if (w.approval) return "request";
  return "register";
}
