import { BadgeCheck, DollarSign, Heart, Lock, MessageSquareText, Shield } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { C } from "./theme";

const TRUST = [
  {
    icon: BadgeCheck,
    title: "Organizer verification",
    body: "Confirms approved identity information — not a guarantee of event outcome or future conduct.",
  },
  {
    icon: MessageSquareText,
    title: "Rescue relationship, shown honestly",
    body: "A verified rescue/beneficiary relationship is a separate signal from organizer identity — never merged into one badge.",
  },
  {
    icon: Lock,
    title: "Venue & location privacy",
    body: "Exact details are shown only according to the event’s approved visibility rules — sometimes only after RSVP.",
  },
  {
    icon: Heart,
    title: "Animal welfare comes first",
    body: "Adoptable and demo animals follow welfare-first handling and environment conditions set by the organizer.",
  },
  {
    icon: DollarSign,
    title: "Fundraisers, clearly labeled",
    body: "An authorized fundraising component is shown as its own separate, honest label — never implied by event trust alone.",
  },
  {
    icon: Shield,
    title: "Report an event or safety concern",
    body: "Available on every listing — content, animal-welfare, and organizer concerns route to the right team.",
    link: { label: "Report a concern >", href: APP_LINKS.safety },
  },
] as const;

export function TrustPanel() {
  return (
    <section className="mt-16 rounded-3xl p-5 sm:p-8" style={{ background: C.chip, border: `1px solid ${C.line}` }}>
      <h2 className="flex items-center gap-2.5 text-lg font-extrabold sm:text-xl" style={{ color: C.ink }}>
        <Shield size={18} strokeWidth={2} />
        Trust &amp; safety
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TRUST.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.title} className="rounded-[20px] bg-white p-5" style={{ border: `1px solid ${C.line}` }}>
              <span className="flex size-9 items-center justify-center rounded-lg" style={{ background: C.chip, color: C.inkDeep }}>
                <Icon size={15} strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-sm font-bold" style={{ color: C.ink }}>
                {t.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5" style={{ color: C.muted }}>
                {t.body}
              </p>
              {"link" in t && (
                <a href={t.link.href} className="mt-3 inline-block text-xs font-bold hover:underline" style={{ color: C.brand }}>
                  {t.link.label}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function RepresentRescue() {
  return (
    <div
      className="mt-16 flex flex-col gap-4 rounded-[20px] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
      style={{ border: `1px dashed ${C.line}` }}
    >
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl" style={{ background: C.chip, color: C.inkDeep }}>
          <Heart size={18} strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-bold" style={{ color: C.ink }}>
            Represent a rescue or shelter?
          </p>
          <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
            List an adoption day, rescue drive, or foster-support event.
            Organizer and rescue-relationship verification are reviewed
            separately from event publishing.
          </p>
        </div>
      </div>
      <a
        href={appUrl("/events")}
        className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold transition hover:bg-neutral-50"
        style={{ color: C.ink, border: `1px solid ${C.line}` }}
      >
        List a Rescue Event
      </a>
    </div>
  );
}
