import Link from "next/link";
import { BadgeCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { C } from "./theme";

const CARDS = [
  {
    icon: ShieldCheck,
    title: "How We Verify",
    body: "What rescue and shelter verification checks, and what it does not guarantee.",
    /* The app's adoption docs cover the verification process; there is no
       page for it on this site. */
    href: appUrl("/docs/adoption-and-lost-found"),
  },
  {
    icon: BadgeCheck,
    title: "Adoption Safety",
    body: "Guidance for a safer meeting, application, and transfer process.",
    href: "/adopt-adoption-safety",
  },
  {
    icon: ShieldAlert,
    title: "Report a Concern",
    body: "Flag a listing, organization, or interaction that doesn't seem right.",
    href: APP_LINKS.safety,
  },
] as const;

/** The three trust-and-safety entry points that close the page. */
export default function TrustSafety() {
  return (
    <section className="pt-11">
      <h2 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
        Trust &amp; safety
      </h2>
      <p className="pt-[3px] text-sm leading-5" style={{ color: C.muted }}>
        These stay reachable everywhere in Adopt — never hidden behind the
        promotional module.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {CARDS.map(({ icon: Icon, title, body, href }) => (
          <Link
            key={title}
            href={href}
            className="flex items-start gap-3 rounded-[20px] bg-white p-4 transition hover:shadow-[0px_2px_10px_0px_rgba(7,59,71,0.08)]"
            style={{ border: `1px solid ${C.line}` }}
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: C.chip }}
            >
              <Icon size={16} strokeWidth={1.5} style={{ color: C.brand }} aria-hidden />
            </span>
            <span className="flex flex-col gap-1.5">
              <span className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                {title}
              </span>
              <span className="text-xs leading-5" style={{ color: C.muted }}>
                {body}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
