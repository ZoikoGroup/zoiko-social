/**
 * Sample veterinarian listings for the landing page, as the design shows them.
 *
 * The landing site has no provider directory to read from, so these are fixed.
 * The result count and the filters are derived from this list.
 */

const IMG = "/market-veterinarians/";

export const CITY = "New York, NY";

export const SPECIES = ["Dogs", "Cats", "Exotic Pets", "Avian", "Birds"] as const;
export const CARE_TYPES = ["Preventive", "Surgery", "Dental", "Diagnostics", "Behavior"] as const;

export type Species = (typeof SPECIES)[number];
export type CareType = (typeof CARE_TYPES)[number];

export type Vet = {
  id: string;
  name: string;
  role: string;
  /** Tags in the order the design prints them. */
  tags: readonly (Species | CareType)[];
  area: string;
  miles: number;
  /** Undefined when the listing hasn't said, shown as "Status unknown". */
  acceptingNew?: boolean;
  /** Open past 6 PM on at least one weekday; drives the Evening hours chip. */
  eveningHours: boolean;
  image: string;
  imageAlt: string;
};

export const VETS: readonly Vet[] = [
  {
    id: "sarah-chen",
    name: "Dr. Sarah Chen",
    role: "General Practice Veterinarian",
    tags: ["Dogs", "Cats", "Preventive"],
    area: "Manhattan",
    miles: 0.8,
    acceptingNew: true,
    eveningHours: false,
    image: `${IMG}sarah-chen.webp`,
    imageAlt: "Dr. Sarah Chen holding a rabbit",
  },
  {
    id: "james-rodriguez",
    name: "Dr. James Rodriguez",
    role: "Surgery Specialist",
    tags: ["Dogs", "Surgery", "Dental"],
    area: "Brooklyn",
    miles: 2.1,
    acceptingNew: true,
    eveningHours: true,
    image: `${IMG}vet-james-rodriguez.webp`,
    imageAlt: "Dr. James Rodriguez examining a dog with a stethoscope",
  },
  {
    id: "olivia-patel",
    name: "Dr. Olivia Patel",
    role: "Exotic Pet Specialist",
    tags: ["Exotic Pets", "Avian"],
    area: "Queens",
    miles: 3.2,
    acceptingNew: true,
    eveningHours: false,
    image: `${IMG}olivia-patel.webp`,
    imageAlt: "A veterinarian smiling while examining a long-haired cat",
  },
  {
    id: "marcus-johnson",
    name: "Dr. Marcus Johnson",
    role: "Internal Medicine Expert",
    tags: ["Dogs", "Cats", "Diagnostics"],
    area: "Bronx",
    miles: 4.5,
    eveningHours: false,
    image: `${IMG}vet-marcus-johnson.webp`,
    imageAlt: "Dr. Marcus Johnson holding a kitten",
  },
  {
    id: "elena-kowalski",
    name: "Dr. Elena Kowalski",
    role: "Behavioral Veterinarian",
    tags: ["Dogs", "Behavior"],
    area: "Manhattan",
    miles: 1.3,
    acceptingNew: true,
    eveningHours: true,
    image: `${IMG}vet-elena-kowalski.webp`,
    imageAlt: "Dr. Elena Kowalski examining a rabbit",
  },
  {
    id: "ana-silva",
    name: "Dr. Ana Silva",
    role: "General Practice Veterinarian",
    tags: ["Dogs", "Cats", "Birds"],
    area: "Brooklyn",
    miles: 2.7,
    acceptingNew: true,
    eveningHours: false,
    image: `${IMG}ana-silva.webp`,
    imageAlt: "Dr. Ana Silva with a horse",
  },
];
