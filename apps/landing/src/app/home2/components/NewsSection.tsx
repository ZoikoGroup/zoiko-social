import Image from "next/image";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import { IMAGES } from "./images";
import { C } from "./theme";
import { ArrowLink, Chip, FilterPill, SectionHeading } from "./primitives";

const TOPICS = [
  "Welfare",
  "Conservation",
  "Wildlife Crime",
  "Vet Science",
  "Rescue Response",
  "Policy",
];

const LEAD = {
  image: IMAGES.panda,
  alt: "A giant panda eating bamboo",
  age: "2 hours ago",
  title: "Major Policy Update on Wildlife Trade Enforcement",
  body: "International coalition strengthens measures to combat illegal wildlife trafficking across 47 nations.",
};

const STORIES = [
  {
    image: IMAGES.goldenPortrait,
    alt: "A golden retriever looking at the camera",
    age: "4 hours ago",
    title: "New Research on Canine Cognitive Development",
    body: "Veterinary study reveals breakthrough findings on early socialization impacts.",
    place: "United States",
  },
  {
    image: IMAGES.dolphins,
    alt: "Dolphins seen from above at the ocean surface",
    age: "6 hours ago",
    title: "Marine Life Rescue Operation Underway",
    body: "International teams coordinate response to stranded dolphins in coastal region.",
    place: "Australia",
  },
  {
    image: IMAGES.twoDogs,
    alt: "A corgi and a terrier standing together",
    age: "9 hours ago",
    title: "Animal Shelter Capacity Initiative Launched",
    body: "National program aims to increase shelter resources and adoption rates.",
    place: "United Kingdom",
  },
  {
    image: IMAGES.catBandana,
    alt: "A cat wearing a yellow bandana",
    age: "12 hours ago",
    title: "Veterinary Access Expands in Rural Communities",
    body: "Mobile clinic partnerships bring routine care to underserved regions.",
    place: "Canada",
  },
];

/** Badge pair — Tier 1 source, verified — plus the story's age. */
function StoryMeta({ age }: { age: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Chip tone="warm">Tier 1 Source</Chip>
      <Chip>Verified</Chip>
      <span className="text-xs leading-4" style={{ color: C.muted }}>
        {age}
      </span>
    </div>
  );
}

/** "World Animal News" — one lead story beside a 2x2 grid of secondaries. */
export default function NewsSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <SectionHeading
        title="World Animal News"
        subtitle="Verified, contextual, profanity-free."
      />

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {TOPICS.map((topic, i) => (
          <FilterPill key={topic} active={i === 0}>
            {topic}
          </FilterPill>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article
          className="flex flex-col overflow-hidden rounded-[20px] bg-white"
          style={{ border: `1px solid ${C.line}` }}
        >
          <div className="relative h-48 sm:h-64">
            <Image
              src={LEAD.image}
              alt={LEAD.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <StoryMeta age={LEAD.age} />
            <h3
              className="mt-3 text-xl font-bold leading-8"
              style={{ color: C.inkDeep }}
            >
              {LEAD.title}
            </h3>
            <p className="mt-2 text-sm leading-5" style={{ color: C.muted }}>
              {LEAD.body}
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-6 pt-6">
              <ArrowLink href={APP_LINKS.news}>Learn More</ArrowLink>
              <Link
                href={APP_LINKS.communities}
                className="text-sm font-semibold transition hover:opacity-80"
                style={{ color: C.brand }}
              >
                Discuss in Community
              </Link>
              <Link
                href={APP_LINKS.safety}
                className="text-sm font-semibold transition hover:opacity-80"
                style={{ color: C.brand }}
              >
                Report Issue
              </Link>
            </div>
          </div>
        </article>

        <div className="grid gap-6 sm:grid-cols-2">
          {STORIES.map((story) => (
            <article
              key={story.title}
              className="flex flex-col rounded-[20px] bg-white p-4"
              style={{ border: `1px solid ${C.line}` }}
            >
              <div className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={story.image}
                    alt={story.alt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <StoryMeta age={story.age} />
              </div>

              <h3
                className="mt-3 text-sm font-bold leading-5"
                style={{ color: C.inkDeep }}
              >
                {story.title}
              </h3>
              <p className="mt-2 text-xs leading-5" style={{ color: C.muted }}>
                {story.body}
              </p>
              <p
                className="mt-auto pt-4 text-xs leading-4"
                style={{ color: C.muted }}
              >
                {story.place}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href={APP_LINKS.news}
          className="rounded-xl px-8 py-3.5 text-base font-semibold text-white transition hover:opacity-90"
          style={{ background: C.brand }}
        >
          View All News
        </Link>
      </div>
    </section>
  );
}
