import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import LiveBoard from "./_components/LiveBoard";
import SafetyBanner from "./_components/SafetyBanner";
import { C } from "./_components/theme";

export const metadata: Metadata = {
  title: "Live Now | Zoiko Social",
  description:
    "Live video from communities and events happening across Zoiko Social — with clear host, context, and safety signals before you watch.",
};

export default function DiscoverLiveNowPage() {
  return (
    <div className="min-h-screen pb-20" style={{ background: C.page }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <header
          className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-8 sm:pt-10"
          style={{ borderBottom: `1px solid ${C.line}` }}
        >
          <div className="flex max-w-[560px] flex-col gap-2">
            <span
              className="self-start rounded-[20px] px-3 py-[5px] text-xs font-semibold leading-4 tracking-wide"
              style={{ background: C.chip, color: C.brand }}
            >
              Discover · Live now
            </span>
            <h1
              className="pt-1.5 text-3xl font-extrabold leading-tight sm:text-4xl sm:leading-[54px]"
              style={{ color: C.ink }}
            >
              Live Now
            </h1>
            <p className="text-base leading-6" style={{ color: C.muted }}>
              Live video from communities and events happening across Zoiko
              Social — with clear host, context, and safety signals before you
              watch.
            </p>
          </div>

          <Link
            href={APP_LINKS.safety}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold transition hover:opacity-80"
            style={{ color: C.brand, border: `1px solid ${C.line}` }}
          >
            <Lock size={14} strokeWidth={2} />
            How live safety works
          </Link>
        </header>

        <LiveBoard />
        <SafetyBanner />
      </div>
    </div>
  );
}
