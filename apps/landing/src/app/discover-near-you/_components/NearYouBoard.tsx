"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Lock, Search, Shield, X } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C, inkAt } from "./theme";
import { REGIONS, regionLabel, type Region } from "./regions";
import RegionResults from "./RegionResults";

const smallPrimary =
  "rounded-[10px] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90";
const smallOutline =
  "rounded-[10px] bg-white px-3 py-1.5 text-xs font-semibold transition hover:opacity-80";

/**
 * The region picker from the comp: search a metro area, tap it to set it.
 *
 * Only named areas are offered — there is no "use my location" option,
 * because the page promises location is never taken from the device. Each
 * row shows its state and country so same-named places stay distinct.
 */
function RegionDialog({
  current,
  onSelect,
  onClose,
}: {
  current: Region | null;
  onSelect: (region: Region) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus lands in the search field once, on open — kept apart from the Esc
  // listener so a re-render can never pull focus back out of the list.
  // The page behind is locked while the dialog is open, so a swipe on a
  // phone scrolls the list rather than the page underneath the overlay.
  useEffect(() => {
    searchRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const matches = q
    ? REGIONS.filter((r) => `${r.name} ${r.area}`.toLowerCase().includes(q))
    : REGIONS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: inkAt(0.55) }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="region-dialog-title"
        className="relative flex max-h-[min(792px,calc(100dvh-2.5rem))] w-full max-w-[460px] flex-col overflow-hidden rounded-3xl bg-white p-5 sm:p-6 shadow-[0_20px_48px_rgba(7,59,71,0.16)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full transition hover:opacity-70"
          style={{ background: "#F7F9F9", border: `1px solid ${C.line}`, color: "#000" }}
        >
          <X size={15} strokeWidth={2} />
        </button>

        <h2 id="region-dialog-title" className="pr-10 text-lg font-extrabold leading-7" style={{ color: C.ink }}>
          Set your region
        </h2>
        <p className="pb-4 pt-1 text-xs leading-5" style={{ color: C.muted }}>
          Search for your city or metro area. We&apos;ll show the country and
          state to avoid mixing up same-named places.
        </p>

        <label
          className="flex items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ border: `1px solid ${C.line}` }}
        >
          <Search size={16} strokeWidth={2} style={{ color: C.inkDeep }} className="shrink-0" />
          <span className="sr-only">Search city or metro area</span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or metro area"
            autoComplete="off"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#71767A]"
            style={{ color: C.inkDeep }}
          />
        </label>

        {/* The list scrolls inside the dialog; the dialog itself never grows
            past the viewport. */}
        <ul
          className="mt-2.5 max-h-56 min-h-0 overflow-y-auto overscroll-contain rounded-xl"
          style={{ border: `1px solid ${C.line}` }}
          aria-label="Matching areas"
        >
          {matches.length ? (
            matches.map((r, i) => {
              const selected = current?.id === r.id;
              return (
                <li
                  key={r.id}
                  style={{ borderTop: i === 0 ? undefined : `1px solid ${C.line}` }}
                >
                  <button
                    type="button"
                    disabled={r.unsupported}
                    onClick={() => onSelect(r)}
                    aria-current={selected ? "true" : undefined}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition enabled:hover:bg-[#F7F9F9] disabled:cursor-not-allowed"
                  >
                    <span className="min-w-0 flex-1">
                      <span
                        className="block text-sm font-bold leading-5"
                        style={{ color: r.unsupported ? C.muted : C.inkDeep }}
                      >
                        {r.name}
                      </span>
                      <span className="block text-xs leading-4" style={{ color: C.muted }}>
                        {r.area}
                        {r.unsupported ? " · Not yet supported" : ""}
                      </span>
                    </span>
                    {selected ? (
                      <Check size={16} strokeWidth={2.4} className="shrink-0" style={{ color: C.brand }} />
                    ) : null}
                  </button>
                </li>
              );
            })
          ) : (
            <li className="px-3.5 py-6 text-center text-xs leading-5" style={{ color: C.muted }}>
              No supported area matches &ldquo;{query.trim()}&rdquo;. Try a
              nearby larger city.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

type PickerMode = "explore" | "change";

/**
 * Header row, region status card, and everything beneath it: the "set a
 * region" prompt from the comp until a region is picked, then that region's
 * searchable, filterable communities.
 *
 * Two regions are tracked. The saved one is the viewer's own; an explored
 * one is a temporary look elsewhere that leaves the saved one untouched —
 * which is what the card's "Temporary" chip and "Save as my region" mean.
 * Neither outlives the visit: saving here only means "use this as mine".
 */
export default function NearYouBoard() {
  const [saved, setSaved] = useState<Region | null>(null);
  const [exploring, setExploring] = useState<Region | null>(null);
  const [picker, setPicker] = useState<PickerMode | null>(null);

  const current = exploring ?? saved;

  const onPick = (r: Region) => {
    // "Change region" replaces whichever region is showing and keeps its
    // status; "Explore another" (and the first pick) is always temporary.
    if (picker === "change" && !exploring && saved) setSaved(r);
    else setExploring(r);
    setPicker(null);
  };

  const outlineBtn = (label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={smallOutline}
      style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-6 pb-5 pt-8 sm:pt-10">
        <div className="flex max-w-[480px] flex-col gap-2">
          <span
            className="self-start rounded-[20px] px-3 py-[5px] text-xs font-semibold leading-4 tracking-wide"
            style={{ background: C.chip, color: C.brand }}
          >
            Discover
          </span>
          <h1
            className="pt-1.5 text-3xl font-extrabold leading-tight sm:text-4xl sm:leading-[54px]"
            style={{ color: C.ink }}
          >
            Near You
          </h1>
          <p className="text-base leading-6" style={{ color: C.muted }}>
            Local communities once your region is set.
          </p>
          <p className="flex items-start gap-2 text-xs leading-5" style={{ color: C.muted }}>
            <Lock size={14} strokeWidth={2} className="mt-[3px] shrink-0" style={{ color: C.brand }} />
            We use your selected region for discovery. Precise location is
            never required or collected here.
          </p>
        </div>

        <section
          className="w-full rounded-3xl bg-white px-5 py-4 shadow-[0_1px_2px_rgba(7,59,71,0.06)] sm:w-auto sm:min-w-72"
          style={{ border: `1px solid ${C.line}` }}
          aria-live="polite"
        >
          <p className="text-xs font-bold uppercase leading-4 tracking-tight" style={{ color: C.muted }}>
            {exploring ? "Exploring" : saved ? "Your region" : "No region set"}
          </p>

          {/* The icon sits outside the wrapping group, so on a narrow screen
              the long prompt wraps beside it instead of leaving it alone on
              a line of its own. */}
          <div className="mt-1 flex items-start gap-2">
            <Shield size={16} strokeWidth={2} className="mt-1 shrink-0" style={{ color: C.brand }} />
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-base font-bold leading-6" style={{ color: C.inkDeep }}>
                {current ? current.name : "Choose a region to see local communities"}
              </span>
              {current ? (
                <span
                  className="rounded-md px-1.5 py-0.5 text-xs font-bold leading-4"
                  style={exploring ? { background: C.chipWarm, color: C.warmText } : { background: C.chip, color: C.ink }}
                  title={regionLabel(current)}
                >
                  {exploring ? "Temporary" : "Saved"}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-3">
            {!current ? (
              <>
                <button
                  type="button"
                  onClick={() => setPicker("explore")}
                  className={smallPrimary}
                  style={{ background: C.brand }}
                >
                  Set your region
                </button>
                <Link
                  href={APP_LINKS.communities}
                  className={smallOutline}
                  style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
                >
                  Browse all communities
                </Link>
              </>
            ) : (
              <>
                {outlineBtn("Change region", () => setPicker("change"))}
                {outlineBtn("Explore another", () => setPicker("explore"))}
                {exploring
                  ? outlineBtn("Save as my region", () => {
                      setSaved(exploring);
                      setExploring(null);
                    })
                  : outlineBtn("Clear region", () => setSaved(null))}
                {exploring && saved ? outlineBtn(`Back to ${saved.name}`, () => setExploring(null)) : null}
              </>
            )}
          </div>
        </section>
      </div>

      {current ? (
        <RegionResults key={current.id} region={current} />
      ) : (
        <section
          className="flex flex-col items-center gap-3 rounded-[20px] px-6 py-8 text-center"
          style={{ background: C.chip, border: `1px dashed ${C.brand}` }}
        >
          <h2 className="max-w-md text-base font-extrabold leading-6" style={{ color: C.ink }}>
            See eligible local communities once you set a region
          </h2>
          <p className="max-w-md text-sm leading-5" style={{ color: C.muted }}>
            Region selection is always your choice — coarse by default,
            reversible any time, and never collected silently from your device
            or IP address.
          </p>
          <button
            type="button"
            onClick={() => setPicker("explore")}
            className="mt-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            Set your region
          </button>
        </section>
      )}

      {picker ? (
        <RegionDialog current={current} onClose={() => setPicker(null)} onSelect={onPick} />
      ) : null}
    </>
  );
}
