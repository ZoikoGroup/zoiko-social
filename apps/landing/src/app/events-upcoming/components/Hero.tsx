import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { EVENTS, REGION } from "./events";
import { C, PHOTO_TINT } from "./theme";

/** Dates are chosen with the filter chips below the hero. */
const DATES_URL = "#filters";
/** The app has no region settings page yet; its /events page is the closest. */
const REGION_URL = appUrl("/events");

function RegionBar() {
  const link = "text-sm font-bold underline decoration-1 underline-offset-4 hover:opacity-80";
  return (
    <div style={{ background: C.chip, borderBottom: `1px solid ${C.line}` }}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <p
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold"
          style={{ color: C.inkDeep }}
        >
          <span className="inline-flex items-center gap-2">
            <Calendar size={16} strokeWidth={2} />
            Next 30 days · Through Oct 21
          </span>
          <span className="hidden font-medium sm:inline" style={{ color: C.muted }}>
            ·
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} strokeWidth={2} />
            Your region: {REGION}
          </span>
        </p>
        <div className="flex gap-5">
          <a href={DATES_URL} className={link} style={{ color: C.brand }}>
            Change dates
          </a>
          <a href={REGION_URL} className={link} style={{ color: C.brand }}>
            Change region
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const strip = EVENTS.filter((e) => e.thumb);

  return (
    <>
      <RegionBar />
      <section className="relative overflow-hidden bg-gradient-to-br from-[#062F39] via-[#066879] to-[#8A6A1F] xl:h-[620px]">
        <Image
          src="/events-upcoming/hero-meerkat.webp"
          alt="A meerkat resting in the grass"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] xl:object-center"
        />
        {/* Dark on the left for the copy, easing off toward the photo. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(3,31,37,0.88) 0%, rgba(4,36,43,0.55) 42%, rgba(6,47,57,0.30) 100%)",
          }}
        />
        {/* Below xl the copy spans the whole width, including the light side
            of the photo, so darken it evenly to keep the text readable. */}
        <div className="absolute inset-0 bg-[rgba(3,31,37,0.45)] xl:hidden" />

        <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-14 sm:px-6 sm:pt-20 xl:pb-0 xl:pt-20">
          <div className="max-w-[560px]">
            <p className="text-xs font-bold tracking-wide" style={{ color: C.warmBright }}>
              EVENTS · UPCOMING
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.15] text-white sm:text-5xl sm:leading-[57px]">
              Plan what you want to show up for next.
            </h1>
            <p className="mt-4 max-w-[540px] text-base leading-7 text-white/80 sm:text-lg">
              Community gatherings, rescue events, workshops, fundraisers and
              online sessions — everything coming up that you might like, from
              Austin and beyond.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#upcoming"
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: C.warmBright }}
              >
                Explore upcoming events
              </a>
              <a
                href={DATES_URL}
                className="rounded-xl border border-white/50 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Change dates
              </a>
            </div>
            <p className="mt-5 text-sm text-white/75">
              <Link href="/events-this-weekend" className="border-b border-white/50 font-bold text-white hover:border-white">
                This Weekend
              </Link>
              {" · "}
              <Link href="/events-online" className="border-b border-white/50 font-bold text-white hover:border-white">
                Online Events
              </Link>
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
              <span className="size-1.5 rounded-sm" style={{ background: C.warmBright }} />
              Plenty to explore over the next 30 days
            </p>
          </div>
        </div>

        {/* Next few events: a glass strip docked bottom-right from xl (it
            needs ~860px), a full-width row under the copy below that —
            stretched to fit on laptops, swipeable on phones and tablets. */}
        <ul
          aria-label="Coming up next"
          className="relative flex overflow-x-auto border-t border-white/20 bg-[rgba(2,20,24,0.35)] backdrop-blur-[3px] xl:absolute xl:bottom-0 xl:right-0 xl:overflow-visible"
        >
          {strip.map((e, i) => (
            <li
              key={e.id}
              className={`flex shrink-0 items-center gap-3 px-5 py-4 sm:px-6 lg:flex-1 xl:flex-none ${
                i < strip.length - 1 ? "border-r border-white/15" : ""
              }`}
            >
              <div className="relative size-11 shrink-0 overflow-hidden rounded-xl">
                <Image src={e.thumb!} alt="" fill sizes="44px" className="object-cover" />
                <div className="absolute inset-0 mix-blend-multiply" style={{ background: PHOTO_TINT }} />
              </div>
              <div className="w-28">
                <p className="text-xs font-bold uppercase tracking-tight text-white/60">
                  {e.dateLabel}
                </p>
                <p className="text-sm font-bold leading-5 text-white">{e.stripTitle}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
