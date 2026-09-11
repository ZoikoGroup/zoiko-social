"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Users } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";
import type { Badge, Stream, Topic } from "./streams";

/** The solid red LIVE badge laid over a thumbnail. */
export function LiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-[5px] rounded-md py-1 pl-1.5 pr-2 text-xs font-bold leading-4 tracking-tight text-white"
      style={{ background: C.live }}
    >
      <span className="size-1.5 rounded-[3px] bg-white" aria-hidden />
      LIVE
    </span>
  );
}

/** A translucent ink badge laid over a thumbnail: duration or viewer count. */
export function OverlayBadge({
  children,
  icon = false,
}: {
  children: React.ReactNode;
  icon?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-[5px] rounded-md px-2 py-1 text-xs font-semibold leading-4 text-white"
      style={{ background: C.overlay }}
    >
      {icon ? <Users size={11} strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

/** Host avatar, falling back to initials where no photo was supplied. */
export function Avatar({
  name,
  src,
  size,
}: {
  name: string;
  src?: string;
  size: number;
}) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-bold"
      style={{ width: size, height: size, background: C.chip, color: C.ink }}
    >
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
      )}
    </span>
  );
}

function BadgeChip({ badge }: { badge: Badge }) {
  const warm = badge === "Advisory" || badge === "New voice";
  return (
    <span
      className="inline-flex items-center rounded-md px-1.5 py-[3px] text-xs font-bold leading-4"
      style={warm ? { background: C.chipWarm, color: C.warm } : { background: C.chip, color: C.ink }}
    >
      {badge}
    </span>
  );
}

const quietLink =
  "text-xs font-semibold underline underline-offset-2 transition hover:opacity-70";

/** Label a secondary button shows once engaged. */
const ENGAGED: Record<Stream["secondary"], string> = {
  Follow: "Following",
  "Follow Event": "Following event",
  Join: "Joined",
};

export default function StreamCard({
  stream,
  engaged,
  onToggleEngaged,
  onHide,
  tuned,
}: {
  stream: Stream;
  engaged: boolean;
  onToggleEngaged: () => void;
  onHide: () => void;
  tuned: Topic[];
}) {
  const [whyOpen, setWhyOpen] = useState(false);
  const { ended } = stream;

  // "Why shown" answers from the viewer's own signals first, so the rail's
  // Tune Live card changes what each card says about itself.
  const tunedMatch = stream.topics.find((topic) => tuned.includes(topic));
  const reason = tunedMatch
    ? `Shown because you tuned Live for ${tunedMatch}.`
    : engaged
      ? "Shown because you follow this host."
      : "Shown because it's popular in communities near you.";

  return (
    <article
      className="flex flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative aspect-[276/155]">
        <Image
          src={stream.thumb}
          alt={stream.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 280px"
          // A finished stream is shown washed out, as in the comp.
          className={`object-cover ${ended ? "opacity-60 grayscale" : ""}`}
        />
        <div className="absolute left-2.5 top-2.5">
          {ended ? (
            <span
              className="inline-flex items-center gap-[5px] rounded-md py-1 pl-1.5 pr-2 text-xs font-bold leading-4 text-white"
              style={{ background: C.overlay }}
            >
              <span className="size-1.5 rounded-[3px] bg-white/70" aria-hidden />
              Ended
            </span>
          ) : (
            <LiveBadge />
          )}
        </div>
        {!ended ? (
          <>
            <div className="absolute right-2.5 top-2.5">
              <OverlayBadge>{stream.duration}</OverlayBadge>
            </div>
            <div className="absolute bottom-2.5 left-3">
              <OverlayBadge>{stream.watching}</OverlayBadge>
            </div>
          </>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col gap-2 px-4 pb-4 pt-3.5 ${ended ? "opacity-70" : ""}`}>
        {stream.badges.length ? (
          <div className="flex flex-wrap gap-1.5">
            {stream.badges.map((badge) => (
              <BadgeChip key={badge} badge={badge} />
            ))}
          </div>
        ) : null}

        <h3 className="text-base font-bold leading-5" style={{ color: C.inkDeep }}>
          {stream.title}
        </h3>

        <div className="flex items-center gap-2">
          <Avatar name={stream.host.name} src={stream.host.avatar} size={24} />
          <span className="text-xs font-semibold leading-5" style={{ color: C.inkDeep }}>
            {stream.host.name}
          </span>
        </div>

        <p className="text-xs leading-4" style={{ color: C.muted }}>
          {stream.org} · {stream.format}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-1.5">
          {ended ? (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-[10px] px-3 py-2 text-xs font-semibold"
              style={{ background: C.page, color: C.muted, border: `1px solid ${C.line}` }}
            >
              Replay unavailable
            </button>
          ) : (
            <>
              <Link
                href={APP_LINKS.communities}
                className="rounded-[10px] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                style={{ background: C.brand }}
              >
                Watch Live
              </Link>
              <button
                type="button"
                onClick={onToggleEngaged}
                aria-pressed={engaged}
                className="inline-flex items-center gap-1 rounded-[10px] px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
                style={
                  engaged
                    ? { background: C.chip, color: C.brand, border: `1px solid ${C.brand}` }
                    : { background: "#fff", color: C.inkDeep, border: `1px solid ${C.line}` }
                }
              >
                {engaged ? <Check size={12} strokeWidth={2.6} /> : null}
                {engaged ? ENGAGED[stream.secondary] : stream.secondary}
              </button>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-1.5" style={{ color: C.muted }}>
          <button
            type="button"
            onClick={() => setWhyOpen((v) => !v)}
            aria-expanded={whyOpen}
            className={quietLink}
          >
            Why shown
          </button>
          <button type="button" onClick={onHide} className={quietLink}>
            Hide
          </button>
          <Link href={APP_LINKS.safety} className={quietLink}>
            Report
          </Link>
        </div>

        {whyOpen ? (
          <p
            className="rounded-lg px-3 py-2 text-xs leading-5"
            style={{ background: C.chip, color: C.ink }}
          >
            {reason}
          </p>
        ) : null}
      </div>
    </article>
  );
}
