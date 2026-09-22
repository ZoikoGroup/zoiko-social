import Image from "next/image";
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
    <div className="grid items-center gap-10 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
      <div>
        <p className="text-base leading-6" style={{ color: C.ink }}>
          Events · Training &amp; Workshops
        </p>
        <h1 className="max-w-[620px] text-3xl font-extrabold leading-tight sm:leading-[48px]" style={{ color: C.inkDeep }}>
          Learn practical animal-care skills from trusted professionals.
        </h1>
        <p className="max-w-[640px] pt-3 text-base leading-6" style={{ color: C.ink }}>
          Find educational sessions and demonstrations with clear learning
          outcomes, prerequisites, professional context and animal-welfare
          safeguards.
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
          <a
            href="#workshops"
            className="rounded-xl px-6 py-3 text-center text-base font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            Browse workshops
          </a>
          <a
            href="#upcoming-sessions"
            className="rounded-xl bg-white px-6 py-3 text-center text-base font-semibold transition hover:bg-neutral-50"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            View upcoming sessions
          </a>
        </div>
        <p className="max-w-[640px] pt-4 text-xs leading-5" style={{ color: C.muted }}>
          Professional verification confirms approved identity/scope
          information. It does not turn every workshop into medical advice or an
          official certification.
        </p>
      </div>

      <div
        className="grid h-80 grid-cols-2 grid-rows-[1fr_auto] gap-2.5 rounded-3xl bg-white p-4 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)] sm:h-[360px]"
        style={{ border: `1px solid ${C.line}` }}
      >
        <Tile
          src="/events-training-workshops/hero-behavior-training.webp"
          alt="A girl feeding a rabbit a carrot"
          chip="Behavior & Training"
          label="Sat, 10:00 AM"
          className="row-span-2"
        />
        <Tile
          src="/events-training-workshops/hero-care-education.webp"
          alt="Two people relaxing on a bed with a small dog"
          label="Care Education"
        />
        <Tile
          src="/events-training-workshops/hero-grooming-handling.webp"
          alt="A groomer working on a dog's coat"
          label="Grooming & Handling"
          className="h-16 sm:h-20"
        />
      </div>
    </div>
  );
}
