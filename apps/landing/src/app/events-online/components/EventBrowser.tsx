"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import EventCard from "./EventCard";
import { EVENTS, type OnlineEvent } from "./events";
import { C } from "./theme";

type Chip = "today" | "week" | "free" | "fundraiser" | "professional";

const CHIPS: readonly { id: Chip; label: string; test: (e: OnlineEvent) => boolean }[] = [
  { id: "today", label: "Today", test: (e) => e.today },
  { id: "week", label: "Next 7 days", test: (e) => e.thisWeek },
  { id: "free", label: "Free", test: (e) => e.price === "Free" },
  { id: "fundraiser", label: "Fundraisers", test: (e) => e.topic === "fundraiser" },
  {
    id: "professional",
    label: "Professional education",
    test: (e) => e.topic === "professional",
  },
];

type Sort = "soonest" | "az";

/** Three rows of three, as in the design. */
const PAGE_SIZE = 9;

export default function EventBrowser() {
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState<ReadonlySet<Chip>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [transcriptOnly, setTranscriptOnly] = useState(false);
  const [hideInactive, setHideInactive] = useState(false);
  // Null keeps the design's curated order until the visitor picks a sort.
  const [sort, setSort] = useState<Sort | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const active = CHIPS.filter((c) => chips.has(c.id));
    const matches = EVENTS.filter(
      (e) =>
        (!q ||
          e.title.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q)) &&
        active.every((c) => c.test(e)) &&
        (!transcriptOnly || e.access.includes("Transcript")) &&
        (!hideInactive || (e.status !== "canceled" && e.status !== "replay")),
    );
    if (sort === "az") return matches.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "soonest") return matches.sort((a, b) => a.startsAt - b.startsAt);
    return matches;
  }, [query, chips, transcriptOnly, hideInactive, sort]);

  const toggle = <T,>(set: ReadonlySet<T>, v: T) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  // Any change to what matches starts pagination over.
  const resetPage = () => setVisible(PAGE_SIZE);

  const shown = results.slice(0, visible);

  return (
    <section id="events" className="scroll-mt-24">
      <label
        className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ background: C.panel, border: `1px solid ${C.line}` }}
      >
        <Search size={16} strokeWidth={2} style={{ color: C.inkDeep }} />
        <span className="sr-only">Search events</span>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            resetPage();
          }}
          placeholder="Search events, organizers, or topics"
          className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-neutral-500 sm:text-sm"
          style={{ color: C.inkDeep }}
        />
      </label>

      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 py-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {CHIPS.map((c) => {
          const on = chips.has(c.id);
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setChips(toggle(chips, c.id));
                resetPage();
              }}
              className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition"
              style={
                on
                  ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                  : { background: "#fff", color: C.muted, border: `1px solid ${C.line}` }
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-3 pb-3"
        style={{ borderBottom: `1px solid ${C.line}` }}
      >
        <button
          type="button"
          aria-expanded={showFilters}
          onClick={() => setShowFilters((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold transition hover:bg-neutral-50"
          style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          Filters
        </button>
        <label className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: C.muted }}>
            Sort
          </span>
          <select
            value={sort ?? "soonest"}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="w-32 rounded-xl bg-white px-4 py-2.5 text-base font-semibold outline-none sm:w-36 sm:text-sm"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            <option value="soonest">Soonest</option>
            <option value="az">A–Z</option>
          </select>
        </label>
      </div>

      {showFilters && (
        <div
          className="mt-3 flex flex-wrap gap-6 rounded-xl p-4 text-sm"
          style={{ background: C.panel, border: `1px solid ${C.line}`, color: C.inkDeep }}
        >
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={transcriptOnly}
              onChange={(e) => {
                setTranscriptOnly(e.target.checked);
                resetPage();
              }}
            />
            Transcript available
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hideInactive}
              onChange={(e) => {
                setHideInactive(e.target.checked);
                resetPage();
              }}
            />
            Hide canceled and ended events
          </label>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-2 pt-7 sm:pt-9">
        <div>
          <h2 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
            Online events
          </h2>
          <p className="text-xs leading-5" style={{ color: C.muted }}>
            Eligible events only — no fake inventory when results run out.
          </p>
        </div>
        <p className="text-xs font-semibold leading-5" style={{ color: C.muted }}>
          {results.length} {results.length === 1 ? "event" : "events"}
        </p>
      </div>

      {shown.length > 0 ? (
        <div className="mt-5 grid gap-x-5 gap-y-5 sm:grid-cols-2 sm:gap-y-9 lg:grid-cols-3">
          {shown.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              saved={saved.has(e.id)}
              onToggleSave={() => setSaved(toggle(saved, e.id))}
            />
          ))}
        </div>
      ) : (
        <div
          className="mt-5 rounded-3xl px-6 py-14 text-center"
          style={{ background: C.panel, border: `1px solid ${C.line}` }}
        >
          <p className="text-base font-bold" style={{ color: C.inkDeep }}>
            No events match these filters.
          </p>
          <p className="mt-1 text-sm" style={{ color: C.muted }}>
            Try removing a filter or searching for something broader.
          </p>
        </div>
      )}

      {visible < results.length && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            Load more events
          </button>
        </div>
      )}
    </section>
  );
}
