import Image from "next/image";
import { C } from "./theme";

const STEPS = [
  { label: "Create:", text: "Set event details, date, location, and capacity in minutes" },
  { label: "Promote:", text: "Share with your community and reach supporters across the platform" },
  { label: "Manage:", text: "Track RSVPs, send updates, and coordinate logistics" },
  { label: "Measure:", text: "See attendance, engagement, and real impact metrics" },
  { label: "Follow up:", text: "Share photos, celebrate outcomes, and engage attendees post-event" },
];

/** "Organizing Events Made Simple" — labelled workflow steps beside a product photo. */
export default function OrganizingEventsMadeSimple() {
  return (
    <section className="w-full px-4 py-12 sm:px-8 sm:py-16 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div
        className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-8 rounded-[28px] bg-gradient-to-br from-white to-[#eef8f9] p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-12"
      >
        <div className="flex flex-col items-start gap-5">
          <h2 className="font-jakarta text-2xl font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl" style={{ color: C.ink }}>
            Organizing Events Made Simple
          </h2>
          <p className="text-base leading-7 sm:text-[17px]" style={{ color: C.muted }}>
            See how community organizers use Zoiko Social to coordinate rescue missions, adoption events, and volunteer
            initiatives across their region.
          </p>
          <div className="flex w-full flex-col gap-4 py-3">
            {STEPS.map((step) => (
              <div
                key={step.label}
                className="rounded-xl border-l-[3px] bg-white p-4 text-sm"
                style={{ borderColor: C.orange }}
              >
                <span className="font-bold" style={{ color: C.ink }}>
                  {step.label}
                </span>{" "}
                <span style={{ color: C.ink }}>{step.text}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="rounded-xl px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: C.brand }}
          >
            Learn More About Events
          </button>
        </div>

        <div className="relative h-[220px] w-full overflow-hidden rounded-[28px] sm:h-[300px] lg:h-[380px]">
          <Image
            src="/platform-features/event-coordination.webp"
            alt="Event coordination interface showing attendee management"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
