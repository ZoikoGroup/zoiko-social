import Link from "next/link";
import { appUrl } from "@/lib/app-links";
import { C } from "./theme";

/**
 * Items with their own landing page link there; the app has one /events page
 * and no filtered views, so the rest point there rather than at a URL that
 * would 404.
 */
const LINKS: readonly { title: string; note: string; href: string }[] = [
  { title: "Upcoming", note: "Further out than this weekend", href: "/events-upcoming" },
  { title: "Near You", note: "Local, beyond the weekend window", href: "/events-near-you" },
  { title: "Online Events", note: "Attend from anywhere", href: "/events-online" },
  { title: "Community Meetups", note: "Recurring local groups", href: "/events-community-meetups" },
  { title: "Training & Workshops", note: "Professional-led sessions", href: "/events-training-workshops" },
  { title: "Fundraisers", note: "Support a cause directly", href: "/events-fundraisers" },
  { title: "Rescue Events", note: "Adoption days and intake drives", href: "/events-rescue" },
  { title: "Host an event", note: "For approved organizers", href: appUrl("/events") },
];

export default function MoreLinks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
          Looking for something else?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map((l) => (
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
