"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { C } from "./theme";
import {
  DISTANCE_OPTIONS,
  FILTER_GROUPS,
  SIZE_OPTIONS,
  SOURCE_OPTIONS,
} from "./nearYou";

export type ExtraFilters = {
  /** Ticked boxes, keyed by group label. */
  checks: Record<string, string[]>;
  size: string;
  distance: string;
  source: string;
};

export const EMPTY_EXTRAS: ExtraFilters = {
  checks: {},
  size: SIZE_OPTIONS[0],
  distance: DISTANCE_OPTIONS[0],
  source: SOURCE_OPTIONS[0],
};

/** True when nothing in the drawer is narrowing the results. */
export function extrasAreEmpty(e: ExtraFilters) {
  return (
    e.size === SIZE_OPTIONS[0] &&
    e.distance === DISTANCE_OPTIONS[0] &&
    e.source === SOURCE_OPTIONS[0] &&
    Object.values(e.checks).every((v) => v.length === 0)
  );
}

/** A labelled group of checkboxes. */
function CheckGroup({
  group,
  checked,
  onToggle,
}: {
  group: (typeof FILTER_GROUPS)[number];
  checked: readonly string[];
  onToggle: (option: string) => void;
}) {
  return (
    <fieldset className="pb-6">
      <legend className="pb-2 text-xs font-bold uppercase tracking-wide" style={{ color: C.muted }}>
        {group.label}
      </legend>
      <div className="flex flex-col gap-2.5">
        {group.options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={checked.includes(option)}
              onChange={() => onToggle(option)}
              className="size-4 shrink-0 accent-[#066879]"
            />
            <span className="text-sm leading-5" style={{ color: C.inkDeep }}>
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A labelled single-choice select. */
function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (next: string) => void;
}) {
  return (
    <div className="pb-6">
      <p className="pb-2 text-xs font-bold uppercase tracking-wide" style={{ color: C.muted }}>
        {label}
      </p>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white px-3 py-2.5 text-sm"
        style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * The More filters panel. It edits a draft copy so Reset and closing the
 * drawer leave the applied results alone — only Apply filters commits.
 */
export default function MoreFiltersDrawer({
  open,
  draft,
  onDraftChange,
  onClose,
  onApply,
}: {
  open: boolean;
  draft: ExtraFilters;
  onDraftChange: (next: ExtraFilters) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const toggle = (group: string, option: string) => {
    const current = draft.checks[group] ?? [];
    const next = current.includes(option)
      ? current.filter((x) => x !== option)
      : [...current, option];
    onDraftChange({ ...draft, checks: { ...draft.checks, [group]: next } });
  };

  const [age, household] = FILTER_GROUPS;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="More filters"
        /* Full width on phones, where a 380px panel would leave a useless
           sliver of the page beside it. */
        className="relative flex h-full w-full flex-col bg-white shadow-[0px_8px_24px_0px_rgba(7,59,71,0.18)] sm:max-w-[380px]"
      >
        <header
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${C.line}` }}
        >
          <h2 className="text-sm font-bold" style={{ color: C.ink }}>
            More filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex size-7 items-center justify-center rounded-md"
            style={{ border: `1px solid ${C.line}` }}
          >
            <X size={14} style={{ color: C.muted }} aria-hidden />
          </button>
        </header>

        {/* The comp's order: age, size, household fit, distance, source. */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <CheckGroup
            group={age}
            checked={draft.checks[age.label] ?? []}
            onToggle={(o) => toggle(age.label, o)}
          />
          <Select
            label="Size"
            value={draft.size}
            options={SIZE_OPTIONS}
            onChange={(size) => onDraftChange({ ...draft, size })}
          />
          <CheckGroup
            group={household}
            checked={draft.checks[household.label] ?? []}
            onToggle={(o) => toggle(household.label, o)}
          />
          <Select
            label="Distance / area"
            value={draft.distance}
            options={DISTANCE_OPTIONS}
            onChange={(distance) => onDraftChange({ ...draft, distance })}
          />
          <Select
            label="Source"
            value={draft.source}
            options={SOURCE_OPTIONS}
            onChange={(source) => onDraftChange({ ...draft, source })}
          />
        </div>

        <footer
          className="flex items-center justify-between gap-3 px-5 py-4"
          style={{ borderTop: `1px solid ${C.line}` }}
        >
          <button
            type="button"
            onClick={() => onDraftChange(EMPTY_EXTRAS)}
            className="text-sm font-semibold"
            style={{ color: C.muted }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            Apply filters
          </button>
        </footer>
      </aside>
    </div>
  );
}
