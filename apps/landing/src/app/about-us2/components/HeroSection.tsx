import Image from "next/image";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import { IMAGES } from "./images";
import { C } from "./theme";

/** Page hero: boardwalk photograph, dark teal wash, headline and two CTAs. */
export default function HeroSection() {
  return (
    <section className="relative min-h-[420px] overflow-hidden lg:min-h-[460px]">
      <Image
        src={IMAGES.heroBoardwalk}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* The photograph is already graded teal; this only deepens the left
          side so the white type keeps its contrast over the bright sunset. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, ${C.ink}E0 0%, ${C.ink}B8 32%, ${C.ink}0D 82%)`,
        }}
      />

      <div className="relative mx-auto flex min-h-[420px] max-w-[1280px] flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[460px]">
        <div className="max-w-[600px]">
          <span className="inline-flex items-center rounded-[5px] bg-white/[0.14] px-3 py-1 text-sm leading-5 text-white">
            About Us
          </span>

          <h1 className="mt-3.5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            About Zoiko Social
          </h1>

          <p className="mt-3.5 max-w-[600px] text-base leading-7 text-white/[0.86] sm:text-lg">
            Zoiko Social is a global social platform built for animal
            communities, welfare, and verified news — a place to connect,
            discover, and help protect animal life together.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href={APP_LINKS.home}
              className="flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-semibold transition hover:bg-white/90 sm:w-auto"
              style={{ color: C.ink }}
            >
              Explore Zoiko Social
            </Link>
            <Link
              href="#principles"
              className="flex w-full items-center justify-center rounded-xl border border-white/50 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Our Principles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
