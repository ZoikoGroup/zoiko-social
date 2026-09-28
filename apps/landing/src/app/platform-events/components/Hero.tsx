import Image from "next/image";
import { APP_EVENTS_URL } from "./content";
import { C, CARD_SHADOW } from "./theme";

// Color tokens from Figma
const MOSQUE_COLOR = "#066879";
const NEVADA_COLOR = "#646E73";

/**
 * The design places the photo to the right of the copy on one row.
 */
export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-12 lg:py-24">
        {/* Copy Column */}
        <div className="flex flex-1 flex-col items-start gap-4">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: C.warm }}
          >
            EVENTS
          </p>

          {/* Heading with Mosque color */}
          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[52px] lg:leading-[1.15]"
            style={{ color: MOSQUE_COLOR }}
          >
            Discover animal events near
            <br />
            you
          </h1>

          {/* Description with Nevada color */}
          <p
            className="text-base leading-7"
            style={{ color: NEVADA_COLOR }}
          >
            Find adoption drives, rescue fundraisers, training workshops,
            <br />
            community gatherings, and animal welfare events hosted by trusted
            <br />
            organizations in your area.
          </p>

          {/* Buttons: 344px width x 42px height */}
          <div className="flex w-full flex-col gap-4 pt-3 sm:flex-row">
            <a
              href={APP_EVENTS_URL}
              className="flex h-[42px] w-full items-center justify-center rounded-xl text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-[344px]"
              style={{ background: MOSQUE_COLOR }}
            >
              Browse Events
            </a>
            <a
              href={APP_EVENTS_URL}
              className="flex h-[42px] w-full items-center justify-center rounded-xl bg-white text-center text-sm font-semibold transition hover:bg-neutral-50 sm:w-[344px]"
              style={{ color: MOSQUE_COLOR, border: `1px solid ${C.line}` }}
            >
              Create Event
            </a>
          </div>
        </div>

        {/* Photo Card: 472px x 394px */}
        <div className="w-full shrink-0 lg:w-[472px]">
          <div
            className="relative h-[340px] w-full overflow-hidden rounded-[24px] sm:h-[394px] lg:h-[394px] lg:w-[472px]"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <Image
              src="/platform-events/ii.png"
              alt="A dog leaping over an agility hurdle at an outdoor event"
              fill
              priority
              sizes="(min-width: 1024px) 472px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}