import Image from "next/image";
import { APP_LINKS } from "@/lib/app-links";
import { IMAGES } from "./images";
import { C } from "./theme";
import { ArrowLink, Eyebrow } from "./primitives";

/** "Who we are" — copy on the left, the sleeping-cat photograph on the right. */
export default function WhoWeAreSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
        <div className="w-full flex-1">
          <Eyebrow>Who we are</Eyebrow>

          <h2
            className="mt-4 text-2xl font-extrabold leading-tight lg:text-3xl lg:leading-10"
            style={{ color: C.ink }}
          >
            A dedicated home for
            <br className="hidden sm:block" /> the animal welfare community
          </h2>

          <p className="mt-4 text-base leading-6" style={{ color: C.muted }}>
            Zoiko Social exists to give the global animal welfare community a
            dedicated place to connect — away from noisy, algorithm-driven feeds
            built for anything and everything. We bring together individuals,
            professionals, and organizations working toward the same goal: a
            safer, more connected world for animals.
          </p>

          <p className="mt-4 text-base leading-6" style={{ color: C.muted }}>
            Our purpose is simple: help people find each other, share verified
            information, and coordinate care — without compromising on safety,
            privacy, or truth.
          </p>

          <div className="mt-6">
            <ArrowLink href={APP_LINKS.home}>
              See what you can do on Zoiko
            </ArrowLink>
          </div>
        </div>

        <div
          className="w-full flex-1 overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(7,59,71,0.10)]"
          style={{ border: `1px solid ${C.line}` }}
        >
          <div className="relative aspect-[583/378]">
            <Image
              src={IMAGES.sleepingCat}
              alt="A ginger cat asleep on a bed"
              fill
              sizes="(max-width: 1024px) 100vw, 583px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
