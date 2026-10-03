import Image from "next/image";
import { APP_EVENTS_URL, HOSTING_POINTS } from "./content";
import { C, CARD_SHADOW } from "./theme";

/** "Host an event on Zoiko Social" — copy and ✓ rows beside a photo card. */
export default function HostAnEvent() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        {/* Main Section Header */}
        <div className="flex flex-col gap-2.5">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: C.ink }}
          >
            Host an event on Zoiko Social
          </h2>
          <p className="text-base leading-7" style={{ color: C.muted }}>
            Are you an organization interested in hosting an event on Zoiko
            Social? Let&rsquo;s work together.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-[39px]">
          {/* Left Column */}
          <div className="flex flex-col items-start gap-5">
            <div className="flex flex-col gap-3">
              <h3
                className="text-xl font-bold"
                style={{ color: C.warm }}
              >
                Get your event in front of the right community
              </h3>

              {/* Description matching Figma <br /> breaks */}
              <p className="text-base leading-7" style={{ color: C.muted }}>
                Zoiko Social reaches thousands of animal lovers, rescue professionals,
                <br />
                and community members actively looking for events and ways to
                <br />
                participate.
              </p>
            </div>

            {/* Checklist with tick marks */}
            <div className="flex flex-col gap-3.5 py-2">
              {HOSTING_POINTS.map((p) => (
                <div key={p} className="flex items-center gap-2.5 text-base">
                  <span
                    className="text-base font-bold leading-none"
                    style={{ color: C.brand }}
                  >
                    ✓
                  </span>
                  <span style={{ color: C.ink }}>
                    {p.replace(/^[✓✔\s]+/, "")}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href={APP_EVENTS_URL}
                className="inline-flex w-fit items-center rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                style={{ background: C.brand }}
              >
                Learn about event hosting
              </a>
            </div>
          </div>

          {/* Right Column: Photo Card shifted left by an additional 50px (total 78px) */}
          <div className="w-full lg:-translate-x-[78px]">
            <div
              className="relative h-[360px] w-full overflow-hidden rounded-[24px] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.14)] sm:h-[400px] lg:h-[420px]"
              style={{ boxShadow: CARD_SHADOW }}
            >
              <Image
                src="/platform-events/yy.png"
                alt="An organization team planning an event around a laptop"
                fill
                priority
                sizes="(min-width: 1024px) 591px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}