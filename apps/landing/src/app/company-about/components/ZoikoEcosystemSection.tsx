import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "./images";
import { C } from "./theme";

export default function ZoikoEcosystemSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:gap-4 max-w-[850px]">
          <h2
            className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]"
            style={{ color: C.firefly }}
          >
            The Zoiko Ecosystem
          </h2>
          <p
            className="text-sm font-normal leading-relaxed sm:text-base lg:text-[17px] sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Zoiko Social is part of a larger Zoiko Media Corp family of platforms, each
            serving the animal welfare and media ecosystem:
          </p>
        </div>

        {/* 3 Ecosystem Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {/* Card 1: Zoiko Social (Highlighted with Mosque border) */}
          <div
            className="flex flex-col items-center justify-between rounded-[18px] sm:rounded-[20px] p-6 sm:p-7 lg:p-8 text-center shadow-sm transition hover:shadow-md"
            style={{
              background: C.white,
              border: `2px solid ${C.mosque}`,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="flex size-14 items-center justify-center">
                <Image
                  src={IMAGES.ecosystem.zoikoSocial}
                  alt="Zoiko Social"
                  width={48}
                  height={48}
                  className="size-12 object-contain"
                />
              </div>

              <h3
                className="mt-3.5 sm:mt-4 text-base sm:text-lg lg:text-[20px] font-bold leading-snug sm:leading-[26px]"
                style={{ color: C.firefly }}
              >
                Zoiko Social
              </h3>

              <p
                className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-[16px] font-normal leading-relaxed sm:leading-[26px]"
                style={{ color: C.nevada }}
              >
                Global social infrastructure for animal communities, communication,
                adoption, and coordination.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-2">
              <span
                className="text-sm sm:text-base font-semibold leading-[19.8px]"
                style={{ color: C.mosque }}
              >
                You are here
              </span>
            </div>
          </div>

          {/* Card 2: ZoikoTV */}
          <div
            className="flex flex-col items-center justify-between rounded-[18px] sm:rounded-[20px] p-6 sm:p-7 lg:p-8 text-center shadow-sm transition hover:shadow-md"
            style={{
              background: C.white,
              border: `2px solid ${C.geyser}`,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="flex size-14 items-center justify-center">
                <Image
                  src={IMAGES.ecosystem.zoikoTv}
                  alt="ZoikoTV"
                  width={48}
                  height={48}
                  className="size-12 object-contain"
                />
              </div>

              <h3
                className="mt-3.5 sm:mt-4 text-base sm:text-lg lg:text-[20px] font-bold leading-snug sm:leading-[26px]"
                style={{ color: C.firefly }}
              >
                ZoikoTV
              </h3>

              <p
                className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-[16px] font-normal leading-relaxed sm:leading-[26px]"
                style={{ color: C.nevada }}
              >
                Verified news and media platform dedicated to animal welfare, science,
                and conservation stories.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-2">
              <Link
                href="/latest"
                className="text-sm sm:text-base font-semibold transition hover:underline"
                style={{ color: C.mosque }}
              >
                Learn more →
              </Link>
            </div>
          </div>

          {/* Card 3: Zoiko Media Corp */}
          <div
            className="flex flex-col items-center justify-between rounded-[18px] sm:rounded-[20px] p-6 sm:p-7 lg:p-8 text-center shadow-sm transition hover:shadow-md"
            style={{
              background: C.white,
              border: `2px solid ${C.geyser}`,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="flex size-14 items-center justify-center">
                <Image
                  src={IMAGES.ecosystem.zoikoMediaCorp}
                  alt="Zoiko Media Corp"
                  width={38}
                  height={38}
                  className="size-[38px] object-contain"
                />
              </div>

              <h3
                className="mt-3.5 sm:mt-4 text-base sm:text-lg lg:text-[20px] font-bold leading-snug sm:leading-[26px]"
                style={{ color: C.firefly }}
              >
                Zoiko Media Corp
              </h3>

              <p
                className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-[16px] font-normal leading-relaxed sm:leading-[26px]"
                style={{ color: C.nevada }}
              >
                Parent company connecting animal-focused platforms with shared values
                of trust, welfare, and responsibility.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-2">
              <Link
                href="/about-us"
                className="text-sm sm:text-base font-semibold transition hover:underline"
                style={{ color: C.mosque }}
              >
                Company info →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
