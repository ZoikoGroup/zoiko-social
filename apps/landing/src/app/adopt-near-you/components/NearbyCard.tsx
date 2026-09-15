"use client";

import Image from "next/image";
import { BadgeCheck, Bookmark, MapPin, MoreHorizontal } from "lucide-react";
import { C } from "./theme";
import { STATUS_LABEL, type NearbyListing, type Status } from "./nearYou";

/** Badge fill and text colour per status. */
const STATUS_STYLE: Record<Status, { background: string; color: string }> = {
  available: { background: C.okFill, color: C.okInk },
  needed: { background: C.okFill, color: C.okInk },
  pending: { background: C.warnFill, color: C.warnInk },
  paused: { background: C.warnFill, color: C.warnInk },
};

export default function NearbyCard({
  listing,
  saved,
  onToggleSave,
}: {
  listing: NearbyListing;
  saved: boolean;
  onToggleSave: () => void;
}) {
  /* Only an open listing takes new interest; the comp greys the action out
     on the other two states rather than hiding it. */
  const open = listing.status === "available" || listing.status === "needed";
  const action = listing.kind === "Foster" ? "View Foster Need" : "View Adoption Profile";

  return (
    <article
      className="flex flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative aspect-[291/218] w-full" style={{ background: C.chip }}>
        <Image
          src={listing.image}
          alt={listing.alt}
          fill
          sizes="(min-width: 1280px) 291px, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />

        <div className="absolute inset-x-[9px] top-[9px] flex items-start justify-between gap-2">
          <span
            className="rounded-[100px] px-2 py-1 text-xs font-bold leading-4"
            style={{ background: "rgba(255,255,255,0.95)", color: C.ink }}
          >
            {listing.kind}
          </span>
          <span
            className="rounded-[100px] px-2 py-1 text-xs font-bold leading-4"
            style={STATUS_STYLE[listing.status]}
          >
            {STATUS_LABEL[listing.status]}
          </span>
        </div>

        {/* Save. The comp draws it as a 32px tile with a 2px outline, sitting
            just inside the bottom-right of the photo. */}
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${listing.name} from saved` : `Save ${listing.name}`}
          className="absolute bottom-[9px] right-[9px] flex size-8 items-center justify-center rounded-lg transition"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: `2px solid ${saved ? C.brand : "#000"}`,
          }}
        >
          <Bookmark
            size={14}
            strokeWidth={1.25}
            style={{ color: saved ? C.brand : C.muted }}
            fill={saved ? C.brand : "none"}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-6" style={{ color: C.inkDeep }}>
          {listing.name}
        </h3>
        <p className="pt-[3px] text-xs leading-5" style={{ color: C.muted }}>
          {listing.breed}
        </p>

        <p
          className="flex items-start gap-1 pt-2 text-xs leading-4"
          style={{ color: C.muted }}
        >
          <MapPin size={12} strokeWidth={1} className="mt-px shrink-0" aria-hidden />
          {listing.where}
        </p>

        {listing.attributes.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {listing.attributes.map((attribute) => (
              <span
                key={attribute}
                className="rounded-[100px] px-2 py-[3px] text-xs font-semibold leading-4"
                style={{ background: C.page, border: `1px solid ${C.line}`, color: C.muted }}
              >
                {attribute}
              </span>
            ))}
          </div>
        ) : null}

        <p className="flex items-center gap-[5px] pt-1.5 text-xs leading-4" style={{ color: C.muted }}>
          {listing.org}
          <BadgeCheck size={12} strokeWidth={1.5} aria-label="Verified organization" />
        </p>

        <p className="pt-[5px] text-xs leading-4" style={{ color: C.muted }}>
          Listed {listing.listedDaysAgo} {listing.listedDaysAgo === 1 ? "day" : "days"} ago
        </p>

        {/* Pushed to the bottom so the actions line up across a row of cards
            whose copy runs to different lengths. */}
        <div className="mt-auto flex items-center gap-1.5 pt-4">
          <a
            href="#"
            aria-disabled={!open}
            tabIndex={open ? undefined : -1}
            className={`flex-1 rounded-lg px-2.5 py-2 text-center text-xs font-bold leading-5 transition ${
              open ? "hover:opacity-90" : "pointer-events-none"
            }`}
            style={
              open
                ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                : { background: C.page, color: C.muted, border: `1px solid ${C.line}` }
            }
          >
            {action}
          </a>
          <button
            type="button"
            aria-label={`More options for ${listing.name}`}
            className="flex size-8 items-center justify-center rounded-lg"
            style={{ background: C.chip, border: "2px solid #000" }}
          >
            <MoreHorizontal size={16} style={{ color: C.muted }} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
