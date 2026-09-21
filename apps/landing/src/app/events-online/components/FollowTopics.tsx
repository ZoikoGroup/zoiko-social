"use client";

import { useState } from "react";
import { C } from "./theme";

export default function FollowTopics() {
  const [cadence, setCadence] = useState("weekly");
  const [saved, setSaved] = useState(false);

  return (
    <section
      className="mt-12 flex flex-col gap-5 rounded-3xl p-5 sm:mt-16 sm:p-8 md:flex-row md:items-center md:justify-between"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div>
        <h2 className="text-lg font-extrabold leading-7" style={{ color: C.ink }}>
          Follow topics and organizers you trust.
        </h2>
        <p className="mt-1 max-w-md text-xs leading-5" style={{ color: C.muted }}>
          Get reminders and material-change alerts — never a pressure loop. You
          control the frequency.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="events-digest">
          Reminder frequency
        </label>
        <select
          id="events-digest"
          value={cadence}
          onChange={(e) => {
            setCadence(e.target.value);
            setSaved(false);
          }}
          className="w-full rounded-xl bg-white px-4 py-2.5 text-base outline-none sm:w-40 sm:text-sm"
          style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
        >
          <option value="daily">Daily digest</option>
          <option value="weekly">Weekly digest</option>
          <option value="changes">Material changes only</option>
        </select>
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
          style={{ background: C.brand }}
        >
          {saved ? "Preference saved" : "Save preference"}
        </button>
      </div>
    </section>
  );
}
