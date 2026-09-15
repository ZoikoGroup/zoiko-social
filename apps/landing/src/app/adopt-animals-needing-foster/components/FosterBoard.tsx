"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { C } from "./theme";
import { FOSTER_NEEDS, type FosterNeed } from "./fosterNeeds";
import FosterCard from "./FosterCard";
import MoreFiltersDrawer, {
  EMPTY_EXTRAS,
  extrasAreEmpty,
  type ExtraFilters,
} from "./MoreFiltersDrawer";

const PILLS = [
  "All",
  "Short-term",
  "Longer-term",
  "Medical-capable",
  "Near You",
  "Recently Listed",
] as const;

const SORTS = ["Best Match", "Recently Listed", "Soonest Needed", "Nearest"] as const;

/** How many cards show before Load more. The comp lists eight. */
const PAGE = 8;

/** A listing counts as recent for the Recently Listed pill inside a week. */
const RECENT_DAYS = 7;

const field =
  "w-full rounded-xl bg-white px-3.5 py-3 text-sm outline-none placeholder:text-[#757575]";

export default function FosterBoard() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Best Match");
  const [pill, setPill] = useState<(typeof PILLS)[number]>("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [shown, setShown] = useState(PAGE);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [extras, setExtras] = useState<ExtraFilters>(EMPTY_EXTRAS);
  const [draft, setDraft] = useState<ExtraFilters>(EMPTY_EXTRAS);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const loc = location.trim().toLowerCase();

    let list: FosterNeed[] = FOSTER_NEEDS.filter((n) => {
      if (q && !`${n.name} ${n.breed} ${n.org}`.toLowerCase().includes(q)) return false;
      if (loc && !n.area.toLowerCase().includes(loc)) return false;

      if (pill === "Short-term" || pill === "Longer-term" || pill === "Medical-capable") {
        if (n.duration !== pill) return false;
      }
      if (pill === "Near You" && !n.nearYou) return false;
      if (pill === "Recently Listed" && n.listedDaysAgo > RECENT_DAYS) return false;

      /* Drawer groups narrow on what the listings themselves state. Foster
         duration reuses the badge, so Medium-term and Open-ended match
         nothing in this set. */
      const durations = extras.checks["Foster duration"] ?? [];
      if (durations.length && !durations.includes(n.duration)) return false;

      const care = extras.checks["Care level"] ?? [];
      if (care.length && !care.some((c) => n.careLevel.includes(c as never))) return false;

      const fit = extras.checks["Household fit"] ?? [];
      if (fit.length && !fit.some((f) => n.householdFit.includes(f as never))) return false;

      if (extras.experience !== "Any experience level" && n.experience !== extras.experience) {
        return false;
      }
      return true;
    });

    if (sort === "Recently Listed") {
      list = [...list].sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
    } else if (sort === "Nearest") {
      list = [...list].sort((a, b) => Number(b.nearYou) - Number(a.nearYou));
    } else if (sort === "Soonest Needed") {
      /* Open needs first, then the ones no longer taking offers. */
      const rank = (n: FosterNeed) => (n.status === "needed" ? 0 : 1);
      list = [...list].sort((a, b) => rank(a) - rank(b));
    }
    return list;
  }, [query, location, pill, sort, extras]);

  const visible = results.slice(0, shown);
  const filtered = pill !== "All" || query || location || !extrasAreEmpty(extras);

  const reset = () => {
    setQuery("");
    setLocation("");
    setPill("All");
    setExtras(EMPTY_EXTRAS);
    setDraft(EMPTY_EXTRAS);
    setShown(PAGE);
  };

  return (
    <>
      {/* Search, location, sort, and the drawer trigger. */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1 basis-[420px]">
          <label
            htmlFor="foster-search"
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
              id="foster-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShown(PAGE);
              }}
              placeholder="Search by name, species, or organization"
              className={`${field} pl-11`}
              style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
            />
          </div>
        </div>

        <div className="min-w-44 flex-1 basis-52 sm:max-w-56">
          <label
            htmlFor="foster-location"
            className="block pb-2 text-xs font-bold leading-5"
            style={{ color: C.inkDeep }}
          >
            Location
          </label>
          <input
            id="foster-location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShown(PAGE);
            }}
            placeholder="City, region, or postal code"
            className={field}
            style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
          />
        </div>

        <div className="min-w-44">
          <label
            htmlFor="foster-sort"
            className="block pb-2 text-xs font-bold leading-5"
            style={{ color: C.inkDeep }}
          >
            Sort
          </label>
          <select
            id="foster-sort"
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

      {/* The two shortcuts under the filter bar. Both are placeholders in the
          comp — geolocation and the date picker are not designed yet. */}
      <p className="pt-3 text-xs" style={{ color: C.inkDeep }}>
        <button
          type="button"
          onClick={() => {
            setLocation("Sacramento");
            setShown(PAGE);
          }}
          className="text-xs font-bold underline"
          style={{ color: C.brand }}
        >
          Use my location
        </button>
        <span className="px-2">·</span>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="text-xs font-bold underline"
          style={{ color: C.brand }}
        >
          I can foster from / until…
        </button>
      </p>

      <div className="flex flex-wrap gap-2 pt-4">
        {PILLS.map((p) => {
          const on = pill === p;
          return (
            <button
              key={p}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setPill(p);
                setShown(PAGE);
              }}
              className="rounded-[100px] px-4 pb-2 pt-1.5 text-xs font-semibold leading-5 transition"
              style={
                on
                  ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                  : { background: "#fff", color: C.muted, border: `1px solid ${C.line}` }
              }
            >
              {p}
            </button>
          );
        })}
      </div>

      <p className="pt-4 text-sm leading-5" style={{ color: C.muted }}>
        Showing {filtered ? `${results.length} of ${FOSTER_NEEDS.length} ` : ""}matching foster
        needs
      </p>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 xl:grid-cols-4">
          {visible.map((need) => (
            <FosterCard
              key={need.id}
              need={need}
              saved={saved.includes(need.id)}
              onToggleSave={() =>
                setSaved((list) =>
                  list.includes(need.id)
                    ? list.filter((x) => x !== need.id)
                    : [...list, need.id],
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
            No foster needs match these filters.
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

      {shown < results.length ? (
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
