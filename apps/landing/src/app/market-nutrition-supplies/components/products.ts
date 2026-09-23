export const CATEGORIES = [
  "Food & Nutrition",
  "Treats",
  "Supplements",
  "Grooming & Care",
  "Toys & Play",
  "Furniture & Beds",
  "Accessories",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SPECIES = ["Dogs", "Cats"] as const;
/** "All Stages" products match every stage, so it is not a filter option. */
export const STAGES = ["Puppy", "Adult", "Senior"] as const;

/** The quick-filter tabs; each one covers one or more listing categories. */
export const TABS: readonly { label: string; icon: string; categories: readonly Category[] }[] = [
  { label: "Food & Nutrition", icon: "🍖", categories: ["Food & Nutrition", "Treats"] },
  { label: "Supplements", icon: "💊", categories: ["Supplements"] },
  { label: "Grooming & Care", icon: "🛁", categories: ["Grooming & Care"] },
  { label: "Toys & Play", icon: "🎾", categories: ["Toys & Play"] },
  { label: "Furniture & Beds", icon: "🏠", categories: ["Furniture & Beds"] },
];

export type Product = {
  id: string;
  name: string;
  category: Category;
  species: readonly (typeof SPECIES)[number][];
  /** A life stage, or "All Stages". */
  stage: (typeof STAGES)[number] | "All Stages";
  price: number;
  image: string;
  imageAlt: string;
  /** Card tags, when the design shows something other than species + stage. */
  tags?: readonly string[];
};

const IMG = "/market-nutrition-supplies";

export const PRODUCTS: readonly Product[] = [
  {
    id: "balanced-dog-food",
    name: "Balanced Nutrition Dog Food",
    category: "Food & Nutrition",
    species: ["Dogs"],
    stage: "Adult",
    price: 24.99,
    image: `${IMG}/dog-food.webp`,
    imageAlt: "A German Shepherd watching dry food pour into a steel bowl",
  },
  {
    id: "training-treats",
    name: "Natural Training Treats",
    category: "Treats",
    species: ["Dogs"],
    stage: "All Stages",
    price: 8.99,
    image: `${IMG}/training-treats.webp`,
    imageAlt: "A boy offering a treat to a sitting German Shepherd puppy in a park",
  },
  {
    id: "joint-support",
    name: "Joint Support Supplement",
    category: "Supplements",
    species: ["Dogs"],
    stage: "Senior",
    price: 32.99,
    image: `${IMG}/joint-support.webp`,
    imageAlt: "A husky puppy looking at a supplement chew held beside its tub",
  },
  {
    id: "premium-cat-nutrition",
    name: "Premium Cat Nutrition",
    category: "Food & Nutrition",
    species: ["Cats"],
    stage: "Adult",
    price: 19.99,
    image: `${IMG}/cat-food.webp`,
    imageAlt: "A ginger kitten eating dry food from a white bowl",
  },
  {
    id: "omega-3-fish-oil",
    name: "Omega-3 Fish Oil",
    category: "Supplements",
    species: ["Dogs", "Cats"],
    stage: "All Stages",
    price: 28.99,
    image: `${IMG}/fish-oil.webp`,
    tags: ["Dogs", "Cats"],
    imageAlt: "A woman reading the label on a bottle of fish oil capsules",
  },
  {
    id: "grooming-kit",
    name: "Complete Grooming Kit",
    category: "Grooming & Care",
    species: ["Dogs", "Cats"],
    stage: "All Stages",
    price: 45.99,
    image: `${IMG}/grooming-kit.webp`,
    tags: ["Dogs", "Cats"],
    imageAlt: "A fluffy dog being groomed on a table beside shampoo bottles",
  },
  {
    id: "puzzle-toy",
    name: "Interactive Puzzle Toy",
    category: "Toys & Play",
    species: ["Dogs"],
    stage: "All Stages",
    price: 14.99,
    image: `${IMG}/puzzle-toy.webp`,
    imageAlt: "A German Shepherd puppy lying on grass next to an orange ball",
  },
  {
    id: "organic-wet-food",
    name: "Organic Wet Food (Variety Pack)",
    category: "Food & Nutrition",
    species: ["Dogs"],
    stage: "Adult",
    price: 18.99,
    image: `${IMG}/wet-food.webp`,
    imageAlt: "A can of organic wet dog food with fresh ingredients and a dog behind it",
  },
  {
    id: "orthopedic-bed",
    name: "Orthopedic Dog Bed",
    category: "Furniture & Beds",
    species: ["Dogs"],
    stage: "Senior",
    price: 89.99,
    image: `${IMG}/dog-bed.webp`,
    imageAlt: "A golden retriever resting in a grey bolster bed",
  },
  {
    id: "puppy-growth-formula",
    name: "Puppy Growth Formula",
    category: "Food & Nutrition",
    species: ["Dogs"],
    stage: "Puppy",
    price: 26.99,
    image: `${IMG}/puppy-formula.webp`,
    imageAlt: "A golden retriever puppy on a kitchen counter behind a tub of formula",
  },
  {
    id: "senior-chews",
    name: "Senior-Friendly Chews",
    category: "Treats",
    species: ["Dogs"],
    stage: "Senior",
    price: 12.99,
    image: `${IMG}/senior-chews.webp`,
    imageAlt: "A West Highland terrier taking a biscuit from a hand",
  },
  {
    id: "safety-collar",
    name: "Reflective Safety Collar",
    category: "Accessories",
    species: ["Dogs"],
    stage: "All Stages",
    price: 16.99,
    image: `${IMG}/safety-collar.webp`,
    imageAlt: "A French Bulldog walking on a lead in a harness",
  },
];

export const FEATURED: readonly { tag: string; name: string; meta: string; image: string; imageAlt: string }[] = [
  {
    tag: "Featured",
    name: "Balanced Nutrition Dog Food",
    meta: "Dogs · Adult · Dry Food",
    image: `${IMG}/dog-food.webp`,
    imageAlt: "A German Shepherd watching dry food pour into a steel bowl",
  },
  {
    tag: "Popular",
    name: "Natural Training Treats",
    meta: "Dogs · All Stages · Treats",
    image: `${IMG}/featured-treats.webp`,
    imageAlt: "A boy offering a treat to a sitting German Shepherd puppy in a park",
  },
  {
    tag: "New",
    name: "Joint Support Supplement",
    meta: "Dogs · Senior · Supplement",
    image: `${IMG}/featured-joint-support.webp`,
    imageAlt: "A husky puppy looking at a supplement chew held beside its tub",
  },
];
