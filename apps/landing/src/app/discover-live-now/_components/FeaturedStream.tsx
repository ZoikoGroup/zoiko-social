"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";
import { FEATURED } from "./streams";
import { Avatar, LiveBadge, OverlayBadge } from "./StreamCard";

/**
 * The large stream at the top of For You: video on the left, details right.
 *
 * Side by side from md, except between lg and xl: that is where the rail
 * moves up beside the feed and takes 320px, which would leave the details
 * column about 250px wide. The card stacks there until xl gives it room back.
 */
export default function FeaturedStream() {
  const [following, setFollowing] = useState(false);
  const f = FEATURED;

  return (
    <article
      className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(7,59,71,0.06)] md:flex-row lg:flex-col xl:flex-row"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div className="relative aspect-[527/297] w-full md:w-[60%] md:shrink-0 lg:w-full xl:w-[60%]">
        <Image
          src={f.thumb}
          alt={f.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 440px, (max-width: 1280px) 640px, 530px"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <LiveBadge />
          <OverlayBadge>{f.duration}</OverlayBadge>
        </div>
        <span
          className="absolute right-3 top-3 rounded-md px-2 py-1 text-xs font-bold leading-4"
          style={{ background: C.chipWarm, color: C.warm, border: `1px solid ${C.warm}` }}
        >
          {f.advisory}
        </span>
        <div className="absolute bottom-3 left-3">
          <OverlayBadge icon>{f.watching}</OverlayBadge>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <Avatar name={f.host.name} src={f.host.avatar} size={34} />
          <div>
            <p className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
              {f.host.name}
            </p>
            <span
              className="mt-0.5 inline-flex items-center gap-1 rounded-md px-2 py-[3px] text-xs font-bold leading-4"
              style={{ background: C.chip, color: C.ink }}
            >
              <Check size={10} strokeWidth={3} />
              {f.host.credential}
            </span>
          </div>
        </div>

        <h2
          className="mt-4 text-lg font-extrabold leading-7 sm:text-xl"
          style={{ color: C.inkDeep }}
        >
          {f.title}
        </h2>
        <p className="mt-2 text-xs leading-5" style={{ color: C.muted }}>
          {f.context}
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            href={APP_LINKS.communities}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            Watch Live
          </Link>
          <button
            type="button"
            onClick={() => setFollowing((v) => !v)}
            aria-pressed={following}
            className="inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-80"
            style={
              following
                ? { background: C.chip, color: C.brand, border: `1px solid ${C.brand}` }
                : { background: "#fff", color: C.inkDeep, border: `1px solid ${C.line}` }
            }
          >
            {following ? <Check size={14} strokeWidth={2.6} /> : null}
            {following ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </article>
  );
}
