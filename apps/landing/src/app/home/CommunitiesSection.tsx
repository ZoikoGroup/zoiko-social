"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Star,
  UserRound,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { IMAGES } from "./images";
import { C } from "./theme";
import { Chip, FilterPill, SectionHeading } from "./primitives";

/**
 * The two filter rows work together.
 *
 * The top row picks how you want to browse — by the species a community is
 * about, by where it meets, or by what it exists to do. That choice narrows
 * the category row beneath it, and the category row narrows the cards. "All"
 * shows every category, and the three featured communities from the comp.
 *
 * "+ Create a Community" is a fourth state rather than a link: selecting it
 * swaps the card grid for a short primer on starting one. It deliberately
 * navigates nowhere — the landing site runs on its own origin, so any link
 * out lands on the main app instead of staying on the page.
 */
type Mode = "All" | "Create" | "Species" | "Location" | "Purpose";

const MODES: { label: string; mode: Mode }[] = [
  { label: "All", mode: "All" },
  { label: "+ Create a Community", mode: "Create" },
  { label: "Browse by Species", mode: "Species" },
  { label: "Browse by Location", mode: "Location" },
  { label: "Browse by Purpose", mode: "Purpose" },
];

/** Shown in place of the grid when "+ Create a Community" is selected. */
const CREATE_STEPS = [
  {
    title: "Pick a focus",
    body: "A species, a city, a rescue mission, or a specialty — the narrower the focus, the faster a community finds its people.",
  },
  {
    title: "Set your standards",
    body: "Choose your moderation rules up front. Every community inherits profanity-free defaults and the platform's welfare standards.",
  },
  {
    title: "Invite your first members",
    body: "Bring in a handful of people who will post early. Communities with ten active members in week one keep growing.",
  },
];

type Category =
  | "Species Hubs"
  | "Local Groups"
  | "Rescue Networks"
  | "Professional Communities"
  | "Training & Nutrition"
  | "Memorial & Support";

const CATEGORIES: { label: Category; icon: LucideIcon; mode: Mode }[] = [
  { label: "Species Hubs", icon: Heart, mode: "Species" },
  { label: "Local Groups", icon: Star, mode: "Location" },
  { label: "Rescue Networks", icon: Heart, mode: "Purpose" },
  { label: "Professional Communities", icon: UserRound, mode: "Purpose" },
  { label: "Training & Nutrition", icon: BookOpen, mode: "Purpose" },
  { label: "Memorial & Support", icon: Heart, mode: "Purpose" },
];

const COMMUNITIES: {
  image: string;
  alt: string;
  name: string;
  body: string;
  stats: string;
  tag: string;
  category: Category;
  /**
   * The three communities the comp shows. "All" displays only these, so the
   * default view stays exactly as designed; the rest are reached by picking a
   * way to browse or a category.
   */
  featured?: boolean;
}[] = [
  {
    image: IMAGES.goldenWithTulip,
    alt: "A golden retriever carrying a tulip",
    name: "Golden Retriever Guardians",
    body: "A global community dedicated to Golden Retriever care and adoption.",
    stats: "45.2k members · 128 posts/week",
    tag: "Moderated",
    category: "Species Hubs",
    featured: true,
  },
  {
    image: IMAGES.sleepingGingerCat,
    alt: "A ginger cat asleep in a blanket",
    name: "London Cat Rescue Coalition",
    body: "Coordinating rescue, foster, and adoption across London.",
    stats: "8.4k members · 64 posts/week",
    tag: "Adoption Focus",
    category: "Local Groups",
    featured: true,
  },
  {
    image: IMAGES.kingfisher,
    alt: "A kingfisher perched outdoors",
    name: "Exotic Bird Keepers Network",
    body: "Expert advice and support for parrot and exotic bird owners.",
    stats: "12.7k members · 89 posts/week",
    tag: "Professional Led",
    category: "Species Hubs",
    featured: true,
  },
  {
    image: IMAGES.guineaPigs,
    alt: "Two guinea pigs sharing food",
    name: "Small Pet Keepers Circle",
    body: "Housing, diet, and enrichment for guinea pigs, rabbits, and rodents.",
    stats: "6.1k members · 41 posts/week",
    tag: "Beginner Friendly",
    category: "Species Hubs",
  },
  {
    image: IMAGES.meetupOutdoors,
    alt: "People gathered outdoors around an animal in a park",
    name: "Pacific Northwest Pet Meetups",
    body: "Weekend walks, park meetups, and local events across the region.",
    stats: "9.8k members · 52 posts/week",
    tag: "Events Weekly",
    category: "Local Groups",
  },
  {
    image: IMAGES.dolphins,
    alt: "Dolphins seen from above at the ocean surface",
    name: "Coastal Marine Rescue Response",
    body: "Volunteer coordination for strandings and coastal wildlife callouts.",
    stats: "3.2k members · 27 posts/week",
    tag: "Rapid Response",
    category: "Rescue Networks",
  },
  {
    image: IMAGES.vetWithRabbit,
    alt: "A veterinarian holding a rabbit in a clinic",
    name: "Veterinary Professionals Forum",
    body: "Case discussion and continuing education for verified practitioners.",
    stats: "14.3k members · 96 posts/week",
    tag: "Verification Required",
    category: "Professional Communities",
  },
  {
    image: IMAGES.trainingClass,
    alt: "A trainer working with a room full of dogs",
    name: "Positive Reinforcement Trainers",
    body: "Force-free training methods, nutrition guidance, and behaviour support.",
    stats: "21.5k members · 113 posts/week",
    tag: "Professional Led",
    category: "Training & Nutrition",
  },
  {
    image: IMAGES.catDogCuddling,
    alt: "A cat and a golden retriever curled up together",
    name: "Pet Loss & Memorial Support",
    body: "A gentle space for grief, remembrance, and tribute pages.",
    stats: "7.6k members · 33 posts/week",
    tag: "Moderated",
    category: "Memorial & Support",
  },
  {
    image: IMAGES.familyAutumnDog,
    alt: "A family under autumn trees with a golden retriever",
    name: "Foster & Adoption Network",
    body: "Matching shelters with vetted foster homes and transport volunteers.",
    stats: "11.4k members · 78 posts/week",
    tag: "Adoption Focus",
    category: "Rescue Networks",
  },
  {
    image: IMAGES.frenchieSweater,
    alt: "A French bulldog in a yellow sweater",
    name: "Groomers & Care Specialists",
    body: "Technique, tooling, and client care for verified grooming professionals.",
    stats: "5.9k members · 38 posts/week",
    tag: "Verification Required",
    category: "Professional Communities",
  },
  {
    image: IMAGES.pug,
    alt: "A wide-eyed black pug",
    name: "Canine Nutrition Collective",
    body: "Evidence-led feeding plans, allergy support, and weight management.",
    stats: "16.2k members · 84 posts/week",
    tag: "Professional Led",
    category: "Training & Nutrition",
  },
  {
    image: IMAGES.frenchieYellow,
    alt: "A French bulldog lying on a yellow background",
    name: "Senior Pet Companions",
    body: "Comfort care, mobility, and end-of-life planning for older animals.",
    stats: "4.8k members · 22 posts/week",
    tag: "Moderated",
    category: "Memorial & Support",
  },
  {
    image: IMAGES.friendsWithDog,
    alt: "Laughing friends in winter hats with a dog",
    name: "Nordic Dog Owners Circle",
    body: "Cold-weather care, gear, and meetups across the Nordic countries.",
    stats: "7.1k members · 45 posts/week",
    tag: "Events Weekly",
    category: "Local Groups",
  },
];

/** The white community band, set off from the page by its top and bottom rules. */
export default function CommunitiesSection() {
  const [mode, setMode] = useState<Mode>("All");
  const [category, setCategory] = useState<Category | null>(null);

  // Picking a new way to browse clears the category chosen under the old one,
  // which would otherwise stay applied while hidden from the row below.
  const selectMode = (next: Mode) => {
    setMode(next);
    setCategory(null);
  };

  const visibleCategories =
    mode === "All" ? CATEGORIES : CATEGORIES.filter((c) => c.mode === mode);

  const visibleCommunities = COMMUNITIES.filter((community) => {
    if (category) return community.category === category;
    // Unfiltered, the section shows the comp's three featured communities
    // rather than the whole directory.
    if (mode === "All") return community.featured === true;
    return visibleCategories.some((c) => c.label === community.category);
  });

  return (
    <section
      className="bg-white py-12 sm:py-16 lg:py-20"
      style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <SectionHeading
          title={
            <>
              Build Communities That Protect,
              <br className="hidden sm:block" /> Celebrate and Support Animal
              Life
            </>
          }
        />

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {MODES.map(({ label, mode: value }) => (
            <FilterPill
              key={value}
              active={mode === value}
              onClick={() => selectMode(value)}
            >
              {label}
            </FilterPill>
          ))}
        </div>

        {/* The category row is a way to narrow the directory, so it has nothing
            to offer while the create primer is showing. */}
        <div
          className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start"
          hidden={mode === "Create"}
        >
          {visibleCategories.map(({ label, icon: Icon }) => {
            const active = category === label;
            return (
              <button
                key={label}
                type="button"
                // Clicking the active category clears it, so a category can be
                // switched off without reaching back up to the row above.
                onClick={() => setCategory(active ? null : label)}
                aria-pressed={active}
                className="flex items-center gap-2 transition hover:opacity-80"
              >
                <Icon
                  size={14}
                  strokeWidth={1.8}
                  style={{ color: active ? C.ink : C.brand }}
                />
                <span
                  className={`text-xs leading-5 ${
                    active ? "font-bold underline underline-offset-4" : "font-semibold"
                  }`}
                  style={{ color: active ? C.ink : C.muted }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {mode === "Create" ? (
          <div
            className="mt-8 rounded-[20px] bg-white p-6 sm:p-10"
            style={{ border: `1px solid ${C.line}` }}
          >
            <h3
              className="text-lg font-bold leading-7"
              style={{ color: C.inkDeep }}
            >
              Start a community of your own
            </h3>
            <p
              className="mt-2 max-w-[640px] text-sm leading-5"
              style={{ color: C.muted }}
            >
              Anyone can open a space on Zoiko Social. Communities are moderated
              from the first post, so yours arrives with the same protections as
              every one above.
            </p>

            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {CREATE_STEPS.map((step, i) => (
                <li key={step.title}>
                  <span
                    className="flex size-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: C.brand }}
                  >
                    {i + 1}
                  </span>
                  <h4
                    className="mt-3 text-base font-bold leading-6"
                    style={{ color: C.inkDeep }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="mt-1 text-sm leading-5"
                    style={{ color: C.muted }}
                  >
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCommunities.map((community) => (
            <article
              key={community.name}
              className="flex flex-col overflow-hidden rounded-[20px] bg-white"
              style={{ border: `1px solid ${C.line}` }}
            >
              <div className="relative h-36">
                <Image
                  src={community.image}
                  alt={community.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3
                  className="text-base font-bold leading-6"
                  style={{ color: C.inkDeep }}
                >
                  {community.name}
                </h3>
                <p className="mt-1 text-sm leading-5" style={{ color: C.muted }}>
                  {community.body}
                </p>
                <p
                  className="mt-3 text-xs font-semibold leading-5"
                  style={{ color: C.muted }}
                >
                  {community.stats}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Chip>Verified Community</Chip>
                  <Chip tone="outline">{community.tag}</Chip>
                </div>

                <Link
                  href={APP_LINKS.communities}
                  className="mt-5 flex items-center justify-center rounded-[10px] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: C.brand }}
                >
                  Join
                </Link>
              </div>
            </article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
