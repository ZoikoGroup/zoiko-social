"use client";

import { useState } from "react";
import Image from "next/image";
import { C } from "./theme";
import { TOPIC_IMAGES } from "./images";
import {
  DEFAULT_TUNED,
  STREAMS,
  TABS,
  TOPICS,
  type Stream,
  type Tab,
  type Topic,
} from "./streams";
import FeaturedStream from "./FeaturedStream";
import SideRail from "./SideRail";
import StreamCard from "./StreamCard";

const scrollRow =
  "-mx-4 flex overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden";

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

/**
 * Tabs, species circles, the stream grid and the rail.
 *
 * State lives here rather than in each card because tabs read it: Following
 * lists the streams whose Follow / Join the viewer pressed, and every card's
 * "Why shown" reads the rail's Tune Live signals. Hidden cards are tracked
 * here too, so a hidden stream stays hidden when the tab changes.
 */
export default function LiveBoard() {
  const [tab, setTab] = useState<Tab>("For You");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [engaged, setEngaged] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [tuned, setTuned] = useState<Topic[]>(DEFAULT_TUNED);
  const [exhausted, setExhausted] = useState(false);

  // Picking a circle is a Species / Topic filter; picking the active circle
  // again clears it.
  const selectTopic = (next: Topic) => {
    setTopic((current) => (current === next ? null : next));
    setTab("Species / Topic");
  };

  const matches = (s: Stream): boolean => {
    switch (tab) {
      case "For You":
        return true;
      case "Communities":
        return s.format === "Community livestream";
      case "Events":
        return s.format === "Event livestream";
      case "Following":
        return engaged.includes(s.id);
      case "Professionals":
        return s.badges.includes("Verified Professional");
      case "Species / Topic":
        return topic !== null && s.topics.includes(topic);
    }
  };

  const visible = STREAMS.filter((s) => matches(s) && !hidden.includes(s.id));
  const hiddenHere = STREAMS.filter((s) => matches(s) && hidden.includes(s.id));

  const heading =
    tab === "For You"
      ? "More live right now"
      : tab === "Species / Topic"
        ? topic
          ? `Live now in ${topic}`
          : "Live now by species or topic"
        : `Live now in ${tab}`;

  const emptyMessage =
    tab === "Following"
      ? "Follow or join a stream and it will appear here."
      : tab === "Species / Topic" && !topic
        ? "Pick a species or topic above to see who's live."
        : "Nothing live here right now. Check back shortly.";

  return (
    <>
      <div className={`${scrollRow} gap-2.5 py-5`} role="tablist" aria-label="Filter live streams">
        {TABS.map((name) => {
          const active = name === tab;
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(name)}
              className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition hover:opacity-80"
              style={
                active
                  ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                  : { background: "#fff", color: C.muted, border: `1px solid ${C.line}` }
              }
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className={`${scrollRow} gap-5 pb-7 pt-1`}>
        {TOPICS.map((name) => {
          const active = tab === "Species / Topic" && topic === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => selectTopic(name)}
              aria-pressed={active}
              className="flex w-20 shrink-0 flex-col items-center gap-2 px-1.5 py-px transition hover:opacity-80"
            >
              <span
                className="relative size-16 overflow-hidden rounded-full"
                style={{ boxShadow: `0 0 0 2px ${active ? C.brand : C.line}` }}
              >
                <Image src={TOPIC_IMAGES[name]} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: active ? C.brand : C.muted }}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          {tab === "For You" ? <FeaturedStream /> : null}

          <h2
            className={`text-xl font-extrabold leading-8 ${tab === "For You" ? "pt-10" : ""}`}
            style={{ color: C.ink }}
          >
            {heading}
          </h2>

          {visible.length ? (
            <div className="grid gap-6 pt-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  engaged={engaged.includes(stream.id)}
                  onToggleEngaged={() => setEngaged((list) => toggle(list, stream.id))}
                  onHide={() => setHidden((list) => [...list, stream.id])}
                  tuned={tuned}
                />
              ))}
            </div>
          ) : (
            <p
              className="mt-5 rounded-[20px] px-6 py-10 text-center text-sm leading-5"
              style={{ color: C.muted, border: `1px dashed ${C.line}` }}
            >
              {emptyMessage}
            </p>
          )}

          {hiddenHere.length ? (
            <p className="pt-4 text-xs leading-5" style={{ color: C.muted }}>
              {hiddenHere.length} hidden ·{" "}
              <button
                type="button"
                onClick={() =>
                  setHidden((list) => list.filter((id) => !hiddenHere.some((s) => s.id === id)))
                }
                className="font-bold underline underline-offset-2"
                style={{ color: C.brand }}
              >
                Show again
              </button>
            </p>
          ) : null}

          {tab === "For You" ? (
            <div className="flex justify-center pt-8">
              {exhausted ? (
                <p className="text-center text-xs leading-5" style={{ color: C.muted }}>
                  That&apos;s everything live right now. New streams appear here
                  as they start.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setExhausted(true)}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold transition hover:opacity-80"
                  style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
                >
                  Load more
                </button>
              )}
            </div>
          ) : null}
        </div>

        <SideRail tuned={tuned} onToggleTuned={(t) => setTuned((list) => toggle(list, t))} />
      </div>
    </>
  );
}
