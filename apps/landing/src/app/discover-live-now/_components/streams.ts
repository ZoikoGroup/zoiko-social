import { AVATARS, THUMBS } from "./images";

export const TABS = [
  "For You",
  "Communities",
  "Events",
  "Following",
  "Professionals",
  "Species / Topic",
] as const;

export type Tab = (typeof TABS)[number];

export const TOPICS = [
  "Dogs",
  "Cats",
  "Wildlife",
  "Veterinary",
  "Rescue",
  "Farm",
  "Birds",
  "Horses",
  "Events",
] as const;

export type Topic = (typeof TOPICS)[number];

export type Badge =
  | "Verified Organization"
  | "Verified Professional"
  | "Advisory"
  | "New voice";

export type Stream = {
  id: string;
  title: string;
  host: { name: string; avatar?: string };
  /** The community or organisation the stream runs under. */
  org: string;
  format: "Community livestream" | "Event livestream";
  thumb: string;
  alt: string;
  badges: Badge[];
  /** The card's second button, beside Watch Live. */
  secondary: "Follow" | "Follow Event" | "Join";
  /** Species and topics this stream shows up under in the circle row. */
  topics: Topic[];
  duration: string;
  watching: string;
  /** A stream that has finished. Shown faded, with no replay to watch. */
  ended?: boolean;
};

/** The large card at the top of For You. */
export const FEATURED = {
  title: "Post-Surgery Recovery Clinic: What Healing Looks Like",
  host: {
    name: "Dr. Amara Okafor",
    avatar: AVATARS.amaraOkafor,
    credential: "Verified Veterinarian",
  },
  context: "Vet Care Collective · Community livestream",
  thumb: THUMBS.featured,
  alt: "Veterinary surgeons operating on an animal in a clinic",
  duration: "32 min",
  watching: "500+ watching",
  advisory: "Advisory · Mild medical",
};

export const STREAMS: Stream[] = [
  {
    id: "golden-hour-sanctuary",
    title: "Golden Hour at the Sanctuary",
    host: { name: "Diego Fuentes", avatar: AVATARS.diegoFuentes },
    org: "Retired Racehorse Sanctuary",
    format: "Community livestream",
    thumb: THUMBS.horsesSanctuary,
    alt: "Two horses side by side at a sanctuary",
    badges: [],
    secondary: "Follow",
    topics: ["Horses", "Rescue"],
    duration: "12 min",
    watching: "120 watching",
  },
  {
    id: "peregrine-nest-cam",
    title: "Nest Cam: Peregrine Falcon Watch",
    host: { name: "Urban Bird Rescue", avatar: AVATARS.urbanBirdRescue },
    org: "Backyard Habitat Builders",
    format: "Event livestream",
    thumb: THUMBS.peregrine,
    alt: "A peregrine falcon landing on a bare branch",
    badges: ["Verified Organization"],
    secondary: "Follow Event",
    topics: ["Birds", "Wildlife", "Events"],
    duration: "3h 40 min",
    watching: "1,200+ watching",
  },
  {
    id: "puppy-socialization",
    title: "Puppy Socialization Hour",
    host: { name: "Priya Natarajan", avatar: AVATARS.priyaNatarajan },
    org: "Calm Paws Training",
    format: "Community livestream",
    thumb: THUMBS.puppyPaw,
    alt: "A puppy's paw resting in a circle of hands",
    badges: ["Verified Professional"],
    secondary: "Join",
    topics: ["Dogs"],
    duration: "18 min",
    watching: "340 watching",
  },
  {
    id: "flood-evacuation",
    title: "Rescue Response: Flood Evacuation Update",
    host: { name: "Coastal Animal Rescue Network", avatar: AVATARS.coastalRescue },
    org: "Local Rescue Allies",
    format: "Community livestream",
    thumb: THUMBS.floodRescue,
    alt: "Volunteers checking on rescued rabbits in outdoor hutches",
    badges: ["Verified Organization", "Advisory"],
    secondary: "Follow",
    topics: ["Rescue"],
    duration: "46 min",
    watching: "800+ watching",
  },
  {
    id: "wing-wrap-demo",
    title: "Injury Care Demo: Wing Wrap Technique",
    host: { name: "Renee Castillo, RVT", avatar: AVATARS.reneeCastillo },
    org: "Vet Care Collective",
    format: "Community livestream",
    thumb: THUMBS.wingWrap,
    alt: "Two veterinary staff treating an animal on the grass",
    badges: ["Verified Professional", "Advisory"],
    secondary: "Follow",
    topics: ["Veterinary", "Birds"],
    duration: "9 min",
    watching: "210 watching",
  },
  {
    id: "cat-cafe-enrichment",
    title: "Cat Cafe Morning Enrichment",
    host: { name: "Whisker Lounge Cafe", avatar: AVATARS.whiskerLounge },
    org: "Foster Cat Network",
    format: "Community livestream",
    thumb: THUMBS.catCafe,
    alt: "A long-haired ginger cat resting in a cafe",
    badges: [],
    secondary: "Join",
    topics: ["Cats"],
    duration: "5 min",
    watching: "64 watching",
  },
  {
    id: "adoption-day",
    title: "Adoption Day Livestream",
    host: { name: "City Shelter Volunteers", avatar: AVATARS.cityShelter },
    org: "Regional Adoption Day",
    format: "Event livestream",
    thumb: THUMBS.adoptionDay,
    alt: "Volunteers outdoors with a group of dogs",
    badges: ["Verified Organization"],
    secondary: "Follow Event",
    topics: ["Dogs", "Rescue", "Events"],
    duration: "1h 05 min",
    watching: "430 watching",
  },
  {
    id: "farm-feeding-time",
    title: "Farm Sanctuary Feeding Time",
    host: { name: "Green Pastures Farm Sanctuary", avatar: AVATARS.greenPastures },
    org: "Urban Homesteaders Collective",
    format: "Community livestream",
    thumb: THUMBS.farmCalf,
    alt: "A smiling volunteer cuddling a calf",
    badges: ["Verified Organization"],
    secondary: "Join",
    topics: ["Farm"],
    duration: "40 min",
    watching: "95 watching",
  },
  {
    id: "first-foster-diary",
    title: "New Voices: First Foster Diary",
    host: { name: "Ruth Alcantara", avatar: AVATARS.ruthAlcantara },
    org: "Foster Cat Network",
    format: "Community livestream",
    thumb: THUMBS.fosterCats,
    alt: "A person at a kitchen counter with two foster cats",
    badges: ["New voice"],
    secondary: "Follow",
    topics: ["Cats", "Rescue"],
    duration: "7 min",
    watching: "28 watching",
  },
  {
    id: "morning-trail-walk",
    title: "Morning Trail Walk with Rescue Dogs",
    host: { name: "Marcus Webb", avatar: AVATARS.marcusWebb },
    org: "Local Rescue Allies",
    format: "Community livestream",
    thumb: THUMBS.trailWalk,
    alt: "Two people crouching to greet a small rescue dog",
    badges: [],
    secondary: "Follow",
    topics: ["Dogs", "Rescue"],
    duration: "",
    watching: "",
    ended: true,
  },
  {
    id: "reef-tank-cleaning",
    title: "Aquarium Enrichment: Reef Tank Cleaning",
    host: { name: "Sofia Marchetti", avatar: AVATARS.sofiaMarchetti },
    org: "Backyard Habitat Builders",
    format: "Community livestream",
    thumb: THUMBS.aquarium,
    alt: "Tropical fish swimming among aquarium plants",
    badges: [],
    secondary: "Join",
    topics: ["Wildlife"],
    duration: "15 min",
    watching: "52 watching",
  },
  {
    id: "trail-ride-qa",
    title: "Trail Ride Q&A with the Rescue Herd",
    host: { name: "Theo Marsh", avatar: AVATARS.theoMarsh },
    org: "Retired Racehorse Sanctuary",
    format: "Community livestream",
    thumb: THUMBS.trailRide,
    alt: "Riders on horseback along a wooded trail",
    badges: [],
    secondary: "Join",
    topics: ["Horses", "Rescue"],
    duration: "24 min",
    watching: "68 watching",
  },
  {
    id: "bearded-dragon-basking",
    title: "Exotic Pet Corner: Bearded Dragon Basking Setup",
    host: { name: "Owen Blackwood" },
    org: "Exotic Pet Care",
    format: "Community livestream",
    thumb: THUMBS.beardedDragon,
    alt: "A bearded dragon basking on bark substrate",
    badges: ["New voice"],
    secondary: "Join",
    topics: ["Wildlife"],
    duration: "6 min",
    watching: "41 watching",
  },
];

/** Signals offered in the rail's Tune Live card. */
export const TUNE_SIGNALS: Topic[] = ["Dogs", "Rescue", "Wildlife", "Veterinary"];

/** The comp shows Dogs and Rescue switched on. */
export const DEFAULT_TUNED: Topic[] = ["Dogs", "Rescue"];
