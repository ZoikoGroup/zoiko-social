"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import FiltersDrawer, { EMPTY_DRAWER, type Drawer } from "./FiltersDrawer";
import MeetupCard from "./MeetupCard";
import { INTERESTS, MEETUPS, type Meetup } from "./meetups";
import { C } from "./theme";

const CHIPS: readonly { id: string; label: string; test: (m: Meetup) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "welcome", label: "Animals welcome", test: (m) => m.animals === "welcome" },
  { id: "people", label: "People-only", test: (m) => m.animals === "people-only" },
  { id: "ages", label: "All ages", test: (m) => m.age === "all" },
  { id: "recurring", label: "Recurring series", test: (m) => Boolean(m.recurrence) },
];

function matchesDrawer(m: Meetup, d: Drawer) {
  if (d.formats.size && !d.formats.has(m.format)) return false;
  if (d.animals.size && !d.animals.has(m.animals)) return false;
  if (d.age !== "any" && m.age !== d.age) return false;
  if (d.frequency.size && !d.frequency.has(m.recurrence ? "recurring" : "one-time")) return false;
  return true;
}

function matchesQuery(m: Meetup, q: string) {
  if (!q) return true;
  const interests = INTERESTS.filter((i) => m.interests.includes(i.id)).map((i) => i.label);
  return [m.title, ...interests].some((s) => s.toLowerCase().includes(q));
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export default function MeetupsBrowser() {
  const [chip, setChip] = useState("all");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<Drawer>(EMPTY_DRAWER);
  const [draft, setDraft] = useState<Drawer>(EMPTY_DRAWER);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());

  const q = query.trim().toLowerCase();
  const chipTest = CHIPS.find((c) => c.id === chip)!.test;
  const results = MEETUPS.filter((m) => chipTest(m) && matchesQuery(m, q) && matchesDrawer(m, applied));
  const series = MEETUPS.filter((m) => m.recurrence);

  const toggleSave = (id: string) => {
    const next = new Set(saved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSaved(next);
  };

  const openDrawer = () => {
    setDraft(applied);
    setDrawerOpen(true);
  };
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const pickInterest = (label: string) => {
    setQuery(label);
    document.getElementById("meetups")?.scrollIntoView({ behavior: "smooth" });
  };

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

      <div id="meetups" className="flex scroll-mt-6 flex-wrap items-end gap-3 pt-4 sm:gap-4">
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
              placeholder="Search meetups by title or interest"
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
          onClick={openDrawer}
          aria-haspopup="dialog"
          className="flex h-12 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-white px-4 text-sm font-bold sm:flex-none transition hover:bg-neutral-50"
          style={{ color: C.ink, border: `1px solid ${C.line}` }}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          More filters
        </button>
      </div>

      <p className="pt-3 text-sm leading-5" style={{ color: C.muted }}>
        Recommended meetups
      </p>
      <div className="pt-5">
        {results.length > 0 ? (
          <Grid>
            {results.map((m) => (
              <MeetupCard key={m.id} meetup={m} saved={saved.has(m.id)} onToggleSave={() => toggleSave(m.id)} />
            ))}
          </Grid>
        ) : (
          <p
            className="rounded-[20px] bg-white px-6 py-10 text-center text-sm"
            style={{ border: `1px dashed ${C.line}`, color: C.muted }}
          >
            No meetups match these filters.
          </p>
        )}
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
          Browse by interest
        </h2>
        <div className="grid grid-cols-2 gap-3 pt-5 sm:gap-4 lg:grid-cols-4">
          {INTERESTS.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => pickInterest(i.label)}
              className="group relative h-28 overflow-hidden rounded-xl text-left sm:h-36"
              style={{
                border: `1px solid ${C.inkDeep}`,
                // The design leaves the Horse Lovers tile without a photo.
                background: i.image ? undefined : "linear-gradient(180deg, #F7F9FA 0%, #EDEFEF 45%, #3E4E53 100%)",
              }}
            >
              {i.image && (
                <Image
                  src={i.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 296px, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span
                className="absolute bottom-2.5 left-3 text-xs font-bold text-white"
                style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.40)" }}
              >
                {i.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="pt-16">
        <h2 className="text-xl font-extrabold sm:text-2xl" style={{ color: C.ink }}>
          Recurring series &amp; community meetups
        </h2>
        <div className="pt-5">
          <Grid>
            {series.map((m) => (
              <MeetupCard
                key={m.id}
                meetup={m}
                series
                saved={saved.has(m.id)}
                onToggleSave={() => toggleSave(m.id)}
              />
            ))}
          </Grid>
        </div>
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
