"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ShieldCheck } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { C } from "./theme";

type Tab = "soon" | "week" | "fundraisers";

type Featured = {
  badge: string;
  title: string;
  byline: string;
  time: string;
  image: string;
  alt: string;
};

type Side = { title: string; note: string; image: string; alt: string };

const TABS: readonly { id: Tab; label: string }[] = [
  { id: "soon", label: "Starting Soon" },
  { id: "week", label: "This Week" },
  { id: "fundraisers", label: "Fundraisers" },
];

const PREVIEW: Record<Tab, { featured: Featured; side: readonly Side[] }> = {
  soon: {
    featured: {
      badge: "Starting soon",
      title: "Understanding Feline Body Language",
      byline: "Dr. Amara Okafor, DVM · Verified Professional",
      time: "7:00 PM your time · 11:00 PM UTC",
      image: "/events-online/hero-featured.webp",
      alt: "Veterinary staff examining a dog outdoors",
    },
    side: [
      {
        title: "Foster Parent Meetup",
        note: "RSVP confirmed",
        image: "/events-online/thumb-foster.webp",
        alt: "Foster parents with a cat",
      },
      {
        title: "Flood Response Fundraiser",
        note: "Verified fundraiser",
        image: "/events-online/thumb-flood.webp",
        alt: "Rescue volunteers in matching shirts",
      },
    ],
  },
  week: {
    featured: {
      badge: "This week",
      title: "Backyard Wildlife Habitat Workshop",
      byline: "Urban Habitat Builders · Verified Community",
      time: "Sat 10:00 AM your time · 2:00 PM UTC",
      image: "/events-online/wildlife-habitat.webp",
      alt: "A guide leading hikers along a wooded trail",
    },
    side: [
      {
        title: "Reptile Husbandry 101",
        note: "Waitlist open",
        image: "/events-online/reptile-husbandry.webp",
        alt: "Two veterinary staff holding a small dog",
      },
      {
        title: "Bird Rescue First Response",
        note: "Verified Professional",
        image: "/events-online/bird-rescue.webp",
        alt: "A rescued fledgling",
      },
    ],
  },
  fundraisers: {
    featured: {
      badge: "Starting soon",
      title: "Emergency Shelter Fundraiser: Flood Response",
      byline: "Coastal Animal Rescue Network · Verified Organization",
      time: "6:15 PM your time · 10:15 PM UTC",
      image: "/events-online/flood-fundraiser.webp",
      alt: "Rescued dogs behind a shelter fence",
    },
    side: [
      {
        title: "Flood Response Fundraiser",
        note: "Verified fundraiser",
        image: "/events-online/thumb-flood.webp",
        alt: "Rescue volunteers in matching shirts",
      },
    ],
  },
};

export default function Hero() {
  const [tab, setTab] = useState<Tab>("soon");
  const { featured, side } = PREVIEW[tab];

  return (
    <section className="grid items-center gap-8 pb-8 pt-8 sm:pt-10 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-11">
      <div>
        <span
          className="inline-block rounded-[20px] px-3 py-1.5 text-xs font-bold leading-4 tracking-wide"
          style={{ background: C.chip, color: C.brand }}
        >
          Online Events
        </span>
        <h1
          className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl sm:leading-10"
          style={{ color: C.ink }}
        >
          Join animal-focused
          <br className="hidden sm:block" />
          events from anywhere.
        </h1>
        <p className="mt-4 max-w-[440px] text-base leading-6" style={{ color: C.muted }}>
          Discover live workshops, community sessions, fundraisers, rescue
          events, and other eligible online gatherings hosted across Zoiko
          Social — with clear organizers, times, access requirements, and
          safety expectations.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#events"
            className="rounded-xl px-[18px] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            Browse online events
          </a>
          <a
            href={appUrl("/events")}
            className="rounded-xl bg-white px-[18px] py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            Host an event
          </a>
        </div>
        <p className="mt-5 flex max-w-[440px] gap-2 text-xs leading-5" style={{ color: C.muted }}>
          <ShieldCheck size={14} strokeWidth={2} className="mt-0.5 shrink-0" style={{ color: C.brand }} />
          Verified organizer signals, clear time zones, moderated participation,
          and privacy-respecting attendance controls.
        </p>
      </div>

      <div
        className="rounded-3xl p-3 sm:p-5"
        style={{ background: C.panel, border: `1px solid ${C.line}` }}
      >
        <div role="tablist" aria-label="Preview events" className="flex flex-wrap gap-1.5">
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className="rounded-lg px-3 py-1.5 text-xs font-bold leading-4 transition"
                style={
                  on
                    ? { background: C.ink, color: "#fff", border: `1px solid ${C.ink}` }
                    : { background: "#fff", color: C.muted, border: `1px solid ${C.line}` }
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
          <div
            className="overflow-hidden rounded-2xl bg-white"
            style={{ border: `1px solid ${C.line}` }}
          >
            <div className="relative aspect-[344/199] w-full bg-gradient-to-br from-cyan-800 to-orange-500">
              <Image
                src={featured.image}
                alt={featured.alt}
                fill
                sizes="(min-width: 1024px) 344px, 100vw"
                className="object-cover"
                priority
              />
              <span
                className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9.5px] font-bold leading-4 text-white"
                style={{ background: C.overlay }}
              >
                <Clock size={8} strokeWidth={2.5} />
                {featured.badge}
              </span>
            </div>
            <div className="p-3">
              <p className="text-xs font-bold leading-4" style={{ color: C.inkDeep }}>
                {featured.title}
              </p>
              <p className="mt-0.5 text-xs leading-4" style={{ color: C.muted }}>
                {featured.byline}
              </p>
              <span
                className="mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold leading-4"
                style={{ background: C.chip, color: C.ink }}
              >
                {featured.time}
              </span>
            </div>
          </div>

          <ul
            className="flex flex-col gap-2.5 self-start rounded-2xl bg-white p-2.5"
            style={{ border: `1px solid ${C.line}` }}
          >
            {side.map((s) => (
              <li key={s.title} className="flex items-center gap-2.5">
                <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-lg" style={{ background: C.chip }}>
                  <Image src={s.image} alt={s.alt} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold leading-4" style={{ color: C.inkDeep }}>
                    {s.title}
                  </p>
                  <p className="text-[10px] leading-4" style={{ color: C.muted }}>
                    {s.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
