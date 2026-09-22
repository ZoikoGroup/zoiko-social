import Link from "next/link";
import { BadgeCheck, Heart, Lock, MessageSquareText, Shield, Users } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";

const TRUST = [
  {
    icon: MessageSquareText,
    title: "Code of conduct",
    body: "Every meetup follows Zoiko Social’s community standards. Organizers may add reasonable additional expectations.",
  },
  {
    icon: Heart,
    title: "Bringing an animal? Read the rules first",
    body: "Organizers state species, handling, environment, and safety requirements — never assumed from event photos.",
  },
  {
    icon: Lock,
    title: "Venue & location privacy",
    body: "Exact details are shown only according to the event’s approved visibility rules — sometimes only after RSVP or approval.",
  },
  {
    icon: Users,
    title: "Youth & family participation",
    body: "Age policy is set by the organizer and shown clearly — never inferred from a meetup’s title or description.",
  },
  {
    icon: BadgeCheck,
    title: "Trust signals, kept separate",
    body: "Organizer identity, community affiliation, professional status, and sponsorship are shown as distinct signals — never merged into one “verified” badge.",
  },
  {
    icon: Shield,
    title: "Report this event or a safety concern",
    body: "Available from every meetup, whether you’re attending or just browsing.",
    link: { label: "Report a concern >", href: APP_LINKS.safety },
  },
] as const;

export function TrustPanel() {
  return (
    <section
      className="mt-16 rounded-3xl p-5 sm:p-8"
      style={{ background: C.chip, border: `1px solid ${C.line}` }}
    >
      <h2 className="flex items-center gap-2.5 text-lg font-extrabold sm:text-xl" style={{ color: C.ink }}>
        <Shield size={18} strokeWidth={2} />
        Trust &amp; participation
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TRUST.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.title} className="rounded-[20px] bg-white p-5" style={{ border: `1px solid ${C.line}` }}>
              <span
                className="flex size-9 items-center justify-center rounded-lg"
                style={{ background: C.chip, color: C.inkDeep }}
              >
                <Icon size={15} strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-sm font-bold" style={{ color: C.ink }}>
                {t.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5" style={{ color: C.muted }}>
                {t.body}
              </p>
              {"link" in t && (
                <a
                  href={t.link.href}
                  className="mt-3 inline-block text-xs font-bold hover:underline"
                  style={{ color: C.brand }}
                >
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

/**
 * Items with their own landing page link there; the app has one /events page
 * and no filtered views, so the rest point there rather than at a URL that
 * would 404.
 */
const BROWSE: readonly { title: string; note: string; href: string }[] = [
  { title: "This Weekend", note: "Meetups happening in the next few days.", href: "/events-this-weekend" },
  { title: "Upcoming", note: "Everything scheduled, further out.", href: "/events-upcoming" },
  { title: "Near You", note: "Meetups close to your set region.", href: "/events-near-you" },
  { title: "Online Events", note: "Virtual gatherings and webinars.", href: "/events-online" },
  { title: "Training", note: "Skill-building classes and workshops.", href: "/events-training-workshops" },
  { title: "Fundraisers", note: "Events supporting animal welfare causes.", href: "/events-fundraisers" },
  { title: "Rescue Events", note: "Adoption days and rescue-led gatherings.", href: "/events-rescue" },
];

export function BrowseAnotherWay() {
  return (
    <section className="pt-16">
      <h2 className="text-center text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
        Browse another way
      </h2>
      <div className="grid grid-cols-1 gap-3 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {BROWSE.map((b) => (
          <Link
            key={b.title}
            href={b.href}
            className="rounded-xl bg-white px-4 py-3.5 transition hover:-translate-y-0.5 hover:shadow-[0px_8px_24px_0px_rgba(7,59,71,0.08)]"
            style={{ border: `1px solid ${C.line}` }}
          >
            <span className="block text-sm font-bold" style={{ color: C.ink }}>
              {b.title}
            </span>
            <span className="mt-0.5 block text-xs" style={{ color: C.muted }}>
              {b.note}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
