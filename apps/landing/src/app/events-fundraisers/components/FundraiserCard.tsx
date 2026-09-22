import Image from "next/image";
import { BadgeCheck, Bookmark } from "lucide-react";
import type { Fundraiser, Status } from "./fundraisers";
import { C } from "./theme";

const BADGES: Partial<Record<Status, { label: string; bg: string }>> = {
  "goal-reached": { label: "Goal reached", bg: C.brand },
  "under-review": { label: "Under review", bg: C.reviewBadge },
  closed: { label: "Closed", bg: C.mutedBadge },
  canceled: { label: "Canceled", bg: C.mutedBadge },
};

/** Paused, closed or canceled fundraisers get an outline button instead of a primary one. */
const ACTION: Record<Status, { label: string; primary: boolean }> = {
  live: { label: "View fundraiser", primary: true },
  "goal-reached": { label: "View fundraiser", primary: true },
  "under-review": { label: "View fundraiser", primary: false },
  closed: { label: "View outcome", primary: false },
  canceled: { label: "View details", primary: false },
};

function VerifiedBeneficiary() {
  return (
    <span
      className="inline-flex items-center gap-[3px] rounded-md px-1.5 py-0.5 text-[9.5px] font-bold"
      style={{ background: C.chip, color: C.inkDeep }}
    >
      <BadgeCheck size={9} strokeWidth={2.5} />
      Verified Beneficiary
    </span>
  );
}

export default function FundraiserCard({
  f,
  saved,
  onToggleSave,
  onView,
}: {
  f: Fundraiser;
  saved: boolean;
  onToggleSave: () => void;
  onView: () => void;
}) {
  const badge = BADGES[f.status];
  const action = ACTION[f.status];
  const outline = { background: "#fff", color: C.ink, border: `1px solid ${C.line}` };

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white" style={{ border: `1px solid ${C.line}` }}>
      <div className="relative aspect-[382/215] w-full bg-gradient-to-br from-cyan-800 to-orange-500">
        <Image
          src={f.image}
          alt={f.imageAlt}
          fill
          sizes="(min-width: 1024px) 382px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        {badge && (
          <span
            className="absolute left-2.5 top-2.5 rounded-md px-2 pb-1 pt-[3px] text-xs font-bold leading-4 text-white"
            style={{ background: badge.bg }}
          >
            {badge.label}
          </span>
        )}
        {f.sponsored && (
          <span
            className="absolute right-2.5 top-2.5 rounded-md bg-white/90 px-2 py-[3px] text-[9.5px] font-bold leading-4"
            style={{ color: C.warm, border: `1px solid ${C.warm}` }}
          >
            Sponsored
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-4 pt-3.5">
        {f.status === "under-review" && (
          <p className="mb-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold leading-4" style={{ background: C.chipWarm, color: C.warm }}>
            Contributions are temporarily unavailable while this fundraiser is reviewed.
          </p>
        )}
        {f.status === "canceled" && (
          <p className="mb-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-4" style={{ background: C.panel, color: C.muted }}>
            Canceled — contributions refunded
          </p>
        )}
        <h3 className="text-base font-bold leading-5" style={{ color: C.ink }}>
          {f.title}
        </h3>
        <p className="text-xs leading-4" style={{ color: C.muted }}>
          {f.blurb}
        </p>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 pt-0.5 text-xs leading-4">
          <span className="min-w-16 font-semibold" style={{ color: C.muted }}>
            Beneficiary
          </span>
          <span className="font-bold" style={{ color: C.ink }}>
            {f.beneficiary}
          </span>
          <VerifiedBeneficiary />
        </div>
        {f.organizer && (
          <p className="flex flex-wrap gap-x-1.5 text-xs leading-4">
            <span className="min-w-16 font-semibold" style={{ color: C.muted }}>
              Organizer
            </span>
            <span className="font-bold" style={{ color: C.ink }}>
              {f.organizer}
            </span>
          </p>
        )}
        {f.contributed && f.goal ? (
          <p className="flex flex-wrap gap-1.5 pt-1">
            <span className="rounded-md px-2 pb-[3px] pt-0.5 text-xs font-bold leading-4" style={{ background: C.chip, color: C.inkDeep }}>
              Contributed {f.contributed}
            </span>
            <span
              className="rounded-md px-2 pb-[3px] pt-0.5 text-xs font-bold leading-4"
              style={{ background: C.panel, color: C.ink, border: `1px solid ${C.line}` }}
            >
              Goal {f.goal}
            </span>
          </p>
        ) : (
          <p className="pt-1 text-xs italic leading-4" style={{ color: C.muted }}>
            Financial details not publicly disclosed for this fundraiser.
          </p>
        )}
        <p className="text-xs leading-4" style={{ color: C.muted }}>
          {f.location}
        </p>
        <div className="mt-auto flex gap-2 pt-1.5">
          <button
            type="button"
            onClick={onView}
            aria-haspopup="dialog"
            className="rounded-lg px-3 py-2 text-xs font-semibold transition hover:opacity-90"
            style={action.primary ? { background: C.brand, color: "#fff" } : outline}
          >
            {action.label}
          </button>
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={saved}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:bg-neutral-50"
            style={outline}
          >
            {saved && <Bookmark size={12} strokeWidth={2.5} fill="currentColor" />}
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
}
