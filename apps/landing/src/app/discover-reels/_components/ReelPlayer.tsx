"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  Captions,
  ChevronRight,
  EllipsisVertical,
  Heart,
  MessageSquare,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C, scrim } from "./theme";
import { VERIFIED_BADGE } from "./images";
import { formatCount, type Reel } from "./reels";

const shadow = "[text-shadow:0_1px_2px_rgb(0_0_0/0.4)]";

/** A round control on the right-hand action column, with its label below. */
function ActionButton({
  icon: Icon,
  label,
  onClick,
  pressed,
  href,
  filled = false,
  ariaLabel,
}: {
  icon: LucideIcon;
  label?: string;
  onClick?: () => void;
  pressed?: boolean;
  href?: string;
  filled?: boolean;
  ariaLabel: string;
}) {
  const circle = (
    <span
      className="flex size-10 items-center justify-center rounded-full transition group-hover:scale-105"
      style={{ background: scrim(0.42) }}
    >
      <Icon
        size={20}
        strokeWidth={1.8}
        className="text-white"
        fill={filled ? "currentColor" : "none"}
      />
    </span>
  );
  const text = label ? (
    <span className={`text-xs font-bold text-white ${shadow}`}>{label}</span>
  ) : null;
  const cls = "group flex flex-col items-center gap-[3px] px-1.5 py-px";

  return href ? (
    <Link href={href} aria-label={ariaLabel} className={cls}>
      {circle}
      {text}
    </Link>
  ) : (
    <button type="button" onClick={onClick} aria-label={ariaLabel} aria-pressed={pressed} className={cls}>
      {circle}
      {text}
    </button>
  );
}

/** Small round control in the player's top-left corner. */
function CornerButton({
  onClick,
  pressed,
  label,
  children,
}: {
  onClick: () => void;
  pressed: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="flex size-8 items-center justify-center rounded-full text-white transition hover:opacity-80"
      style={{ background: scrim(0.5) }}
    >
      {children}
    </button>
  );
}

/** ⋮ menu: skip this reel, or report it. Closes on outside click or Esc. */
function MoreMenu({ onNotInterested }: { onNotInterested: () => void }) {
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
    <div ref={ref} className="relative">
      <ActionButton
        icon={EllipsisVertical}
        ariaLabel="More options"
        onClick={() => setOpen((v) => !v)}
        pressed={open}
      />
      {open ? (
        <div
          role="menu"
          className="absolute bottom-0 right-full mr-2 w-40 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(7,59,71,0.2)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onNotInterested();
            }}
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

export type PlayerState = {
  playing: boolean;
  muted: boolean;
  captions: boolean;
  liked: boolean;
  saved: boolean;
  following: boolean;
};

export default function ReelPlayer({
  reel,
  state,
  onTogglePlay,
  onToggleMute,
  onToggleCaptions,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onEnded,
  onNotInterested,
}: {
  reel: Reel;
  state: PlayerState;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleCaptions: () => void;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onToggleFollow: () => void;
  onEnded: () => void;
  onNotInterested: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const start = reel.resumeAt ?? 0;

  // Native share sheet where the browser has one; otherwise copy the link.
  const share = async () => {
    const url = APP_LINKS.communities;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: reel.caption, url });
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
      // Clipboard access denied; leave the label as it was.
    }
  };

  return (
    <div
      className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl shadow-[0_20px_48px_rgba(7,59,71,0.16)]"
      style={{ border: `1px solid ${C.line}` }}
    >
      {/* The progress bar is a CSS animation rather than a timer, so pausing
          freezes it exactly where it is and it survives re-renders. */}
      <style>{`@keyframes reel-progress { from { transform: scaleX(var(--reel-start)); } to { transform: scaleX(1); } }`}</style>

      <Image
        key={reel.id}
        src={reel.media}
        alt={reel.alt}
        fill
        priority
        sizes="(max-width: 640px) 100vw, 360px"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${scrim(0.45)} 0%, ${scrim(0)} 22%, ${scrim(0)} 55%, ${scrim(0.9)} 100%)`,
        }}
      />

      <div className="absolute left-4 top-3 flex gap-1.5">
        <CornerButton onClick={onToggleMute} pressed={state.muted} label={state.muted ? "Unmute" : "Mute"}>
          {state.muted ? <VolumeX size={14} strokeWidth={2} /> : <Volume2 size={14} strokeWidth={2} />}
        </CornerButton>
        <CornerButton onClick={onToggleCaptions} pressed={state.captions} label="Captions">
          <Captions size={14} strokeWidth={2} fill={state.captions ? "currentColor" : "none"} />
        </CornerButton>
      </div>

      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={state.playing ? "Pause" : "Play"}
        className={`absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/[0.92] transition hover:scale-105 ${
          state.playing ? "opacity-0 hover:opacity-100 focus-visible:opacity-100" : ""
        }`}
        style={{ color: C.ink }}
      >
        {state.playing ? (
          <Pause size={24} fill="currentColor" strokeWidth={0} />
        ) : (
          <Play size={24} fill="currentColor" strokeWidth={0} className="translate-x-0.5" />
        )}
      </button>

      <div className="absolute bottom-6 right-3 flex flex-col items-center gap-3.5">
        <ActionButton
          icon={Heart}
          ariaLabel={state.liked ? "Unlike" : "Like"}
          label={formatCount(reel.likes + (state.liked ? 1 : 0))}
          onClick={onToggleLike}
          pressed={state.liked}
          filled={state.liked}
        />
        <ActionButton
          icon={MessageSquare}
          ariaLabel="Comments"
          label={formatCount(reel.comments)}
          href={APP_LINKS.communities}
        />
        <ActionButton
          icon={state.saved ? BookmarkCheck : Bookmark}
          ariaLabel={state.saved ? "Unsave" : "Save"}
          label={state.saved ? "Saved" : "Save"}
          onClick={onToggleSave}
          pressed={state.saved}
        />
        <ActionButton icon={Share2} ariaLabel="Share" label={copied ? "Copied" : "Share"} onClick={share} />
        <MoreMenu onNotInterested={onNotInterested} />
      </div>

      <div className="absolute bottom-6 left-4 right-[72px] flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span
            className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-bold text-white"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.7)", background: C.brand }}
          >
            {reel.source.avatar ? (
              <Image src={reel.source.avatar} alt="" fill sizes="32px" className="object-cover" />
            ) : (
              reel.source.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="line-clamp-1 text-sm font-bold leading-5 text-white">
                {reel.source.name}
              </span>
              <Image src={VERIFIED_BADGE} alt="Verified" width={12} height={12} unoptimized className="shrink-0" />
            </div>
            <p className="text-xs leading-4 text-white/75">{reel.source.kind}</p>
          </div>
          <button
            type="button"
            onClick={onToggleFollow}
            aria-pressed={state.following}
            className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white transition hover:bg-white/30"
            style={{
              background: state.following ? C.brand : "rgba(255,255,255,0.18)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.7)",
            }}
          >
            {state.following ? "Following" : "Follow"}
          </button>
        </div>

        <p className="text-xs leading-5 text-white/[0.92] [text-shadow:0_1px_2px_rgb(0_0_0/0.3)]">
          {reel.caption}
        </p>

        <div className="flex flex-wrap gap-[5px]">
          {reel.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/[0.18] px-2 py-[3px] text-xs font-semibold leading-4 text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={APP_LINKS.communities}
          className="inline-flex max-w-full items-center gap-[5px] self-start rounded-lg bg-white/[0.16] px-2.5 pb-[5px] pt-1.5 text-xs font-bold leading-4 text-white transition hover:bg-white/25"
        >
          <ChevronRight size={12} strokeWidth={2.4} className="shrink-0" />
          <span className="truncate">
            {reel.source.name} · {reel.source.kind.split(" · ")[0]}
          </span>
        </Link>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
        <div
          key={reel.id}
          className="h-full origin-left"
          onAnimationEnd={onEnded}
          style={
            {
              background: C.warmBright,
              "--reel-start": start,
              animation: `reel-progress ${reel.seconds * (1 - start)}s linear both`,
              animationPlayState: state.playing ? "running" : "paused",
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
