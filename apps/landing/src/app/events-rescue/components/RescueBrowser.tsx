"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import FiltersDrawer, { EMPTY_DRAWER, type Drawer } from "./FiltersDrawer";
import RescueCard, { type Section } from "./RescueCard";
import RsvpModal from "./RsvpModal";
import { EVENTS, TYPE_TILES, type EventType, type RescueEvent } from "./rescueEvents";
import { C } from "./theme";

const CHIPS: readonly { id: string; label: string; test: (e: RescueEvent) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "adoption", label: "Adoption days", test: (e) => e.type === "adoption" },
  { id: "volunteer", label: "Volunteer / hands-on", test: (e) => e.participation === "Volunteer / hands-on" },
  { id: "adoptable", label: "Adoptable animals present", test: (e) => e.adoptable },
  { id: "fundraiser", label: "Includes fundraiser", test: (e) => Boolean(e.fundraiser) },
];

function matchesDrawer(e: RescueEvent, d: Drawer) {
  if (d.types.size && !d.types.has(e.type)) return false;
  if (d.species.size && !d.species.has(e.species)) return false;
  if (d.participation !== "any" && e.participation !== d.participation) return false;
  if (d.presence.size && !d.presence.has(e.adoptable ? "adoptable" : "none")) return false;
  return true;
}

function Empty() {
  return (
    <p
      className="rounded-[20px] bg-white px-6 py-10 text-center text-sm"
      style={{ border: `1px dashed ${C.line}`, color: C.muted }}
    >
      No rescue events match these filters.
    </p>
  );
}

export default function RescueBrowser() {
  const [chip, setChip] = useState("all");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<Drawer>(EMPTY_DRAWER);
  const [draft, setDraft] = useState<Drawer>(EMPTY_DRAWER);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());
  const [rsvpFor, setRsvpFor] = useState<RescueEvent | null>(null);

  const q = query.trim().toLowerCase();
  const chipTest = CHIPS.find((c) => c.id === chip)!.test;
  const results = EVENTS.filter(
    (e) =>
      chipTest(e) &&
      (!q || [e.title, e.organizer].some((s) => s.toLowerCase().includes(q))) &&
      matchesDrawer(e, applied),
  );
  const featured = EVENTS.find((e) => e.photos.featured)!;
  const upcoming = EVENTS.filter((e) => e.photos.upcoming);

  const toggleSave = (id: string) => {
    const next = new Set(saved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSaved(next);
  };
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const closeRsvp = useCallback(() => setRsvpFor(null), []);

  const pickType = (type: EventType) => {
    setQuery("");
    setChip("all");
    const next = { ...EMPTY_DRAWER, types: new Set([type]) };
    setDraft(next);
    setApplied(next);
    document.getElementById("rescue-events")?.scrollIntoView({ behavior: "smooth" });
  };

  const card = (e: RescueEvent, section: Section) => (
    <RescueCard
      key={e.id}
      e={e}
      section={section}
      saved={saved.has(e.id)}
      onToggleSave={() => toggleSave(e.id)}
      onRsvp={() => setRsvpFor(e)}
    />
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 pb-1 pt-8">
        {CHIPS.map((c) => {
          const on = c.id === chip;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => setChip(c.id)}
              className="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold leading-5 transition"
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

      <div className="flex flex-wrap items-end gap-3 pt-4 sm:gap-4">
        <label className="w-full max-w-[560px] sm:min-w-48 sm:flex-1">
          <span className="block pb-2 text-xs font-bold leading-5" style={{ color: C.ink }}>
            Search
          </span>
          <span className="relative block">
            <Search size={16} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
            <input
              type="search"
              value={query}
              onChange={(ev) => setQuery(ev.target.value)}
              placeholder="Search rescue events by title or organizer"
              className="w-full rounded-xl bg-white py-3 pl-11 pr-4 text-base outline-none placeholder:text-[#737373] sm:text-sm"
              style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
            />
          </span>
        </label>
        <label className="min-w-0 flex-1 sm:min-w-44 sm:flex-none">
          <span className="block pb-2 text-xs font-bold leading-5" style={{ color: C.ink }}>
            Sort
          </span>
          <select
            defaultValue="recommended"
            className="h-12 w-full rounded-xl bg-white pl-4 pr-7 text-base outline-none sm:text-sm"
            style={{ color: C.ink, border: `1px solid ${C.line}` }}
          >
            <option value="recommended">Recommended</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setDraft(applied);
            setDrawerOpen(true);
          }}
          aria-haspopup="dialog"
          className="flex h-12 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-white px-4 text-sm font-bold transition hover:bg-neutral-50 sm:flex-none"
          style={{ color: C.ink, border: `1px solid ${C.line}` }}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          More filters
        </button>
      </div>

      <h2 className="pt-3 text-xl font-extrabold leading-8" style={{ color: C.inkDeep }}>
        Featured event
      </h2>
      <div className="pt-4">{card(featured, "featured")}</div>

      <p id="rescue-events" className="scroll-mt-6 pt-16 text-sm leading-5" style={{ color: C.muted }}>
        All rescue events
      </p>
      <div className="pt-5">
        {results.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map((e) => card(e, "all"))}</div>
        ) : (
          <Empty />
        )}
      </div>

      <section className="pt-16">
        <h2 className="text-xl font-extrabold sm:text-2xl" style={{ color: C.ink }}>
          Browse by event type
        </h2>
        <div className="grid grid-cols-2 gap-3 pt-5 sm:gap-4 lg:grid-cols-4">
          {TYPE_TILES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => pickType(t.id)}
              className="group relative h-28 overflow-hidden rounded-xl text-left sm:h-36"
              style={{ border: `1px solid ${C.inkDeep}` }}
            >
              <Image
                src={t.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 296px, 50vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white" style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.40)" }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="pt-16">
        <h2 className="text-xl font-extrabold sm:text-2xl" style={{ color: C.ink }}>
          Upcoming rescue events
        </h2>
        <div className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map((e) => card(e, "upcoming"))}</div>
      </section>

      {drawerOpen && (
        <FiltersDrawer
          draft={draft}
          setDraft={setDraft}
          onClose={closeDrawer}
          onReset={() => {
            setDraft(EMPTY_DRAWER);
            setApplied(EMPTY_DRAWER);
          }}
          onApply={() => {
            setApplied(draft);
            setDrawerOpen(false);
          }}
        />
      )}

      {rsvpFor && <RsvpModal e={rsvpFor} onClose={closeRsvp} />}
    </>
  );
}
