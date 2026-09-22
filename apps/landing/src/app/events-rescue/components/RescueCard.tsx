import Image from "next/image";
import { BadgeCheck, Bookmark, Clock, Ellipsis, MapPin } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { actionOf, type RescueEvent } from "./rescueEvents";
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

export type Section = "featured" | "all" | "upcoming";

export default function RescueCard({
  e,
  section,
  saved,
  onToggleSave,
  onRsvp,
}: {
  e: RescueEvent;
  section: Section;
  saved: boolean;
  onToggleSave: () => void;
  onRsvp: () => void;
}) {
  const action = ACTIONS[actionOf(e)];
  const photo = e.photos[section] ?? e.photos.all;
  const featured = section === "featured";
  const hasSpots = e.filled !== undefined && e.capacity !== undefined;
  const full = hasSpots && e.filled! >= e.capacity!;

  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] bg-white" style={{ border: `1px solid ${C.line}` }}>
      <div className={`relative bg-gradient-to-br from-cyan-800 to-orange-500 ${featured ? "h-56 sm:h-80" : "h-60 sm:h-72"}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={featured}
          sizes={featured ? "(min-width: 1280px) 1230px, 100vw" : "(min-width: 1024px) 396px, (min-width: 640px) 50vw, 100vw"}
          className="object-cover"
        />
        <span
          className="absolute left-2 top-2 flex flex-col items-center rounded-lg bg-white px-2.5 py-1 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
          aria-hidden
        >
          <span className="text-[9px] font-bold uppercase leading-3 tracking-tight" style={{ color: C.warm }}>
            {e.badge.top}
          </span>
          <span className="text-base font-extrabold leading-4" style={{ color: C.ink }}>
            {e.badge.day}
          </span>
        </span>
        {e.fundraiser && !featured && (
          <span
            className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold leading-4"
            style={{ color: C.inkDeep }}
          >
            Fundraiser
          </span>
        )}
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${e.title} from saved` : `Save ${e.title}`}
          className="absolute bottom-2.5 right-2.5 flex size-8 items-center justify-center rounded-lg bg-white/90 transition hover:bg-white"
          style={{ color: saved ? C.brand : C.muted }}
        >
          <Bookmark size={14} strokeWidth={2} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-[5px] pb-1.5 text-xs font-bold leading-4" style={{ color: C.brand }}>
          <Clock size={12} strokeWidth={2} />
          {e.when}
        </p>
        {e.reason && (
          <p className="pb-1 text-xs font-bold leading-4" style={{ color: C.warm }}>
            {e.reason}
          </p>
        )}
        {e.updated && (
          <span
            className="mb-1 self-start rounded px-1.5 py-0.5 text-[10px] font-bold uppercase leading-4 tracking-tight"
            style={{ background: C.chip, color: C.inkDeep }}
          >
            Updated
          </span>
        )}
        <h3 className="text-base font-bold leading-5" style={{ color: C.ink }}>
          {e.title}
        </h3>
        <p className="flex items-center gap-1 pb-2.5 pt-1 text-xs leading-4" style={{ color: C.muted }}>
          <MapPin size={12} strokeWidth={2} />
          {e.venue}
        </p>
        <div className="flex flex-wrap gap-[5px] pb-2.5">
          <Pill label={e.adoptable ? "Adoptable animals present" : "No animals on-site"} strong={e.adoptable} />
          <Pill label={e.participation} />
        </div>
        <p className="flex flex-wrap gap-1.5 pb-0.5">
          <span
            className="inline-flex items-center gap-[5px] rounded-full px-2.5 py-[3px] text-xs font-bold"
            style={{ background: C.chip, color: C.inkDeep }}
          >
            {!e.independent && <BadgeCheck size={11} strokeWidth={2.5} />}
            {e.organizer}
          </span>
        </p>
        {e.fundraiser && (
          <p className="pt-1.5">
            <span
              className="inline-block rounded-full px-2.5 py-[3px] text-xs font-semibold"
              style={{ background: C.chipWarm, color: C.warm }}
            >
              $ Includes authorized fundraiser
            </span>
          </p>
        )}
        <p className="pb-3 pt-2 text-xs leading-4" style={{ color: C.muted }}>
          {hasSpots ? `${full ? "Full — " : ""}${e.filled} of ${e.capacity} spots filled` : "Open drop-off — no RSVP limit"}
        </p>
        <div className="mt-auto flex items-center gap-1.5">
          {actionOf(e) === "rsvp" && e.rsvp ? (
            <button
              type="button"
              onClick={onRsvp}
              aria-haspopup="dialog"
              className="flex-1 rounded-lg px-2.5 py-2 text-center text-xs font-bold transition hover:opacity-90"
              style={action.style}
            >
              {action.label}
            </button>
          ) : (
            <a
              href={appUrl("/events")}
              className="flex-1 rounded-lg px-2.5 py-2 text-center text-xs font-bold transition hover:opacity-90"
              style={action.style}
            >
              {action.label}
            </a>
          )}
          <a
            href={appUrl("/events")}
            aria-label={`More about ${e.title}`}
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
