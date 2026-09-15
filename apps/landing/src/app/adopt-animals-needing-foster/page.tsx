import type { Metadata } from "next";
import Link from "next/link";
import { BellRing, BookmarkPlus, CircleCheck } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import ClosingBand from "./components/ClosingBand";
import FosterBoard from "./components/FosterBoard";
import HeroCollage from "./components/HeroCollage";
import InCharge from "./components/InCharge";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Animals Needing Foster | Zoiko Social",
  description:
    "Browse short- and long-term foster needs from verified rescues and shelters. Compare timing, care requirements, household fit, and support before offering to foster.",
};

const heroButton =
  "flex items-center justify-center rounded-xl px-6 pb-3.5 pt-3 text-base font-semibold leading-6 transition hover:opacity-90";

export default function AnimalsNeedingFosterPage() {
  return (
    <div className="min-h-screen" style={{ background: C.page }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6">
        {/* Hero. The collage sits beside the copy from lg and drops below it
            underneath, where it would otherwise squeeze the text. */}
        <div className="flex flex-col gap-8 pt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <header className="flex-1">
            <p className="text-base leading-6" style={{ color: C.inkDeep }}>
              Animals Needing Foster
            </p>
            <h1
              className="text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
              style={{ color: C.ink }}
            >
              Give temporary care where it is needed most.
            </h1>
            <p className="max-w-[640px] pt-3 text-base leading-6" style={{ color: C.inkDeep }}>
              Browse short- and long-term foster needs from verified rescues and
              shelters. Compare timing, care requirements, household fit, and
              support before offering to foster.
            </p>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <a href="#foster-needs" className={heroButton} style={{ background: C.brand, color: "#fff" }}>
                Find Foster Needs
              </a>
              <Link
                href="/adopt-adoption-safety"
                className={heroButton}
                style={{ background: "#fff", color: C.ink, border: `1px solid ${C.line}` }}
              >
                Foster Safety
              </Link>
            </div>

            <p className="max-w-[640px] pt-4 text-xs leading-5" style={{ color: C.muted }}>
              Foster placements are coordinated by the verified rescue or
              shelter. Availability, requirements, expenses, and handoff details
              must be confirmed directly through the organization&apos;s process.
            </p>
          </header>

          <div className="w-full lg:max-w-[480px] lg:shrink-0">
            <HeroCollage />
          </div>
        </div>

        <section id="foster-needs" className="scroll-mt-24 pt-10">
          <FosterBoard />
        </section>

        {/* Foster Readiness, then the two saved-search actions. */}
        <section
          className="mt-10 flex flex-col gap-4 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          style={{ border: `1px solid ${C.line}` }}
        >
          <div className="flex items-start gap-3">
            <CircleCheck
              size={18}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0"
              style={{ color: C.brand }}
              aria-hidden
            />
            <div>
              <h2 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                Set up a Foster Readiness profile (optional)
              </h2>
              <p className="pt-1 text-xs leading-5" style={{ color: C.muted }}>
                Save your availability, household details, and experience once,
                and reuse them across future foster offers. Never required to
                browse.
              </p>
            </div>
          </div>
          <Link
            href={appUrl("/adoption")}
            className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold"
            style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
          >
            Set Up Readiness
          </Link>
        </section>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            href={appUrl("/adoption")}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold"
            style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
          >
            <BookmarkPlus size={15} strokeWidth={1.5} aria-hidden />
            Save this search
          </Link>
          <Link
            href={appUrl("/adoption")}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold"
            style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
          >
            <BellRing size={15} strokeWidth={1.5} aria-hidden />
            Get alerts for new matches
          </Link>
        </div>

        <InCharge />

        <ClosingBand />
      </div>
    </div>
  );
}
