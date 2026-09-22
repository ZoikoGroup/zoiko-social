"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Calendar } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { DAYS, EVENTS, REGION, type Tag, type WeekendEvent } from "./events";
import { C, PHOTO_TINT } from "./theme";

type Filter = { id: string; label: string; test: (e: WeekendEvent) => boolean };

/** Local YYYY-MM-DD, so "Today" means the visitor's today, not UTC's. */
function localToday() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const FILTERS: readonly Filter[] = [
  { id: "all", label: "All", test: () => true },
  {
    id: "today",
    label: "Today",
    test: (e) => DAYS.find((d) => d.id === e.day)!.date === localToday(),
  },
  { id: "sat", label: "Saturday", test: (e) => e.day === "sat" },
  { id: "sun", label: "Sunday", test: (e) => e.day === "sun" },
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

function SoonCard({
  event,
  saved,
  onToggleSave,
}: {
  event: WeekendEvent;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const f = event.featured!;
  const day = DAYS.find((d) => d.id === event.day)!;

  return (
    <article
      className="flex flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative h-48 bg-gradient-to-br from-cyan-800 to-orange-500">
        <Photo src={event.image} alt={event.imageAlt} sizes="(min-width: 1024px) 394px, (min-width: 640px) 50vw, 100vw" />
        {f.badge && (
          <span
            className="absolute left-3.5 top-3.5 rounded-full px-3 py-1.5 text-xs font-bold text-white backdrop-blur-[2px]"
            style={{ background: "rgba(6, 47, 57, 0.85)" }}
          >
            {f.badge}
          </span>
        )}
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
        <div className="flex flex-wrap gap-2">
          {event.tags.map((t) => (
            <TagPill key={t.label} tag={t} />
          ))}
        </div>
        <h3 className="pt-1.5 text-lg font-extrabold leading-6" style={{ color: C.ink }}>
          {event.title}
        </h3>
        <p className="min-h-9 text-sm leading-5" style={{ color: C.muted }}>
          {event.blurb}
        </p>
        <p className="flex items-center gap-2 pb-3 pt-2 text-xs font-semibold" style={{ color: C.muted }}>
          <Calendar size={14} strokeWidth={2} style={{ color: C.brand }} />
          {day.short} · {event.time} · {event.format}
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
              {f.initials}
            </span>
            <span className="truncate text-xs font-bold" style={{ color: C.ink }}>
              {f.organizer}
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

function DayCard({ event }: { event: WeekendEvent }) {
  return (
    <article
      className="flex overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative w-24 shrink-0 bg-gradient-to-br from-cyan-800 to-orange-500 sm:w-36">
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
            {event.time} · {event.price}
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

export default function WeekendBrowser() {
  const [filter, setFilter] = useState("all");
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());

  const test = FILTERS.find((f) => f.id === filter)!.test;
  const matching = EVENTS.filter(test);
  const soon = matching.filter((e) => e.featured);
  const narrowed = filter !== "all";

  const toggleSave = (id: string) => {
    const next = new Set(saved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSaved(next);
  };

  return (
    <>
      <div className={`${WRAP} pb-6`}>
        <div
          role="group"
          aria-label="Filter weekend events"
          className="flex flex-wrap gap-2.5 pb-1"
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

      <section className="bg-white pb-16 pt-12 sm:pb-20">
        <div className={WRAP}>
          <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
            Starting soon
          </h2>
          <p className="mt-1.5 max-w-[520px] text-base leading-6" style={{ color: C.muted }}>
            A small, high-confidence set of eligible events — never ranked by
            popularity alone.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {soon.map((e) => (
              <SoonCard
                key={e.id}
                event={e}
                saved={saved.has(e.id)}
                onToggleSave={() => toggleSave(e.id)}
              />
            ))}
          </div>
          {soon.length === 0 && (
            <div className="mt-8">
              <Empty>None of the starting-soon picks match this filter.</Empty>
            </div>
          )}
        </div>
      </section>

      <section id="day-by-day" className="scroll-mt-6 pb-14 pt-14 sm:pb-20 sm:pt-20" style={{ background: C.panel }}>
        <div className={WRAP}>
          <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
            This weekend, day by day
          </h2>
          <p className="mt-1.5 max-w-[520px] text-base leading-6" style={{ color: C.muted }}>
            A stable snapshot for {REGION}. Times shown in your local time zone.
          </p>

          {DAYS.map((d) => {
            const count = matching.filter((e) => e.day === d.id).length;
            // Starting-soon picks already have a full card above.
            const rest = matching.filter((e) => e.day === d.id && !e.featured);
            return (
              <div key={d.id} className="mt-8">
                <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-xl font-bold" style={{ color: C.ink }}>
                    {d.label}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: C.muted }}>
                    {count} eligible {count === 1 ? "event" : "events"}
                  </span>
                </h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {rest.map((e) => (
                    <DayCard key={e.id} event={e} />
                  ))}
                </div>
                {rest.length === 0 && (
                  <Empty>
                    {count === 0
                      ? `No ${d.label.split(",")[0]} events match this filter.`
                      : "The matching events are shown in Starting soon above."}
                  </Empty>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <div className={WRAP}>
          <div
            className="flex flex-col gap-5 rounded-[20px] p-6 sm:p-8 md:flex-row md:items-center md:justify-between"
            style={{ background: C.chip, border: `1px solid ${C.line}` }}
          >
            <div>
              <p className="text-lg font-extrabold" style={{ color: C.ink }}>
                {narrowed
                  ? `That's everything matching this filter in ${REGION} this weekend.`
                  : `That's everything eligible in ${REGION} this weekend.`}
              </p>
              <p className="mt-1 text-sm" style={{ color: C.muted }}>
                Sparse day? Broaden your area temporarily, or check what&apos;s
                coming up further out.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/events-near-you"
                className="rounded-xl bg-white px-5 py-2.5 text-center text-sm font-bold transition hover:bg-neutral-50"
                style={{ color: C.ink, border: `1px solid ${C.line}` }}
              >
                Broaden area temporarily
              </a>
              <Link
                href="/events-upcoming"
                className="rounded-xl px-5 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: C.brand }}
              >
                View Upcoming
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
