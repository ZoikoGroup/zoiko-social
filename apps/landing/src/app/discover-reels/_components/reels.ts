import { REEL_MEDIA, SOURCE_AVATARS } from "./images";

export const TOPICS = ["Dogs", "Cats", "Wildlife", "Expert", "Rescue"] as const;
export type Topic = (typeof TOPICS)[number];

export type Reel = {
  id: string;
  media: string;
  alt: string;
  source: {
    name: string;
    avatar?: string;
    /** Shown under the name inside the player, e.g. "Community · Verified". */
    kind: string;
    /** Shown in the rail, e.g. "45.2k members · Verified Community". */
    stats: string;
    description: string;
  };
  caption: string;
  tags: string[];
  /** Topics the Tune panel filters on. */
  topics: Topic[];
  likes: number;
  comments: number;
  why: string;
  /** Seconds of footage, which drives the progress bar. */
  seconds: number;
  /** Fraction already watched, so the bar resumes where the viewer left off. */
  resumeAt?: number;
};

/** The first reel is the comp's; the rest use stand-in media (see images.ts). */
export const REELS: Reel[] = [
  {
    id: "goldens-park-meetup",
    media: REEL_MEDIA.goldensPark,
    alt: "A golden retriever and a golden retriever puppy sitting in a park",
    source: {
      name: "Golden Retriever Guardians",
      avatar: SOURCE_AVATARS.goldenRetrieverGuardians,
      kind: "Community · Verified",
      stats: "45.2k members · Verified Community",
      description: "A global community dedicated to Golden Retriever care, training, and adoption.",
    },
    caption: "Saturday park meetup highlights — 40 goldens showed up! 🐾",
    tags: ["Dogs", "Community"],
    topics: ["Dogs"],
    likes: 842,
    comments: 63,
    why: "You're seeing this because you follow Golden Retriever Guardians and often watch community reels.",
    seconds: 15,
    resumeAt: 1 / 3,
  },
  {
    id: "foster-kitten-first-week",
    media: REEL_MEDIA.catBandana,
    alt: "A cat in a yellow bandana, mouth open mid-meow",
    source: {
      name: "London Cat Rescue Coalition",
      avatar: SOURCE_AVATARS.londonCatRescue,
      kind: "Community · Verified",
      stats: "8.4k members · Verified Community",
      description: "Coordinating rescue, foster, and adoption across London.",
    },
    caption: "Week one in foster: from hiding under the sofa to demanding breakfast.",
    tags: ["Cats", "Rescue"],
    topics: ["Cats", "Rescue"],
    likes: 516,
    comments: 41,
    why: "You're seeing this because you often watch rescue and foster reels.",
    seconds: 18,
  },
  {
    id: "senior-dog-hydration",
    media: REEL_MEDIA.puppy,
    alt: "An Australian shepherd puppy with one blue eye",
    source: {
      name: "Verified Vets Network",
      avatar: SOURCE_AVATARS.verifiedVets,
      kind: "Professional-led · Verified",
      stats: "14.3k members · Verified Professionals",
      description: "Licensed veterinarians sharing practical, evidence-led care advice.",
    },
    caption: "A 60-second check for dehydration you can do at home.",
    tags: ["Dogs", "Expert"],
    topics: ["Dogs", "Expert"],
    likes: 1204,
    comments: 88,
    why: "You're seeing this because it's from a verified veterinary source.",
    seconds: 60,
  },
  {
    id: "field-report-big-cats",
    media: REEL_MEDIA.lion,
    alt: "A lion walking past a tree on open grass",
    source: {
      name: "Wildlife Photographers United",
      avatar: SOURCE_AVATARS.wildlifePhotographers,
      kind: "Community · Verified",
      stats: "22.1k members · Verified Community",
      description: "Ethical wildlife photography, shot from a safe distance.",
    },
    caption: "Shot from 200 metres with a long lens — no baiting, no crowding.",
    tags: ["Wildlife"],
    topics: ["Wildlife"],
    likes: 2310,
    comments: 147,
    why: "You're seeing this because it's widely watched in wildlife communities.",
    seconds: 22,
  },
  {
    id: "panda-release-prep",
    media: REEL_MEDIA.panda,
    alt: "A giant panda eating bamboo",
    source: {
      name: "Global Wildlife Rescue Network",
      avatar: SOURCE_AVATARS.globalWildlifeRescue,
      kind: "Organization · Verified",
      stats: "31.6k followers · Verified Organization",
      description: "Coordinating wildlife rescue and rehabilitation across borders.",
    },
    caption: "Feeding time at the rehabilitation centre ahead of next month's release.",
    tags: ["Wildlife", "Rescue"],
    topics: ["Wildlife", "Rescue"],
    likes: 1788,
    comments: 102,
    why: "You're seeing this because you follow wildlife rescue updates.",
    seconds: 20,
  },
  {
    id: "recall-training-field",
    media: REEL_MEDIA.goldenMeadow,
    alt: "A golden retriever standing in a sunlit meadow",
    source: {
      name: "Calm Paws Training",
      kind: "Professional-led · Verified",
      stats: "9.2k members · Verified Professionals",
      description: "Force-free training for puppies and rescue dogs.",
    },
    caption: "Recall training in an open field, step by step.",
    tags: ["Dogs", "Expert"],
    topics: ["Dogs", "Expert"],
    likes: 694,
    comments: 52,
    why: "You're seeing this because you often watch training reels.",
    seconds: 30,
  },
];

/** Compact count, as the action rail shows it: 842, 1.2k. */
export const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
