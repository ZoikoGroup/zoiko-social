"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, MapPin, User } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";
import type { Badge, Community, JoinState } from "./regions";

const BADGE_STYLE: Record<Badge, React.CSSProperties> = {
  "Verified Community": { background: C.chip, color: C.ink },
  Moderated: { background: "#F7F9F9", color: C.muted, border: `1px solid ${C.line}` },
  "Organization-led": { background: C.chipWarm, color: C.warmText },
  "Professional-led": { background: C.chipWarm, color: C.warmText },
};

const quietLink = "text-xs font-semibold underline underline-offset-2 transition hover:opacity-70";
const primary = "rounded-[10px] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90";
const outline = "rounded-[10px] bg-white px-3 py-1.5 text-xs font-semibold transition hover:opacity-80";

/** The join button, which changes with the viewer's standing. */
function JoinButton({ state, onChange }: { state: JoinState; onChange: (next: JoinState) => void }) {
  switch (state) {
    case "open":
      return (
        <button type="button" onClick={() => onChange("joined")} className={`${primary} min-w-36`} style={{ background: C.brand }}>
          Join
        </button>
      );
    case "request":
      return (
        <button type="button" onClick={() => onChange("requested")} className={primary} style={{ background: C.brand }}>
          Request to Join
        </button>
      );
    case "requested":
      // The whole button cancels: the request is the only thing it can undo.
      return (
        <button
          type="button"
          onClick={() => onChange("request")}
          className={outline}
          style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
        >
          Requested · Cancel
        </button>
      );
    case "joined":
      return (
        <Link href={APP_LINKS.communities} className={outline} style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}>
          Joined · View
        </Link>
      );
    case "paused":
      return (
        <Link href={APP_LINKS.communities} className={outline} style={{ color: C.muted, border: `1px solid ${C.line}` }}>
          View Community
        </Link>
      );
  }
}

export default function CommunityCard({
  community,
  regionName,
  localNote,
  join,
  onJoinChange,
}: {
  community: Community;
  regionName: string;
  /** "Local to Sacramento area", or "Across California" for the wider view. */
  localNote: string;
  join: JoinState;
  onJoinChange: (next: JoinState) => void;
}) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const { place } = community;
  const tags = [...community.species, ...community.purposes];

  const share = async () => {
    const url = APP_LINKS.communities;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: community.name, url });
      } catch {
        // The viewer dismissed the sheet.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access denied.
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] bg-white" style={{ border: `1px solid ${C.line}` }}>
      <div
        className="relative h-[120px] shrink-0"
        style={{ background: `linear-gradient(73deg, ${C.brand} 0%, ${C.warm} 100%)` }}
      >
        {community.cover ? (
          <Image src={community.cover} alt="" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover" />
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col gap-2 px-4 pb-4 pt-8">
        {/* The logo straddles the cover's lower edge. */}
        <span
          className="absolute -top-[30px] left-4 flex size-12 items-center justify-center overflow-hidden rounded-2xl text-xs font-bold shadow-[0_1px_2px_rgba(7,59,71,0.06)]"
          style={{ background: C.chip, color: C.ink, boxShadow: "0 0 0 3px #fff" }}
        >
          {community.logo ? (
            <Image src={community.logo} alt="" fill sizes="48px" className="object-cover" />
          ) : (
            community.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
          )}
        </span>

        <h3 className="text-base font-bold leading-5" style={{ color: C.inkDeep }}>
          {community.name}
        </h3>

        {place.kind === "area" ? (
          <p className="flex items-center gap-[5px] text-xs leading-5" style={{ color: C.muted }}>
            <MapPin size={12} strokeWidth={2} className="shrink-0" />
            {regionName}
          </p>
        ) : (
          <p className="flex items-center gap-[5px] text-xs font-semibold leading-5" style={{ color: C.warmText }}>
            <User size={12} strokeWidth={2} className="shrink-0" />
            {place.kind === "protected" ? "Location protected" : place.label}
          </p>
        )}

        <p className="text-xs leading-5" style={{ color: C.muted }}>
          {community.description}
        </p>

        {community.badges.length ? (
          <div className="flex flex-wrap gap-1.5">
            {community.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-md px-2 py-[3px] text-xs font-bold leading-4"
                style={BADGE_STYLE[badge]}
              >
                {badge === "Verified Community" ? <Check size={10} strokeWidth={3} /> : null}
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        {tags.length ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2 pb-1 pt-0.5 text-xs font-semibold leading-4"
                style={{ background: "#F7F9F9", color: C.muted, border: `1px solid ${C.line}` }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <p className="text-xs leading-4" style={{ color: C.muted }}>
          {community.members} · {community.activity}
        </p>
        <p className="text-xs font-semibold leading-4" style={{ color: C.brand }}>
          {localNote}
        </p>

        <div className="mt-auto pt-2">
          <JoinButton state={join} onChange={onJoinChange} />
        </div>

        <div className="flex flex-wrap gap-3 pt-1.5" style={{ color: C.muted }}>
          <button type="button" onClick={() => setSaved((v) => !v)} aria-pressed={saved} className={quietLink}>
            {saved ? "Saved" : "Save"}
          </button>
          <button type="button" onClick={share} className={quietLink}>
            {copied ? "Link copied" : "Share"}
          </button>
          <Link href={APP_LINKS.safety} className={quietLink}>
            Report
          </Link>
        </div>
      </div>
    </article>
  );
}
