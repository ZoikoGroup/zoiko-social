import Link from "next/link";
import { MapPin, Shield, TriangleAlert } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { REGION } from "./events";
import { C, CTA_GRADIENT } from "./theme";

const WRAP = "mx-auto max-w-[1280px] px-4 sm:px-6";

export function EverythingBox() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className={WRAP}>
        <div
          className="flex flex-col gap-5 rounded-[20px] p-6 sm:p-8 md:flex-row md:items-center md:justify-between"
          style={{ background: C.chip, border: `1px solid ${C.line}` }}
        >
          <div>
            <p className="text-lg font-extrabold" style={{ color: C.ink }}>
              That&apos;s everything eligible in {REGION} right now.
            </p>
            <p className="mt-1 text-sm" style={{ color: C.muted }}>
              Nothing that fits? Explore another region temporarily, or check
              what&apos;s coming up further out.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={appUrl("/events")}
              className="rounded-xl bg-white px-5 py-2.5 text-center text-sm font-bold transition hover:bg-neutral-50"
              style={{ color: C.ink, border: `1px solid ${C.line}` }}
            >
              Explore another region
            </a>
            <Link
              href="/events-upcoming"
              className="rounded-xl px-5 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              View Upcoming
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const SAFETY = [
  {
    icon: MapPin,
    title: "Coarse region, by design",
    body: "Your region comes from what you set — never from device GPS or attendee coordinates.",
  },
  {
    icon: Shield,
    title: "Venue details, protected",
    body: "Rescues, foster homes and wildlife sites stay broadened or hidden until you’re eligible to attend.",
  },
  {
    icon: TriangleAlert,
    title: "Report an event",
    body: "Every listing has a direct report route. Reports never appear as public accusations.",
  },
] as const;

export function SafetyCards() {
  return (
    <section className="py-14 sm:py-20" style={{ background: C.panel }}>
      <div className={WRAP}>
        <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
          Locality, handled safely
        </h2>
        <p className="mt-1.5 max-w-[540px] text-base leading-6" style={{ color: C.muted }}>
          How region matching, venue privacy and youth safety work together on
          Near You.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {SAFETY.map(({ icon: Icon, title, body }) => (
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

/**
 * Items with their own landing page link there; the app has one /events page
 * and no filtered views, so the rest point there rather than at a URL that
 * would 404.
 */
const MORE: readonly { title: string; note: string; href: string }[] = [
  { title: "This Weekend", note: "The next few days only", href: "/events-this-weekend" },
  { title: "Upcoming", note: "A broader planning horizon", href: "/events-upcoming" },
  { title: "Online Events", note: "Attend from anywhere", href: "/events-online" },
  { title: "Community Meetups", note: "Recurring local groups", href: "/events-community-meetups" },
  { title: "Training & Workshops", note: "Professional-led sessions", href: "/events-training-workshops" },
  { title: "Fundraisers", note: "Support a cause directly", href: "/events-fundraisers" },
  { title: "Rescue Events", note: "Adoption days and intake drives", href: "/events-rescue" },
  { title: "Host an event", note: "For approved organizers", href: appUrl("/events") },
];

export function MoreLinks() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className={WRAP}>
        <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
          Looking for something else?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MORE.map((l) => (
            <Link
              key={l.title}
              href={l.href}
              className="rounded-2xl bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-[0px_8px_24px_0px_rgba(7,59,71,0.08)]"
              style={{ border: `1px solid ${C.line}` }}
            >
              <span className="block text-sm font-bold" style={{ color: C.ink }}>
                {l.title}
              </span>
              <span className="mt-0.5 block text-xs" style={{ color: C.muted }}>
                {l.note}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RegionCTA() {
  return (
    <section className="py-14 sm:py-20" style={{ background: C.panel }}>
      <div className={WRAP}>
        <div
          className="flex flex-col gap-6 rounded-[28px] p-6 text-white sm:gap-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
          style={{ background: CTA_GRADIENT }}
        >
          <div className="max-w-[520px]">
            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              Set your region once, and Near You does the rest.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
              Join free to save events, get material-change alerts, and follow
              the organizers you trust.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={APP_LINKS.signUp}
              className="rounded-xl px-6 py-3 text-center text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: C.warmBright }}
            >
              Join Free
            </a>
            <Link
              href="/communities-all"
              className="rounded-xl border border-white/40 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              Explore Communities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
