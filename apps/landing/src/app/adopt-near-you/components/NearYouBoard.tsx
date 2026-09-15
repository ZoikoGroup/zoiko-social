"use client";

import { useMemo, useState } from "react";
import { List, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { C } from "./theme";
import { LISTINGS, REGION, type Kind, type NearbyListing } from "./nearYou";
import NearbyCard from "./NearbyCard";
import MoreFiltersDrawer, {
  EMPTY_EXTRAS,
  extrasAreEmpty,
  type ExtraFilters,
} from "./MoreFiltersDrawer";

const TABS = ["All", "Adoption", "Foster"] as const;
const SORTS = ["Recommended nearby", "Nearest first", "Recently listed"] as const;

/** How many cards show before Load more. The comp lists eight. */
const PAGE = 8;

/** The drawer says "children" where a listing's own chip says "kids". */
const FIT_ALIASES: Record<string, string[]> = {
  "Good with children": ["Good with kids", "Good with children"],
  "Good with dogs": ["Good with dogs"],
  "Good with cats": ["Good with cats"],
};

/** Miles ceiling for each distance option; Infinity means no limit. */
const DISTANCE_LIMIT: Record<string, number> = {
  "Any distance in region": Infinity,
  "Within 5 mi": 5,
  "Within 10 mi": 10,
  "Within 25 mi": 25,
};

export default function NearYouBoard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Recommended nearby");
  const [view, setView] = useState<"List" | "Map">("List");
  const [saved, setSaved] = useState<string[]>([]);
  const [shown, setShown] = useState(PAGE);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [extras, setExtras] = useState<ExtraFilters>(EMPTY_EXTRAS);
  const [draft, setDraft] = useState<ExtraFilters>(EMPTY_EXTRAS);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list: NearbyListing[] = LISTINGS.filter((l) => {
      if (tab !== "All" && l.kind !== (tab as Kind)) return false;
      if (q && !`${l.name} ${l.breed} ${l.org}`.toLowerCase().includes(q)) return false;

      /* Age reads off the listing's own breed line — "Cat · Domestic
         Shorthair · Senior" — rather than a field added to it. */
      const ages = extras.checks["Age / life stage"] ?? [];
      if (ages.length && !ages.some((a) => l.breed.toLowerCase().includes(a.toLowerCase()))) {
        return false;
      }

      const fits = extras.checks["Household fit"] ?? [];
      if (
        fits.length &&
        !fits.some((f) => (FIT_ALIASES[f] ?? [f]).some((alias) => l.attributes.includes(alias)))
      ) {
        return false;
      }

      if (l.miles > (DISTANCE_LIMIT[extras.distance] ?? Infinity)) return false;
      if (extras.source !== "Any verified organization" && l.org !== extras.source) return false;

      /* Size is in the comp's drawer but no listing states one, so a chosen
         size matches nothing until organizations supply it. */
      if (extras.size !== "Any size") return false;

      return true;
    });

    if (sort === "Nearest first") {
      list = [...list].sort((a, b) => a.miles - b.miles);
    } else if (sort === "Recently listed") {
      list = [...list].sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
    }
    return list;
  }, [tab, query, sort, extras]);

  const visible = results.slice(0, shown);
  const filtered = tab !== "All" || query !== "" || !extrasAreEmpty(extras);

  const reset = () => {
    setTab("All");
    setQuery("");
    setExtras(EMPTY_EXTRAS);
    setDraft(EMPTY_EXTRAS);
    setShown(PAGE);
  };

  return (
    <>
      {/* All / Adoption / Foster */}
      <div
        className="inline-flex gap-0.5 rounded-[100px] p-1"
        style={{ background: C.page, border: `1px solid ${C.line}` }}
      >
        {TABS.map((t) => {
          const on = tab === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setTab(t);
                setShown(PAGE);
              }}
              className="rounded-[100px] px-5 py-2 text-sm font-bold transition"
              style={on ? { background: C.brand, color: "#fff" } : { color: C.muted }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Search, sort, and the drawer trigger. */}
      <div className="flex flex-wrap items-end gap-4 pt-6">
        <div className="min-w-48 flex-1 basis-[420px]">
          <label
            htmlFor="near-search"
            className="block pb-2 text-xs font-bold leading-5"
            style={{ color: C.inkDeep }}
          >
            Search
          </label>
          <div className="relative">
            <Search
              size={16}
              strokeWidth={1.42}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: C.muted }}
              aria-hidden
            />
            <input
              id="near-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShown(PAGE);
              }}
              placeholder="Search by name, species, or organization"
              className="w-full rounded-xl bg-white py-3 pl-11 pr-3.5 text-sm outline-none placeholder:text-[#757575]"
              style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
            />
          </div>
        </div>

        <div className="min-w-44">
          <label
            htmlFor="near-sort"
            className="block pb-2 text-xs font-bold leading-5"
            style={{ color: C.inkDeep }}
          >
            Sort
          </label>
          <select
            id="near-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
            className="w-full rounded-xl bg-white px-4 py-3 text-sm"
            style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setDraft(extras);
            setDrawerOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-3 text-sm font-bold"
          style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
        >
          <SlidersHorizontal size={14} strokeWidth={1.25} aria-hidden />
          More filters
        </button>
      </div>

      {/* List / Map */}
      <div
        className="mt-5 inline-flex gap-0.5 rounded-[10px] p-[3px]"
        style={{ background: C.page, border: `1px solid ${C.line}` }}
      >
        {(["List", "Map"] as const).map((v) => {
          const on = view === v;
          const Icon = v === "List" ? List : MapPin;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={on}
              onClick={() => setView(v)}
              className="flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-bold transition"
              style={
                on
                  ? {
                      background: "#fff",
                      color: C.ink,
                      boxShadow: "0px 1px 2px 0px rgba(7,59,71,0.06)",
                    }
                  : { color: C.muted }
              }
            >
              <Icon size={14} strokeWidth={1} aria-hidden />
              {v}
            </button>
          );
        })}
      </div>

      <p className="pt-5 text-sm leading-5" style={{ color: C.muted }}>
        Showing {filtered ? `${results.length} of ${LISTINGS.length} ` : ""}eligible listings
        around {REGION}
      </p>

      {view === "Map" ? (
        /* The comp designs the List view only; Map has no layout yet, so it
           says so rather than showing an empty frame. */
        <div
          className="mt-4 rounded-[20px] bg-white px-6 py-12 text-center"
          style={{ border: `1px solid ${C.line}` }}
        >
          <MapPin size={22} strokeWidth={1.5} className="mx-auto" style={{ color: C.brand }} aria-hidden />
          <p className="pt-3 text-sm font-bold" style={{ color: C.inkDeep }}>
            Map view is coming soon.
          </p>
          <p className="pt-1 text-xs leading-5" style={{ color: C.muted }}>
            Listings show broad locality only, never an exact private address.
          </p>
          <button
            type="button"
            onClick={() => setView("List")}
            className="mt-3 text-sm font-semibold underline"
            style={{ color: C.brand }}
          >
            Back to list
          </button>
        </div>
      ) : visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 xl:grid-cols-4">
          {visible.map((listing) => (
            <NearbyCard
              key={listing.id}
              listing={listing}
              saved={saved.includes(listing.id)}
              onToggleSave={() =>
                setSaved((list) =>
                  list.includes(listing.id)
                    ? list.filter((x) => x !== listing.id)
                    : [...list, listing.id],
                )
              }
            />
          ))}
        </div>
      ) : (
        <div
          className="mt-4 rounded-[20px] bg-white px-6 py-10 text-center"
          style={{ border: `1px solid ${C.line}` }}
        >
          <p className="text-sm font-bold" style={{ color: C.inkDeep }}>
            No listings near you match these filters.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-sm font-semibold underline"
            style={{ color: C.brand }}
          >
            Clear filters
          </button>
        </div>
      )}

      {view === "List" && shown < results.length ? (
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="rounded-xl bg-white px-6 py-2.5 text-sm font-semibold"
            style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
          >
            Load more
          </button>
        </div>
      ) : null}

      <MoreFiltersDrawer
        open={drawerOpen}
        draft={draft}
        onDraftChange={setDraft}
        onClose={() => setDrawerOpen(false)}
        onApply={() => {
          setExtras(draft);
          setShown(PAGE);
          setDrawerOpen(false);
        }}
      />
    </>
  );
}
