import Image from "next/image";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import { SAFETY_BANNER } from "./images";
import { C } from "./theme";

/** The closing banner: how live streams are vetted, over a graded photo. */
export default function SafetyBanner() {
  return (
    <section className="relative mt-16 overflow-hidden rounded-3xl">
      <Image src={SAFETY_BANNER} alt="" fill sizes="(max-width: 1280px) 100vw, 1232px" className="object-cover" />
      {/* The photo is already graded; this only steadies the left side so the
          white type holds its contrast wherever the image is brightest. */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, ${C.ink}B3 0%, ${C.ink}66 55%, ${C.ink}1A 100%)` }}
      />

      <div className="relative max-w-[560px] px-6 py-12 sm:px-12 sm:py-20">
        <h2 className="text-xl font-extrabold leading-snug text-white sm:text-2xl sm:leading-9">
          Every live stream on Zoiko Social is eligibility-checked before it
          ever reaches you.
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/85">
          Verification, moderation, and privacy checks run before ranking — not
          after. Locations stay coarse, sensitive content is gated, and under-18
          accounts get stricter defaults automatically.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={APP_LINKS.safety}
            className="flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: C.warmBright }}
          >
            How live safety works
          </Link>
          <Link
            href={APP_LINKS.safety}
            className="flex items-center justify-center rounded-xl border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Report a concern
          </Link>
        </div>
      </div>
    </section>
  );
}
