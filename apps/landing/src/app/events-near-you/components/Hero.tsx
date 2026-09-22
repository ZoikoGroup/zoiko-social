import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { REGION, STATS } from "./events";
import { C, PHOTO_TINT } from "./theme";

/** The app has no region settings page yet; its /events page is the closest. */
const REGION_URL = appUrl("/events");

function RegionBar() {
  return (
    <div style={{ background: C.chip, borderBottom: `1px solid ${C.line}` }}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: C.inkDeep }}>
          <MapPin size={16} strokeWidth={2} />
          Your region: {REGION}
        </p>
        <div className="flex gap-4">
          <a
            href={REGION_URL}
            className="text-sm font-bold underline decoration-1 underline-offset-4 hover:opacity-80"
            style={{ color: C.brand }}
          >
            Change region
          </a>
          <a href={REGION_URL} className="text-sm font-semibold hover:underline" style={{ color: C.muted }}>
            Clear region
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const stats = [
    { value: STATS.events, label: "Eligible events" },
    { value: STATS.verifiedOrganizers, label: "Verified organizers" },
    { value: STATS.communities, label: "Communities active here" },
  ];

  return (
    <>
      <RegionBar />
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
        <div className="flex flex-col gap-2.5">
          <p className="text-xs font-bold tracking-wide" style={{ color: C.warmBright }}>
            EVENTS · NEAR YOU
          </p>
          <h1
            className="max-w-[560px] text-4xl font-extrabold leading-[1.1] sm:text-5xl sm:leading-[1.035]"
            style={{ color: C.ink }}
          >
            Find animal-focused events in your region.
          </h1>
          <p className="max-w-[480px] pt-1 text-base leading-7" style={{ color: C.muted }}>
            Explore meetups, workshops, rescue events, fundraisers and other
            animal-focused events connected to {REGION} — the region you chose.
          </p>
          <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#local-events"
              className="rounded-xl px-5 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Explore local events
            </a>
            <p className="text-sm" style={{ color: C.muted }}>
              <Link href="/events-this-weekend" className="font-bold hover:underline" style={{ color: C.brand }}>
                This Weekend
              </Link>
              {" · "}
              <Link href="/events-upcoming" className="font-bold hover:underline" style={{ color: C.brand }}>
                Upcoming
              </Link>
            </p>
          </div>
          <p className="flex items-center gap-2 pt-3 text-sm font-semibold" style={{ color: C.inkDeep }}>
            <span className="size-1.5 rounded-sm" style={{ background: C.warmBright }} />
            Plenty to explore in {REGION}
          </p>
          <p className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
            <MapPin size={12} strokeWidth={2} className="shrink-0" />
            Near You uses the region you set. Precise GPS is never required.
          </p>
        </div>

        <div className="relative aspect-[559/377] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-800 to-orange-500 shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)]">
          <Image
            src="/events-near-you/hero-collage.webp"
            alt="A grid of big cats and wild cat fur patterns"
            fill
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: PHOTO_TINT }} />
          {/* Darkens the bottom so the stats stay legible over the photos. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(2,24,29,0.86) 0%, rgba(4,36,43,0.15) 55%, rgba(4,36,43,0) 80%)",
            }}
          />
          <dl className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-3 p-4 sm:gap-5 sm:p-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-0.5">
                <dt className="text-[11px] font-semibold leading-4 text-white/75 sm:text-xs">{s.label}</dt>
                <dd className="text-xl font-extrabold text-white sm:text-2xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
