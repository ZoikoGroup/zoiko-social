"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { AVATARS } from "./images";
import { C } from "./theme";
import { TOP_TREND, type Tab } from "./feed";

const card = "rounded-[20px] bg-white p-5";

const FOLLOWED = [
  {
    avatar: AVATARS.goldenRetrieverGuardians,
    name: "Golden Retriever Guardians",
    detail: "Meetup post · 128 reactions",
  },
  {
    avatar: AVATARS.londonCatRescue,
    name: "London Cat Rescue Coalition",
    detail: "Foster update · 64 related posts",
  },
];

function RailHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
      {children}
    </h2>
  );
}

function RailLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-3 inline-flex items-center gap-1 text-sm font-bold transition hover:opacity-80"
      style={{ color: C.brand }}
    >
      {children}
      <ChevronRight size={14} strokeWidth={2.5} />
    </Link>
  );
}

const rowClass =
  "flex w-full items-center justify-between py-2.5 text-left text-xs font-semibold transition hover:opacity-70";

/**
 * The right-hand rail. Every destination leaves the page except "Live Now",
 * which is a view of this same feed, so it switches the tab instead.
 */
export default function SideRail({ onSelectTab }: { onSelectTab: (tab: Tab) => void }) {
  const discover: ({ label: string } & ({ href: string } | { tab: Tab }))[] = [
    { label: "World Animal News", href: APP_LINKS.news },
    { label: "Communities", href: APP_LINKS.communities },
    { label: "Events", href: appUrl("/events") },
    { label: "Animals", href: "/discover-animals" },
    { label: "Live Now", tab: "Live" },
  ];

  return (
    <aside className="grid w-full gap-5 sm:grid-cols-2 lg:flex lg:w-[320px] lg:shrink-0 lg:flex-col lg:self-start">
      {TOP_TREND ? (
        <section
          className={card}
          style={{ background: C.chip, border: `1px solid ${C.line}` }}
        >
          <RailHeading>Why this is trending</RailHeading>
          <p className="mt-2 text-xs leading-5" style={{ color: C.muted }}>
            &ldquo;{TOP_TREND.title}&rdquo; is trending because it&apos;s new
            information from a verified source, and it&apos;s being discussed
            across multiple communities.
          </p>
          <RailLink href={APP_LINKS.docs}>How trending works</RailLink>
        </section>
      ) : null}

      <section className={card} style={{ border: `1px solid ${C.line}` }}>
        <RailHeading>Popular in communities you follow</RailHeading>
        <ul className="mt-3 flex flex-col gap-3">
          {FOLLOWED.map((item) => (
            <li key={item.name}>
              <Link
                href={APP_LINKS.communities}
                className="flex items-center gap-3 transition hover:opacity-80"
              >
                <span className="relative size-9 shrink-0 overflow-hidden rounded-full">
                  <Image src={item.avatar} alt="" fill sizes="36px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span
                    className="block truncate text-xs font-bold leading-5"
                    style={{ color: C.inkDeep }}
                  >
                    {item.name}
                  </span>
                  <span className="block text-xs leading-4" style={{ color: C.muted }}>
                    {item.detail}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={card} style={{ border: `1px solid ${C.line}` }}>
        <RailHeading>Discover more</RailHeading>
        <ul className="mt-2">
          {discover.map((item, i) => {
            const content = (
              <>
                {item.label}
                <ChevronRight size={14} strokeWidth={2} style={{ color: C.muted }} />
              </>
            );
            return (
              <li
                key={item.label}
                style={{ borderTop: i === 0 ? undefined : `1px solid ${C.line}` }}
              >
                {"tab" in item ? (
                  <button
                    type="button"
                    onClick={() => onSelectTab(item.tab)}
                    className={rowClass}
                    style={{ color: C.inkDeep }}
                  >
                    {content}
                  </button>
                ) : (
                  <Link href={item.href} className={rowClass} style={{ color: C.inkDeep }}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section
        className={card}
        style={{ background: C.chip, border: `1px solid ${C.line}` }}
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-white">
          <Shield size={16} strokeWidth={2} style={{ color: C.ink }} />
        </span>
        <h2 className="mt-3 text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
          Trending, but never at the cost of safety
        </h2>
        <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
          Content is checked for animal welfare, privacy, and safety before it
          can ever appear here.
        </p>
        <RailLink href={APP_LINKS.safety}>Visit Safety Center</RailLink>
      </section>
    </aside>
  );
}
