import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { DAYS, EVENTS, REGION, WEEKEND_LABEL } from "./events";
import { C, PHOTO_TINT } from "./theme";

function RegionBar() {
  return (
    <div style={{ background: C.chip, borderBottom: `1px solid ${C.line}` }}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <p
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold"
          style={{ color: C.inkDeep }}
        >
          <span className="inline-flex items-center gap-2">
            <Calendar size={16} strokeWidth={2} />
            This weekend · {WEEKEND_LABEL}
          </span>
          <span className="hidden font-medium sm:inline" style={{ color: C.muted }}>
            ·
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} strokeWidth={2} />
            Your region: {REGION}
          </span>
        </p>
        <a
          href={appUrl("/events")}
          className="text-sm font-bold underline decoration-1 underline-offset-4 hover:opacity-80"
          style={{ color: C.brand }}
        >
          Change region
        </a>
      </div>
    </div>
  );
}

export default function Hero() {
  const picks = EVENTS.filter((e) => e.featured);
  const dayShort = (id: string) => DAYS.find((d) => d.id === id)!.short.slice(0, 3);

  return (
    <>
      <RegionBar />
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold tracking-wide" style={{ color: C.warmBright }}>
            EVENTS · THIS WEEKEND
          </p>
          <h1
            className="max-w-[560px] text-4xl font-extrabold leading-[1.1] sm:text-5xl sm:leading-[1.035]"
            style={{ color: C.ink }}
          >
            Find something worth showing up for this weekend.
          </h1>
          <p className="max-w-[480px] text-base leading-7" style={{ color: C.muted }}>
            Browse animal-focused events happening in the next few days,
            matched to {REGION} and your local time.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#day-by-day"
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Explore this weekend
            </a>
            <p className="text-sm" style={{ color: C.muted }}>
              <Link href="/events-online" className="font-bold hover:underline" style={{ color: C.brand }}>
                Online Events
              </Link>
              {" · "}
              <Link href="/events-upcoming" className="font-bold hover:underline" style={{ color: C.brand }}>
                Upcoming
              </Link>
            </p>
          </div>
          <p
            className="flex items-center gap-2 pt-2.5 text-sm font-semibold"
            style={{ color: C.inkDeep }}
          >
            <span className="size-1.5 rounded-sm" style={{ background: C.warmBright }} />
            {EVENTS.length} eligible events near {REGION} this weekend
          </p>
        </div>

        <div
          className="rounded-3xl bg-white p-5 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)]"
          style={{ border: `1px solid ${C.line}` }}
        >
          <p className="text-xs font-bold" style={{ color: C.muted }}>
            A quick look at this weekend
          </p>
          <ul className="mt-4">
            {picks.map((e, i) => (
              <li
                key={e.id}
                className="flex items-center gap-3.5 py-3"
                style={i ? { borderTop: `1px solid ${C.line}` } : undefined}
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                  <Image src={e.featured!.thumb} alt="" fill sizes="48px" className="object-cover" />
                  <div className="absolute inset-0 mix-blend-multiply" style={{ background: PHOTO_TINT }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-tight" style={{ color: C.muted }}>
                    {dayShort(e.day)} · {e.time}
                  </p>
                  <p className="text-sm font-bold" style={{ color: C.ink }}>
                    {e.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
