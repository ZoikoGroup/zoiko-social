import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { C } from "./theme";

const TEXT_SHADOW = { textShadow: "0px 1px 3px rgba(0,0,0,0.40)" };

function Tile({
  src,
  alt,
  label,
  chip,
  className = "",
  sizes,
}: {
  src: string;
  alt: string;
  label: string;
  chip?: string;
  className?: string;
  sizes: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-800 to-orange-500 ${className}`}
      style={{ border: `1px solid ${C.line}` }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
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
    <div className="grid items-center gap-10 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
      <div>
        <p className="text-base leading-6" style={{ color: C.ink }}>
          Community Meetups
        </p>
        <h1 className="text-3xl font-extrabold leading-tight sm:leading-[48px]" style={{ color: C.inkDeep }}>
          Meet animal lovers around shared interests.
        </h1>
        <p className="max-w-[620px] pt-3 text-base leading-6" style={{ color: C.ink }}>
          Discover casual, community-centered gatherings built around animals,
          shared interests, and responsible participation.
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
          <a
            href="#meetups"
            className="rounded-xl px-6 py-3 text-center text-base font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            Explore meetups
          </a>
          <Link
            href="/events-near-you"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold transition hover:bg-neutral-50"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            <MapPin size={14} strokeWidth={2} />
            Meetups in Global
          </Link>
        </div>
        <p className="max-w-[640px] pt-4 text-xs leading-5" style={{ color: C.muted }}>
          Organizer, participation, venue, and safety details are shown
          according to the event&apos;s approved visibility rules.
        </p>
      </div>

      <div
        className="grid h-80 grid-cols-2 grid-rows-2 gap-2.5 rounded-3xl bg-white p-4 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)] sm:h-[360px]"
        style={{ border: `1px solid ${C.line}` }}
      >
        <Tile
          src="/events-community-meetups/hero-dog-walk.webp"
          alt="A woman hugging a husky puppy"
          chip="Dog Walk & Social"
          label="Sun, 9:00 AM"
          className="row-span-2"
          sizes="(min-width: 1024px) 200px, 50vw"
        />
        <Tile
          src="/events-community-meetups/hero-new-owner-circle.webp"
          alt="A corgi and a terrier running together"
          label="New Owner Circle"
          sizes="(min-width: 1024px) 200px, 50vw"
        />
        <Tile
          src="/events-community-meetups/hero-birdwatching.webp"
          alt="A kingfisher perched on a branch"
          label="Birdwatching Walk"
          sizes="(min-width: 1024px) 200px, 50vw"
        />
      </div>
    </div>
  );
}
