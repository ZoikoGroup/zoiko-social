import Image from "next/image";
import { BadgeCheck, Bookmark, Clock, Ellipsis } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { actionOf, type Workshop } from "./workshops";
import { C } from "./theme";

const ACTIONS = {
  register: { label: "Register", style: { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` } },
  waitlist: { label: "Join Waitlist", style: { background: C.chipWarm, color: C.warm, border: `1px solid ${C.chipWarm}` } },
  request: { label: "Request to Join", style: { background: C.panel, color: C.muted, border: `1px solid ${C.line}` } },
} as const;

function Pill({ label, warm }: { label: string; warm?: boolean }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-semibold leading-4"
      style={
        warm
          ? { background: C.chipWarm, color: C.warm, border: `1px solid ${C.chipWarm}` }
          : { background: C.panel, color: C.muted, border: `1px solid ${C.line}` }
      }
    >
      {label}
    </span>
  );
}

export type Section = "recommended" | "all" | "upcoming";

export default function WorkshopCard({
  workshop,
  section,
  saved,
  onToggleSave,
}: {
  workshop: Workshop;
  section: Section;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const action = ACTIONS[actionOf(workshop)];
  const full = workshop.filled >= workshop.capacity;
  const photo = workshop.photos[section] ?? workshop.photos.all;

  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] bg-white" style={{ border: `1px solid ${C.line}` }}>
      <div className="relative h-60 bg-gradient-to-br from-cyan-800 to-orange-500 sm:h-72">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 396px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span
          className="absolute left-2 top-2 flex flex-col items-center rounded-lg bg-white px-2.5 py-1 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
          aria-hidden
        >
          <span className="text-[9px] font-bold uppercase leading-3 tracking-tight" style={{ color: C.warm }}>
            {workshop.badge.top}
          </span>
          <span className="text-base font-extrabold leading-4" style={{ color: C.ink }}>
            {workshop.badge.day}
          </span>
        </span>
        <span
          className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold leading-4"
          style={{ color: C.inkDeep }}
        >
          {workshop.mode}
        </span>
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${workshop.title} from saved` : `Save ${workshop.title}`}
          className="absolute bottom-2.5 right-2.5 flex size-8 items-center justify-center rounded-lg bg-white/90 transition hover:bg-white"
          style={{ color: saved ? C.brand : C.muted }}
        >
          <Bookmark size={14} strokeWidth={2} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-[5px] pb-1.5 text-xs font-bold leading-4" style={{ color: C.brand }}>
          <Clock size={12} strokeWidth={2} />
          {workshop.when}
        </p>
        {workshop.reason && (
          <p className="pb-1 text-xs font-bold leading-4" style={{ color: C.warm }}>
            {workshop.reason}
          </p>
        )}
        <h3 className="text-base font-bold leading-5" style={{ color: C.ink }}>
          {workshop.title}
        </h3>
        <div className="flex flex-wrap gap-[5px] pb-2.5 pt-1.5">
          <Pill label={workshop.level} warm={workshop.level === "Professional-only"} />
          <Pill label={workshop.participation} />
        </div>
        <p className="pb-0.5">
          <span
            className="inline-flex items-center gap-[5px] rounded-full px-2.5 py-[3px] text-xs font-bold"
            style={{ background: C.chip, color: C.inkDeep }}
          >
            <BadgeCheck size={11} strokeWidth={2.5} />
            {workshop.instructor}
          </span>
        </p>
        <p className="pb-3 pt-2 text-xs leading-4" style={{ color: C.muted }}>
          {full ? "Full — " : ""}
          {workshop.filled} of {workshop.capacity} spots filled
        </p>
        <div className="mt-auto flex items-center gap-1.5">
          <a
            href={appUrl("/events")}
            className="flex-1 rounded-lg px-2.5 py-2 text-center text-xs font-bold transition hover:opacity-90"
            style={action.style}
          >
            {action.label}
          </a>
          <a
            href={appUrl("/events")}
            aria-label={`More about ${workshop.title}`}
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
