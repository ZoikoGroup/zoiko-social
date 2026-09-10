import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { IMAGES } from "./images";
import { C } from "./theme";

const ASSURANCES = [
  "Profanity-Free",
  "Verified News Sources",
  "Institutional Moderation",
];

const STATS: [string, string][] = [
  ["12,500+", "Verified Professionals"],
  ["2,800+", "Active Communities"],
  ["<2 min", "Average Response Time"],
];

/**
 * Hero band plus the stats strip that overlaps its lower edge.
 *
 * The two are one component because the strip is positioned against the
 * hero's bottom edge — splitting them would mean recreating that overlap
 * with negative margins from the page.
 */
export default function HeroSection() {
  return (
    <section className="relative">
      {/* The comp's backdrop is the gradient itself, not a photograph. */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(105deg, ${C.ink} 0%, ${C.brand} 42%, #1E8F6E 72%, ${C.warmBright} 100%)`,
        }}
      >
        <div className="relative mx-auto flex min-h-[460px] max-w-[1280px] flex-col items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[560px] lg:flex-row lg:justify-between lg:py-20">
          <div className="max-w-[600px]">
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Where the World Comes
              <br className="hidden lg:block" /> Together for Animals
            </h1>

            <p className="mt-5 max-w-[553px] text-base leading-7 text-white/[0.86] sm:text-lg">
              Share moments, build communities, follow verified animal welfare
              news, and coordinate care safely — globally, and profanity-free.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href={APP_LINKS.signUp}
                className="flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-semibold transition hover:bg-white/90 sm:w-52"
                style={{ color: C.ink }}
              >
                Join Free
              </Link>
              <Link
                href={APP_LINKS.communities}
                className="flex w-full items-center justify-center rounded-xl border border-white/50 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                Explore Communities
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {ASSURANCES.map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    style={{ color: C.warmBright }}
                  />
                  <span className="text-sm font-semibold text-white/[0.88]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-[532px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_48px_rgba(0,0,0,0.18)] ring-1 ring-white/20">
            <div className="relative aspect-[532/388]">
              <Image
                src={IMAGES.alpacaSelfie}
                alt="Two people taking a selfie with an alpaca"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 532px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip, centred on the gradient's bottom edge: half over the
          hero, half over the page. The card is a fixed 112px tall from sm up
          (py-6, plus a 40px value, a 4px gap and a 20px label), so pulling it
          up by exactly half that lands the seam through its middle. Below sm
          the columns stack to an unpredictable height, so the overlap is
          dropped rather than guessed at. */}
      <div className="relative z-10 flex justify-center px-4 sm:-mt-14 sm:px-6">
        <dl
          className="flex w-full max-w-[760px] flex-col rounded-3xl bg-white shadow-[0_20px_48px_rgba(7,59,71,0.16)] sm:flex-row sm:justify-center"
          style={{ border: `1px solid ${C.line}` }}
        >
          {STATS.map(([value, label], i) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1 px-4 py-6 sm:flex-1 ${
                i === STATS.length - 1 ? "" : "sm:border-r"
              }`}
              style={{ borderColor: C.line }}
            >
              <dt className="sr-only">{label}</dt>
              <dd
                className="text-2xl font-extrabold leading-10"
                style={{ color: C.ink }}
              >
                {value}
              </dd>
              <p
                className="text-center text-xs font-semibold leading-5"
                style={{ color: C.muted }}
              >
                {label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
