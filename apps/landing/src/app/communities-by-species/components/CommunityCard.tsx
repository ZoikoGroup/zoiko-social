"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";
import type { Community } from "./communities";

/** What the join button says once it has been pressed. */
const ENGAGED = { "Open to join": "Joined", "Request required": "Requested" } as const;

export default function CommunityCard({ community }: { community: Community }) {
  const [engaged, setEngaged] = useState(false);
  const label = community.access === "Open to join" ? "Join" : "Request to Join";

  return (
    <article
      className="flex flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div
        className="relative aspect-[394/108] shrink-0"
        style={{ background: `linear-gradient(75deg, ${C.brand} 0%, ${C.warm} 100%)` }}
      >
        {community.cover ? (
          <Image
            src={community.cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col px-4 pb-4 pt-8">
        {/* The logo straddles the cover's lower edge. */}
        <span
          className="absolute -top-7 left-4 flex size-12 items-center justify-center overflow-hidden rounded-2xl text-xs font-bold"
          style={{ background: C.chip, color: C.ink, boxShadow: "0 0 0 3px #fff, 0 1px 2px rgba(7,59,71,0.06)" }}
        >
          {community.logo ? (
            <Image src={community.logo} alt="" fill sizes="48px" className="object-cover" />
          ) : (
            community.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
          )}
        </span>

        <h3 className="text-base font-extrabold leading-6" style={{ color: C.inkDeep }}>
          {community.name}
        </h3>
        <p className="mt-1.5 text-xs leading-5" style={{ color: C.muted }}>
          {community.description}
        </p>

        <span
          className="mt-3 inline-flex self-start rounded-md px-2.5 py-1 text-xs font-semibold leading-4"
          style={{ background: C.chip, color: C.inkDeep, border: `1px solid ${C.brand}` }}
        >
          {community.category}
        </span>

        <p className="mt-3 flex items-center gap-1.5 text-xs leading-4" style={{ color: C.muted }}>
          <Clock size={12} strokeWidth={2} className="shrink-0" style={{ color: C.amber }} />
          {community.activity}
        </p>
        <p className="mt-2 text-xs leading-4" style={{ color: C.muted }}>
          {community.access} · {community.steward}
        </p>

        <Link
          href={APP_LINKS.safety}
          className="mt-2.5 self-start text-xs font-semibold underline underline-offset-2 transition hover:opacity-80"
          style={{ color: C.brand }}
        >
          View purpose &amp; standards
        </Link>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Link
            href={APP_LINKS.communities}
            className="rounded-[10px] bg-white px-3 py-2 text-xs font-semibold transition hover:opacity-80"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            View Community
          </Link>
          <button
            type="button"
            onClick={() => setEngaged((v) => !v)}
            aria-pressed={engaged}
            className="rounded-[10px] px-3 py-2 text-xs font-semibold transition hover:opacity-90"
            style={
              engaged
                ? { background: C.chip, color: C.brand, border: `1px solid ${C.brand}` }
                : { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
            }
          >
            {engaged ? ENGAGED[community.access] : label}
          </button>
        </div>
      </div>
    </article>
  );
}
