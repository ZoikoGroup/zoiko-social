import Image from "next/image";
import { C } from "./theme";

/** "Ready to Make a Difference?" — closing CTA over a full-bleed photo. */
export default function CTA() {
  return (
    <section className="w-full bg-white px-4 py-8 sm:px-8 lg:px-[105px] lg:py-12">
      <div className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-3xl">
        <Image
          src="/platform-features/cta-background.webp"
          alt=""
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(7,59,71,0.9)] to-[rgba(7,59,71,0.45)]" />

        <div className="relative flex flex-col items-center gap-6 px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-[76px]">
          <h2 className="text-center font-jakarta text-2xl font-extrabold tracking-[-0.36px] text-white sm:text-3xl lg:text-4xl">
            Ready to Make a Difference?
          </h2>
          <p className="max-w-[638px] text-center text-base leading-7 text-white/90 sm:text-[17px]">
            Join Zoiko Social and connect with thousands of animal advocates, rescuers, and organizations working toward
            real change.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              className="rounded-xl border bg-white px-8 py-[17px] text-sm font-bold"
              style={{ borderColor: C.line, color: C.brand }}
            >
              Explore Communities
            </button>
            <button
              type="button"
              className="rounded-xl border bg-white px-8 py-[17px] text-sm font-bold"
              style={{ borderColor: C.line, color: C.brand }}
            >
              Join Free Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
