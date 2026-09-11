"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Check,
  Ellipsis,
  Flame,
  HeartHandshake,
  Image as ImageIcon,
  MessagesSquare,
  Newspaper,
  Plus,
  Radio,
  Share2,
  Stethoscope,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { VERIFIED_BADGE } from "./images";
import { C } from "./theme";
import type { Author, Kind, Trend } from "./feed";

const KIND_ICONS: Record<Kind, LucideIcon> = {
  Story: Newspaper,
  Post: ImageIcon,
  "Community discussion": MessagesSquare,
  Live: Radio,
  "Rescue update": HeartHandshake,
  "Expert update": Stethoscope,
  Event: CalendarDays,
};

function KindChip({ kind }: { kind: Kind }) {
  const Icon = KIND_ICONS[kind];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold leading-4"
      style={{ background: C.page, color: C.muted, border: `1px solid ${C.line}` }}
    >
      <Icon size={11} strokeWidth={2} />
      {kind}
    </span>
  );
}

function SignalChip({ signal }: { signal: NonNullable<Trend["signal"]> }) {
  const live = signal.tone === "live";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold leading-4"
      style={
        live
          ? { background: C.liveWash, color: C.live }
          : { background: C.chipWarm, color: C.warm }
      }
    >
      {live ? (
        <span
          className="size-1.5 rounded-full"
          style={{ background: C.live }}
          aria-hidden
        />
      ) : (
        <TrendingUp size={11} strokeWidth={2.2} />
      )}
      {signal.label}
    </span>
  );
}

function VerifiedName({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
        {name}
      </span>
      {/* SVGs gain nothing from the image optimizer, so it is bypassed. */}
      <Image src={VERIFIED_BADGE} alt="Verified" width={14} height={14} unoptimized />
    </span>
  );
}

function AuthorRow({ author }: { author: Author }) {
  // Follow and RSVP are per-card, per-visit toggles: this page is public and
  // has no account behind it, so nothing here persists beyond the session.
  const [on, setOn] = useState(false);

  if (author.type === "source") {
    return (
      <div className="pt-2">
        <VerifiedName name={author.name} />
        <p className="text-xs leading-5" style={{ color: C.muted }}>
          {author.detail}
        </p>
      </div>
    );
  }

  const label =
    author.action === "RSVP" ? (on ? "Going" : "RSVP") : on ? "Following" : "Follow";

  return (
    <div className="flex items-start gap-3">
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full">
        <Image src={author.avatar} alt="" fill sizes="40px" className="object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <VerifiedName name={author.name} />
        <p className="text-xs leading-5" style={{ color: C.muted }}>
          {author.detail}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition hover:opacity-80"
        style={
          on
            ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
            : { background: C.chip, color: C.brand, border: `1px solid ${C.line}` }
        }
      >
        {on ? <Check size={12} strokeWidth={2.6} /> : null}
        {label}
      </button>
    </div>
  );
}

/** Warning panel standing in for sensitive media until the viewer opts in. */
function SensitiveMedia({
  revealed,
  onSkip,
}: {
  revealed: string;
  onSkip: () => void;
}) {
  const [shown, setShown] = useState(false);

  if (shown) {
    return (
      <p
        className="rounded-2xl p-4 text-sm leading-6"
        style={{ background: C.page, color: C.inkDeep, border: `1px solid ${C.line}` }}
      >
        {revealed}
      </p>
    );
  }

  return (
    <div
      className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-2xl px-6 py-10 text-center sm:min-h-[340px]"
      style={{ background: "linear-gradient(135deg, #0B4A55 0%, #3A3F2C 55%, #6B4A26 100%)" }}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-white/95">
        <TriangleAlert size={18} strokeWidth={2.2} style={{ color: C.warm }} />
      </span>
      <p className="max-w-[300px] text-sm font-semibold leading-5 text-white">
        This post contains sensitive content related to an animal welfare
        situation.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setShown(true)}
          className="rounded-lg bg-white px-4 py-1.5 text-xs font-bold transition hover:bg-white/90"
          style={{ color: C.inkDeep }}
        >
          Reveal
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="rounded-lg border border-white/50 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-white/10"
        >
          Skip
        </button>
        <Link
          href={APP_LINKS.safety}
          className="rounded-lg border border-white/50 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-white/10"
        >
          Report
        </Link>
      </div>
    </div>
  );
}

const ghostButton =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold leading-5 transition hover:bg-[#EAF3F5]";

/** The ⋯ menu: hide this item, or report it. Closes on outside click or Esc. */
function MoreMenu({ onHide }: { onHide: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    // Sits directly after the last action, as in the comp — not pushed to the
    // far edge of the card. The wrapper is deliberately not `relative`: the
    // menu anchors to the action bar's right edge instead of the button's, so
    // it stays inside the card even when the bar wraps on a phone and leaves
    // the button at the far left.
    <div ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="More options"
        aria-expanded={open}
        // The comp's square box: 28px, light grey fill, 2px black outline.
        className="flex size-7 items-center justify-center rounded-lg transition hover:opacity-80"
        style={{ background: C.menuFill, color: C.muted, border: "2px solid #000" }}
      >
        <Ellipsis size={16} strokeWidth={2.4} />
      </button>
      {open ? (
        <div
          className="absolute bottom-full right-0 z-10 mb-1 w-44 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(7,59,71,0.14)]"
          style={{ border: `1px solid ${C.line}` }}
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            onClick={onHide}
            className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-[#F7F9F9]"
            style={{ color: C.inkDeep }}
          >
            Not interested
          </button>
          <Link
            href={APP_LINKS.safety}
            role="menuitem"
            className="block px-3 py-2 text-xs font-semibold hover:bg-[#F7F9F9]"
            style={{ color: C.inkDeep }}
          >
            Report
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function ActionBar({ trend, onHide }: { trend: Trend; onHide: () => void }) {
  const { actions } = trend;
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Native share sheet where the browser has one; otherwise copy the link.
  const share = async () => {
    const url = actions.primary.href;
    const title = trend.title ?? trend.body;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        // The viewer dismissed the sheet; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access denied; leave the button as it was.
    }
  };

  return (
    <div
      className="relative flex flex-wrap items-center gap-1 pt-3"
      style={{ borderTop: `1px solid ${C.line}` }}
    >
      <Link
        href={actions.primary.href}
        className={`${ghostButton} font-bold`}
        style={{ color: C.ink }}
      >
        {actions.primary.label}
      </Link>

      {actions.followTopic ? (
        <button
          type="button"
          onClick={() => setFollowing((v) => !v)}
          aria-pressed={following}
          className={ghostButton}
          style={{ color: following ? C.brand : C.muted }}
        >
          {following ? <Check size={14} strokeWidth={2.4} /> : <Plus size={14} strokeWidth={2} />}
          {following ? "Following topic" : "Follow topic"}
        </button>
      ) : null}

      {actions.save ? (
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          className={ghostButton}
          style={{ color: saved ? C.brand : C.muted }}
        >
          {saved ? <BookmarkCheck size={14} strokeWidth={2} /> : <Bookmark size={14} strokeWidth={2} />}
          {saved ? "Saved" : "Save"}
        </button>
      ) : null}

      {actions.share ? (
        <button type="button" onClick={share} className={ghostButton} style={{ color: C.muted }}>
          <Share2 size={14} strokeWidth={2} />
          {copied ? "Link copied" : "Share"}
        </button>
      ) : null}

      {actions.extra ? (
        <Link href={actions.extra.href} className={ghostButton} style={{ color: C.muted }}>
          {actions.extra.label}
        </Link>
      ) : null}

      <MoreMenu onHide={onHide} />
    </div>
  );
}

/** A collapsed stand-in for an item the viewer skipped or hid, with undo. */
function Dismissed({ label, onUndo }: { label: string; onUndo: () => void }) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-[20px] bg-white px-5 py-4"
      style={{ border: `1px dashed ${C.line}` }}
    >
      <span className="text-sm leading-5" style={{ color: C.muted }}>
        {label}
      </span>
      <button
        type="button"
        onClick={onUndo}
        className="text-sm font-bold transition hover:opacity-80"
        style={{ color: C.brand }}
      >
        Undo
      </button>
    </div>
  );
}

export default function FeedCard({ trend }: { trend: Trend }) {
  const [dismissed, setDismissed] = useState<null | "skipped" | "hidden">(null);

  if (dismissed) {
    return (
      <Dismissed
        label={
          dismissed === "skipped"
            ? "You skipped this sensitive post."
            : "Hidden. You'll see fewer items like this."
        }
        onUndo={() => setDismissed(null)}
      />
    );
  }

  const { media } = trend;

  return (
    <article
      className="flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-[0_1px_2px_rgba(7,59,71,0.06)] sm:p-5"
      // The top trend is set apart with the brand outline instead of a hairline.
      style={{ border: `1px solid ${trend.topTrend ? C.brand : C.line}` }}
    >
      {trend.topTrend ? (
        <span
          className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase leading-4 tracking-wide"
          style={{ color: C.warm }}
        >
          <Flame size={13} strokeWidth={2.2} fill="currentColor" />
          Top trend
        </span>
      ) : null}

      <div className="flex flex-wrap items-center gap-1.5">
        {trend.lead ? (
          <span
            className="inline-flex items-center rounded-full px-2 py-[3px] text-xs font-bold leading-4"
            style={{ background: C.chip, color: C.ink, border: `1px solid ${C.line}` }}
          >
            {trend.lead}
          </span>
        ) : null}
        <KindChip kind={trend.kind} />
        {trend.signal ? <SignalChip signal={trend.signal} /> : null}
        {trend.age ? (
          <span className="text-xs leading-5" style={{ color: C.muted }}>
            {trend.age}
          </span>
        ) : null}
      </div>

      <AuthorRow author={trend.author} />

      {trend.title ? (
        <h3
          className={`font-bold ${trend.topTrend ? "text-lg leading-7 sm:text-xl" : "text-base leading-6"}`}
          style={{ color: C.inkDeep }}
        >
          {trend.title}
        </h3>
      ) : null}

      <p className="text-sm leading-6" style={{ color: C.inkDeep }}>
        {trend.body}
      </p>

      {trend.note ? (
        <p
          className="rounded-lg px-3 py-2 text-xs leading-5"
          style={{ background: C.page, color: C.muted, border: `1px solid ${C.line}` }}
        >
          {trend.note}
        </p>
      ) : null}

      {media?.type === "image" ? (
        <div className={`relative w-full overflow-hidden rounded-2xl ${media.aspect}`}>
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(max-width: 768px) 100vw, 680px"
            className="object-cover"
            priority={trend.topTrend}
          />
        </div>
      ) : null}

      {media?.type === "sensitive" ? (
        <SensitiveMedia revealed={media.revealed} onSkip={() => setDismissed("skipped")} />
      ) : null}

      {trend.stats ? (
        <p className="text-xs leading-4" style={{ color: C.muted }}>
          {trend.stats}
        </p>
      ) : null}

      <ActionBar trend={trend} onHide={() => setDismissed("hidden")} />
    </article>
  );
}
