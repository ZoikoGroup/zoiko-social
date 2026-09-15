"use client";

import { Fragment, useEffect } from "react";
import { X } from "lucide-react";
import { C } from "./theme";
import { EXPERIENCE_LEVELS, FILTER_GROUPS } from "./fosterNeeds";

export type ExtraFilters = {
  /** Ticked boxes, keyed by group label. */
  checks: Record<string, string[]>;
  experience: string;
};

export const EMPTY_EXTRAS: ExtraFilters = {
  checks: {},
  experience: EXPERIENCE_LEVELS[0],
};

/** True when nothing in the drawer is narrowing the results. */
export function extrasAreEmpty(e: ExtraFilters) {
  return (
    e.experience === EXPERIENCE_LEVELS[0] &&
    Object.values(e.checks).every((v) => v.length === 0)
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

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {FILTER_GROUPS.map((group) => (
            <Fragment key={group.label}>
            <fieldset className="pb-6">
              <legend
                className="pb-2 text-xs font-bold uppercase tracking-wide"
                style={{ color: C.muted }}
              >
                {group.label}
              </legend>
              <div className="flex flex-col gap-2.5">
                {group.options.map((option) => {
                  const on = (draft.checks[group.label] ?? []).includes(option);
                  return (
                    <label key={option} className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(group.label, option)}
                        className="size-4 shrink-0 accent-[#066879]"
                      />
                      <span className="text-sm leading-5" style={{ color: C.inkDeep }}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* The comp places Experience needed between Care level and
                Household fit, so it renders inside the loop. */}
            {group.label === "Care level" ? (
              <fieldset className="pb-6">
                <legend
                  className="pb-2 text-xs font-bold uppercase tracking-wide"
                  style={{ color: C.muted }}
                >
                  Experience needed
                </legend>
                <select
                  value={draft.experience}
                  onChange={(e) => onDraftChange({ ...draft, experience: e.target.value })}
                  className="w-full rounded-xl bg-white px-3 py-2.5 text-sm"
                  style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </fieldset>
            ) : null}
            </Fragment>
          ))}
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
