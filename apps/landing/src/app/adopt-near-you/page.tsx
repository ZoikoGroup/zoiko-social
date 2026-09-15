import type { Metadata } from "next";
import Link from "next/link";
import { BellRing, BookmarkPlus } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import ClosingBand from "./components/ClosingBand";
import HeroCollage from "./components/HeroCollage";
import NearYouBoard from "./components/NearYouBoard";
import Organizations from "./components/Organizations";
import { REGION } from "./components/nearYou";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Near You | Zoiko Social",
  description:
    "Find adoption listings and foster needs from verified rescues and shelters near your region. Search by region without sharing precise device location.",
};

const heroButton =
  "flex items-center justify-center rounded-xl px-6 pb-3.5 pt-3 text-base font-semibold leading-6 transition hover:opacity-90";

export default function AdoptNearYouPage() {
  return (
    <div className="min-h-screen" style={{ background: C.page }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6">
        {/* Hero. The collage sits beside the copy from lg and drops below it
            underneath, where it would otherwise squeeze the text. */}
        <div className="flex flex-col gap-8 pt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <header className="flex-1">
            <p className="text-base leading-6" style={{ color: C.inkDeep }}>
              Near You
            </p>
            <h1
              className="text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
              style={{ color: C.ink }}
            >
              Find animals and foster needs near your region.
            </h1>
            <p className="max-w-[640px] pt-3 text-base leading-6" style={{ color: C.inkDeep }}>
              Showing eligible listings around <strong className="font-bold">{REGION}</strong>.
              Change your region anytime.
            </p>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Link
                href={appUrl("/adoption")}
                id="set-region"
                className={`${heroButton} scroll-mt-24`}
                style={{ background: C.brand, color: "#fff" }}
              >
                Set / Change Region
              </Link>
              <Link
                href="/adopt"
                className={heroButton}
                style={{ background: "#fff", color: C.ink, border: `1px solid ${C.line}` }}
              >
                Browse All Adopt Listings
              </Link>
            </div>

            <p className="max-w-[640px] pt-4 text-xs leading-5" style={{ color: C.muted }}>
              You can search by region without sharing precise device location.
              Exact private foster/home addresses are not shown publicly.
            </p>
          </header>

          <div className="w-full lg:max-w-[480px] lg:shrink-0">
            <HeroCollage />
          </div>
        </div>

        <section className="pt-10">
          <NearYouBoard />
        </section>

        <Organizations />

        <div className="flex flex-wrap gap-3 pt-6">
          <Link
            href={appUrl("/adoption")}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold"
            style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
          >
            <BookmarkPlus size={15} strokeWidth={1.5} aria-hidden />
            Save This Local Search
          </Link>
          <Link
            href={appUrl("/adoption")}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold"
            style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
          >
            <BellRing size={15} strokeWidth={1.5} aria-hidden />
            Get Alerts for New Nearby Listings
          </Link>
        </div>

        <ClosingBand />
      </div>
    </div>
  );
}
