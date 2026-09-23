/**
 * Sample emergency-care listings for the landing page. The landing site has no
 * provider directory, so these are fixed; the first three are the ones the
 * design shows, the rest appear behind "Load more results".
 */

const IMG = "/market-emergency-vet-care/";

export const CITY = "San Francisco, CA";

export const SPECIES = ["Dogs", "Cats", "Exotic pets"] as const;
export const CARE_TYPES = ["Emergency surgery", "Trauma care", "Internal medicine"] as const;
export const PATIENT_STATUS = ["Accepting now", "Status unknown"] as const;

export type Species = (typeof SPECIES)[number];
export type CareType = (typeof CARE_TYPES)[number];

export type Provider = {
  id: string;
  name: string;
  area: string;
  miles: number;
  /** "24-hour facility" or the listed opening hours. */
  hours: string;
  /** Undefined when the listing hasn't said. */
  acceptingNew?: boolean;
  species: readonly Species[];
  care: readonly CareType[];
  /** Tags in the order the design prints them. */
  tags: readonly string[];
  phone: string;
  image: string;
  imageAlt: string;
};

export const PROVIDERS: readonly Provider[] = [
  {
    id: "emergency-vet-care-sf",
    name: "Emergency Vet Care SF",
    area: "Mission District",
    miles: 0.3,
    hours: "24-hour facility",
    acceptingNew: true,
    species: ["Dogs", "Cats"],
    care: ["Emergency surgery", "Trauma care"],
    tags: ["Emergency surgery", "Trauma care", "Dogs & cats"],
    phone: "(415) 555-0001",
    image: `${IMG}emergency-vet-care-sf.webp`,
    imageAlt: "Two vets bandaging a German Shepherd puppy's paw",
  },
  {
    id: "pacific-animal-hospital",
    name: "Pacific Animal Hospital",
    area: "Financial District",
    miles: 0.8,
    hours: "Open: 7am–11pm",
    acceptingNew: true,
    species: ["Dogs"],
    care: ["Emergency surgery", "Trauma care"],
    tags: ["Emergency care", "Orthopedic surgery", "Dogs"],
    phone: "(415) 555-0002",
    image: `${IMG}pacific-animal-hospital.webp`,
    imageAlt: "Two vets and an owner with a husky in an exam room",
  },
  {
    id: "bay-area-emergency-vet",
    name: "Bay Area Emergency Vet",
    area: "SoMa",
    miles: 1.2,
    hours: "24-hour facility",
    species: ["Dogs", "Cats", "Exotic pets"],
    care: ["Emergency surgery", "Internal medicine"],
    tags: ["Emergency surgery", "Internal medicine", "All species"],
    phone: "(415) 555-0003",
    image: `${IMG}bay-area-emergency-vet.webp`,
    imageAlt: "A vet listening to a cat's chest with a stethoscope",
  },
  {
    id: "golden-gate-emergency",
    name: "Golden Gate Emergency Clinic",
    area: "Presidio Heights",
    miles: 2.1,
    hours: "24-hour facility",
    acceptingNew: true,
    species: ["Dogs", "Cats"],
    care: ["Emergency surgery", "Internal medicine"],
    tags: ["Emergency surgery", "Internal medicine", "Dogs & cats"],
    phone: "(415) 555-0004",
    image: `${IMG}golden-gate-emergency.webp`,
    imageAlt: "A vet fitting a recovery cone on a dog",
  },
  {
    id: "richmond-urgent-care",
    name: "Richmond Urgent Pet Care",
    area: "Inner Richmond",
    miles: 2.7,
    hours: "Open: 8am–12am",
    acceptingNew: true,
    species: ["Dogs"],
    care: ["Emergency surgery", "Trauma care"],
    tags: ["Urgent care", "Trauma care", "Dogs"],
    phone: "(415) 555-0005",
    image: `${IMG}richmond-urgent-care.webp`,
    imageAlt: "A vet holding a French Bulldog",
  },
  {
    id: "sunset-pet-er",
    name: "Sunset Pet ER",
    area: "Sunset District",
    miles: 3.4,
    hours: "Open: 6pm–8am",
    species: ["Dogs", "Cats", "Exotic pets"],
    care: ["Emergency surgery", "Trauma care"],
    tags: ["After-hours emergency", "Trauma care", "All species"],
    phone: "(415) 555-0006",
    image: `${IMG}sunset-pet-er.webp`,
    imageAlt: "A vet examining a rabbit",
  },
];

/** Digits-only form of a listing's phone number, for tel: links. */
export function telHref(phone: string) {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}
