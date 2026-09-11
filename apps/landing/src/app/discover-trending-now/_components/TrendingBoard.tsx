"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CircleCheck, Info, RefreshCw } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";
import { FEED, TABS, isRemoved, type Tab } from "./feed";
import FeedCard from "./FeedCard";
import SideRail from "./SideRail";

/**
 * Tabs, feed and rail. They live in one client component because the rail's
 * "Live Now" link drives the same tab state as the tab row.
 */
export default function TrendingBoard() {
  const [tab, setTab] = useState<Tab>("All");
  const [refreshed, setRefreshed] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const selectTab = (next: Tab) => {
    setTab(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // A withdrawn item only makes sense in the unfiltered feed: it has no kind,
  // so it can't belong to any narrower tab.
  const entries = FEED.filter((entry) =>
    isRemoved(entry) ? tab === "All" : tab === "All" || entry.tabs.includes(tab),
  );

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* One row, scrolled sideways on narrow screens rather than wrapped, so
          the feed starts at the same height whatever the viewport. */}
      <div
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Filter trends"
      >
        {TABS.map((name) => {
          const active = name === tab;
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(name)}
              className="shrink-0 whitespace-nowrap rounded-full px-4 pb-2.5 pt-2 text-sm font-semibold leading-5 transition hover:opacity-80"
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

      {!refreshed ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setRefreshed(true);
              selectTab("All");
            }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition hover:opacity-80"
            style={{ background: C.chip, color: C.brand, border: `1px solid ${C.brand}` }}
          >
            <RefreshCw size={14} strokeWidth={2.2} />
            New trends available · Refresh
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-8 pt-6 lg:flex-row xl:gap-14">
        <div className="flex w-full min-w-0 flex-col gap-5 lg:max-w-[720px]">
          {entries.map((entry) =>
            isRemoved(entry) ? (
              <div
                key={entry.id}
                className="flex flex-col items-center gap-2 rounded-[20px] bg-white px-5 py-8 text-center"
                style={{ border: `1px solid ${C.line}` }}
              >
                <Info size={18} strokeWidth={2} style={{ color: C.muted }} />
                <p className="text-sm leading-5" style={{ color: C.muted }}>
                  This item is no longer available.
                </p>
              </div>
            ) : (
              <FeedCard key={entry.id} trend={entry} />
            ),
          )}

          <div
            className="flex flex-col items-center rounded-[20px] px-6 py-10 text-center"
            style={{ background: C.page, border: `1px solid ${C.line}` }}
          >
            <span
              className="flex size-10 items-center justify-center rounded-full"
              style={{ background: C.chip }}
            >
              <CircleCheck size={20} strokeWidth={2} style={{ color: C.brand }} />
            </span>
            <h2 className="mt-4 text-base font-bold leading-6" style={{ color: C.inkDeep }}>
              You&apos;re all caught up on what&apos;s trending
            </h2>
            <p className="mt-1 max-w-[440px] text-xs leading-5" style={{ color: C.muted }}>
              That&apos;s every eligible trend for this snapshot. Explore more, or
              check back shortly for what&apos;s new.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={APP_LINKS.communities}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold transition hover:opacity-80"
                style={{ color: C.ink, border: `1px solid ${C.line}` }}
              >
                Explore Communities
              </Link>
              <Link
                href="/discover-animals"
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold transition hover:opacity-80"
                style={{ color: C.ink, border: `1px solid ${C.line}` }}
              >
                Discover Animals
              </Link>
            </div>
          </div>

          <section
            className="relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10"
            style={{ background: `linear-gradient(115deg, ${C.ink} 0%, #0B4F5C 55%, #1D5A5E 100%)` }}
          >
            <h2 className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
              Join to follow topics and save trends
            </h2>
            <p className="mt-2 max-w-[520px] text-sm leading-6 text-white/80">
              Create a free account to follow topics, save posts, and join the
              conversation — public trends stay open either way.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={APP_LINKS.signUp}
                className="flex items-center justify-center rounded-xl px-8 py-3 text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: C.warmBright }}
              >
                Join Free
              </Link>
              <Link
                href={APP_LINKS.signIn}
                className="flex items-center justify-center rounded-xl border border-white/50 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </section>
        </div>

        <SideRail onSelectTab={selectTab} />
      </div>
    </div>
  );
}
