import Image from "next/image";
import { Check } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";

const POINTS = [
  "Real-time moderation and report/block/mute tools during live sessions.",
  "Recording status and consent notice are shown before you join — never buried.",
  "Age-appropriate defaults for chat, recording, and attendee visibility on youth-sensitive events.",
  "Fundraisers show beneficiary verification, fees, and refund policy before you donate.",
  "External links are checked for reputation risk and never auto-open.",
  "Protected rescue and wildlife locations are never exposed in event details, chat, or replays.",
] as const;

export default function SafetySection() {
  return (
    <section className="pt-12 sm:pt-16">
      <h2 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
        Safety &amp; expectations
      </h2>
      <p className="text-xs leading-5" style={{ color: C.muted }}>
        What to expect before you RSVP — the same for every event.
      </p>

      <div
        className="mt-6 grid items-center gap-8 rounded-3xl p-5 sm:p-8 lg:grid-cols-[minmax(0,552px)_1fr] lg:p-8"
        style={{ background: C.panel, border: `1px solid ${C.line}` }}
      >
        <div className="relative aspect-[552/434] w-full overflow-hidden rounded-2xl">
          <Image
            src="/events-online/safety.webp"
            alt="A tiger and a lion resting side by side behind a railing"
            fill
            sizes="(min-width: 1024px) 552px, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <ul className="flex flex-col gap-3">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm leading-5" style={{ color: C.inkDeep }}>
                <Check size={14} strokeWidth={2.5} className="mt-[3px] shrink-0" style={{ color: C.brand }} />
                {p}
              </li>
            ))}
          </ul>
          <a
            href={APP_LINKS.safety}
            className="mt-6 inline-block rounded-xl bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            Read community standards
          </a>
        </div>
      </div>
    </section>
  );
}
