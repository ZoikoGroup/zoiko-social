"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";
import type { Reel } from "./reels";

const card = "flex flex-col gap-3 rounded-[20px] p-5";

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
      {children}
    </h2>
  );
}

const arrowLink =
  "inline-flex items-center gap-1.5 self-start text-base font-semibold leading-6 transition hover:opacity-80";

/** The three cards beside the player. The first two follow the current reel. */
export default function ReelRail({ reel, onTune }: { reel: Reel; onTune: () => void }) {
  const { source } = reel;

  return (
    <aside className="grid w-full max-w-[760px] gap-5 sm:grid-cols-2 lg:flex lg:w-80 lg:max-w-none lg:shrink-0 lg:flex-col">
      <section className={card} style={{ background: "#fff", border: `1px solid ${C.line}` }}>
        <CardTitle>Why this reel</CardTitle>
        <p className="text-xs leading-5" style={{ color: C.muted }}>
          {reel.why}
        </p>
        <button type="button" onClick={onTune} className={arrowLink} style={{ color: C.brand }}>
          Tune your Reels
          <ChevronRight size={14} strokeWidth={2.4} />
        </button>
      </section>

      <section className={card} style={{ background: "#fff", border: `1px solid ${C.line}` }}>
        <CardTitle>About this source</CardTitle>
        <div className="flex items-center gap-2.5 pt-1">
          <span
            className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] text-[10px] font-bold"
            style={{ background: C.chip, color: C.ink }}
          >
            {source.avatar ? (
              <Image src={source.avatar} alt="" fill sizes="36px" className="object-cover" />
            ) : (
              source.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
            )}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-5" style={{ color: C.inkDeep }}>
              {source.name}
            </p>
            <p className="text-xs leading-4" style={{ color: C.muted }}>
              {source.stats}
            </p>
          </div>
        </div>
        <p className="text-xs leading-5" style={{ color: C.muted }}>
          {source.description}
        </p>
        <Link
          href={APP_LINKS.communities}
          className="flex items-center justify-center rounded-[10px] bg-white px-4 pb-2 pt-2.5 text-sm font-semibold leading-5 transition hover:opacity-80"
          style={{ color: C.ink, border: `1px solid ${C.line}` }}
        >
          View community
        </Link>
      </section>

      <section
        className={`${card} gap-1.5 sm:col-span-2 lg:col-span-1`}
        style={{ background: C.chip, border: `1px solid ${C.line}` }}
      >
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-white">
          <Shield size={16} strokeWidth={1.8} style={{ color: C.ink }} />
        </span>
        <h2 className="pt-1.5 text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
          Every reel is checked first
        </h2>
        <p className="text-xs leading-5" style={{ color: C.muted }}>
          Animal welfare, privacy, and safety checks happen before a reel can
          ever be recommended.
        </p>
        <Link href={APP_LINKS.safety} className={`${arrowLink} pt-1.5`} style={{ color: C.brand }}>
          Visit Safety Center
          <ChevronRight size={14} strokeWidth={2.4} />
        </Link>
      </section>
    </aside>
  );
}
