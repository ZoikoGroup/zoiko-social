/**
 * Sample fundraisers for the landing page, as the design lists them.
 *
 * The landing site has no fundraiser feed, so these are fixed. The count line
 * and the chip filters are derived from this list.
 */

const IMG = "/events-fundraisers/";

export type Status = "live" | "goal-reached" | "under-review" | "closed" | "canceled";
export type Cause = "emergency" | "shelter" | "transport";

export type Fundraiser = {
  id: string;
  title: string;
  blurb: string;
  beneficiary: string;
  /** Present when the organizer differs from the beneficiary. */
  organizer?: string;
  /** Omitted when the fundraiser doesn't disclose its figures. */
  contributed?: string;
  goal?: string;
  location: string;
  /** Full transparency breakdown, shown in the detail popup when disclosed. */
  breakdown?: { pending: string; settled: string; disbursed: string; refunded: string };
  /** Latest organizer update, shown in the detail popup. */
  update?: string;
  status: Status;
  sponsored?: boolean;
  cause: Cause;
  image: string;
  imageAlt: string;
};

export const FUNDRAISERS: readonly Fundraiser[] = [
  {
    id: "flood-response",
    title: "Emergency Shelter Fundraiser: Flood Response",
    blurb: "Emergency care and temporary sheltering for animals displaced by regional flooding.",
    beneficiary: "Coastal Animal Rescue Network",
    contributed: "$8,240",
    goal: "$15,000",
    location: "Gulf Coast, USA (public region) · Online",
    status: "live",
    cause: "emergency",
    image: `${IMG}flood-response.webp`,
    imageAlt: "Two volunteers kneeling beside dogs in a shelter barn",
  },
  {
    id: "senior-dog-medical",
    title: "Medical Care Fund for Senior Rescue Dogs",
    blurb: "Ongoing veterinary care for senior dogs with chronic conditions in foster care.",
    beneficiary: "Downtown Humane Society",
    contributed: "$3,120",
    goal: "$6,000",
    location: "Sacramento, CA (public region) · Online",
    breakdown: { pending: "$0", settled: "$3,120", disbursed: "$2,800", refunded: "$0" },
    update: "Latest update: three dogs completed dental surgery this month.",
    status: "live",
    sponsored: true,
    cause: "emergency",
    image: `${IMG}senior-dog-medical.webp`,
    imageAlt: "A person comforting a black Labrador",
  },
  {
    id: "sanctuary-repair",
    title: "Sanctuary Facility Repair Drive",
    blurb: "Repairing barn and fencing infrastructure damaged in a recent storm.",
    beneficiary: "Regional Farm Sanctuary",
    contributed: "$4,150",
    goal: "$4,000",
    location: "Seattle, WA (public region) · Hybrid",
    status: "goal-reached",
    cause: "shelter",
    image: `${IMG}sanctuary-repair.webp`,
    imageAlt: "A cat resting in a wire enclosure",
  },
  {
    id: "wildlife-rehab",
    title: "Wildlife Rehabilitation Equipment Fund",
    blurb: "Purchasing enclosure and rehabilitation equipment for injured wildlife intake.",
    beneficiary: "Coastal Wildlife Shelter",
    contributed: "$1,900",
    goal: "$5,500",
    location: "Manchester, UK (public region) · Online",
    status: "under-review",
    cause: "shelter",
    image: `${IMG}wildlife-rehab.webp`,
    imageAlt: "Caretakers treating a sedated tiger",
  },
  {
    id: "community-care",
    title: "Community Animal Care Drive",
    blurb: "Supplying food and basic veterinary care for community and stray animals.",
    beneficiary: "City Shelter Volunteers Network",
    location: "Manila, PH (public region) · In-person",
    status: "live",
    cause: "shelter",
    image: `${IMG}community-care.webp`,
    imageAlt: "A man petting a dog beside a wooden fence",
  },
  {
    id: "rescue-transport",
    title: "Rescue Transport Network Support",
    blurb: "Fuel, vehicle maintenance, and driver support for a volunteer rescue-transport network.",
    beneficiary: "Regional Rescue Transport Collective",
    organizer: "Local Rescue Allies",
    contributed: "$3,000",
    goal: "$3,000",
    location: "Chicago, IL (public region) · Online",
    status: "closed",
    cause: "transport",
    image: `${IMG}rescue-transport.webp`,
    imageAlt: "A volunteer sitting in the open back of a transport van",
  },
  {
    id: "reptile-rescue",
    title: "Reptile Rescue Intake Support",
    blurb: "Habitat and quarantine setup costs for surrendered and seized reptiles.",
    beneficiary: "Reptile Rescue & Rehoming Network",
    contributed: "$640",
    goal: "$2,500",
    location: "National (public region) · Online",
    status: "canceled",
    cause: "shelter",
    image: `${IMG}reptile-rescue.webp`,
    imageAlt: "Hands holding two lizards",
  },
  {
    id: "kitten-nursery",
    title: "Foster Kitten Nursery Supplies",
    blurb: "Bottle-feeding and neonatal care supplies for a kitten foster network.",
    beneficiary: "Feline Foster Network",
    contributed: "$1,180",
    goal: "$2,000",
    location: "Austin, TX (public region) · Online",
    status: "live",
    cause: "shelter",
    image: `${IMG}kitten-nursery.webp`,
    imageAlt: "A person holding a ginger kitten",
  },
];
