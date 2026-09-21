import { Shield, ShieldCheck, TriangleAlert } from "lucide-react";
import { C } from "./theme";

const CARDS = [
  {
    icon: ShieldCheck,
    title: "What “Verified” means",
    body: "Verification confirms an organizer’s identity — it isn’t a quality guarantee for the event itself.",
  },
  {
    icon: Shield,
    title: "Venue details, protected",
    body: "Sensitive locations — rescues, foster homes, wildlife sites — stay hidden until you’re eligible to attend.",
  },
  {
    icon: TriangleAlert,
    title: "Report an event",
    body: "Every listing has a direct report route. Reports never appear as public accusations.",
  },
] as const;

export default function SafetyCards() {
  return (
    <section className="py-16 sm:py-20" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
          Safety is part of every listing
        </h2>
        <p className="mt-1.5 max-w-[520px] text-base leading-6" style={{ color: C.muted }}>
          How we handle organizer trust, venue privacy and reporting — before
          you ever RSVP.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-[20px] bg-white p-6 sm:p-7"
              style={{ border: `1px solid ${C.line}` }}
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ background: C.chip, color: C.brand }}
              >
                <Icon size={18} strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-base font-extrabold" style={{ color: C.ink }}>
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-5" style={{ color: C.muted }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
