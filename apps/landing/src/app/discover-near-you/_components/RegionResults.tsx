"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { C } from "./theme";
import {
  PURPOSES,
  SPECIES,
  TRUST,
  type Community,
  type JoinState,
  type Region,
  type Trust,
} from "./regions";
import CommunityCard from "./CommunityCard";

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onToggle: (option: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2 pt-1">
      <p className="text-xs font-bold uppercase leading-4 tracking-tight" style={{ color: C.muted }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={on}
              className="rounded-full px-3.5 py-2 text-xs font-semibold transition hover:opacity-80"
              style={
                on
                  ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                  : { background: "#fff", color: C.muted, border: `1px solid ${C.line}` }
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Search, filters and the community grid for one region.
 *
 * Mounted with the region as its key, so choosing another region starts
 * from a clean slate. Within a group, options widen the match (Dogs or
 * Cats); across groups they narrow it (Dogs and Meetups); every Trust option
 * picked must hold.
 */
export default function RegionResults({ region }: { region: Region }) {
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState<(typeof SPECIES)[number][]>([]);
  const [purposes, setPurposes] = useState<(typeof PURPOSES)[number][]>([]);
  const [trust, setTrust] = useState<Trust[]>([]);
  const [showWider, setShowWider] = useState(false);
  // Join changes are kept here rather than in each card, so they survive a
  // card being filtered out and back in.
  const [joins, setJoins] = useState<Record<string, JoinState>>({});

  const joinOf = (c: Community) => joins[c.id] ?? c.join;
  const wider = region.wider;
  const widerIds = new Set(wider?.communities.map((c) => c.id));
  const pool = [...region.communities, ...(showWider && wider ? wider.communities : [])];

  const q = query.trim().toLowerCase();
  const results = pool.filter((c) => {
    if (q && !`${c.name} ${c.description}`.toLowerCase().includes(q)) return false;
    if (species.length && !c.species.some((s) => species.includes(s))) return false;
    if (purposes.length && !c.purposes.some((p) => purposes.includes(p))) return false;
    return trust.every((t) =>
      t === "Open to join" ? joinOf(c) === "open" : c.badges.includes(t),
    );
  });

  const filtered = Boolean(q || species.length || purposes.length || trust.length);
  const clear = () => {
    setQuery("");
    setSpecies([]);
    setPurposes([]);
    setTrust([]);
  };

  return (
    <>
      <section className="flex flex-col gap-2 pb-2 pt-8" style={{ borderBottom: `1px solid ${C.line}` }}>
        <label
          className="flex w-full max-w-96 items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ border: `1px solid ${C.line}` }}
        >
          <Search size={16} strokeWidth={2} className="shrink-0" style={{ color: C.inkDeep }} />
          <span className="sr-only">Search communities in this region</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities in this region"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#71767A]"
            style={{ color: C.inkDeep }}
          />
        </label>

        <FilterGroup label="Species" options={SPECIES} selected={species} onToggle={(o) => setSpecies((l) => toggle(l, o))} />
        <FilterGroup label="Purpose" options={PURPOSES} selected={purposes} onToggle={(o) => setPurposes((l) => toggle(l, o))} />
        <FilterGroup label="Trust & membership" options={TRUST} selected={trust} onToggle={(o) => setTrust((l) => toggle(l, o))} />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <p className="text-sm leading-5" style={{ color: C.muted }} aria-live="polite">
            {results.length} eligible {results.length === 1 ? "community" : "communities"} in {region.name}
            {showWider && wider ? ` and across ${wider.label}` : ""}
          </p>
          <button
            type="button"
            onClick={clear}
            disabled={!filtered}
            className="text-sm font-semibold underline underline-offset-2 transition enabled:hover:opacity-80 disabled:cursor-default disabled:opacity-40"
            style={{ color: C.brand }}
          >
            Clear filters
          </button>
        </div>
      </section>

      {results.length ? (
        <div className="grid gap-6 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              regionName={region.name}
              localNote={
                widerIds.has(community.id) && wider
                  ? `Across ${wider.label}`
                  : `Local to ${region.name}`
              }
              join={joinOf(community)}
              onJoinChange={(next) => setJoins((j) => ({ ...j, [community.id]: next }))}
            />
          ))}
        </div>
      ) : (
        <div
          className="mt-5 flex flex-col items-center gap-2 rounded-[20px] px-6 py-10 text-center"
          style={{ border: `1px dashed ${C.line}` }}
        >
          <p className="text-sm leading-5" style={{ color: C.muted }}>
            No communities in {region.name} match these filters.
          </p>
          <button type="button" onClick={clear} className="text-sm font-bold underline underline-offset-2" style={{ color: C.brand }}>
            Clear filters
          </button>
        </div>
      )}

      {wider ? (
        <section
          className="mt-6 flex flex-col items-center gap-2 rounded-[20px] px-6 py-6 text-center"
          style={{ background: C.chip, border: `1px dashed ${C.brand}` }}
        >
          <h2 className="text-sm font-extrabold leading-5" style={{ color: C.ink }}>
            {showWider ? `Including communities across ${wider.label}` : `Showing communities local to ${region.name}`}
          </h2>
          <p className="max-w-md text-xs leading-5" style={{ color: C.muted }}>
            {showWider
              ? "Communities outside your local area are marked with their broader region."
              : "Want a wider view? You can see more eligible communities across the broader region without changing your saved region."}
          </p>
          <button
            type="button"
            onClick={() => setShowWider((v) => !v)}
            className="mt-1 rounded-xl bg-white px-4 py-2 text-xs font-semibold transition hover:opacity-80"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            {showWider ? `Show only ${region.name} communities` : `Show more communities across ${wider.label}`}
          </button>
        </section>
      ) : null}
    </>
  );
}
