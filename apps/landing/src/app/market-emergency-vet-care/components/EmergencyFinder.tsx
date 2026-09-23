"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import {
  CARE_TYPES,
  CITY,
  PATIENT_STATUS,
  PROVIDERS,
  SPECIES,
  telHref,
  type Provider,
} from "./providers";
import { C } from "./theme";

type Sort = "relevance" | "distance" | "name";
type Filters = { species: string[]; care: string[]; status: string[] };

const PAGE_SIZE = 3;
// The design opens with Dogs and Emergency surgery ticked.
const DEFAULT_FILTERS: Filters = { species: ["Dogs"], care: ["Emergency surgery"], status: [] };
const NO_FILTERS: Filters = { species: [], care: [], status: [] };

const SORTS: readonly { value: Sort; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "distance", label: "Distance" },
  { value: "name", label: "Name (A–Z)" },
];

/** Filters are OR within a group and AND across groups. */
function matches(p: Provider, location: string, f: Filters) {
  const loc = location.trim().toLowerCase();
  if (loc && ![CITY, p.area].some((s) => s.toLowerCase().includes(loc))) return false;
  if (f.species.length && !f.species.some((s) => p.species.includes(s as Provider["species"][number]))) return false;
  if (f.care.length && !f.care.some((c) => p.care.includes(c as Provider["care"][number]))) return false;
  if (f.status.length) {
    const status = p.acceptingNew ? "Accepting now" : "Status unknown";
    if (!f.status.includes(status)) return false;
  }
  return true;
}

const FIELD = "h-11 w-full rounded-xl bg-white text-base outline-none focus-visible:ring-2 focus-visible:ring-cyan-700/30 sm:text-sm";

function Hero({ onSearch }: { onSearch: (location: string, species: string) => void }) {
  const [location, setLocation] = useState(CITY);
  const [species, setSpecies] = useState("all");

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-8 sm:py-20">
      <Image
        src="/market-emergency-vet-care/hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* The photo ships with its overlay baked in; this extra wash keeps the
          copy readable where narrow screens crop into its lighter side. */}
      <div className="absolute inset-0 bg-[rgba(8,51,68,0.35)] md:bg-[rgba(8,51,68,0.15)]" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-2.5 text-center">
        <p className="text-xs font-semibold uppercase leading-5 tracking-wide text-white">Market / Professional Care</p>
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl sm:leading-[57.6px]">
          Emergency vet care
        </h1>
        <p className="max-w-[880px] pb-5 pt-1 text-base leading-7 text-white/85">
          Discover trusted emergency veterinary care providers in your area. This is a marketplace discovery tool — not
          an emergency dispatcher. Always confirm availability and reach out directly to the facility.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(location, species);
          }}
          className="flex w-full max-w-[871px] flex-col gap-4 rounded-3xl bg-white p-5 text-left shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)] sm:p-8"
          style={{ border: `1px solid ${C.line}` }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold leading-5" style={{ color: C.ink }}>
                Location or area
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`${FIELD} px-3`}
                style={{ color: C.ink, border: `1px solid ${C.line}` }}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold leading-5" style={{ color: C.ink }}>
                Pet species
              </span>
              <span className="relative">
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className={`${FIELD} cursor-pointer appearance-none pl-4 pr-8`}
                  style={{ color: C.ink, border: `1px solid ${C.line}` }}
                >
                  <option value="all">All species</option>
                  {SPECIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: C.muted }}
                />
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="rounded-xl p-3 text-sm font-semibold text-white transition hover:opacity-90 sm:self-start"
            style={{ background: C.brand }}
          >
            Search Emergency Vet Care Options
          </button>
        </form>
      </div>
    </section>
  );
}

function CheckGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: readonly string[];
  selected: readonly string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="pb-3 text-xs font-bold uppercase leading-5 tracking-wide" style={{ color: C.ink }}>
        {title}
      </legend>
      {options.map((o) => (
        <label key={o} className="flex cursor-pointer items-center gap-2 py-2 text-xs leading-5" style={{ color: C.ink }}>
          <input
            type="checkbox"
            checked={selected.includes(o)}
            onChange={() => onToggle(o)}
            className="size-3.5 cursor-pointer accent-blue-600"
          />
          {o}
        </label>
      ))}
    </fieldset>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span
      className="rounded-xl px-2.5 py-1 text-[11px] font-semibold uppercase leading-4 tracking-wide sm:text-xs"
      style={{ background: C.chip, color: C.brand, border: `1px solid ${C.line}` }}
    >
      {label}
    </span>
  );
}

function ProviderCard({ p }: { p: Provider }) {
  // Only Emergency Vet Care SF has a full profile on this page; the others open in the app.
  const detailsHref = p.id === "emergency-vet-care-sf" ? "#provider-profile" : appUrl("/vet-finder");
  return (
    <article
      className="flex flex-col gap-4 rounded-[20px] bg-white p-4 sm:flex-row sm:items-start sm:gap-6 sm:p-6"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="flex min-w-0 flex-1 gap-3 min-[400px]:gap-4 sm:gap-6">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-800 to-orange-500 min-[400px]:size-20 sm:size-28 sm:rounded-[20px]">
          <Image src={p.image} alt={p.imageAlt} fill sizes="112px" className="object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-base font-bold leading-7 sm:text-lg" style={{ color: C.ink }}>
              {p.name}
            </h3>
            <span className="rounded-sm px-2 py-0.5 text-xs font-semibold leading-5" style={{ background: C.chip, color: C.brand }}>
              ✓ Verified
            </span>
          </div>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5" style={{ color: C.muted }}>
            <span>
              <span aria-hidden>📍 </span>
              {p.area} · {p.miles} mi
            </span>
            <span>{p.hours}</span>
            <span>{p.acceptingNew ? "Accepting new patients" : "Status: Unknown"}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        </div>
      </div>
      {/* Side by side from 400px; below that the phone number would wrap. */}
      <div className="grid gap-2 min-[400px]:grid-cols-2 sm:flex sm:w-40 sm:shrink-0 sm:flex-col">
        <a
          href={detailsHref}
          className="flex min-h-10 items-center justify-center rounded-xl p-3 text-center text-xs font-semibold text-white transition hover:opacity-90"
          style={{ background: C.brand }}
        >
          View details
        </a>
        <a
          href={telHref(p.phone)}
          className="flex min-h-10 items-center justify-center rounded-xl bg-white px-3 py-2.5 text-center text-xs font-semibold transition hover:bg-neutral-50"
          style={{ color: C.brand, border: `1px solid ${C.line}` }}
        >
          Call: {p.phone}
        </a>
      </div>
    </article>
  );
}

function Results({
  location,
  filters,
  setFilters,
}: {
  location: string;
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const [sort, setSort] = useState<Sort>("relevance");
  const [showAll, setShowAll] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = PROVIDERS.filter((p) => matches(p, location, filters));
  if (sort === "distance") results.sort((a, b) => a.miles - b.miles);
  if (sort === "name") results.sort((a, b) => a.name.localeCompare(b.name));
  const visible = showAll ? results : results.slice(0, PAGE_SIZE);

  const toggle = (key: keyof Filters) => (value: string) => {
    const list = filters[key];
    setFilters({ ...filters, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const place = location.trim().replace(/,\s*CA$/i, "") || "your area";
  const activeCount = filters.species.length + filters.care.length + filters.status.length;

  return (
    <section id="results" className="scroll-mt-4 bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="filters"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold lg:hidden"
          style={{ color: C.brand, border: `1px solid ${C.line}` }}
        >
          <SlidersHorizontal size={16} aria-hidden />
          Filters{activeCount > 0 && ` (${activeCount})`}
        </button>

        <aside
          id="filters"
          className={`${filtersOpen ? "grid" : "hidden"} gap-6 rounded-[20px] bg-white p-6 sm:grid-cols-3 lg:grid lg:w-60 lg:shrink-0 lg:grid-cols-1`}
          style={{ border: `1px solid ${C.line}` }}
        >
          <CheckGroup title="Species" options={SPECIES} selected={filters.species} onToggle={toggle("species")} />
          <CheckGroup title="Care type" options={CARE_TYPES} selected={filters.care} onToggle={toggle("care")} />
          <CheckGroup title="New patients" options={PATIENT_STATUS} selected={filters.status} onToggle={toggle("status")} />
          <button
            type="button"
            onClick={() => setFilters(NO_FILTERS)}
            className="min-h-10 rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:bg-neutral-50 sm:col-span-3 lg:col-span-1 lg:mt-6"
            style={{ color: C.brand, border: `1px solid ${C.brand}` }}
          >
            Clear all
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div
            className="flex flex-wrap items-center justify-between gap-3 pb-4"
            style={{ borderBottom: `1px solid ${C.line}` }}
          >
            <p className="text-sm font-semibold leading-6" style={{ color: C.muted }} aria-live="polite">
              Showing {results.length} {results.length === 1 ? "provider" : "providers"} in {place}
            </p>
            <label className="flex items-center gap-2 text-xs leading-5" style={{ color: C.muted }}>
              Sort by:
              <span className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-10 cursor-pointer appearance-none rounded-xl bg-white pl-4 pr-9 text-base outline-none focus-visible:ring-2 focus-visible:ring-cyan-700/30 sm:text-xs"
                  style={{ color: C.ink, border: `1px solid ${C.line}` }}
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: C.muted }}
                />
              </span>
            </label>
          </div>

          {results.length > 0 ? (
            <>
              {visible.map((p) => (
                <ProviderCard key={p.id} p={p} />
              ))}
              {results.length > visible.length && (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="mt-2 min-h-10 self-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
                  style={{ color: C.brand, border: `1px solid ${C.line}` }}
                >
                  Load more results
                </button>
              )}
            </>
          ) : (
            <div className="rounded-[20px] px-6 py-12 text-center" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
              <p className="text-base font-bold" style={{ color: C.ink }}>
                No providers match this search.
              </p>
              <p className="pt-1 text-sm" style={{ color: C.muted }}>
                Try another area or clear some filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters(NO_FILTERS)}
                className="mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                style={{ background: C.brand }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * The hero search and the results share their state, so both live here; the
 * sections the design places between them are passed in as `children`.
 */
export default function EmergencyFinder({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState(CITY);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  return (
    <>
      <Hero
        onSearch={(loc, species) => {
          setLocation(loc);
          setFilters({ ...filters, species: species === "all" ? [] : [species] });
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      {children}
      <Results location={location} filters={filters} setFilters={setFilters} />
    </>
  );
}
