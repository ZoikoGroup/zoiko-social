/**
 * Sample clinic and hospital listings for the landing page, as the design
 * shows them. The landing site has no provider directory, so these are fixed.
 */

const IMG = "/market-clinics-hospitals/";

export const CITY = "San Francisco, CA";

export const SPECIES = ["Dogs", "Cats", "Exotic"] as const;
export const FACILITY_TYPES = ["Hospital", "Clinic", "Specialty"] as const;
export const SERVICES = ["Emergency", "Preventive", "Surgery", "Dental"] as const;

export type FacilityType = (typeof FACILITY_TYPES)[number];

export type Facility = {
  id: string;
  name: string;
  type: FacilityType;
  /** Veterinarians on staff; shown in the orange badge on the photo. */
  teamSize: number;
  team: string;
  /** Tags in the order the design prints them. */
  tags: readonly string[];
  area: string;
  miles: number;
  hours: string;
  /** Undefined when the listing hasn't said. */
  acceptingNew?: boolean;
  image: string;
  imageAlt: string;
};

export const FEATURED = {
  name: "Marina Veterinary Clinic",
  vets: 6,
  years: 18,
  area: "Marina District",
  description:
    "Marina Vet is a full-service animal clinic with a team of experienced veterinarians specializing in preventive care, surgery, and dental services for dogs and cats. Known for compassionate care and modern facilities.",
  tags: ["General wellness", "Surgery", "Dental care", "Lab work"],
  image: `${IMG}marina-featured.webp`,
  imageAlt: "A veterinarian fitting a cone on a white dog",
};

export const FACILITIES: readonly Facility[] = [
  {
    id: "bay-view",
    name: "Bay View Animal Hospital",
    type: "Hospital",
    teamSize: 4,
    team: "Dr. Chen, Dr. Patel, Dr. Kim, Dr. Garcia",
    tags: ["Dogs", "Cats", "Emergency"],
    area: "Mission District",
    miles: 1.2,
    hours: "Mon–Fri: 8am–8pm | Sat–Sun: 9am–6pm",
    acceptingNew: true,
    image: `${IMG}bay-view.webp`,
    imageAlt: "Two veterinarians examining a husky on an exam table",
  },
  {
    id: "golden-gate",
    name: "Golden Gate Veterinary Clinic",
    type: "Clinic",
    teamSize: 3,
    team: "Dr. Lopez, Dr. Anderson, Dr. Thompson",
    tags: ["Dogs", "Cats", "Preventive"],
    area: "Richmond District",
    miles: 2.5,
    hours: "Mon–Fri: 9am–6pm | Sat: 10am–4pm",
    acceptingNew: true,
    image: `${IMG}golden-gate.webp`,
    imageAlt: "A veterinarian talking with a dog owner in an exam room",
  },
  {
    id: "pacific-specialty",
    name: "Pacific Specialty Animal Care",
    type: "Specialty",
    teamSize: 5,
    team: "Dr. Martinez, Dr. Wu, Dr. Yamamoto, +2 more",
    tags: ["Dogs", "Exotic", "Surgery"],
    area: "SOMA",
    miles: 3.1,
    hours: "By appointment | Emergency 24/7",
    image: `${IMG}pacific-specialty.webp`,
    imageAlt: "A veterinarian examining a rabbit",
  },
  {
    id: "sunset-associates",
    name: "Sunset Veterinary Associates",
    type: "Clinic",
    teamSize: 2,
    team: "Dr. Silva, Dr. Nguyen",
    tags: ["Cats", "Preventive", "Dental"],
    area: "Sunset District",
    miles: 4.2,
    hours: "Mon–Fri: 10am–7pm | Sat: 10am–3pm",
    acceptingNew: true,
    image: `${IMG}sunset-associates.webp`,
    imageAlt: "A veterinarian holding a small dog in a clinic office",
  },
];
