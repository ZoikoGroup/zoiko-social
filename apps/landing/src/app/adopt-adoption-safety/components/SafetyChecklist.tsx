"use client";

import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { C } from "./theme";
import { CHECKLIST } from "./guidance";

/**
 * The hero's checklist card. Ticking an item is a private, per-visit note to
 * self — nothing is sent anywhere, and the page says so.
 */
export default function SafetyChecklist() {
  const [done, setDone] = useState<string[]>(
    CHECKLIST.filter((item) => item.done).map((item) => item.id),
  );

  return (
    <section
      className="flex w-full flex-col rounded-3xl bg-white p-6 shadow-[0_8px_24px_rgba(7,59,71,0.10)]"
      style={{ border: `1px solid ${C.line}` }}
    >
      <span
        className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-bold leading-4"
        style={{ background: C.chip, color: C.ink }}
      >
        <ShieldCheck size={12} strokeWidth={2.4} />
        Verified Organization
      </span>

      <p className="py-4 text-xs leading-5" style={{ color: C.muted }}>
        Sacramento Animal Rescue · Status active
      </p>

      <ul>
        {CHECKLIST.map((item, i) => {
          const ticked = done.includes(item.id);
          return (
            <li
              key={item.id}
              style={{ borderBottom: i === CHECKLIST.length - 1 ? undefined : `1px solid ${C.line}` }}
            >
              <label className="flex cursor-pointer items-center gap-2.5 py-2">
                <input
                  type="checkbox"
                  checked={ticked}
                  onChange={() =>
                    setDone((list) =>
                      list.includes(item.id) ? list.filter((x) => x !== item.id) : [...list, item.id],
                    )
                  }
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className="flex size-5 shrink-0 items-center justify-center rounded-md"
                  style={
                    ticked
                      ? { background: C.brand, border: `2px solid ${C.brand}` }
                      : { border: `2px solid ${C.line}` }
                  }
                >
                  {ticked ? <Check size={12} strokeWidth={2.6} className="text-white" /> : null}
                </span>
                <span
                  className={`text-sm leading-5 ${ticked ? "line-through" : ""}`}
                  style={{ color: ticked ? C.muted : C.inkDeep }}
                >
                  {item.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
