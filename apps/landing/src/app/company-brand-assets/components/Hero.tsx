import Image from "next/image";
import { IMG, MEDIA_KIT_REQUEST } from "./content";
import { C } from "./theme";

export default function Hero() {
  return (
    <section className="bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-28">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:grid-cols-[minmax(0,1fr)_473px] lg:gap-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: C.warm }}>
            Brand Assets
          </p>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl lg:leading-[57.6px]" style={{ color: C.brand }}>
            Official Zoiko Social brand files and guidelines
          </h1>
          <p className="max-w-[680px] pt-3 text-lg font-medium leading-8 sm:text-xl" style={{ color: C.muted }}>
            Download approved logos, colors, typography, and usage guidelines. Everything you need to represent Zoiko
            Social accurately and consistently.
          </p>
          <div className="flex w-full max-w-[400px] flex-col gap-4 pt-5">
            <a
              href={MEDIA_KIT_REQUEST}
              className="rounded-xl px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Download Media Kit
            </a>
            <a
              href="#asset-finder"
              className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold transition hover:bg-neutral-50"
              style={{ color: C.ink, border: `1px solid ${C.line}` }}
            >
              View All Assets
            </a>
          </div>
        </div>
        <div className="relative aspect-[473/395] w-full overflow-hidden rounded-3xl shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)]">
          <Image
            src={`${IMG}hero.webp`}
            alt="A Zoiko Social branded binder of swatches on a sofa"
            fill
            priority
            sizes="(min-width: 1024px) 473px, (min-width: 768px) 440px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
