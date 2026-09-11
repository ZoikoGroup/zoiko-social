import { APP_LINKS, appUrl } from "@/lib/app-links";
import { AVATARS, IMAGES } from "./images";

export const TABS = [
  "All",
  "Stories",
  "Posts",
  "Communities",
  "Live",
  "Events",
  "Expert / Professional",
  "Rescue & Welfare",
] as const;

export type Tab = (typeof TABS)[number];

/** The neutral chip naming what kind of item this is. Each has its own icon. */
export type Kind =
  | "Story"
  | "Post"
  | "Community discussion"
  | "Live"
  | "Rescue update"
  | "Expert update"
  | "Event";

/** Who an item comes from: a news source, or an account with an avatar. */
export type Author =
  | { type: "source"; name: string; detail: string }
  | {
      type: "account";
      name: string;
      detail: string;
      avatar: string;
      /** The account's call to action — most offer Follow, events offer RSVP. */
      action: "Follow" | "RSVP";
    };

export type Trend = {
  id: string;
  /** Tabs this item appears under, besides "All". */
  tabs: Exclude<Tab, "All">[];
  /** The single highlighted item at the top of the feed. */
  topTrend?: boolean;
  /** A leading status chip, shown before the kind chip. */
  lead?: "Emerging" | "Updated";
  kind: Kind;
  /** Why it is trending. `live` renders with the red broadcast dot. */
  signal?: { label: string; tone: "warm" | "live" };
  age?: string;
  author: Author;
  title?: string;
  body: string;
  media?:
    | { type: "image"; src: string; alt: string; aspect: string }
    /** Held behind a warning until the viewer chooses to reveal it. */
    | { type: "sensitive"; revealed: string };
  /** A correction notice for a story that has been updated since publishing. */
  note?: string;
  stats?: string;
  actions: {
    primary: { label: "Open" | "Join Live"; href: string };
    followTopic?: boolean;
    save?: boolean;
    share?: boolean;
    extra?: { label: string; href: string };
  };
};

/** A slot for an item that has since been withdrawn. Shown under "All" only. */
export type Removed = { id: string; removed: true };

export type FeedEntry = Trend | Removed;

export const isRemoved = (entry: FeedEntry): entry is Removed =>
  "removed" in entry;

const WORLD_ANIMAL_NEWS: Author = {
  type: "source",
  name: "World Animal News",
  detail: "Tier 1 Source · Verified",
};

export const FEED: FeedEntry[] = [
  {
    id: "wildlife-trade-policy",
    tabs: ["Stories", "Rescue & Welfare"],
    topTrend: true,
    kind: "Story",
    signal: { label: "Verified update", tone: "warm" },
    age: "2 hours ago",
    author: WORLD_ANIMAL_NEWS,
    title: "Major Policy Update on Wildlife Trade Enforcement",
    body: "International coalition strengthens measures to combat illegal wildlife trafficking across 47 nations.",
    media: {
      type: "image",
      src: IMAGES.panda,
      alt: "A giant panda eating bamboo",
      aspect: "aspect-[678/384]",
    },
    stats: "4 verified sources · 210 related posts",
    actions: {
      primary: { label: "Open", href: APP_LINKS.news },
      followTopic: true,
      save: true,
      share: true,
      extra: { label: "Discuss in Community", href: APP_LINKS.communities },
    },
  },
  {
    id: "golden-meetup",
    tabs: ["Posts", "Communities"],
    kind: "Community discussion",
    signal: { label: "Widely discussed", tone: "warm" },
    age: "3 hours ago",
    author: {
      type: "account",
      name: "Golden Retriever Guardians",
      detail: "Verified Community",
      avatar: AVATARS.goldenRetrieverGuardians,
      action: "Follow",
    },
    body: "Community meetup draws record turnout — 40 goldens and their humans showed up this weekend, with photos and stories pouring in all day.",
    media: {
      type: "image",
      src: IMAGES.goldenMeadow,
      alt: "A golden retriever standing in a sunlit meadow",
      aspect: "aspect-[678/509]",
    },
    stats: "128 reactions across the community · 24 comments",
    actions: {
      primary: { label: "Open", href: APP_LINKS.communities },
      save: true,
      share: true,
    },
  },
  {
    id: "ask-a-vet-live",
    tabs: ["Live", "Expert / Professional"],
    kind: "Live",
    signal: { label: "Live now", tone: "live" },
    author: {
      type: "account",
      name: "Verified Vets Network",
      detail: "Professional-led · Verified",
      avatar: AVATARS.verifiedVetsNetwork,
      action: "Follow",
    },
    body: "Live now: Ask-a-Vet session on senior dog nutrition — bring your questions for our panel of licensed veterinarians.",
    media: {
      type: "image",
      src: IMAGES.catBandana,
      alt: "A cat in a yellow bandana, mouth open mid-meow",
      aspect: "aspect-[678/384]",
    },
    actions: {
      primary: { label: "Join Live", href: APP_LINKS.communities },
      save: true,
    },
  },
  {
    id: "foster-record-month",
    tabs: ["Communities", "Rescue & Welfare"],
    kind: "Rescue update",
    signal: { label: "Popular in your network", tone: "warm" },
    age: "6 hours ago",
    author: {
      type: "account",
      name: "London Cat Rescue Coalition",
      detail: "Verified Community · London, UK area",
      avatar: AVATARS.londonCatRescue,
      action: "Follow",
    },
    body: "Record month for foster placements — three more kittens found loving foster homes this week, with more applications coming in daily.",
    stats: "64 related posts",
    actions: {
      primary: { label: "Open", href: APP_LINKS.communities },
      save: true,
      share: true,
      extra: { label: "Join Community", href: APP_LINKS.communities },
    },
  },
  {
    id: "canine-cognition-research",
    tabs: ["Stories", "Expert / Professional"],
    kind: "Expert update",
    signal: { label: "Growing quickly", tone: "warm" },
    age: "4 hours ago",
    author: WORLD_ANIMAL_NEWS,
    title: "New Research on Canine Cognitive Development",
    body: "Veterinary study reveals breakthrough findings on early socialization impacts.",
    actions: {
      primary: { label: "Open", href: APP_LINKS.news },
      save: true,
      share: true,
    },
  },
  {
    id: "snow-leopard-sighting",
    tabs: ["Posts", "Communities"],
    lead: "Emerging",
    kind: "Post",
    signal: { label: "Widely discussed", tone: "warm" },
    age: "1 day ago",
    author: {
      type: "account",
      name: "Wildlife Photographers United",
      detail: "Verified Community",
      avatar: AVATARS.wildlifePhotographers,
      action: "Follow",
    },
    body: "Rare snow leopard sighting captured from a safe distance in Nepal — field report and photos from our community's latest expedition.",
    media: {
      type: "image",
      src: IMAGES.lion,
      alt: "A lion walking past a tree on open grass",
      aspect: "aspect-[678/384]",
    },
    actions: {
      primary: { label: "Open", href: APP_LINKS.communities },
      save: true,
      share: true,
    },
  },
  {
    id: "adoption-day",
    tabs: ["Events", "Communities", "Rescue & Welfare"],
    kind: "Event",
    signal: { label: "Trending in your region", tone: "warm" },
    author: {
      type: "account",
      name: "London Cat Rescue Coalition",
      detail: "Community Adoption Day · Starts in 2 days",
      avatar: AVATARS.londonCatRescue,
      action: "RSVP",
    },
    body: "Community Adoption Day — Saturday, 11:00 AM–3:00 PM at Regent's Park. Meet adoptable cats and support local rescue volunteers.",
    media: {
      type: "image",
      src: IMAGES.puppy,
      alt: "An Australian shepherd puppy with one blue eye",
      aspect: "aspect-[678/384]",
    },
    actions: {
      primary: { label: "Open", href: appUrl("/events") },
      save: true,
      share: true,
    },
  },
  {
    id: "active-rescue-operation",
    tabs: ["Rescue & Welfare"],
    kind: "Rescue update",
    signal: { label: "Verified update", tone: "warm" },
    age: "5 hours ago",
    author: {
      type: "account",
      name: "Global Wildlife Rescue Network",
      detail: "Verified organization",
      avatar: AVATARS.globalWildlifeRescue,
      action: "Follow",
    },
    body: "An update from an active rescue operation — details in the post below.",
    media: {
      type: "sensitive",
      revealed:
        "Rescue teams reached the site this morning. Every animal recovered is now receiving veterinary care, and the operation remains under the partner organization's supervision. Further updates will follow as assessments are completed.",
    },
    actions: {
      primary: { label: "Open", href: APP_LINKS.communities },
      share: true,
    },
  },
  {
    id: "shelter-capacity-initiative",
    tabs: ["Stories", "Rescue & Welfare"],
    lead: "Updated",
    kind: "Story",
    signal: { label: "Verified update", tone: "warm" },
    age: "9 hours ago",
    author: WORLD_ANIMAL_NEWS,
    title: "Animal Shelter Capacity Initiative Launched",
    body: "National program aims to increase shelter resources and adoption rates.",
    note: "Updated 1 hour ago — funding figures corrected from an earlier version of this story.",
    actions: {
      primary: { label: "Open", href: APP_LINKS.news },
      save: true,
      share: true,
    },
  },
  { id: "withdrawn-item", removed: true },
];

/** The top trend, which the rail's "Why this is trending" card explains. */
export const TOP_TREND = FEED.find(
  (entry): entry is Trend => !isRemoved(entry) && entry.topTrend === true,
);
