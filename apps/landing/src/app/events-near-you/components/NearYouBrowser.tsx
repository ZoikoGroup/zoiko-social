"use client";

import { useState } from "react";
import Image from "next/image";
import { Bookmark, Calendar, MapPin, Users } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import {
  AREAS,
  EVENTS,
  REGION,
  WEEK_END,
  WEEKEND,
  WINDOW_END,
  type Area,
  type LocalEvent,
  type Tag,
} from "./events";
import { C, PHOTO_TINT } from "./theme";

/** Local YYYY-MM-DD, so "Today" means the visitor's today, not UTC's. */
function localToday() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type Filter = { id: string; label: string; test: (e: LocalEvent) => boolean };

const FILTERS: readonly Filter[] = [
  { id: "all", label: "All", test: () => true },
  { id: "today", label: "Today", test: (e) => e.date === localToday() },
  { id: "weekend", label: "This Weekend", test: (e) => (WEEKEND as readonly string[]).includes(e.date) },
  { id: "30", label: "Next 30 days", test: (e) => e.date <= WINDOW_END },
  { id: "online", label: "Online / Hybrid", test: (e) => e.format !== "In person" },
  { id: "free", label: "Free", test: (e) => e.price === "Free" },
  { id: "family", label: "Family-friendly", test: (e) => e.categories.includes("family") },
  { id: "accessible", label: "Accessible", test: (e) => e.categories.includes("accessible") },
  { id: "rescue", label: "Rescue", test: (e) => e.categories.includes("rescue") },
  { id: "training", label: "Training", test: (e) => e.categories.includes("training") },
  { id: "fundraiser", label: "Fundraiser", test: (e) => e.categories.includes("fundraiser") },
];

const GROUPS = [
  { name: "Today & this week", test: (e: LocalEvent) => e.date <= WEEK_END },
  { name: "Next 30 days", test: (e: LocalEvent) => e.date > WEEK_END },
] as const;

/** An area with at least this many events gets a numbered cluster pin. */
const CLUSTER_AT = 3;

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
  event: LocalEvent;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const r = event.rec!;
  const Why = r.because === "region" ? MapPin : Users;
  return (
    <article
      className="flex flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative h-48 bg-gradient-to-br from-cyan-800 to-orange-500">
        <Photo src={event.image} alt={event.imageAlt} sizes="(min-width: 1024px) 394px, (min-width: 640px) 50vw, 100vw" />
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
          <Why size={12} strokeWidth={2} className="shrink-0" />
          {r.reason}
        </p>
        <div className="flex flex-wrap gap-2 pt-1.5">
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
          <Calendar size={14} strokeWidth={2} className="shrink-0" style={{ color: C.brand }} />
          {r.dateLabel} · {r.time} · {event.area}
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
              {event.organizer}
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

function ListCard({ event }: { event: LocalEvent }) {
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
            {event.when} · {event.price}
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

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
        {title}
      </h2>
      <p className="mt-1.5 max-w-[540px] text-base leading-6" style={{ color: C.muted }}>
        {sub}
      </p>
    </div>
  );
}

const MAP_NOTE =
  "Every event on this map also appears in the list above. Sensitive locations show a broad area only, never an exact address.";

function AreaMap({ byArea }: { byArea: [Area, LocalEvent[]][] }) {
  return (
    <>
      <div
        className="relative h-72 overflow-hidden rounded-3xl sm:h-auto sm:aspect-[1232/418]"
        style={{ border: `1px solid ${C.line}`, background: C.panel }}
      >
        <Image
          src="/events-near-you/area-map.webp"
          alt=""
          fill
          sizes="(min-width: 1280px) 1232px, 100vw"
          className="object-cover"
        />
        {byArea.map(([area, events]) => {
          const { x, y } = AREAS[area];
          const cluster = events.length >= CLUSTER_AT;
          return (
            <div
              key={area}
              className="absolute flex flex-col items-center"
              // Centre the marker (not the label) on the area's point.
              style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, ${cluster ? "-18px" : "-7px"})` }}
            >
              {cluster ? (
                <span
                  className="flex size-9 items-center justify-center rounded-full border-2 border-white text-sm font-extrabold text-white shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
                  style={{ background: C.inkDeep }}
                >
                  {events.length}
                </span>
              ) : (
                <span
                  className="size-3.5 rounded-md border-[3px] border-white shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
                  style={{ background: C.brand }}
                />
              )}
              <span
                className="mt-1 whitespace-nowrap rounded-md bg-white px-1.5 py-0.5 text-[11px] font-bold sm:mt-1.5 sm:px-2 sm:py-[3px] sm:text-xs shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
                style={{ color: C.ink }}
              >
                {area}
                <span className="sr-only">
                  : {events.length} {events.length === 1 ? "event" : "events"}
                </span>
              </span>
            </div>
          );
        })}
        <p
          className="absolute bottom-5 left-5 hidden max-w-[320px] rounded-xl bg-white/90 px-4 py-3 text-xs leading-5 sm:block"
          style={{ color: C.muted }}
        >
          {MAP_NOTE}
        </p>
      </div>
      <p className="mt-3 text-xs leading-5 sm:hidden" style={{ color: C.muted }}>
        {MAP_NOTE}
      </p>
    </>
  );
}

function AreaList({ byArea }: { byArea: [Area, LocalEvent[]][] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {byArea.map(([area, events]) => (
        <li key={area} className="rounded-[20px] bg-white p-5" style={{ border: `1px solid ${C.line}` }}>
          <p className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-base font-extrabold" style={{ color: C.ink }}>
              <MapPin size={16} strokeWidth={2} style={{ color: C.brand }} />
              {area}
            </span>
            <span className="text-xs font-semibold" style={{ color: C.muted }}>
              {events.length} {events.length === 1 ? "event" : "events"}
            </span>
          </p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {events.map((e) => (
              <li key={e.id} className="text-sm" style={{ color: C.inkDeep }}>
                {e.title}
                <span style={{ color: C.muted }}> · {e.when}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default function NearYouBrowser() {
  const [filter, setFilter] = useState("all");
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());
  const [view, setView] = useState<"list" | "map">("map");

  const test = FILTERS.find((f) => f.id === filter)!.test;
  const matching = EVENTS.filter(test);
  const recs = matching.filter((e) => e.rec).sort((a, b) => a.rec!.rank - b.rec!.rank);

  const byArea = (Object.keys(AREAS) as Area[])
    .map((a) => [a, matching.filter((e) => e.area === a)] as [Area, LocalEvent[]])
    .filter(([, events]) => events.length > 0);

  const toggleSave = (id: string) => {
    const next = new Set(saved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSaved(next);
  };

  return (
    <>
      <div className={`${WRAP} pb-10 pt-2 sm:pb-12`}>
        <div
          role="group"
          aria-label="Filter local events"
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

      <section className="bg-white py-14 sm:py-20">
        <div className={WRAP}>
          <Heading
            title={`Recommended in ${REGION}`}
            sub="A small, explainable set — eligibility always comes before ranking."
          />
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
              <Empty>None of the recommended events match this filter.</Empty>
            </div>
          )}
        </div>
      </section>

      <section id="local-events" className="scroll-mt-6 py-14 sm:py-20" style={{ background: C.panel }}>
        <div className={WRAP}>
          <Heading
            title="Local events, in order"
            sub={`A stable snapshot for ${REGION}. Sensitive venues stay broad or protected until you're eligible to see more.`}
          />
          {GROUPS.map((g) => {
            const inGroup = matching.filter(g.test);
            // Recommended picks already have a full card above.
            const rest = inGroup.filter((e) => !e.rec);
            return (
              <div key={g.name} className="mt-8">
                <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-xl font-bold" style={{ color: C.ink }}>
                    {g.name}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: C.muted }}>
                    {inGroup.length} eligible {inGroup.length === 1 ? "event" : "events"}
                  </span>
                </h3>
                {rest.length > 0 ? (
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    {rest.map((e) => (
                      <ListCard key={e.id} event={e} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5">
                    <Empty>
                      {inGroup.length === 0
                        ? "No events in this window match this filter."
                        : "The matching events are shown in Recommended above."}
                    </Empty>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className={WRAP}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Heading
              title="See it on a map"
              sub="Approximate area only. Protected venues — foster homes, wildlife sites — never appear as exact pins."
            />
            <div
              role="group"
              aria-label="Show areas as"
              className="flex rounded-full bg-white p-1"
              style={{ border: `1px solid ${C.line}` }}
            >
              {(["list", "map"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className="rounded-full px-4 py-2 text-xs font-bold capitalize transition"
                  style={view === v ? { background: C.brand, color: "#fff" } : { color: C.muted }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8">
            {byArea.length === 0 ? (
              <Empty>No events match this filter, so there is nothing to place.</Empty>
            ) : view === "map" ? (
              <AreaMap byArea={byArea} />
            ) : (
              <AreaList byArea={byArea} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
