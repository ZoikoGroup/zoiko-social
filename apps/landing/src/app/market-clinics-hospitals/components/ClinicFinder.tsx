"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { CITY, FACILITIES, FACILITY_TYPES, FEATURED, SERVICES, SPECIES, type Facility } from "./clinics";
import { C } from "./theme";

type Query = { location: string; species: string; type: string; service: string };

const DEFAULT: Query = { location: CITY, species: "all", type: "all", service: "all" };
const CLEARED: Query = { location: "", species: "all", type: "all", service: "all" };

function matches(f: Facility, q: Query) {
  const loc = q.location.trim().toLowerCase();
  if (loc && ![CITY, f.area].some((s) => s.toLowerCase().includes(loc))) return false;
  if (q.species !== "all" && !f.tags.includes(q.species)) return false;
  if (q.type !== "all" && f.type !== q.type) return false;
  if (q.service !== "all" && !f.tags.includes(q.service)) return false;
  return true;
}

const FIELD_LABEL = "block pb-2 text-xs font-semibold leading-5";
const SELECT = "h-12 w-full rounded-xl pl-4 pr-7 text-base outline-none sm:text-sm";

function Pin() {
  return <Image src="/market-clinics-hospitals/pin.webp" alt="" width={16} height={16} className="size-4 shrink-0" />;
}

function Tag({ label, white }: { label: string; white?: boolean }) {
  return (
    <span
      className="rounded-lg px-2.5 py-1 text-xs font-medium leading-4"
      style={{ background: white ? "#fff" : C.panel, color: C.ink, border: `1px solid ${C.line}` }}
    >
      {label}
    </span>
  );
}

function FacilityCard({ f }: { f: Facility }) {
  // Only Bay View has a full profile on this page; the others open in the app.
  const detailsHref = f.id === "bay-view" ? "#facility-profile" : appUrl("/vet-finder");
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white" style={{ border: `1px solid ${C.line}` }}>
      <div className="relative h-52 bg-gradient-to-br from-cyan-800 to-orange-500 sm:h-60">
        <Image src={f.image} alt={f.imageAlt} fill sizes="(min-width: 1024px) 573px, 100vw" className="object-cover" />
        <span
          className="absolute left-3 top-3 rounded-2xl bg-white px-2.5 py-1 text-xs font-semibold uppercase leading-4 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
          style={{ color: C.brand }}
        >
          {f.type}
        </span>
        <span
          className="absolute bottom-3 right-3 flex size-11 items-center justify-center rounded-3xl text-base font-bold text-white shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)]"
          style={{ background: C.warm }}
          aria-label={`${f.teamSize} veterinarians`}
        >
          {f.teamSize}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-2">
          <h3 className="min-w-0 flex-1 pb-2 text-lg font-bold leading-6" style={{ color: C.ink }}>
            {f.name}
          </h3>
          <span className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold leading-5" style={{ background: C.chip, color: C.brand }}>
            ✓ Verified
          </span>
        </div>
        <p className="pb-3 text-xs leading-5">
          <span className="font-semibold" style={{ color: C.ink }}>
            Team:
          </span>{" "}
          <span style={{ color: C.muted }}>{f.team}</span>
        </p>
        <div className="flex flex-wrap gap-2 pb-4">
          {f.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
        <p className="flex items-center gap-1 pb-3 text-xs leading-5" style={{ color: C.muted }}>
          <Pin />
          {f.area} · {f.miles} mi
        </p>
        <div className="mb-4 flex flex-col gap-1 rounded-xl p-3" style={{ background: C.panel }}>
          <p className="text-xs font-semibold leading-5" style={{ color: C.ink }}>
            Hours
          </p>
          <p className="text-xs leading-5" style={{ color: C.ink }}>
            {f.hours}
          </p>
        </div>
        <p className="mb-4 rounded-xl p-3 text-xs font-semibold leading-5" style={{ background: C.chip, color: C.ink }}>
          {f.acceptingNew ? "Accepting new patients" : "Status unknown · Contact to confirm"}
        </p>
        <a
          href={detailsHref}
          className="mt-auto rounded-xl py-3 text-center text-xs font-semibold text-white transition hover:opacity-90"
          style={{ background: C.brand }}
        >
          View facility details
        </a>
      </div>
    </article>
  );
}

export default function ClinicFinder() {
  const [draft, setDraft] = useState<Query>(DEFAULT);
  const [applied, setApplied] = useState<Query>(DEFAULT);
  // Until the visitor searches, show the design's snapshot as-is: its result
  // line, its two active-filter chips, and every listing.
  const [touched, setTouched] = useState(false);

  const results = touched ? FACILITIES.filter((f) => matches(f, applied)) : FACILITIES;

  const clear = (key: keyof Query) => {
    const value = key === "location" ? "" : "all";
    const base = touched ? applied : { ...applied, species: "Dogs" };
    setDraft({ ...base, [key]: value });
    setApplied({ ...base, [key]: value });
    setTouched(true);
  };

  const active = touched
    ? ([
        applied.location.trim() && { key: "location", label: applied.location.trim() },
        applied.species !== "all" && { key: "species", label: applied.species },
        applied.type !== "all" && { key: "type", label: applied.type },
        applied.service !== "all" && { key: "service", label: applied.service },
      ].filter(Boolean) as { key: keyof Query; label: string }[])
    : ([
        { key: "location", label: CITY },
        { key: "species", label: "Dogs" },
      ] as { key: keyof Query; label: string }[]);

  const select = (key: keyof Query, label: string, all: string, options: readonly string[]) => (
    <label>
      <span className={FIELD_LABEL} style={{ color: C.ink }}>
        {label}
      </span>
      <select
        value={draft[key]}
        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        className={SELECT}
        style={{ background: C.select, color: C.ink, border: `1px solid ${C.line}` }}
      >
        <option value="all">{all}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <section className="bg-white px-4 py-10 sm:px-8 sm:py-14 lg:px-16 xl:px-28">
      <div className="mx-auto max-w-[1230px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setApplied(draft);
            setTouched(true);
          }}
          className="flex flex-col gap-6 rounded-[20px] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] sm:p-8"
          style={{ border: `1px solid ${C.line}` }}
        >
          <h2 className="text-base font-bold leading-7" style={{ color: C.ink }}>
            Search by location &amp; care type
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label>
              <span className={FIELD_LABEL} style={{ color: C.ink }}>
                Location or area
              </span>
              <input
                type="text"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                className="h-12 w-full rounded-xl bg-white px-3 text-base outline-none sm:text-sm"
                style={{ color: C.ink, border: `1px solid ${C.line}` }}
              />
            </label>
            {select("species", "Species focus", "All species", SPECIES)}
            {select("type", "Facility type", "All types", FACILITY_TYPES)}
            {select("service", "Services", "All services", SERVICES)}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              className="min-h-10 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(CLEARED);
                setApplied(CLEARED);
                setTouched(true);
              }}
              className="min-h-10 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
              style={{ color: C.brand, border: `1px solid ${C.line}` }}
            >
              Clear filters
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-start justify-between gap-3 pt-4">
          <p className="text-sm leading-6" style={{ color: C.muted }}>
            {touched ? (
              <>
                Showing {results.length} {results.length === 1 ? "clinic or hospital" : "clinics & hospitals"}
                {applied.location.trim() ? ` in ${applied.location.trim()}` : ""}
              </>
            ) : (
              `Showing 8 clinics & hospitals in ${CITY}`
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs leading-5" style={{ color: C.muted }}>
              Active filters:
            </span>
            {active.map((a) => (
              <span
                key={a.key}
                className="flex items-center gap-1 rounded-2xl px-3 py-1.5 text-xs leading-5"
                style={{ background: C.chip, color: C.brand, border: `1px solid ${C.line}` }}
              >
                {a.label}
                <button type="button" onClick={() => clear(a.key)} aria-label={`Remove ${a.label} filter`}>
                  <X size={12} strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div
          className="mt-6 flex flex-col gap-8 rounded-3xl p-5 sm:p-8 md:flex-row md:items-center md:gap-12 lg:px-12 lg:pb-12 lg:pt-16"
          style={{
            background: "linear-gradient(107deg, rgba(6,104,121,0.05), rgba(232,137,36,0.05))",
            border: `1px solid ${C.line}`,
          }}
        >
          <div className="relative aspect-[280/240] w-full shrink-0 overflow-hidden rounded-3xl md:w-72">
            <Image src={FEATURED.image} alt={FEATURED.imageAlt} fill sizes="(min-width: 768px) 288px, 100vw" className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <span
              className="self-start rounded-xl px-2 py-1 text-xs font-semibold uppercase leading-5 tracking-wide"
              style={{ background: C.chip, color: C.brand }}
            >
              Featured Clinic
            </span>
            <h2 className="text-xl font-bold leading-8" style={{ color: C.ink }}>
              {FEATURED.name}
            </h2>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs leading-5" style={{ color: C.muted }}>
              <span>
                <b style={{ color: C.ink }}>{FEATURED.vets}</b> veterinarians
              </span>
              <span>
                <b style={{ color: C.ink }}>{FEATURED.years}</b> years operating
              </span>
              <span className="inline-flex items-center gap-1">
                <Pin />
                {FEATURED.area}
              </span>
            </p>
            <p className="text-sm leading-6" style={{ color: C.ink }}>
              {FEATURED.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {FEATURED.tags.map((t) => (
                <Tag key={t} label={t} white />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={appUrl("/vet-finder")}
                className="flex min-h-10 items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: C.brand }}
              >
                View clinic details
              </a>
              <a
                href={appUrl("/vet-finder")}
                className="flex min-h-10 items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
                style={{ color: C.brand, border: `1px solid ${C.line}` }}
              >
                Contact clinic
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6">
          {results.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {results.map((f) => (
                <FacilityCard key={f.id} f={f} />
              ))}
            </div>
          ) : (
            <p
              className="rounded-[20px] bg-white px-6 py-10 text-center text-sm"
              style={{ border: `1px dashed ${C.line}`, color: C.muted }}
            >
              No clinics or hospitals match these filters.
            </p>
          )}
        </div>

        <div className="flex justify-center pt-8">
          <a
            href={appUrl("/vet-finder")}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
            style={{ color: C.brand, border: `1px solid ${C.line}` }}
          >
            Load more clinics &amp; hospitals
          </a>
        </div>
      </div>
    </section>
  );
}
