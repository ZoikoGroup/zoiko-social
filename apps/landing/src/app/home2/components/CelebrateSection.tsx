import Image from "next/image";
import { appUrl } from "@/lib/app-links";
import { IMAGES } from "./images";
import { C } from "./theme";
import { ArrowLink, SectionHeading } from "./primitives";

const EVENTS = [
  {
    emoji: "🎂",
    image: IMAGES.guineaPigs,
    alt: "Two guinea pigs sharing food",
    title: "Birthdays & Adoptiversaries",
    body: "Celebrate special milestones with invitations, livestreams, and photo albums.",
    cta: "Create Event",
  },
  {
    emoji: "🤝",
    image: IMAGES.meetupOutdoors,
    alt: "People gathered outdoors in a park with an animal",
    title: "Community Meetups",
    body: "Organize local gatherings with RSVP tracking and group coordination.",
    cta: "Plan Meetup",
  },
  {
    emoji: "💗",
    image: IMAGES.charityRun,
    alt: "Charity runners wearing numbered bibs",
    title: "Fundraising Events",
    body: "Host verified fundraisers with transparent donation tracking.",
    cta: "Start Fundraiser",
  },
  {
    emoji: "📚",
    image: IMAGES.trainingClass,
    alt: "A trainer working with a room full of dogs",
    title: "Training Workshops",
    body: "Share knowledge through educational sessions and demonstrations.",
    cta: "Schedule Workshop",
  },
  {
    emoji: "🕊️",
    image: IMAGES.catDogCuddling,
    alt: "A cat and a dog curled up together",
    title: "Memorials & Tributes",
    body: "Honor beloved companions with tribute pages and memorial services.",
    cta: "Create Memorial",
  },
  {
    emoji: "💍",
    image: IMAGES.frenchieYellow,
    alt: "A French bulldog lying on a yellow background",
    title: "Special Ceremonies",
    body: "Include pets in weddings and other meaningful life celebrations.",
    cta: "Plan Ceremony",
  },
];

/** "Celebrate and Honor Animal Life" — the six life-event cards. */
export default function CelebrateSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <SectionHeading
        title="Celebrate and Honor Animal Life"
        subtitle="Create meaningful moments and lasting memories with your animal community."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {EVENTS.map((event) => (
          <article
            key={event.title}
            className="flex flex-col overflow-hidden rounded-[20px] bg-white"
            style={{ border: `1px solid ${C.line}` }}
          >
            <div className="relative h-36">
              <Image
                src={event.image}
                alt={event.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover"
              />
            </div>

            {/* Emoji badge overlapping the image, matching the comp. */}
            <div className="relative px-6 pb-6">
              <div
                className="absolute -top-5 flex size-11 items-center justify-center rounded-xl bg-white text-lg shadow-[0_1px_2px_rgba(7,59,71,0.06)]"
                style={{ border: `1px solid ${C.line}` }}
                aria-hidden
              >
                {event.emoji}
              </div>

              <h3
                className="mt-10 text-base font-bold leading-6"
                style={{ color: C.inkDeep }}
              >
                {event.title}
              </h3>
              <p className="mt-2 text-sm leading-5" style={{ color: C.muted }}>
                {event.body}
              </p>
              <div className="mt-5">
                <ArrowLink href={appUrl("/events")}>{event.cta}</ArrowLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
