"use client";

import Image from "next/image";
import Link from "next/link";
import { Sora } from "next/font/google";
import { appUrl } from "@/lib/app-links";

/* The design sets the two headings in Sora, which the site does not otherwise
   load. Declaring it here rather than in the root layout keeps the extra font
   scoped to this menu. */
const sora = Sora({ subsets: ["latin"], weight: ["700"], display: "swap" });

/* Exported design assets, served straight from /public. `unoptimized` because
   Next's image optimizer refuses SVG unless `dangerouslyAllowSVG` is set. */
const ICON = "/dropdowns/";

type Item = {
  label: string;
  description: string;
  icon: string;
  href: string;
};

/**
 * Menu destinations.
 *
 * The app has one /events page and no filtered views for weekend, upcoming,
 * region or event type, so every item points there rather than at a URL that
 * would 404.
 */
const FIND_EVENTS: readonly Item[] = [
  {
    label: "Online Events",
    description: "Join from anywhere, no travel required.",
    icon: `${ICON}globe.svg`,
    href: appUrl("/events"),
  },
  {
    label: "This Weekend",
    description: "What's on near you in the next few days.",
    icon: `${ICON}calendar.svg`,
    href: appUrl("/events"),
  },
  {
    label: "Upcoming",
    description: "Everything coming up that you might like.",
    icon: `${ICON}clock.svg`,
    href: appUrl("/events"),
  },
  {
    label: "Near You",
    description: "Local events once your region is set.",
    icon: `${ICON}map-pin.svg`,
    href: appUrl("/events"),
  },
];

const EVENT_TYPES: readonly Item[] = [
  {
    label: "Community Meetups",
    description: "Casual gatherings for animal lovers.",
    icon: `${ICON}users.svg`,
    href: appUrl("/events"),
  },
  {
    label: "Training & Workshops",
    description: "Hands-on sessions led by professionals.",
    icon: `${ICON}bone.svg`,
    href: appUrl("/events"),
  },
  {
    label: "Fundraisers",
    description: "Support rescues and shelters directly.",
    icon: `${ICON}banknote.svg`,
    href: appUrl("/events"),
  },
  {
    label: "Rescue Events",
    description: "Adoption days and rescue drives.",
    icon: `${ICON}heart.svg`,
    href: appUrl("/events"),
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-bold uppercase tracking-wide text-teal-900">
      {children}
    </div>
  );
}

function MenuItem({ label, description, icon, href }: Item) {
  return (
    <Link
      href={href}
      className="flex w-full items-start gap-2 rounded-xl py-2.5 pl-1.5 pr-2.5 transition-colors hover:bg-neutral-100"
    >
      <Image
        src={icon}
        alt=""
        aria-hidden
        width={20}
        height={20}
        unoptimized
        className="mt-0.5 size-5 shrink-0"
      />
      <span className="flex flex-col gap-px pl-[3px]">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        <span className="text-xs font-normal leading-4 text-slate-500">
          {description}
        </span>
      </span>
    </Link>
  );
}

export default function EventsDropdown() {
  return (
    <div className="w-full overflow-hidden bg-white xl:w-[780px] xl:rounded-b-2xl xl:shadow-[0px_2px_8px_0px_rgba(17,27,39,0.06),0px_16px_40px_-12px_rgba(17,27,39,0.18)] xl:outline xl:outline-1 xl:outline-offset-[-1px] xl:outline-gray-200">
      {/* Title strip */}
      <div className="flex items-start gap-3.5 border-b border-gray-100 px-7 py-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
          <Image
            src={`${ICON}calendar-40.svg`}
            alt=""
            aria-hidden
            width={40}
            height={40}
            unoptimized
            className="size-10"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <div
            className={`${sora.className} text-base font-bold text-gray-900`}
          >
            Events
          </div>
          <p className="text-xs font-normal leading-5 text-gray-600">
            Find, host, and attend animal-focused events.
          </p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-start">
        {/* Find Events */}
        <div className="flex-1 pb-11 pl-7 pr-7 xl:pr-3 pt-5">
          <SectionLabel>Find Events</SectionLabel>
          <div className="mt-1.5 w-full xl:w-56">
            {FIND_EVENTS.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Event Types */}
        <div className="flex-1 pb-11 pl-7 pr-7 xl:pl-5 xl:pr-3 pt-5">
          <SectionLabel>Event Types</SectionLabel>
          <div className="mt-1.5 w-full xl:w-60">
            {EVENT_TYPES.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Highlight */}
        <div className="w-full px-7 pb-6 xl:w-64 xl:px-0 xl:py-4 xl:pr-4">
          <div className="rounded-2xl bg-neutral-100 p-5">
            <div className="text-xs font-bold uppercase leading-5 tracking-wide text-gray-600">
              Events Highlight
            </div>
            <p
              className={`${sora.className} mt-2.5 text-base font-bold leading-5 text-gray-900`}
            >
              Turn up for the cause in person.
            </p>
            <p className="mt-2 text-xs font-normal leading-5 text-gray-600">
              From local meetups to global fundraisers, hosted by verified
              organizers.
            </p>
            <div className="mt-4 h-24 overflow-hidden rounded-xl">
              <Image
                src={`${ICON}events-highlight.png`}
                alt=""
                aria-hidden
                width={204}
                height={103}
                className="h-24 w-full object-cover"
              />
            </div>
            <Link
              href={appUrl("/events")}
              className="mt-4 flex min-h-9 items-center justify-center rounded-full bg-teal-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
