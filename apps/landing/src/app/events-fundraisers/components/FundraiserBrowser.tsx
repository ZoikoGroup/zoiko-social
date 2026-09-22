"use client";

import { useCallback, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import FundraiserCard from "./FundraiserCard";
import FundraiserModal from "./FundraiserModal";
import { FUNDRAISERS, type Fundraiser } from "./fundraisers";
import { C } from "./theme";

type Chip = "emergency" | "shelter" | "transport" | "verified" | "live";

const CHIPS: readonly { id: Chip; label: string; test: (f: Fundraiser) => boolean }[] = [
  { id: "emergency", label: "Emergency care", test: (f) => f.cause === "emergency" },
  { id: "shelter", label: "Shelter operations", test: (f) => f.cause === "shelter" },
  { id: "transport", label: "Rescue transport", test: (f) => f.cause === "transport" },
  // Every listed fundraiser currently carries a verified beneficiary.
  { id: "verified", label: "Verified beneficiary only", test: () => true },
  { id: "live", label: "Currently live", test: (f) => f.status === "live" },
];

export default function FundraiserBrowser() {
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState<ReadonlySet<Chip>>(new Set());
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());
  const [viewing, setViewing] = useState<Fundraiser | null>(null);
  const closeModal = useCallback(() => setViewing(null), []);
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const active = CHIPS.filter((c) => chips.has(c.id));
  const results = FUNDRAISERS.filter(
    (f) =>
      (!q || [f.title, f.beneficiary, f.blurb].some((s) => s.toLowerCase().includes(q))) &&
      active.every((c) => c.test(f)),
  );

  const toggle = <T,>(set: ReadonlySet<T>, v: T) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  return (
    <>
      <div className="pb-4 pt-2">
        <label
          className="flex items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ background: C.panel, border: `1px solid ${C.line}` }}
        >
          <Search size={16} strokeWidth={2} className="shrink-0" style={{ color: C.ink }} />
          <span className="sr-only">Search fundraisers</span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fundraisers, beneficiaries, or causes"
            className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-[#737373] sm:text-sm"
            style={{ color: C.ink }}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 pb-4 pt-1">
        {CHIPS.map((c) => {
          const on = chips.has(c.id);
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => setChips(toggle(chips, c.id))}
              className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition"
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

      <div className="flex flex-wrap items-center justify-between gap-3 py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
        <button
          type="button"
          onClick={() => searchRef.current?.focus()}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold transition hover:bg-neutral-50"
          style={{ color: C.ink, border: `1px solid ${C.line}` }}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          Filters
        </button>
        <label className="flex items-center gap-2">
          <span className="text-xs font-semibold leading-5" style={{ color: C.muted }}>
            Sort
          </span>
          <select
            defaultValue="recommended"
            className="rounded-xl bg-white py-2 pl-4 pr-7 text-base font-semibold outline-none sm:text-sm"
            style={{ color: C.ink, border: `1px solid ${C.line}` }}
          >
            <option value="recommended">Recommended</option>
          </select>
        </label>
      </div>

      <section id="fundraisers" className="scroll-mt-6 pb-9 pt-14">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold leading-8" style={{ color: C.inkDeep }}>
              Fundraisers
            </h2>
            <p className="max-w-[560px] text-xs leading-5" style={{ color: C.muted }}>
              Eligibility and trust precede ranking — sponsored placement never
              bypasses safety or financial integrity.
            </p>
          </div>
          <p className="text-xs font-semibold leading-5" style={{ color: C.muted }}>
            {results.length} {results.length === 1 ? "fundraiser" : "fundraisers"}
          </p>
        </div>
        {results.length > 0 ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((f) => (
              <FundraiserCard
                key={f.id}
                f={f}
                saved={saved.has(f.id)}
                onToggleSave={() => setSaved(toggle(saved, f.id))}
                onView={() => setViewing(f)}
              />
            ))}
          </div>
        ) : (
          <p
            className="mt-4 rounded-3xl px-6 py-10 text-center text-sm"
            style={{ background: C.panel, border: `1px dashed ${C.line}`, color: C.muted }}
          >
            No fundraisers match these filters.
          </p>
        )}
      </section>

      {viewing && <FundraiserModal f={viewing} onClose={closeModal} />}
    </>
  );
}
