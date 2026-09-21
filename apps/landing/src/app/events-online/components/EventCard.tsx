import Image from "next/image";
import { Bookmark, BadgeCheck, Clock, Radio } from "lucide-react";
import type { OnlineEvent, Status } from "./events";
import { C } from "./theme";

type Badge = { label: string; bg: string; icon?: "clock" | "live" };

const BADGES: Partial<Record<Status, Badge>> = {
  "starting-soon": { label: "Starting soon", bg: C.warmBadge, icon: "clock" },
  live: { label: "Live now", bg: C.live, icon: "live" },
  full: { label: "Full · Waitlist open", bg: C.warmBadge },
  canceled: { label: "Canceled", bg: C.canceled },
  rescheduled: { label: "Rescheduled", bg: C.warmBadge },
  replay: { label: "Ended · Replay available", bg: C.overlay },
};

const NOTICES: Partial<Record<Status, string>> = {
  canceled: "This event was canceled by the organizer",
  rescheduled: "Rescheduled — new time shown below",
};

/** The primary action changes with status; canceled events only get details. */
const ACTIONS: Record<Status, string> = {
  upcoming: "RSVP",
  "starting-soon": "RSVP",
  live: "Join now",
  full: "Join waitlist",
  canceled: "View details",
  rescheduled: "RSVP",
  replay: "Watch replay",
};

export default function EventCard({
  event,
  saved,
  onToggleSave,
}: {
  event: OnlineEvent;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const badge = BADGES[event.status];
  const notice = NOTICES[event.status];
  const canceled = event.status === "canceled";
  const donation = event.price === "Donation-backed";

  return (
    <article
      className="flex flex-col overflow-hidden rounded-3xl bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative aspect-[382/215] w-full overflow-hidden bg-gradient-to-br from-cyan-800 to-orange-500">
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        {badge && (
          <span
            className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold leading-4 text-white"
            style={{ background: badge.bg }}
          >
            {badge.icon === "clock" && <Clock size={10} strokeWidth={2.5} />}
            {badge.icon === "live" && <Radio size={10} strokeWidth={2.5} />}
            {badge.label}
          </span>
        )}
        <span
          className="absolute right-2.5 top-2.5 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold leading-4"
          style={{ color: C.ink }}
        >
          Online
        </span>
      </div>

      <div className="flex flex-col px-4 pb-5 pt-4">
        {notice && (
          <p
            className="mb-3 rounded-lg px-2.5 py-1.5 text-xs font-bold leading-4"
            style={{ background: C.chipWarm, color: C.warm }}
          >
            {notice}
          </p>
        )}

        <h3
          className="text-base font-bold leading-5"
          style={{ color: C.inkDeep }}
        >
          {event.title}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: C.muted }}>
            {event.organizer}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
            style={{ background: C.chip, color: C.ink }}
          >
            <BadgeCheck size={10} strokeWidth={2.5} />
            {event.trust}
          </span>
        </div>

        <p className="mt-2 text-xs leading-5">
          <span className="font-bold" style={{ color: C.inkDeep }}>
            {event.when}
          </span>
          <span style={{ color: C.muted }}> · {event.whenDetail}</span>
        </p>
        {event.previously && (
          <p className="text-xs leading-5 line-through" style={{ color: C.muted }}>
            {event.previously}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {event.access.map((a) => (
            <span
              key={a}
              className="rounded-md px-2 py-1 text-xs font-semibold leading-4"
              style={{
                background: C.panel,
                color: C.muted,
                border: `1px solid ${C.line}`,
              }}
            >
              {a}
            </span>
          ))}
        </div>

        <p
          className="mt-3 text-xs font-bold leading-5"
          style={{ color: donation ? C.warm : C.ink }}
        >
          {event.price}
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-xs font-semibold transition hover:opacity-90"
            style={
              canceled
                ? { background: "#fff", color: C.inkDeep, border: `1px solid ${C.line}` }
                : { background: C.brand, color: "#fff" }
            }
          >
            {ACTIONS[event.status]}
          </button>
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={saved}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold transition hover:bg-neutral-50"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            {saved && <Bookmark size={12} strokeWidth={2.5} fill="currentColor" />}
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
}
