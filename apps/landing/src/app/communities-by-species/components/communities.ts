import { COVERS, LOGOS } from "./images";

/** The chip under each community's description. */
export const CATEGORIES = [
  "Training & Behavior",
  "Wildlife & Conservation",
  "Rescue & Adoption",
  "Professional",
  "Dogs",
  "Cats",
  "Birds",
  "Horses",
  "Memorial & Support",
] as const;
export type Category = (typeof CATEGORIES)[number];

/** How busy a community is, and the order "Most active" sorts by. */
export const ACTIVITY = ["Very active today", "Active today", "Active this week"] as const;
export type Activity = (typeof ACTIVITY)[number];

/** Whether anyone may join, or a request has to be approved first. */
export type Access = "Open to join" | "Request required";

/** Who runs the community. */
export type Steward = "Professional-led" | "Community-run" | "Organization-led";

export type Community = {
  id: string;
  name: string;
  description: string;
  category: Category;
  activity: Activity;
  access: Access;
  steward: Steward;
  /** Both omitted where nothing was supplied; the card falls back gracefully. */
  cover?: string;
  logo?: string;
};

/**
 * The nine communities the comp shows, followed by the rest of the fifteen
 * it counts. Only the first nine came with artwork.
 */
export const COMMUNITIES: Community[] = [
  {
    id: "calm-paws",
    name: "Calm Paws Dog Training Collective",
    description: "A professional-led group sharing reward-based training resources and local classes.",
    category: "Training & Behavior",
    activity: "Very active today",
    access: "Open to join",
    steward: "Professional-led",
    cover: COVERS.dogTraining,
    logo: LOGOS.dogTraining,
  },
  {
    id: "sac-valley-wildlife",
    name: "Sacramento Valley Wildlife Rescue",
    description: "Public updates and volunteer coordination for regional wildlife rescue and rehabilitation work.",
    category: "Wildlife & Conservation",
    activity: "Very active today",
    access: "Request required",
    steward: "Professional-led",
    cover: COVERS.wildlifeRescue,
    logo: LOGOS.wildlife,
  },
  {
    id: "adoption-day-volunteers",
    name: "Adoption Day Volunteers Network",
    description: "Coordinates volunteers for regional adoption events across shelters and rescues.",
    category: "Rescue & Adoption",
    activity: "Very active today",
    access: "Open to join",
    steward: "Community-run",
    cover: COVERS.adoptionEvent,
    logo: LOGOS.adoption,
  },
  {
    id: "feline-foster",
    name: "Feline Foster Network",
    description: "Coordinates foster placements and adoption events for cats and kittens.",
    category: "Rescue & Adoption",
    activity: "Active today",
    access: "Request required",
    steward: "Community-run",
    cover: COVERS.kittenFoster,
    logo: LOGOS.cat,
  },
  {
    id: "urban-bird-conservation",
    name: "Urban Bird Conservation Network",
    description: "Guided walks and habitat-conservation projects for local and migratory bird populations.",
    category: "Wildlife & Conservation",
    activity: "Active today",
    access: "Open to join",
    steward: "Professional-led",
    cover: COVERS.birdwatching,
    logo: LOGOS.bird,
  },
  {
    id: "equine-rescue",
    name: "Equine Rescue & Rehabilitation",
    description: "Organization-led group supporting rescued and retired horses through rehabilitation.",
    category: "Rescue & Adoption",
    activity: "Active today",
    access: "Request required",
    steward: "Professional-led",
    cover: COVERS.horseRescue,
    logo: LOGOS.horse,
  },
  {
    id: "vet-tech-professionals",
    name: "Certified Vet Tech Professionals",
    description: "A professional community for veterinary technicians to share resources and continuing education.",
    category: "Professional",
    activity: "Active this week",
    access: "Request required",
    steward: "Professional-led",
    cover: COVERS.vetClinic,
    logo: LOGOS.vet,
  },
  {
    id: "golden-retriever-lovers",
    name: "Golden Retriever Lovers",
    description: "A community-run space for golden retriever owners to share photos, advice, and local meetups.",
    category: "Dogs",
    activity: "Active this week",
    access: "Open to join",
    steward: "Community-run",
    cover: COVERS.goldenRetriever,
    logo: LOGOS.dog,
  },
  {
    id: "anxious-dogs",
    name: "Behavior & Enrichment for Anxious Dogs",
    description: "Discussion and resources for guardians supporting anxious or reactive dogs.",
    category: "Training & Behavior",
    activity: "Active this week",
    access: "Open to join",
    steward: "Community-run",
    cover: COVERS.dogAnxious,
    logo: LOGOS.dogCalm,
  },
  {
    id: "backyard-birds",
    name: "Backyard Bird Feeders Circle",
    description: "Feeder setups, seasonal visitors, and garden habitat tips for everyday birdwatchers.",
    category: "Birds",
    activity: "Active this week",
    access: "Open to join",
    steward: "Community-run",
    cover: COVERS.wildBird,
    logo: LOGOS.bird,
  },
  {
    id: "senior-cats",
    name: "Senior Cat Companions",
    description: "Care, comfort, and mobility support for cats in their later years.",
    category: "Cats",
    activity: "Active this week",
    access: "Open to join",
    steward: "Community-run",
    logo: LOGOS.cat,
  },
  {
    id: "trail-riding",
    name: "Trail Riding & Horse Care",
    description: "Route sharing, tack advice, and everyday care for horse keepers and riders.",
    category: "Horses",
    activity: "Active this week",
    access: "Open to join",
    steward: "Community-run",
    logo: LOGOS.horse,
  },
  {
    id: "shelter-medicine",
    name: "Shelter Medicine Professionals",
    description: "Case discussion and continuing education for clinicians working in shelters.",
    category: "Professional",
    activity: "Active this week",
    access: "Request required",
    steward: "Professional-led",
    logo: LOGOS.vet,
  },
  {
    id: "puppy-basics",
    name: "Puppy Socialisation Basics",
    description: "Early socialisation plans and reward-based habits for the first six months.",
    category: "Training & Behavior",
    activity: "Active this week",
    access: "Open to join",
    steward: "Community-run",
    logo: LOGOS.dogTraining,
  },
  {
    id: "memorial-circle",
    name: "Pet Loss & Memorial Circle",
    description: "A moderated space for remembrance, grief support, and tribute pages.",
    category: "Memorial & Support",
    activity: "Active this week",
    access: "Open to join",
    steward: "Community-run",
  },
];

/** How many the grid shows before "Load more communities". */
export const PAGE_SIZE = 9;
