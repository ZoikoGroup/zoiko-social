import Image from "next/image";
import { Bookmark, Clock, Ellipsis, MapPin } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { AGE_LABELS, ANIMAL_LABELS, actionOf, type Meetup } from "./meetups";
import { C } from "./theme";

const ACTIONS = {
  rsvp: { label: "RSVP", style: { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` } },
  waitlist: { label: "Join Waitlist", style: { background: C.chipWarm, color: C.warm, border: `1px solid ${C.chipWarm}` } },
  request: { label: "Request to Join", style: { background: C.panel, color: C.muted, border: `1px solid ${C.line}` } },
} as const;

function Pill({ label, strong }: { label: string; strong?: boolean }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-semibold leading-4"
      style={
        strong
          ? { background: C.chip, color: C.inkDeep }
          : { background: C.panel, color: C.muted, border: `1px solid ${C.line}` }
      }
    >
      {label}
    </span>
  );
}

export default function MeetupCard({
  meetup,
  series,
  saved,
  onToggleSave,
}: {
  meetup: Meetup;
  /** Use the alternate photo, as the "Recurring series" section does. */
  series?: boolean;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const action = ACTIONS[actionOf(meetup)];
  const full = meetup.filled >= meetup.capacity;
  const src = series && meetup.seriesImage ? meetup.seriesImage : meetup.image;
  const alt = series && meetup.seriesImageAlt ? meetup.seriesImageAlt : meetup.imageAlt;

  return (
    <article
      id={series ? undefined : meetup.id}
      className="flex scroll-mt-24 flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative h-60 bg-gradient-to-br from-cyan-800 to-orange-500 sm:h-72">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 396px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span
          className="absolute left-2 top-2 flex flex-col items-center rounded-lg bg-white px-2.5 py-1 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
          aria-hidden
        >
          <span className="text-[9px] font-bold uppercase leading-3 tracking-tight" style={{ color: C.warm }}>
            {meetup.badge.top}
          </span>
          <span className="text-base font-extrabold leading-4" style={{ color: C.ink }}>
            {meetup.badge.day}
          </span>
        </span>
        {meetup.recurrence && (
          <span
            className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold leading-4"
            style={{ color: C.inkDeep }}
          >
            {meetup.recurrence}
          </span>
        )}
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${meetup.title} from saved` : `Save ${meetup.title}`}
          className="absolute bottom-2.5 right-2.5 flex size-8 items-center justify-center rounded-lg bg-white/90 transition hover:bg-white"
          style={{ color: saved ? C.brand : C.muted }}
        >
          <Bookmark size={14} strokeWidth={2} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-[5px] pb-1.5 text-xs font-bold leading-4" style={{ color: C.brand }}>
          <Clock size={12} strokeWidth={2} />
          {meetup.when}
        </p>
        <h3 className="text-base font-bold leading-5" style={{ color: C.ink }}>
          {meetup.title}
        </h3>
        <p className="flex items-center gap-1 pb-2.5 pt-1 text-xs leading-4" style={{ color: C.muted }}>
          <MapPin size={12} strokeWidth={2} />
          {meetup.venue}
        </p>
        <div className="flex flex-wrap gap-[5px] pb-2.5">
          <Pill label={ANIMAL_LABELS[meetup.animals]} strong={meetup.animals !== "people-only"} />
          <Pill label={AGE_LABELS[meetup.age]} />
        </div>
        <p className="pb-2.5 text-xs leading-4" style={{ color: C.muted }}>
          {meetup.organizer}
          {meetup.community && ` · ${meetup.community} community`}
        </p>
        <p className="pb-3 text-xs leading-4" style={{ color: C.muted }}>
          {full ? "Full — " : ""}
          {meetup.filled} of {meetup.capacity} spots filled
        </p>
        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <a
            href={appUrl("/events")}
            className="flex-1 rounded-lg px-2.5 py-2 text-center text-xs font-bold transition hover:opacity-90"
            style={action.style}
          >
            {action.label}
          </a>
          <a
            href={appUrl("/events")}
            aria-label={`More about ${meetup.title}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-neutral-200"
            style={{ background: "#EDF1F2", color: C.muted, border: `1px solid ${C.line}` }}
          >
            <Ellipsis size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </article>
  );
}
