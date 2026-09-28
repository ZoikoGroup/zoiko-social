import { APP_EVENTS_URL } from "./content";
import { C } from "./theme";

/** The deep-teal closing banner above the global footer. */
export default function ClosingCTA() {
  return (
    <section className="bg-white px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
      <div
        className="mx-auto flex max-w-[1280px] flex-col items-center justify-center overflow-hidden rounded-[24px] bg-cover bg-center px-6 py-12 shadow-[0px_20px_48px_0px_rgba(7,59,71,0.14)] sm:px-12 sm:py-16"
        style={{ backgroundImage: `url('/platform-events/yu.png')` }}
      >
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          {/* Main Banner Heading */}
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl sm:leading-tight">
            Find your next community event
          </h2>

          {/* Description: <br /> tag directly after "and" */}
          <p className="text-sm font-normal leading-6 text-white/95 sm:text-base sm:leading-7">
            Browse upcoming events, connect with trusted organizations, and
            <br />
            join your local animal community.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <a
              href={APP_EVENTS_URL}
              className="inline-flex items-center rounded-xl bg-white px-6 py-3.5 text-center text-sm font-bold shadow-sm transition hover:bg-neutral-50 hover:opacity-95"
              style={{ color: C.brand }}
            >
              Browse all events
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}