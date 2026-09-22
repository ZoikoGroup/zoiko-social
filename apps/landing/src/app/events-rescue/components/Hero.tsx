import Image from "next/image";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";

const TEXT_SHADOW = { textShadow: "0px 1px 3px rgba(0,0,0,0.40)" };

function Tile({
  src,
  alt,
  label,
  chip,
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  chip?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-800 to-orange-500 ${className}`}
      style={{ border: `1px solid ${C.line}` }}
    >
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 200px, 50vw" className="object-cover" />
      {chip && (
        <span
          className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9.5px] font-bold leading-4"
          style={{ color: C.inkDeep }}
        >
          {chip}
        </span>
      )}
      <span className="absolute bottom-2 left-2 text-xs font-bold leading-4 text-white" style={TEXT_SHADOW}>
        {label}
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <>
      <div className="grid items-center gap-10 pb-8 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
        <div>
          <p className="text-base leading-6" style={{ color: C.ink }}>
            Events · Rescue Events
          </p>
          <h1 className="text-3xl font-extrabold leading-tight sm:leading-[48px]" style={{ color: C.inkDeep }}>
            Support rescue efforts in person.
          </h1>
          <p className="max-w-[640px] pt-3 text-base leading-6" style={{ color: C.ink }}>
            Discover adoption days, rescue drives, shelter gatherings, and
            foster-support events from verified rescue organizations.
          </p>
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
            <a
              href="#rescue-events"
              className="rounded-xl px-6 py-3 text-center text-base font-semibold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Browse rescue events
            </a>
            <Link
              href="/events-upcoming"
              className="rounded-xl bg-white px-6 py-3 text-center text-base font-semibold transition hover:bg-neutral-50"
              style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
            >
              View upcoming events
            </Link>
          </div>
          <p className="max-w-[640px] pt-4 text-xs leading-5" style={{ color: C.muted }}>
            Organizer verification and rescue/beneficiary relationship are shown
            as separate, honest signals. Event safety, venue, and
            animal-participation details follow each event&apos;s approved
            visibility rules.
          </p>
        </div>

        <div
          className="grid h-80 grid-cols-2 grid-rows-2 gap-2.5 rounded-3xl bg-white p-4 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)] sm:h-[360px]"
          style={{ border: `1px solid ${C.line}` }}
        >
          <Tile
            src="/events-rescue/hero-adoption-day.webp"
            alt="A woman hugging a large dog at a shelter"
            chip="Adoption Day"
            label="Sat, 11:00 AM"
            className="row-span-2"
          />
          <Tile
            src="/events-rescue/hero-donation-drive.webp"
            alt="Volunteers sorting donated pet supplies"
            label="Donation Drive"
          />
          <Tile
            src="/events-rescue/hero-foster-support.webp"
            alt="Two women holding a kitten"
            label="Foster Support"
          />
        </div>
      </div>

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[20px] bg-white px-5 py-4 text-xs leading-5 sm:px-6 sm:py-5"
        style={{ border: `1px solid ${C.line}`, color: C.muted }}
      >
        <span className="flex items-center gap-2 font-bold" style={{ color: C.ink }}>
          <span className="size-1.5 rounded-sm" style={{ background: "#2E7D32" }} />
          Verified organizer
        </span>
        <span>
          Confirms <b style={{ color: C.ink }}>identity</b>, not event outcome
        </span>
        <span>
          Rescue/beneficiary relationship shown <b style={{ color: C.ink }}>separately</b>
        </span>
        <a href={APP_LINKS.safety} className="font-bold hover:underline sm:ml-auto" style={{ color: C.brand }}>
          How We Verify &gt;
        </a>
      </div>
    </>
  );
}
