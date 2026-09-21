"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { C } from "./theme";

type Source = {
  id: string;
  name: string;
  initials: string;
  note: string;
  /** Organizers are followed; topics are saved. */
  kind: "organizer" | "topic";
};

const SOURCES: readonly Source[] = [
  { id: "hh", name: "Hill Country Humane", initials: "HH", note: "Verified organizer · 3 upcoming events", kind: "organizer" },
  { id: "ct", name: "Central Texas Wildlife Center", initials: "CT", note: "Professional-led · 2 upcoming events", kind: "organizer" },
  { id: "fc", name: "Foster Care", initials: "FC", note: "Saved topic · 4 upcoming events", kind: "topic" },
];

const CADENCES = [
  { id: "weekly", label: "Weekly digest" },
  { id: "monthly", label: "Monthly digest" },
  { id: "off", label: "Off — I’ll check back myself" },
] as const;

export default function KeepPlanning() {
  // Matches the design: already following Hill Country Humane and saving Foster Care.
  const [on, setOn] = useState<ReadonlySet<string>>(new Set(["hh", "fc"]));
  const [cadence, setCadence] = useState<string>("weekly");

  const toggle = (id: string) => {
    const next = new Set(on);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOn(next);
  };

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
          Keep planning without the pressure
        </h2>
        <p className="mt-1.5 max-w-[540px] text-base leading-6" style={{ color: C.muted }}>
          Follow the organizers and topics you trust; choose how often you hear
          from them.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <ul
            className="rounded-[20px] bg-white px-5"
            style={{ border: `1px solid ${C.line}` }}
          >
            {SOURCES.map((s, i) => {
              const active = on.has(s.id);
              const label =
                s.kind === "organizer" ? (active ? "Following" : "Follow") : active ? "Saved" : "Save";
              return (
                <li
                  key={s.id}
                  className="flex items-center gap-3 py-4"
                  style={i ? { borderTop: `1px solid ${C.line}` } : undefined}
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-white"
                    style={{ background: C.brand }}
                  >
                    {s.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold" style={{ color: C.ink }}>
                      {s.name}
                    </span>
                    <span className="block text-xs" style={{ color: C.muted }}>
                      {s.note}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-pressed={active}
                    aria-label={`${label}: ${s.name}`}
                    onClick={() => toggle(s.id)}
                    className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition"
                    style={
                      active
                        ? { background: C.chip, color: C.inkDeep, border: `1px solid ${C.line}` }
                        : { background: "#fff", color: C.ink, border: `1px solid ${C.line}` }
                    }
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>

          <fieldset
            className="rounded-[20px] p-5"
            style={{ background: C.chip, border: `1px solid ${C.line}` }}
          >
            <legend className="sr-only">Planning digest frequency</legend>
            <p className="text-sm font-bold" style={{ color: C.ink }}>
              Planning digest
            </p>
            <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
              One summary of what&apos;s coming up — no per-event pings unless
              something material changes.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              {CADENCES.map((c) => {
                const selected = cadence === c.id;
                return (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-white px-3.5 py-2.5 text-xs font-semibold"
                    style={{
                      color: C.ink,
                      border: `1px solid ${selected ? C.brand : C.line}`,
                      boxShadow: selected ? `0 0 0 1px ${C.brand}` : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="digest"
                      value={c.id}
                      checked={selected}
                      onChange={() => setCadence(c.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className="flex size-4 shrink-0 items-center justify-center rounded-full"
                      style={{
                        border: `1.5px solid ${selected ? C.brand : C.line}`,
                        background: selected ? C.brand : "#fff",
                      }}
                    >
                      {selected && <Check size={10} strokeWidth={3} color="#fff" />}
                    </span>
                    {c.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>
    </section>
  );
}
