"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { C } from "./theme";
import { REELS, TOPICS, type Topic } from "./reels";
import ReelPlayer from "./ReelPlayer";
import ReelRail from "./ReelRail";

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

/** Round prev / next button beside the player. */
function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous reel" : "Next reel"}
      // The comp dims the unavailable direction to 30% rather than hiding it.
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white transition enabled:hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
      style={{ border: `1px solid ${C.line}`, color: C.muted }}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );
}

/**
 * Header, player, navigation and rail. The Tune panel filters which reels are
 * in the sequence, and the header button and the rail's "Tune your Reels"
 * link both open it.
 */
export default function ReelsViewer() {
  const [tuned, setTuned] = useState<Topic[]>([...TOPICS]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  // Keyed by source, so following a source carries across its other reels.
  const [following, setFollowing] = useState<string[]>([]);
  const [tuneOpen, setTuneOpen] = useState(false);
  const tuneRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);

  const reels = REELS.filter(
    (r) => !skipped.includes(r.id) && r.topics.some((t) => tuned.includes(t)),
  );
  const current = reels[Math.min(index, reels.length - 1)];
  const position = Math.min(index, reels.length - 1);

  // Steps from the clamped position, not the raw index: skipping the last reel
  // leaves the index one past the end, and stepping back from there would
  // otherwise land on the reel already showing.
  const go = (delta: number) =>
    setIndex(Math.max(0, Math.min(reels.length - 1, position + delta)));

  // Arrow keys step through reels, unless focus is somewhere that uses them.
  // The step is inlined rather than calling `go`, so the listener is only
  // re-bound when the position or the length of the sequence changes.
  const count = reels.length;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.altKey || e.ctrlKey || e.metaKey || target.closest("input, textarea, select, [role=menu]")) return;
      const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (delta) setIndex(Math.max(0, Math.min(count - 1, position + delta)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, position]);

  useEffect(() => {
    if (!tuneOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !tuneRef.current?.contains(e.target as Node)) {
        setTuneOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [tuneOpen]);

  const openTune = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTuneOpen(true);
  };

  // Changing the mix restarts the sequence rather than leaving the viewer
  // on whatever reel now happens to sit at the old position.
  const toggleTopic = (topic: Topic) => {
    if (tuned.length === 1 && tuned[0] === topic) return; // keep at least one
    setTuned((list) => toggle(list, topic));
    setIndex(0);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <header className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h1 className="text-3xl font-extrabold leading-10" style={{ color: C.ink }}>
            Reels
          </h1>
          <p className="text-sm leading-5" style={{ color: C.muted }}>
            Short videos from across the platform.
          </p>
        </div>

        <div ref={tuneRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setTuneOpen((v) => !v)}
            aria-expanded={tuneOpen}
            className="flex items-center gap-2 rounded-[10px] bg-white px-4 py-2 text-sm font-semibold transition hover:opacity-80"
            style={{ color: C.ink, border: `1px solid ${C.line}` }}
          >
            <SlidersHorizontal size={14} strokeWidth={2} />
            Tune Feed
          </button>

          {tuneOpen ? (
            <div
              className="absolute right-0 top-full z-20 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl bg-white p-5 shadow-[0_12px_32px_rgba(7,59,71,0.16)]"
              style={{ border: `1px solid ${C.line}` }}
            >
              <h2 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                Tune your Reels
              </h2>
              <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
                Choose the topics you want in your Reels. Never affects your
                blocks or safety settings.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {TOPICS.map((topic) => {
                  const on = tuned.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      aria-pressed={on}
                      className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition hover:opacity-80"
                      style={
                        on
                          ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                          : { background: "#fff", color: C.muted, border: `1px solid ${C.line}` }
                      }
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-5" style={{ color: C.muted }}>
                {reels.length} of {REELS.length} reels match.
              </p>
            </div>
          ) : null}
        </div>
      </header>

      <div className="mt-8 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
        {current ? (
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:block">
              <NavButton direction="prev" disabled={position === 0} onClick={() => go(-1)} />
            </div>

            <div className="w-[min(360px,calc(100vw-2rem))]">
              <p className="pb-3 text-center font-inter text-xs font-bold leading-5" style={{ color: C.muted }}>
                {position + 1} / {reels.length}
              </p>

              {/* Horizontal swipes step through reels on touch screens. */}
              <div
                onPointerDown={(e) => {
                  swipeStart.current = e.clientX;
                }}
                onPointerUp={(e) => {
                  if (swipeStart.current === null) return;
                  const dx = e.clientX - swipeStart.current;
                  swipeStart.current = null;
                  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
                }}
              >
                <ReelPlayer
                  reel={current}
                  state={{
                    playing,
                    muted,
                    captions,
                    liked: liked.includes(current.id),
                    saved: saved.includes(current.id),
                    following: following.includes(current.source.name),
                  }}
                  onTogglePlay={() => setPlaying((v) => !v)}
                  onToggleMute={() => setMuted((v) => !v)}
                  onToggleCaptions={() => setCaptions((v) => !v)}
                  onToggleLike={() => setLiked((l) => toggle(l, current.id))}
                  onToggleSave={() => setSaved((l) => toggle(l, current.id))}
                  onToggleFollow={() => setFollowing((l) => toggle(l, current.source.name))}
                  // Autoplay carries on to the next reel; the last one just stops.
                  onEnded={() => (position < reels.length - 1 ? go(1) : setPlaying(false))}
                  onNotInterested={() => setSkipped((l) => [...l, current.id])}
                />
              </div>

              <div className="flex justify-center gap-4 pt-4 sm:hidden">
                <NavButton direction="prev" disabled={position === 0} onClick={() => go(-1)} />
                <NavButton direction="next" disabled={position === reels.length - 1} onClick={() => go(1)} />
              </div>
            </div>

            <div className="hidden sm:block">
              <NavButton direction="next" disabled={position === reels.length - 1} onClick={() => go(1)} />
            </div>
          </div>
        ) : (
          <div
            className="flex w-full max-w-[360px] flex-col items-center gap-3 rounded-3xl px-6 py-16 text-center"
            style={{ border: `1px dashed ${C.line}` }}
          >
            <p className="text-sm leading-5" style={{ color: C.muted }}>
              You&apos;ve skipped every reel in this mix.
            </p>
            <button
              type="button"
              onClick={() => {
                setSkipped([]);
                setIndex(0);
              }}
              className="text-sm font-bold underline underline-offset-2"
              style={{ color: C.brand }}
            >
              Show them again
            </button>
          </div>
        )}

        {current ? <ReelRail reel={current} onTune={openTune} /> : null}
      </div>
    </div>
  );
}
