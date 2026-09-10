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

const FILTERS = [
  "All",
  "+ Create a Community",
  "Browse by Species",
  "Browse by Location",
  "Browse by Purpose",
];

const CATEGORIES: { label: string; icon: LucideIcon }[] = [
  { label: "Species Hubs", icon: Heart },
  { label: "Local Groups", icon: Star },
  { label: "Rescue Networks", icon: Heart },
  { label: "Professional Communities", icon: UserRound },
  { label: "Training & Nutrition", icon: BookOpen },
  { label: "Memorial & Support", icon: Heart },
];

const COMMUNITIES = [
  {
    image: IMAGES.goldenWithTulip,
    alt: "A golden retriever carrying a tulip",
    name: "Golden Retriever Guardians",
    body: "A global community dedicated to Golden Retriever care and adoption.",
    stats: "45.2k members · 128 posts/week",
    tag: "Moderated",
  },
  {
    image: IMAGES.sleepingGingerCat,
    alt: "A ginger cat asleep in a blanket",
    name: "London Cat Rescue Coalition",
    body: "Coordinating rescue, foster, and adoption across London.",
    stats: "8.4k members · 64 posts/week",
    tag: "Adoption Focus",
  },
  {
    image: IMAGES.kingfisher,
    alt: "A kingfisher perched outdoors",
    name: "Exotic Bird Keepers Network",
    body: "Expert advice and support for parrot and exotic bird owners.",
    stats: "12.7k members · 89 posts/week",
    tag: "Professional Led",
  },
];

/** The white community band, set off from the page by its top and bottom rules. */
export default function CommunitiesSection() {
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
          {FILTERS.map((label, i) => (
            <FilterPill key={label} active={i === 0}>
              {label}
            </FilterPill>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start">
          {CATEGORIES.map(({ label, icon: Icon }) => (
            <span key={label} className="flex items-center gap-2">
              <Icon size={14} strokeWidth={1.8} style={{ color: C.brand }} />
              <span
                className="text-xs font-semibold leading-5"
                style={{ color: C.muted }}
              >
                {label}
              </span>
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COMMUNITIES.map((community) => (
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
      </div>
    </section>
  );
}
