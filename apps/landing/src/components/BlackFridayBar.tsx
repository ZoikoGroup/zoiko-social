"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import { BLACK_FRIDAY_AT, pad, useCountdown } from "@/lib/use-countdown";

/** Site-wide promo strip shown above the header, linking to the Black Friday page. */
export default function BlackFridayBar() {
  const units = useCountdown(BLACK_FRIDAY_AT);

  return (
    <Link
      href="/black-friday"
      className="block bg-[linear-gradient(90deg,#E8892A_0%,#E8892A_45%,#1BA9C0_100%)] px-4 py-2 font-inter text-white"
    >
      <div className="mx-auto flex max-w-[1232px] flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-center">
        <p className="flex items-center gap-2 text-xs font-medium sm:text-sm">
          <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Free to join · Black Friday: 30% off paid creator &amp; business tools — proposed, if live
        </p>
        <div className="flex gap-1.5" role="timer" aria-label="Time until Black Friday">
          {units.map(({ label, value }) => (
            <span
              key={label}
              title={label}
              className="flex h-7 w-9 items-center justify-center rounded-md bg-[#5E5F3E]/80 text-xs font-bold tabular-nums"
            >
              {pad(value)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
