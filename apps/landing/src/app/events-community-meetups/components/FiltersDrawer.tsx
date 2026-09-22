"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AGE_LABELS, ANIMAL_LABELS, type Age, type Animals } from "./meetups";
import { C } from "./theme";

export type Drawer = {
  formats: ReadonlySet<"In person" | "Hybrid">;
  animals: ReadonlySet<Animals>;
  age: Age | "any";
  frequency: ReadonlySet<"one-time" | "recurring">;
};

export const EMPTY_DRAWER: Drawer = {
  formats: new Set(),
  animals: new Set(),
  age: "any",
  frequency: new Set(),
};

function toggle<T>(set: ReadonlySet<T>, v: T): ReadonlySet<T> {
  const next = new Set(set);
  if (next.has(v)) next.delete(v);
  else next.add(v);
  return next;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="px-6 py-4">
      <legend className="float-left mb-3 w-full text-xs font-bold uppercase tracking-wide" style={{ color: C.muted }}>
        {title}
      </legend>
      <div className="clear-both flex flex-col gap-3">{children}</div>
    </fieldset>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm" style={{ color: C.inkDeep }}>
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-[#066879]" />
      {label}
    </label>
  );
}

const SELECT = "w-full rounded-xl bg-white px-4 py-3 text-base outline-none sm:text-sm";

export default function FiltersDrawer({
  draft,
  setDraft,
  onApply,
  onReset,
  onClose,
}: {
  draft: Drawer;
  setDraft: (d: Drawer) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="more-filters-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[444px] flex-col bg-white shadow-[0px_16px_40px_-12px_rgba(17,27,39,0.3)]"
      >
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${C.line}` }}>
          <h2 id="more-filters-title" className="text-base font-extrabold" style={{ color: C.ink }}>
            More filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex size-8 items-center justify-center rounded-lg transition hover:bg-neutral-200"
            style={{ background: "#EDF1F2", color: C.muted, border: `1px solid ${C.line}` }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <Group title="Format">
            {(["In person", "Hybrid"] as const).map((f) => (
              <Check
                key={f}
                label={f === "In person" ? "In-person" : f}
                checked={draft.formats.has(f)}
                onChange={() => setDraft({ ...draft, formats: toggle(draft.formats, f) })}
              />
            ))}
          </Group>
          <Group title="Animal attendance">
            {(Object.keys(ANIMAL_LABELS) as Animals[]).map((a) => (
              <Check
                key={a}
                label={ANIMAL_LABELS[a]}
                checked={draft.animals.has(a)}
                onChange={() => setDraft({ ...draft, animals: toggle(draft.animals, a) })}
              />
            ))}
          </Group>
          <Group title="Age policy">
            <select
              aria-label="Age policy"
              value={draft.age}
              onChange={(e) => setDraft({ ...draft, age: e.target.value as Drawer["age"] })}
              className={SELECT}
              style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
            >
              <option value="any">Any</option>
              {(Object.keys(AGE_LABELS) as Age[]).map((a) => (
                <option key={a} value={a}>
                  {AGE_LABELS[a]}
                </option>
              ))}
            </select>
          </Group>
          <Group title="Frequency">
            <Check
              label="One-time"
              checked={draft.frequency.has("one-time")}
              onChange={() => setDraft({ ...draft, frequency: toggle(draft.frequency, "one-time") })}
            />
            <Check
              label="Recurring series"
              checked={draft.frequency.has("recurring")}
              onChange={() => setDraft({ ...draft, frequency: toggle(draft.frequency, "recurring") })}
            />
          </Group>
          <Group title="Distance">
            <select
              aria-label="Distance"
              defaultValue="any"
              className={SELECT}
              style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
            >
              <option value="any">Any distance / broader area</option>
            </select>
          </Group>
        </div>

        <div className="flex gap-3 px-6 py-5" style={{ borderTop: `1px solid ${C.line}` }}>
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold transition hover:bg-neutral-50"
            style={{ color: C.ink, border: `1px solid ${C.line}` }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            Apply filters
          </button>
        </div>
      </aside>
    </div>
  );
}
