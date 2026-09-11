/**
 * Metro areas offered by the region picker, and the communities in each.
 *
 * Areas are deliberately coarse — a metro area, never a street or a
 * coordinate — which is what the page promises: region selection is coarse
 * by default and never inferred from the device or IP. Every area carries its
 * state and country, because several share a name (two Portlands, two
 * Manchesters) and the picker must never mix them up.
 */

const img = (name: string) => `/discover-near-you/${name}.webp`;

export const SPECIES = ["Dogs", "Cats", "Wildlife", "Horses", "Reptiles", "Birds", "Farm animals"] as const;
export const PURPOSES = [
  "Rescue & foster",
  "Training & care",
  "Meetups",
  "Conservation",
  "Professional",
  "Memorial & support",
] as const;
export const TRUST = ["Verified Community", "Moderated", "Open to join"] as const;

export type Species = (typeof SPECIES)[number];
export type Purpose = (typeof PURPOSES)[number];
export type Trust = (typeof TRUST)[number];

export type Badge = "Verified Community" | "Moderated" | "Organization-led" | "Professional-led";

/**
 * Where a community says it is. Sensitive rescue, foster and wildlife
 * communities never show their area: they show a broadened region, or
 * "Location protected", as the page's banner explains.
 */
export type Place =
  | { kind: "area" }
  | { kind: "broadened"; label: string }
  | { kind: "protected" };

/**
 * The viewer's standing with a community. The comp shows every state at
 * once, so some communities start mid-way through (requested, joined).
 */
export type JoinState = "open" | "request" | "requested" | "joined" | "paused";

export type Community = {
  id: string;
  name: string;
  /** Omitted where no photo was supplied; the card shows the brand gradient. */
  cover?: string;
  logo?: string;
  place: Place;
  description: string;
  badges: Badge[];
  species: Species[];
  purposes: Purpose[];
  members: string;
  activity: string;
  join: JoinState;
};

export type Region = {
  id: string;
  /** e.g. "Portland area". */
  name: string;
  /** e.g. "Oregon, United States". */
  area: string;
  /** Listed so people know it's coming, but not selectable yet. */
  unsupported?: boolean;
  communities: Community[];
  /** The broader region behind "Show more communities across …". */
  wider?: { label: string; communities: Community[] };
};

/** How a chosen region is written back on the page. */
export const regionLabel = (r: Region) => `${r.name}, ${r.area}`;

/** Shorthand for the many small communities below. */
const c = (
  id: string,
  name: string,
  description: string,
  species: Species[],
  purposes: Purpose[],
  rest: Partial<Omit<Community, "id" | "name" | "description" | "species" | "purposes">> = {},
): Community => ({
  id,
  name,
  description,
  species,
  purposes,
  place: { kind: "area" },
  badges: [],
  members: "1k members",
  activity: "Active this week",
  join: "open",
  ...rest,
});

/** The ten communities from the comp. */
const SACRAMENTO: Community[] = [
  c("sac-golden-meetup", "Sacramento Golden Retriever Meetup",
    "Weekly meetups, hikes, and playdates for golden retriever owners around Sacramento.",
    ["Dogs"], ["Meetups"],
    { cover: img("cover-golden-retriever-meetup"), logo: img("logo-golden-retriever-meetup"), members: "1.2k members" }),
  c("sac-valley-wildlife", "Sac Valley Wildlife Rescue",
    "Public updates and volunteer coordination for regional wildlife rescue and rehabilitation.",
    ["Wildlife"], ["Rescue & foster"],
    { cover: img("cover-wildlife-rescue-bats"), logo: img("logo-wildlife-rescue"),
      place: { kind: "broadened", label: "Northern California" },
      badges: ["Verified Community", "Organization-led"], members: "3.4k members", activity: "Active today", join: "request" }),
  c("riverside-feline-foster", "Riverside Feline Foster Network",
    "Coordinates foster placements for cats and kittens; foster home locations are never shown.",
    ["Cats"], ["Rescue & foster"],
    { cover: img("cover-feline-foster"), logo: img("logo-feline-foster"), place: { kind: "protected" },
      badges: ["Verified Community", "Moderated"], members: "860 members", activity: "Active today", join: "requested" }),
  c("capital-city-trainers", "Capital City Dog Trainers Collective",
    "A professional-led network sharing reward-based training resources and local classes.",
    ["Dogs"], ["Training & care", "Professional"],
    { cover: img("cover-dog-trainers"), logo: img("logo-dog-trainers"),
      badges: ["Verified Community", "Professional-led"], members: "2.1k members", join: "joined" }),
  c("sac-reptiles-exotics", "Sacramento Reptile & Exotics Club",
    "Habitat builds, husbandry advice, and meetups for reptile and exotic-pet keepers.",
    ["Reptiles"], ["Meetups"],
    { cover: img("cover-reptiles"), logo: img("logo-reptiles"), members: "540 members", activity: "Active this month" }),
  c("delta-equine", "Delta Horse & Equine Support",
    "Organization-led group supporting equine rescue, rehabilitation, and trail-riding meetups.",
    ["Horses"], ["Rescue & foster", "Meetups"],
    { logo: img("logo-equine"), badges: ["Organization-led"], members: "770 members" }),
  c("river-city-birds", "River City Bird Watchers",
    "Guided walks and habitat-conservation projects for local birdwatchers.",
    ["Birds"], ["Conservation", "Meetups"],
    { cover: img("cover-bird-watchers"), logo: img("logo-bird-watchers"), badges: ["Moderated"], members: "1.5k members", join: "joined" }),
  c("sac-vet-tech", "Sacramento Area Vet Tech Network",
    "A professional community for veterinary technicians to share resources and local CE events.",
    ["Dogs", "Cats"], ["Professional"],
    { cover: img("cover-vet-tech"), logo: img("logo-vet-tech"),
      badges: ["Verified Community", "Professional-led"], members: "410 members", activity: "Active today", join: "request" }),
  c("foothill-farm", "Foothill Farm Sanctuary Volunteers",
    "Volunteer coordination for a local farm sanctuary. Currently paused for new members.",
    ["Farm animals"], ["Rescue & foster"],
    { cover: img("cover-farm-sanctuary"), logo: img("logo-farm-sanctuary"),
      badges: ["Organization-led"], members: "690 members", activity: "Paused", join: "paused" }),
  c("companion-loss", "Companion Loss & Pet Memorial Support",
    "A moderated, gentle space to share memories and support one another through pet loss.",
    [], ["Memorial & support"],
    { cover: img("cover-memorial"), logo: img("logo-memorial"), badges: ["Moderated"], members: "980 members" }),
];

export const REGIONS: Region[] = [
  {
    id: "sacramento-ca",
    name: "Sacramento area",
    area: "California, United States",
    communities: SACRAMENTO,
    wider: {
      label: "California",
      communities: [
        c("bay-area-parrots", "Bay Area Parrot Rescue", "Rehoming and enrichment support for parrots and other companion birds.",
          ["Birds"], ["Rescue & foster"], { place: { kind: "broadened", label: "Bay Area" }, badges: ["Verified Community"], members: "2.6k members", join: "request" }),
        c("central-valley-horses", "Central Valley Horse Rescue", "Coordinating rescue, foster barns, and adoption for horses across the valley.",
          ["Horses"], ["Rescue & foster"], { place: { kind: "broadened", label: "Central Valley" }, badges: ["Organization-led"], members: "1.9k members" }),
      ],
    },
  },
  {
    id: "portland-or",
    name: "Portland area",
    area: "Oregon, United States",
    communities: [
      c("pdx-dog-park", "Portland Dog Park Regulars", "Park meetups and off-leash etiquette for Portland dog owners.",
        ["Dogs"], ["Meetups"], { badges: ["Moderated"], members: "6.3k members" }),
      c("gorge-trail-dogs", "Columbia Gorge Trail Dogs", "Group hikes and trail safety for dogs and their people.",
        ["Dogs"], ["Meetups"], { members: "2.1k members" }),
      c("willamette-cat-foster", "Willamette Cat Foster Network", "Foster placements for cats and kittens; foster homes are never shown.",
        ["Cats"], ["Rescue & foster"], { place: { kind: "protected" }, badges: ["Verified Community", "Moderated"], members: "1.4k members", join: "request" }),
    ],
    wider: {
      label: "Oregon",
      communities: [
        c("oregon-coast-seabirds", "Oregon Coast Seabird Watch", "Seabird counts and nesting-season conservation along the coast.",
          ["Birds", "Wildlife"], ["Conservation"], { place: { kind: "broadened", label: "Oregon Coast" }, members: "1.1k members" }),
      ],
    },
  },
  {
    id: "portland-me",
    name: "Portland area",
    area: "Maine, United States",
    communities: [
      c("casco-bay-pets", "Casco Bay Pet Owners", "Local meetups and shared advice for pet owners around Casco Bay.",
        ["Dogs", "Cats"], ["Meetups"], { members: "1.8k members" }),
      c("maine-seal-watch", "Maine Coast Seal Watch", "Reporting and protecting stranded seals; sighting spots are never shared.",
        ["Wildlife"], ["Conservation", "Rescue & foster"], { place: { kind: "protected" }, badges: ["Verified Community"], members: "760 members", join: "request" }),
    ],
    wider: {
      label: "Maine",
      communities: [
        c("maine-farm-rescue", "Maine Farm Animal Rescue", "Sanctuary volunteering and rehoming for farm animals across the state.",
          ["Farm animals"], ["Rescue & foster"], { place: { kind: "broadened", label: "Southern Maine" }, badges: ["Organization-led"], members: "640 members" }),
      ],
    },
  },
  {
    id: "austin-tx",
    name: "Austin area",
    area: "Texas, United States",
    communities: [
      c("austin-rescue-dogs", "Austin Rescue Dog Meetups", "Socialisation meetups for rescue dogs and their adopters.",
        ["Dogs"], ["Meetups", "Rescue & foster"], { badges: ["Verified Community"], members: "7.2k members" }),
      c("hill-country-horses", "Hill Country Horse Keepers", "Care, farriers, and trail rides for horse keepers in the hills.",
        ["Horses"], ["Training & care", "Meetups"], { members: "1.9k members" }),
      c("central-texas-wildlife", "Central Texas Wildlife Rescue", "Volunteer coordination for regional wildlife rescue and rehabilitation.",
        ["Wildlife"], ["Rescue & foster"], { place: { kind: "broadened", label: "Central Texas" }, badges: ["Verified Community", "Organization-led"], members: "1.1k members", join: "request" }),
    ],
    wider: {
      label: "Texas",
      communities: [
        c("texas-reptile-keepers", "Texas Reptile Keepers", "Husbandry advice and responsible-keeping standards for reptile owners.",
          ["Reptiles"], ["Training & care"], { place: { kind: "broadened", label: "Texas" }, badges: ["Moderated"], members: "3.0k members" }),
      ],
    },
  },
  {
    id: "chicago-il",
    name: "Chicago area",
    area: "Illinois, United States",
    communities: [
      c("lakefront-dog-walkers", "Chicago Lakefront Dog Walkers", "Early walks and meetups along the lakefront paths.",
        ["Dogs"], ["Meetups"], { members: "8.9k members" }),
      c("windy-city-cat-cafe", "Windy City Cat Cafe Club", "Cat cafe visits, adoption days, and enrichment tips.",
        ["Cats"], ["Meetups"], { badges: ["Moderated"], members: "3.3k members" }),
      c("chicagoland-foster", "Chicagoland Foster Network", "Foster coordination for dogs and cats; homes are never shown.",
        ["Dogs", "Cats"], ["Rescue & foster"], { place: { kind: "protected" }, badges: ["Verified Community", "Moderated"], members: "2.4k members", join: "request" }),
    ],
    wider: {
      label: "Illinois",
      communities: [
        c("illinois-vet-network", "Illinois Veterinary Network", "Continuing education and case discussion for veterinary professionals.",
          ["Dogs", "Cats"], ["Professional"], { place: { kind: "broadened", label: "Illinois" }, badges: ["Verified Community", "Professional-led"], members: "1.7k members", join: "request" }),
      ],
    },
  },
  {
    id: "seattle-wa",
    name: "Seattle area",
    area: "Washington, United States",
    communities: [
      c("pnw-pet-meetups", "Pacific Northwest Pet Meetups", "Weekend walks, park meetups, and local events across the region.",
        ["Dogs", "Cats"], ["Meetups"], { badges: ["Verified Community"], members: "9.8k members" }),
      c("cascade-trail-dogs", "Cascade Trail Dogs", "Mountain hikes and trail etiquette for dogs and their people.",
        ["Dogs"], ["Meetups"], { members: "4.4k members" }),
      c("coastal-marine-rescue", "Coastal Marine Rescue Response", "Volunteer coordination for strandings and coastal wildlife callouts.",
        ["Wildlife"], ["Rescue & foster", "Conservation"], { place: { kind: "protected" }, badges: ["Verified Community"], members: "3.2k members", join: "request" }),
    ],
    wider: {
      label: "Washington",
      communities: [
        c("puget-sound-orca", "Puget Sound Orca Watchers", "Responsible whale-watching and orca conservation updates.",
          ["Wildlife"], ["Conservation"], { place: { kind: "broadened", label: "Puget Sound" }, badges: ["Moderated"], members: "5.1k members" }),
      ],
    },
  },
  {
    id: "manchester-uk",
    name: "Manchester area",
    area: "England, United Kingdom",
    communities: [
      c("manchester-greyhounds", "Manchester Greyhound Rehoming", "Rehoming retired racing greyhounds with local families.",
        ["Dogs"], ["Rescue & foster"], { badges: ["Organization-led"], members: "2.7k members", join: "request" }),
      c("peak-district-walkers", "Peak District Dog Walkers", "Group walks and countryside safety for dogs and walkers.",
        ["Dogs"], ["Meetups"], { members: "4.1k members" }),
      c("gm-cat-foster", "Greater Manchester Cat Foster", "Foster placements for cats and kittens; foster homes are never shown.",
        ["Cats"], ["Rescue & foster"], { place: { kind: "protected" }, badges: ["Verified Community", "Moderated"], members: "1.3k members", join: "request" }),
    ],
    wider: {
      label: "North West England",
      communities: [
        c("lake-district-birders", "Lake District Birders", "Birdwatching walks and upland habitat conservation.",
          ["Birds"], ["Conservation", "Meetups"], { place: { kind: "broadened", label: "Cumbria" }, members: "1.6k members" }),
      ],
    },
  },
  {
    id: "manchester-nh",
    name: "Manchester area",
    area: "New Hampshire, United States",
    communities: [
      c("granite-state-dogs", "Granite State Dog Owners", "Meetups and shared advice for dog owners around Manchester.",
        ["Dogs"], ["Meetups"], { members: "1.6k members" }),
      c("merrimack-rescue", "Merrimack Valley Rescue", "Rescue and foster coordination; foster homes are never shown.",
        ["Dogs", "Cats"], ["Rescue & foster"], { place: { kind: "protected" }, badges: ["Verified Community"], members: "820 members", join: "request" }),
    ],
    wider: {
      label: "New Hampshire",
      communities: [
        c("white-mountain-wildlife", "White Mountain Wildlife Watch", "Wildlife sightings and conservation updates from the mountains.",
          ["Wildlife"], ["Conservation"], { place: { kind: "broadened", label: "White Mountains" }, members: "1.2k members" }),
      ],
    },
  },
  {
    id: "nairobi-ke",
    name: "Nairobi area",
    area: "Nairobi County, Kenya",
    communities: [
      c("nairobi-welfare", "Nairobi Animal Welfare Volunteers", "Volunteer drives, clinics, and welfare education across the city.",
        ["Dogs", "Cats"], ["Rescue & foster"], { badges: ["Verified Community", "Organization-led"], members: "3.4k members" }),
      c("karura-dog-walkers", "Karura Forest Dog Walkers", "Group walks and trail etiquette in Karura Forest.",
        ["Dogs"], ["Meetups"], { members: "1.2k members" }),
      c("nairobi-orphan-care", "Nairobi Wildlife Orphan Care", "Updates and volunteer coordination for orphaned wildlife care.",
        ["Wildlife"], ["Rescue & foster", "Conservation"], { place: { kind: "protected" }, badges: ["Verified Community", "Organization-led"], members: "2.9k members", join: "request" }),
    ],
    wider: {
      label: "Kenya",
      communities: [
        c("rift-valley-birds", "Rift Valley Bird Watchers", "Lake-shore birdwatching and wetland conservation.",
          ["Birds"], ["Conservation", "Meetups"], { place: { kind: "broadened", label: "Rift Valley" }, members: "2.0k members" }),
      ],
    },
  },
  {
    id: "reykjavik-is",
    name: "Reykjavík area",
    area: "Iceland",
    unsupported: true,
    communities: [],
  },
];
