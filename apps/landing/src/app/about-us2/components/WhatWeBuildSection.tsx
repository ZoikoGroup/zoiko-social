import Image from "next/image";
import { APP_LINKS } from "@/lib/app-links";
import { IMAGES } from "./images";
import { C } from "./theme";
import { ArrowLink, Eyebrow } from "./primitives";

/**
 * "What we build" — a three-photograph collage beside the copy.
 *
 * The collage is one tall panel on the left and two stacked panels on the
 * right, so it is a two-column grid where the first cell spans both rows.
 */
export default function WhatWeBuildSection() {
  return (
    <section
      className="bg-white py-12 sm:py-16 lg:py-20"
      style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Every panel holds a `fill` image, which is absolutely positioned
              and contributes no height, so something has to give the rows a
              size or the collage collapses to nothing. Rather than pin the
              grid to a fixed height per breakpoint, the two right-hand panels
              carry an aspect ratio: their height follows their own width, the
              tall left panel stretches across both rows to match, and the
              whole collage scales with the column at any viewport. */}
          <div className="grid w-full flex-1 grid-cols-2 grid-rows-2 gap-4">
            <div
              className="relative row-span-2 overflow-hidden rounded-[20px]"
              style={{ border: `1px solid ${C.line}` }}
            >
              <Image
                src={IMAGES.collagePuppy}
                alt="An Australian shepherd puppy lying on a path"
                fill
                sizes="(max-width: 1024px) 50vw, 320px"
                className="object-cover"
              />
            </div>
            <div
              className="relative aspect-square overflow-hidden rounded-[20px] lg:aspect-[245/180]"
              style={{ border: `1px solid ${C.line}` }}
            >
              <Image
                src={IMAGES.collageFrenchie}
                alt="A French bulldog wearing a yellow hoodie"
                fill
                sizes="(max-width: 1024px) 50vw, 245px"
                className="object-cover"
              />
            </div>
            <div
              className="relative aspect-square overflow-hidden rounded-[20px] lg:aspect-[245/180]"
              style={{ border: `1px solid ${C.line}` }}
            >
              <Image
                src={IMAGES.collageLabrador}
                alt="A labrador puppy wearing a bow tie"
                fill
                sizes="(max-width: 1024px) 50vw, 245px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-full flex-1">
            <Eyebrow>What we build</Eyebrow>

            <h2
              className="mt-4 text-2xl font-extrabold leading-tight lg:text-3xl lg:leading-10"
              style={{ color: C.ink }}
            >
              One governed platform, not another
              <br className="hidden sm:block" /> noisy feed
            </h2>

            <p className="mt-4 text-base leading-6" style={{ color: C.muted }}>
              Zoiko Social brings communities, verified animal welfare news, and
              adoption support into one governed platform — built with
              institutional-grade moderation from day one, not added after the
              fact.
            </p>

            <p className="mt-4 text-base leading-6" style={{ color: C.muted }}>
              Every module on Zoiko — from community spaces to news sourcing —
              is reviewed against the same standard: is this useful, accurate,
              and safe for the animal welfare community.
            </p>

            <div className="mt-6">
              <ArrowLink href={APP_LINKS.home}>Explore the platform</ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
