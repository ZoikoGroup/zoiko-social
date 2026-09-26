import Image from "next/image";
import { APP_EVENTS_URL } from "./content";
import { C } from "./theme";

// Figma color tokens from inspect panel
const ATHENS_GRAY_BG = "#F7F8F9"; // Background: Athens Gray
const BORDER_COLOR = "#06687929";  // Border: #06687929
const NEVADA_COLOR = "#646E73";   // Text: Nevada
const AZURE_42_COLOR = "#5B7178"; // Text: azure-42

/** The highlighted event card under the hero. */
export default function FeaturedEvent() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6">
      {/* Featured Card: Athens Gray Background & #06687929 Border */}
      <div
        className="flex flex-col items-center gap-6 rounded-[24px] p-6 sm:p-8 md:flex-row md:items-center md:gap-8"
        style={{
          backgroundColor: ATHENS_GRAY_BG,
          border: `1px solid ${BORDER_COLOR}`,
        }}
      >
        {/* Left Thumbnail */}
        <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-[20px] sm:h-[190px] md:w-[280px]">
          <Image
            src="/platform-events/io.png"
            alt="A rescue dog resting in the grass at an adoption fair"
            fill
            sizes="(min-width: 768px) 280px, 100vw"
            className="object-cover"
          />
        </div>

        {/* Right Info Column */}
        <div className="flex flex-1 flex-col gap-2.5">
          <h2
            className="text-xl font-bold leading-tight"
            style={{ color: C.brand }}
          >
            Spring Adoption &amp; Community Fair
          </h2>

          {/* Date & Time (Nevada) */}
          <p
            className="flex items-center text-sm font-medium leading-6"
            style={{ color: NEVADA_COLOR }}
          >
            <Image
              src="/platform-events/📅.png"
              alt=""
              width={16}
              height={16}
              className="mr-1.5 inline-block shrink-0"
            />
            April 15, 2024 • 10:00 AM – 3:00 PM
          </p>

          {/* Location (Nevada) */}
          <p
            className="flex items-center text-sm font-medium leading-6"
            style={{ color: NEVADA_COLOR }}
          >
            <Image
              src="/platform-events/📍.png"
              alt=""
              width={16}
              height={16}
              className="mr-1.5 inline-block shrink-0"
            />
            In-person • Central Park, New York, NY
          </p>

          {/* Description: Strictly 2 lines only */}
          <p
            className="pt-1 text-sm leading-6"
            style={{ color: NEVADA_COLOR }}
          >
            Join adoption organizations, rescue partners, and community members for a day of animal welfare education, adoption
            <br />
            consultations, and family-friendly activities. Local veterinarians and trainers available for consultations.
          </p>

          {/* Organizer (azure-42) & Learn More */}
          <p className="text-sm leading-6" style={{ color: AZURE_42_COLOR }}>
            <span className="font-bold">Organizer:</span>{" "}
            <span>Greater NY Rescue Alliance (Verified) • </span>
            <a
              href={APP_EVENTS_URL}
              className="inline-flex items-center font-semibold underline transition hover:opacity-80"
              style={{ color: C.brand }}
            >
              Learn more
              <svg
                className="ml-1 inline-block size-3.5 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.333 8h9.334M8.667 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}