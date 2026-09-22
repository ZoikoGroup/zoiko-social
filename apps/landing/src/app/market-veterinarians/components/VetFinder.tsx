"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { CARE_TYPES, CITY, SPECIES, VETS, type Vet } from "./vets";
import { C } from "./theme";

type Query = { location: string; species: string; care: string };

const CHIPS: readonly { id: string; label: string; test: (v: Vet) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "accepting", label: "Accepting new patients", test: (v) => v.acceptingNew === true },
  { id: "evening", label: "Evening hours", test: (v) => v.eveningHours },
  { id: "5mi", label: "Within 5 miles", test: (v) => v.miles <= 5 },
];

function matches(v: Vet, q: Query) {
  const loc = q.location.trim().toLowerCase();
  if (loc && ![CITY, v.area].some((s) => s.toLowerCase().includes(loc))) return false;
  if (q.species !== "all" && !v.tags.includes(q.species as Vet["tags"][number])) return false;
  if (q.care !== "all" && !v.tags.includes(q.care as Vet["tags"][number])) return false;
  return true;
}

const FIELD_LABEL = "block pb-2 text-xs font-semibold leading-5";
const SELECT = "h-12 w-full rounded-xl pl-4 pr-7 text-base outline-none sm:text-sm";

function VetCard({ vet }: { vet: Vet }) {
  // Only Dr. Sarah Chen has a full profile on this page; the others open in the app.
  const detailsHref = vet.id === "sarah-chen" ? "#provider-profile" : appUrl("/vet-finder");
  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] bg-white" style={{ border: `1px solid ${C.line}` }}>
      <div className="relative h-44 bg-gradient-to-br from-cyan-800 to-orange-500">
        <Image src={vet.image} alt={vet.imageAlt} fill sizes="(min-width: 1024px) 385px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-6">
        <div className="flex items-start gap-1">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold leading-6" style={{ color: C.ink }}>
              {vet.name}
            </h3>
            <p className="pb-2 text-xs leading-5" style={{ color: C.muted }}>
              {vet.role}
            </p>
          </div>
          <span className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold leading-5" style={{ background: C.chip, color: C.brand }}>
            ✓ Verified
          </span>
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {vet.tags.map((t) => (
            <span
              key={t}
              className="rounded-lg px-2.5 py-1 text-xs font-medium leading-4"
              style={{ background: C.panel, color: C.ink, border: `1px solid ${C.line}` }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-3">
          <p className="flex items-center gap-1 py-3 text-xs leading-5" style={{ color: C.muted }}>
            <Image src="/market-veterinarians/pin.webp" alt="" width={16} height={16} className="size-4" />
            {vet.area} · {vet.miles} mi
          </p>
          <p className="flex items-center gap-1 py-3 text-xs font-medium leading-5" style={{ color: C.ink }}>
            {vet.acceptingNew && <span className="size-1.5 rounded-full" style={{ background: C.brand }} />}
            {vet.acceptingNew ? "Accepting new patients" : "Status unknown"}
          </p>
        </div>
        <a
          href={detailsHref}
          className="mt-auto rounded-xl p-3 text-center text-xs font-semibold text-white transition hover:opacity-90"
          style={{ background: C.brand }}
        >
          View details
        </a>
      </div>
    </article>
  );
}

export default function VetFinder() {
  const [draft, setDraft] = useState<Query>({ location: CITY, species: "all", care: "all" });
  const [applied, setApplied] = useState<Query>(draft);
  const [chip, setChip] = useState("all");
  // Until the visitor searches or filters, show the design's snapshot as-is:
  // its two active-filter chips, its result count, and every card.
  const [touched, setTouched] = useState(false);

  const chipTest = CHIPS.find((c) => c.id === chip)!.test;
  const results = touched ? VETS.filter((v) => matches(v, applied) && chipTest(v)) : VETS;

  const clear = (key: keyof Query) => {
    const value = key === "location" ? "" : "all";
    const base = touched ? applied : { ...applied, species: "Dogs" };
    setDraft({ ...draft, ...(touched ? {} : { species: "Dogs" }), [key]: value });
    setApplied({ ...base, [key]: value });
    setTouched(true);
  };

  const active = touched ? [
    applied.location.trim() && { key: "location" as const, label: applied.location.trim() },
    applied.species !== "all" && { key: "species" as const, label: applied.species },
    applied.care !== "all" && { key: "care" as const, label: applied.care },
  ].filter(Boolean) as { key: keyof Query; label: string }[]
    : [
        { key: "location" as const, label: CITY },
        { key: "species" as const, label: "Dogs" },
      ];

  return (
    <section className="bg-white pb-16 pt-6 sm:pb-20 sm:pt-8">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 xl:px-28">
        <form
          id="search"
          onSubmit={(e) => {
            e.preventDefault();
            setApplied(draft);
            setTouched(true);
          }}
          className="scroll-mt-6 flex flex-col gap-4 rounded-[20px] bg-white p-4 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] sm:p-6"
          style={{ border: `1px solid ${C.line}` }}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
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
            <label>
              <span className={FIELD_LABEL} style={{ color: C.ink }}>
                Species
              </span>
              <select
                value={draft.species}
                onChange={(e) => setDraft({ ...draft, species: e.target.value })}
                className={SELECT}
                style={{ background: C.select, color: C.ink, border: `1px solid ${C.line}` }}
              >
                <option value="all">All species</option>
                {SPECIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={FIELD_LABEL} style={{ color: C.ink }}>
                Care type
              </span>
              <select
                value={draft.care}
                onChange={(e) => setDraft({ ...draft, care: e.target.value })}
                className={SELECT}
                style={{ background: C.select, color: C.ink, border: `1px solid ${C.line}` }}
              >
                <option value="all">All care types</option>
                {CARE_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="min-h-12 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:col-span-2 lg:col-span-1 lg:min-h-10"
              style={{ background: C.brand }}
            >
              Search
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pb-1">
            {CHIPS.map((c) => {
              const on = c.id === chip;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setChip(c.id);
                    setTouched(true);
                  }}
                  className="shrink-0 whitespace-nowrap rounded-[20px] px-4 py-2 text-xs font-medium leading-5 transition"
                  style={
                    on
                      ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                      : { background: "#fff", color: C.ink, border: `1px solid ${C.line}` }
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </form>

        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 pt-8 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs leading-5" style={{ color: C.muted }}>
                Active filters:
              </span>
              {active.length === 0 && (
                <span className="text-xs leading-5" style={{ color: C.muted }}>
                  None
                </span>
              )}
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
            <p className="text-sm leading-6" style={{ color: C.muted }}>
              {touched ? (
                <>
                  Showing {results.length} {results.length === 1 ? "veterinarian" : "veterinarians"}
                  {applied.location.trim() ? ` in ${applied.location.trim()}` : ""}
                </>
              ) : (
                `Showing 12 veterinarians in ${CITY}`
              )}
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((v) => (
                <VetCard key={v.id} vet={v} />
              ))}
            </div>
          ) : (
            <p
              className="rounded-[20px] bg-white px-6 py-10 text-center text-sm"
              style={{ border: `1px dashed ${C.line}`, color: C.muted }}
            >
              No veterinarians match these filters.
            </p>
          )}

          <div className="flex justify-center pt-4">
            <a
              href={APP_LINKS.safety}
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold transition hover:bg-neutral-50"
              style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
            >
              Understand verification
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
