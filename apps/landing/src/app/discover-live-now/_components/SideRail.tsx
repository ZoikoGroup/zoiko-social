"use client";

import Link from "next/link";
import { appUrl } from "@/lib/app-links";
import { C } from "./theme";
import { TUNE_SIGNALS, type Topic } from "./streams";

const UPCOMING = [
  {
    title: "Backyard Habitat Building Workshop",
    meta: "Conservation Volunteers · Tomorrow, 10:00 AM",
  },
  {
    title: "Regional Adoption Day Kickoff",
    meta: "City Shelter Volunteers · Sat, 9:00 AM",
  },
  {
    title: "Sanctuary Golden Hour Walkthrough",
    meta: "Retired Racehorse Sanctuary · Sun, 5:30 PM",
  },
];

/**
 * Upcoming streams and the Tune Live card. The tuned signals are owned by
 * the board, because every card's "Why shown" reads them.
 */
export default function SideRail({
  tuned,
  onToggleTuned,
}: {
  tuned: Topic[];
  onToggleTuned: (topic: Topic) => void;
}) {
  return (
    <aside className="grid w-full gap-5 sm:grid-cols-2 lg:flex lg:w-[320px] lg:shrink-0 lg:flex-col lg:self-start">
      <section className="rounded-[20px] bg-white p-5" style={{ border: `1px solid ${C.line}` }}>
        <h2 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
          Upcoming from your communities
        </h2>
        <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
          Only shown for communities and events you follow or belong to.
        </p>
        <ul className="mt-4 flex flex-col gap-4">
          {UPCOMING.map((item) => (
            <li key={item.title}>
              <Link
                href={appUrl("/events")}
                className="flex items-start gap-3 transition hover:opacity-80"
              >
                <span
                  className="size-10 shrink-0 rounded-lg"
                  style={{ background: C.chip }}
                  aria-hidden
                />
                <span>
                  <span
                    className="block text-xs font-bold leading-5"
                    style={{ color: C.inkDeep }}
                  >
                    {item.title}
                  </span>
                  <span className="block text-xs leading-4" style={{ color: C.muted }}>
                    {item.meta}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[20px] bg-white p-5" style={{ border: `1px solid ${C.line}` }}>
        <h2 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
          Tune Live
        </h2>
        <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
          Adjust the signals that shape what you see here. Never affects your
          blocks or safety settings.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {TUNE_SIGNALS.map((topic) => {
            const on = tuned.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => onToggleTuned(topic)}
                aria-pressed={on}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition hover:opacity-80"
                style={
                  on
                    ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                    : { background: "#fff", color: C.muted, border: `1px solid ${C.line}` }
                }
              >
                {topic}
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
