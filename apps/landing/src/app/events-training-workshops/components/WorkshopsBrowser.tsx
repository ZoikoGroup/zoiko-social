"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import FiltersDrawer, { EMPTY_DRAWER, type Drawer } from "./FiltersDrawer";
import WorkshopCard, { type Section } from "./WorkshopCard";
import { LEARNING_TYPES, WORKSHOPS, type Workshop } from "./workshops";
import { C } from "./theme";

const CHIPS: readonly { id: string; label: string; test: (w: Workshop) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "intro", label: "Introductory", test: (w) => w.level === "Introductory" },
  { id: "online", label: "Online", test: (w) => w.mode === "Online" },
  { id: "hands-on", label: "Hands-on", test: (w) => w.participation === "Low-risk hands-on" },
  { id: "pro", label: "Professional-only", test: (w) => w.level === "Professional-only" },
];

function matchesDrawer(w: Workshop, d: Drawer) {
  if (d.modes.size && !d.modes.has(w.mode)) return false;
  if (d.levels.size && !d.levels.has(w.level)) return false;
  if (d.participation !== "any" && w.participation !== d.participation) return false;
  if (d.animals.size && !d.animals.has(w.animals)) return false;
  return true;
}

function matchesQuery(w: Workshop, q: string) {
  if (!q) return true;
  return [w.title, ...w.types].some((s) => s.toLowerCase().includes(q));
}

function Empty() {
  return (
    <p
      className="rounded-[20px] bg-white px-6 py-10 text-center text-sm"
      style={{ border: `1px dashed ${C.line}`, color: C.muted }}
    >
      No workshops match these filters.
    </p>
  );
}

export default function WorkshopsBrowser() {
  const [chip, setChip] = useState("all");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<Drawer>(EMPTY_DRAWER);
  const [draft, setDraft] = useState<Drawer>(EMPTY_DRAWER);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());

  const q = query.trim().toLowerCase();
  const chipTest = CHIPS.find((c) => c.id === chip)!.test;
  const results = WORKSHOPS.filter((w) => chipTest(w) && matchesQuery(w, q) && matchesDrawer(w, applied));
  const recommended = results.filter((w) => w.reason);
  const upcoming = WORKSHOPS.filter((w) => w.photos.upcoming);

  const toggleSave = (id: string) => {
    const next = new Set(saved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSaved(next);
  };

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const grid = (list: readonly Workshop[], section: Section) => (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((w) => (
        <WorkshopCard
          key={w.id}
          workshop={w}
          section={section}
          saved={saved.has(w.id)}
          onToggleSave={() => toggleSave(w.id)}
        />
      ))}
    </div>
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

      <div id="workshops" className="flex scroll-mt-6 flex-wrap items-end gap-3 pt-4 sm:gap-4">
        <label className="w-full max-w-[560px] sm:min-w-48 sm:flex-1">
          <span className="block pb-2 text-xs font-bold leading-5" style={{ color: C.ink }}>
            Search
          </span>
          <span className="relative block">
            <Search
              size={16}
              strokeWidth={2}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: C.muted }}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workshops by title or topic"
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
        Recommended for you
      </h2>
      <div className="pt-6">{recommended.length > 0 ? grid(recommended, "recommended") : <Empty />}</div>

      <p className="pt-16 text-sm leading-5" style={{ color: C.muted }}>
        All workshops
      </p>
      <div className="pt-5">
        {results.length > 0 ? grid(results, "all") : <Empty />}
        <div className="flex justify-center pt-6">
          <a
            href="/events-upcoming"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
            style={{ color: C.ink, border: `1px solid ${C.line}` }}
          >
            Load more
          </a>
        </div>
      </div>

      <section className="pt-16">
        <h2 className="text-xl font-extrabold sm:text-2xl" style={{ color: C.ink }}>
          Browse by learning type
        </h2>
        <div className="grid grid-cols-2 gap-3 pt-5 sm:gap-4 lg:grid-cols-4">
          {LEARNING_TYPES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => {
                setQuery(t.label);
                document.getElementById("workshops")?.scrollIntoView({ behavior: "smooth" });
              }}
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
              <span
                className="absolute bottom-2.5 left-3 text-xs font-bold text-white"
                style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.40)" }}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="upcoming-sessions" className="scroll-mt-6 pt-16">
        <h2 className="text-xl font-extrabold sm:text-2xl" style={{ color: C.ink }}>
          Upcoming sessions
        </h2>
        <div className="pt-5">{grid(upcoming, "upcoming")}</div>
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
    </>
  );
}
