import type { Metadata } from "next";
import { Globe } from "lucide-react";
import TrendingBoard from "./_components/TrendingBoard";
import { C } from "./_components/theme";

export const metadata: Metadata = {
  title: "Trending Now | Zoiko Social",
  description:
    "The stories and posts animal communities are following right now — with source, context, and safety signals visible.",
};

export default function DiscoverTrendingNowPage() {
  return (
    <div className="min-h-screen pb-20" style={{ background: C.page }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <header className="flex flex-col gap-2 pb-6 pt-8 sm:pt-10">
          <h1
            className="text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
            style={{ color: C.ink }}
          >
            Trending Now
          </h1>
          <p className="max-w-[654px] text-base leading-6" style={{ color: C.muted }}>
            The stories and posts animal communities are following right now —
            with source, context, and safety signals visible.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-sm" style={{ background: C.fresh }} aria-hidden />
              <span className="text-xs font-semibold leading-5" style={{ color: C.muted }}>
                Updated moments ago
              </span>
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold"
              style={{ background: C.chip, color: C.ink, border: `1px solid ${C.line}` }}
            >
              <Globe size={12} strokeWidth={2} />
              United Kingdom · English
            </span>
          </div>
        </header>

        <TrendingBoard />
      </div>
    </div>
  );
}
