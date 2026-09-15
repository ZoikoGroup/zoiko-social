/** One animal in the Animals for Adoption preview grid. */
export type Listing = {
  /** Stable key, and the id the Save toggle stores. */
  id: string;
  name: string;
  /** Species · age · location, exactly as the comp sets it. */
  meta: string;
  /** The organization that listed the animal. */
  listedBy: string;
  image: string;
  /** Alt text — the cards are not decorative, they identify an animal. */
  alt: string;

  /**
   * Profile fields, shown only in the View Profile popup. The card itself
   * still shows just what the comp puts on it.
   */
  status: string;
  species: string;
  age: string;
  sex: string;
  /** The fuller location the profile shows, rather than the card's short form. */
  location: string;
  goodWith: string;
  fee: string;
  about: string;
};

/**
 * The eight listings in the comp. This is a preview grid, so it is a fixed
 * set rather than a feed; the complete, filterable list lives on the Animals
 * for Adoption page.
 */
export const LISTINGS: readonly Listing[] = [
  {
    id: "biscuit",
    name: "Biscuit",
    meta: "Dog · 2 yrs · Sacramento, CA",
    listedBy: "Downtown Humane Society",
    image: "/adopt/biscuit.webp",
    alt: "A volunteer kneeling beside a white and brown hound.",
    status: "Available",
    species: "Dog",
    age: "2 years",
    sex: "Male",
    location: "Sacramento, CA (city area)",
    goodWith: "Other dogs, older children",
    fee: "$125",
    about:
      "Biscuit is a friendly, food-motivated dog who enjoys long walks and settling in for naps afterward. Downtown Humane Society reports he's still learning basic leash manners and would do well with a patient household.",
  },
  {
    id: "mochi",
    name: "Mochi",
    meta: "Cat · 1 yr · Austin, TX",
    listedBy: "Feline Foster Network",
    image: "/adopt/mochi.webp",
    alt: "A tabby cat resting on a wooden chair.",
    status: "Available",
    species: "Cat",
    age: "1 year",
    sex: "Female",
    location: "Austin, TX (city area)",
    goodWith: "Other cats, older children",
    fee: "$90",
    about:
      "Mochi is a curious young tabby who follows her foster carers from room to room. Feline Foster Network reports she is litter-trained and settles quickly once she knows a space.",
  },
  {
    id: "rocket",
    name: "Rocket",
    meta: "Dog · 4 yrs · Portland, OR",
    listedBy: "Northside Animal Shelter",
    image: "/adopt/rocket.webp",
    alt: "A black and white spotted dog standing against a stone wall.",
    status: "Available",
    species: "Dog",
    age: "4 years",
    sex: "Male",
    location: "Portland, OR (city area)",
    goodWith: "Other dogs, teenagers",
    fee: "$150",
    about:
      "Rocket is an energetic dog who needs a household that can give him a proper run each day. Northside Animal Shelter reports he walks well on a lead and knows his basic commands.",
  },
  {
    id: "willow",
    name: "Willow",
    meta: "Rabbit · 8 mo · Chicago, IL",
    listedBy: "Backyard Litter Foster Circle",
    image: "/adopt/willow.webp",
    alt: "A cream rabbit sitting in a wooden box by a window.",
    status: "Available",
    species: "Rabbit",
    age: "8 months",
    sex: "Female",
    location: "Chicago, IL (city area)",
    goodWith: "Other rabbits, older children",
    fee: "$60",
    about:
      "Willow is a young rabbit who is happiest with company and a space she can explore. Backyard Litter Foster Circle reports she is used to being handled and would prefer to be rehomed with a companion.",
  },
  {
    id: "duke",
    name: "Duke",
    meta: "Dog · 6 yrs · Seattle, WA",
    listedBy: "Regional Farm Sanctuary",
    image: "/adopt/duke.webp",
    alt: "A black and tan dog sitting indoors beside a tabby cat.",
    status: "Available",
    species: "Dog",
    age: "6 years",
    sex: "Male",
    location: "Seattle, WA (city area)",
    goodWith: "Cats, other dogs, children",
    fee: "$110",
    about:
      "Duke is a calm, settled dog who has lived alongside cats and other dogs. Regional Farm Sanctuary reports he is house-trained and content with a steady daily routine.",
  },
  {
    id: "pepper",
    name: "Pepper",
    meta: "Cat · 3 yrs · Nairobi, KE",
    listedBy: "Downtown Humane Society",
    image: "/adopt/pepper.webp",
    alt: "A white cat watching a grey kitten across a kitchen floor.",
    status: "Available",
    species: "Cat",
    age: "3 years",
    sex: "Female",
    location: "Nairobi, KE (city area)",
    goodWith: "Other cats, older children",
    fee: "Ask the shelter",
    about:
      "Pepper is an independent cat who likes her own space before she comes to say hello. Downtown Humane Society reports she is healthy, litter-trained, and used to sharing a home with other cats.",
  },
  {
    id: "scout",
    name: "Scout",
    meta: "Dog · 1 yr · Manchester, UK",
    listedBy: "Coastal Wildlife Shelter",
    image: "/adopt/scout.webp",
    alt: "A close-up of a young tan and white puppy.",
    status: "Available",
    species: "Dog",
    age: "1 year",
    sex: "Male",
    location: "Manchester, UK (city area)",
    goodWith: "Other dogs, older children",
    fee: "£95",
    about:
      "Scout is a young dog still learning the basics and eager to please. Coastal Wildlife Shelter reports he is playful, sociable with other dogs, and would suit an active household.",
  },
  {
    id: "clover",
    name: "Clover",
    meta: "Cat · 5 yrs · Manila, PH",
    listedBy: "Feline Foster Network",
    image: "/adopt/clover.webp",
    alt: "A record player and a feather on a wooden floor.",
    status: "Available",
    species: "Cat",
    age: "5 years",
    sex: "Female",
    location: "Manila, PH (city area)",
    goodWith: "Quiet adult households",
    fee: "Ask the shelter",
    about:
      "Clover is a gentle, quiet cat who prefers a calm home without much coming and going. Feline Foster Network reports she is healthy and affectionate once she has settled.",
  },
];
