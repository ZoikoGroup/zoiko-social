import Link from "next/link";
import { IMAGES } from "./images";
import { C } from "./theme";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[480px] sm:min-h-[560px] lg:min-h-[629px] w-full items-center bg-cover bg-center bg-no-repeat py-12 sm:py-16 md:py-20 lg:py-24"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(7, 27, 32, 0.88) 0%, rgba(7, 42, 50, 0.55) 90%, rgba(7, 59, 71, 0.3) 100%), url(${IMAGES.heroBg})`,
      }}
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <div className="max-w-[760px]">
          {/* Eyebrow */}
          <span
            className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.05em]"
            style={{ color: C.zest }}
          >
            About Zoiko Social
          </span>

          {/* Heading */}
          <h1 className="mt-2.5 sm:mt-3 text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.2] sm:leading-[1.18] lg:leading-[67.2px] tracking-[-0.02em] text-white">
            A social network built{" "}
            <br className="hidden sm:inline" />
            around animal life,{" "}
            <br className="hidden sm:inline" />
            community, and trust
          </h1>

          {/* Subheading */}
          <p className="mt-3.5 sm:mt-5 text-sm sm:text-lg lg:text-[20px] font-medium leading-relaxed sm:leading-[32px] text-white/95">
            Zoiko Social is a global social infrastructure for animal lovers,
            professionals, organizations, and communities — combining communication,
            verified information, adoption, events, commerce, and coordination in a
            purpose-built environment.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-[420px] sm:max-w-none">
            <Link
              href="/signup"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 text-center active:scale-[0.98]"
              style={{ background: C.mosque }}
            >
              Join Zoiko Social
            </Link>

            <Link
              href="/communities-all"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition hover:bg-white/90 text-center active:scale-[0.98]"
              style={{
                background: C.white,
                borderColor: C.geyser,
                color: C.firefly,
              }}
            >
              Explore Communities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
