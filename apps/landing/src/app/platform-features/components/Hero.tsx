import Image from "next/image";
import { C } from "./theme";
import Link from "next/link";

const STATS = [
  { value: "2.4K+", label: "Active communities" },
  { value: "3.8M", label: "Community members" },
  { value: "145K+", label: "Animals helped" },
  { value: "156", label: "Countries reached" },
];

/**
 * Hero — "Discover what Zoiko Social can do".
 *
 * Full-bleed photo (/platform-features/hero-background.webp) under a
 * three-stop cyan gradient (rgba(7,27,32,.88) → rgba(7,42,50,.55) →
 * rgba(7,59,71,.3)) so the "Features" eyebrow, headline, intro copy and
 * the two CTA buttons stay readable. A white stat bar (active
 * communities / members / animals helped / countries reached) sits
 * below the photo, matching the Figma frame exactly.
 */
export default function Hero() {
  return (
    <section className="relative flex w-full flex-col items-center">
      <div className="relative flex w-full min-h-[483px] items-center justify-center overflow-hidden px-6 py-16 lg:px-[105px] lg:py-0">
        <Image
          src="/platform-features/hero-background.webp"
          alt=""
          width={800}
          height={533}
          priority
          className="absolute inset-0 h-full w-full object-cover object-[center_10%]"
        />
        <div className="absolute inset-0 opacity-80 bg-[#073b47]" />
        <div className="relative flex w-full max-w-[900px] flex-col items-center gap-4 px-2 sm:gap-5">
          <p className="text-center font-jakarta text-xs font-bold uppercase tracking-[0.5px] text-[#fff5e8]">
            Features
          </p>
          <h1 className="text-center font-jakarta text-3xl font-extrabold leading-tight tracking-[-0.6px] text-white sm:text-4xl lg:text-[48px] lg:leading-[61.6px] lg:tracking-[-1.12px]">
            Discover what Zoiko Social can do
          </h1>
          <p className="max-w-[884px] text-center font-jakarta text-xl font-normal leading-8 text-white/95">
            Zoiko Social is built for animal lovers, rescuers, advocates, and professionals who want to<br className="hidden md:block" />
            connect, organize, and drive real change. Explore the capabilities that power your mission.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 sm:gap-4">
            <Link
              href="#platform-capabilities"
              className="rounded-xl px-7 py-[18px] font-jakarta text-[15px] font-semibold text-white"
              style={{ backgroundColor: C.brand }}
            >
              Explore Features
            </Link>
            <Link
              href="/platform-premium-plans-production"
              className="rounded-xl border-2 border-white bg-white/20 px-8 py-4 font-jakarta text-[15px] font-semibold text-white"
            >
              View Premium
            </Link>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 bg-white px-6 py-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 lg:gap-6 lg:px-[105px] lg:py-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-1 flex-col items-center gap-1.5 sm:min-w-[140px]">
            <span className="font-jakarta text-2xl font-extrabold" style={{ color: C.brand }}>
              {stat.value}
            </span>
            <span className="text-center text-sm" style={{ color: C.muted }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
