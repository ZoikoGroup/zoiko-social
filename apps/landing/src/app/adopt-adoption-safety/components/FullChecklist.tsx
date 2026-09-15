"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { C } from "./theme";
import { CHECKLIST_GROUPS } from "./guidance";

const TOTAL = CHECKLIST_GROUPS.reduce((n, g) => n + g.items.length, 0);

/**
 * The full sixteen-item checklist, grouped by stage. Ticks live in this
 * component for the visit; as the comp says, nothing here becomes a public
 * "safety score".
 */
export default function FullChecklist() {
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (id: string) =>
    setChecked((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  return (
    <section id="your-safety-checklist" className="scroll-mt-24 pt-16">
      <div className="mx-auto flex max-w-[640px] flex-col gap-3 text-center">
        <h2
          className="text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
          style={{ color: C.ink }}
        >
          Your safety checklist
        </h2>
        <p className="text-base leading-6" style={{ color: C.muted }}>
          Check items off as you go. This is private to your account — it never
          creates a public &ldquo;safety score.&rdquo;
        </p>
      </div>

      <p className="pt-8 text-right text-xs leading-5" style={{ color: C.muted }} aria-live="polite">
        {checked.length} of {TOTAL} checked
      </p>

      <div className="mx-auto mt-3 flex max-w-[760px] flex-col gap-4">
        {CHECKLIST_GROUPS.map((group) => (
          <fieldset
            key={group.group}
            className="rounded-2xl bg-white px-5 py-4"
            style={{ border: `1px solid ${C.line}` }}
          >
            <legend className="px-1 text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
              {group.group}
            </legend>
            <ul className="flex flex-col gap-2 pt-2">
              {group.items.map((item) => {
                const id = `${group.group}:${item}`;
                const on = checked.includes(id);
                return (
                  <li key={item}>
                    <label className="flex cursor-pointer items-start gap-3 py-1">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(id)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded"
                        style={
                          on
                            ? { background: C.brand, border: `2px solid ${C.brand}` }
                            : { border: `2px solid ${C.line}` }
                        }
                      >
                        {on ? <Check size={11} strokeWidth={3} className="text-white" /> : null}
                      </span>
                      <span className="text-sm leading-5" style={{ color: C.inkDeep }}>
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
