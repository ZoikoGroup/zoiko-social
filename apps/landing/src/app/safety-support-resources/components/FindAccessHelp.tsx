import Image from "next/image";
import Section from "./Section";
import { DIAL_211, IMG, PSYCHOLOGY_TODAY, SAMHSA, STEPS } from "./content";
import { C } from "./theme";

const LINK = "font-semibold underline underline-offset-2";

export default function FindAccessHelp() {
  return (
    <Section tinted title="How to find & access help">
      {/* The two people sit near opposite edges, so phones get a wide crop
          (not 4:3) centred between them to keep both in frame. */}
      <div className="relative aspect-[5/2] w-full overflow-hidden rounded-3xl shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] sm:aspect-[1230/356]">
        <Image
          src={`${IMG}find-help.webp`}
          alt="A young man talking with a therapist in a bright room"
          fill
          sizes="(min-width: 1280px) 1230px, 100vw"
          className="object-cover object-[57%_center]"
        />
      </div>

      {/* The design numbers these 1, 2, 1, 2; they read as four steps in order. */}
      <ol className="grid gap-4 sm:gap-8 md:grid-cols-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="flex flex-col gap-5 rounded-[20px] bg-white p-6 sm:gap-6 sm:px-8 sm:pb-12 sm:pt-8"
            style={{ border: `2px solid ${C.line}` }}
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white"
                style={{ background: `linear-gradient(135deg, ${C.brand}, ${C.brandDeep})` }}
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="text-lg font-bold" style={{ color: C.ink }}>
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
            </div>
            <ul className="flex list-disc flex-col gap-3 pl-5 text-[15px] sm:text-base" style={{ color: C.muted }}>
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-2.5 rounded-[20px] p-5 sm:p-6" style={{ background: "rgba(21,94,117,0.10)", border: `2px solid ${C.brand}` }}>
        <h3 className="text-lg font-bold" style={{ color: C.brand }}>
          Quick Start: These can connect you TODAY
        </h3>
        <ul className="flex flex-col gap-2 text-base leading-7" style={{ color: C.muted }}>
          <li>
            <strong>SAMHSA National Helpline:</strong>{" "}
            <a href={SAMHSA.href} className={LINK} style={{ color: C.brand }}>
              {SAMHSA.label}
            </a>{" "}
            (free, confidential, 24/7) — Connects you to local treatment/support in your area
          </li>
          <li>
            <strong>211 Service:</strong> Dial{" "}
            <a href={DIAL_211.href} className={LINK} style={{ color: C.brand }}>
              {DIAL_211.label}
            </a>{" "}
            — Local resource finder for mental health, healthcare, housing, food
          </li>
          <li>
            <strong>Psychology Today Therapist Finder:</strong>{" "}
            <a href={PSYCHOLOGY_TODAY} target="_blank" rel="noopener noreferrer" className={LINK} style={{ color: C.brand }}>
              psychologytoday.com
            </a>{" "}
            — Search by insurance, specialty, location
          </li>
        </ul>
      </div>
    </Section>
  );
}
