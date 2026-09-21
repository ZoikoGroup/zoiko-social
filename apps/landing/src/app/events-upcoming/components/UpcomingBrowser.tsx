"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, Bookmark, Calendar } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import {
  EVENTS,
  WINDOW_END,
  WINDOW_END_LABEL,
  WINDOW_START,
  groupOf,
  type Tag,
  type UpcomingEvent,
} from "./events";
import { C, PHOTO_TINT } from "./theme";

/** ISO date `days` after `iso`. */
function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

type Filter = { id: string; label: string; test: (e: UpcomingEvent) => boolean };

const FILTERS: readonly Filter[] = [
  { id: "all", label: "All", test: () => true },
  { id: "7", label: "Next 7 days", test: (e) => e.date < addDays(WINDOW_START, 7) },
  { id: "30", label: "Next 30 days", test: (e) => e.date <= WINDOW_END },
  { id: "month", label: "This month", test: (e) => e.date.slice(0, 7) === WINDOW_START.slice(0, 7) },
  { id: "online", label: "Online / Hybrid", test: (e) => e.format !== "In person" },
  { id: "free", label: "Free", test: (e) => e.price === "Free" },
  { id: "family", label: "Family-friendly", test: (e) => e.categories.includes("family") },
  { id: "accessible", label: "Accessible", test: (e) => e.categories.includes("accessible") },
  { id: "rescue", label: "Rescue", test: (e) => e.categories.includes("rescue") },
  { id: "training", label: "Training", test: (e) => e.categories.includes("training") },
  { id: "fundraiser", label: "Fundraiser", test: (e) => e.categories.includes("fundraiser") },
];

const WRAP = "mx-auto max-w-[1280px] px-4 sm:px-6";

function TagPill({ tag }: { tag: Tag }) {
  const style =
    tag.tone === "verified"
      ? { background: C.chip, color: C.inkDeep }
      : tag.tone === "warm"
        ? { background: C.chipWarm, color: C.warm }
        : { background: C.panel, color: C.muted, border: `1px solid ${C.line}` };
  return (
    <span className="rounded-full px-2.5 py-[5px] text-xs font-bold" style={style}>
      {tag.label}
    </span>
  );
}

function Photo({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return (
    <>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      <div className="absolute inset-0 mix-blend-multiply" style={{ background: PHOTO_TINT }} />
    </>
  );
}

function RecCard({
  event,
  saved,
  onToggleSave,
}: {
  event: UpcomingEvent;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const r = event.rec!;
  return (
    <article
      className="flex flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative h-48 bg-gradient-to-br from-cyan-800 to-orange-500">
        <Photo src={r.image} alt={r.imageAlt} sizes="(min-width: 1024px) 394px, (min-width: 640px) 50vw, 100vw" />
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${event.title} from saved` : `Save ${event.title}`}
          className="absolute right-3.5 top-3.5 flex size-9 items-center justify-center rounded-2xl bg-white/90 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] transition hover:bg-white"
          style={{ color: C.inkDeep }}
        >
          <Bookmark size={16} strokeWidth={2} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.brand }}>
          <BadgeCheck size={12} strokeWidth={2} className="shrink-0" />
          {r.reason}
        </p>
        <div className="flex flex-wrap gap-2 pt-1.5">
          {r.tags.map((t) => (
            <TagPill key={t.label} tag={t} />
          ))}
        </div>
        <h3 className="pt-1.5 text-lg font-extrabold leading-6" style={{ color: C.ink }}>
          {event.title}
        </h3>
        <p className="min-h-9 text-sm leading-5" style={{ color: C.muted }}>
          {r.blurb}
        </p>
        <p className="flex items-center gap-2 pb-3 pt-2 text-xs font-semibold" style={{ color: C.muted }}>
          <Calendar size={14} strokeWidth={2} style={{ color: C.brand }} />
          {event.dateLabel} · {event.time} · {event.format}
        </p>
        <div
          className="mt-auto flex items-center justify-between gap-3 pt-4"
          style={{ borderTop: `1px solid ${C.line}` }}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-xl text-[10px] font-extrabold text-white"
              style={{ background: C.brand }}
            >
              {r.initials}
            </span>
            <span className="truncate text-xs font-bold" style={{ color: C.ink }}>
              {r.organizer}
            </span>
          </span>
          <a
            href={appUrl("/events")}
            className="shrink-0 text-xs font-bold hover:underline"
            style={{ color: C.brand }}
          >
            RSVP →
          </a>
        </div>
      </div>
    </article>
  );
}

function ListCard({ event }: { event: UpcomingEvent }) {
  return (
    <article
      className="flex overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative min-h-36 w-24 shrink-0 bg-gradient-to-br from-cyan-800 to-orange-500 sm:w-36">
        <Photo src={event.image} alt={event.imageAlt} sizes="150px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {event.tags.map((t) => (
            <TagPill key={t.label} tag={t} />
          ))}
        </div>
        <h4 className="pt-3 text-base font-extrabold" style={{ color: C.ink }}>
          {event.title}
        </h4>
        <p className="pb-3 text-sm leading-6 sm:text-base" style={{ color: C.muted }}>
          {event.blurb}
        </p>
        <div
          className="mt-auto flex items-center justify-between gap-3 pt-3"
          style={{ borderTop: `1px solid ${C.line}` }}
        >
          <span className="text-xs font-semibold" style={{ color: C.muted }}>
            {event.dateLabel} · {event.price}
          </span>
          <a
            href={appUrl("/events")}
            className="text-xs font-bold hover:underline"
            style={{ color: C.brand }}
          >
            View →
          </a>
        </div>
      </div>
    </article>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="rounded-[20px] bg-white px-6 py-10 text-center text-sm"
      style={{ border: `1px dashed ${C.line}`, color: C.muted }}
    >
      {children}
    </p>
  );
}

export default function UpcomingBrowser() {
  const [filter, setFilter] = useState("all");
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());

  const test = FILTERS.find((f) => f.id === filter)!.test;
  const matching = EVENTS.filter(test);
  const recs = matching.filter((e) => e.rec).sort((a, b) => a.rec!.rank - b.rec!.rank);

  // Groups in date order; EVENTS is already sorted.
  const groups: { name: string; events: UpcomingEvent[] }[] = [];
  for (const e of matching) {
    const name = groupOf(e);
    const last = groups[groups.length - 1];
    if (last?.name === name) last.events.push(e);
    else groups.push({ name, events: [e] });
  }

  const toggleSave = (id: string) => {
    const next = new Set(saved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSaved(next);
  };

  return (
    <>
      <div className="py-10 sm:py-12" style={{ background: C.panel }}>
        <div className={WRAP}>
          <div
            role="group"
            aria-label="Filter upcoming events"
            className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {FILTERS.map((f) => {
              const on = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className="shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition"
                  style={
                    on
                      ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                      : { background: "#fff", color: C.ink, border: `1px solid ${C.line}` }
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="bg-white py-14 sm:py-20">
        <div className={WRAP}>
          <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
            Recommended for you
          </h2>
          <p className="mt-1.5 max-w-[540px] text-base leading-6" style={{ color: C.muted }}>
            A small set of eligible events, matched to what you follow and save
            — never boosted by sponsorship.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recs.map((e) => (
              <RecCard
                key={e.id}
                event={e}
                saved={saved.has(e.id)}
                onToggleSave={() => toggleSave(e.id)}
              />
            ))}
          </div>
          {recs.length === 0 && (
            <div className="mt-8">
              <Empty>None of your recommendations match this filter.</Empty>
            </div>
          )}
        </div>
      </section>

      <section id="upcoming" className="scroll-mt-6 py-14 sm:py-20" style={{ background: C.panel }}>
        <div className={WRAP}>
          <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
            Upcoming, in order
          </h2>
          <p className="mt-1.5 max-w-[540px] text-base leading-6" style={{ color: C.muted }}>
            A stable snapshot through {WINDOW_END_LABEL}. Times shown in your
            local time zone.
          </p>

          {groups.map((g) => (
            <div key={g.name} className="mt-8">
              <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-xl font-bold" style={{ color: C.ink }}>
                  {g.name}
                </span>
                <span className="text-sm font-semibold" style={{ color: C.muted }}>
                  {g.events.length} eligible {g.events.length === 1 ? "event" : "events"}
                </span>
              </h3>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {g.events.map((e) => (
                  <ListCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <div className="mt-8">
              <Empty>No upcoming events match this filter.</Empty>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
