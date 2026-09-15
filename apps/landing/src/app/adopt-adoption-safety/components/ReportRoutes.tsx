import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";
import { REPORT_ROUTES } from "./guidance";

/**
 * Where to take a problem. Emergency routes are drawn apart from the
 * reporting ones, because the page is explicit that a platform report is not
 * an emergency response service — so those two rows point off-platform.
 */
export default function ReportRoutes() {
  return (
    <section className="pt-16">
      <div className="mx-auto flex max-w-[640px] flex-col gap-3 text-center">
        <h2
          className="text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
          style={{ color: C.ink }}
        >
          If something goes wrong
        </h2>
        <p className="text-base leading-6" style={{ color: C.muted }}>
          Choose the right path — a platform report is not an emergency
          response service.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-[900px] flex-col gap-3">
        {REPORT_ROUTES.map((route) => (
          <div
            key={route.title}
            className="flex flex-col gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={
              route.emergency
                ? { background: C.dangerFill, border: `1px solid ${C.dangerLine}` }
                : { background: "#fff", border: `1px solid ${C.line}` }
            }
          >
            <div className="min-w-0">
              <h3 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                {route.title}
              </h3>
              <p className="text-xs leading-5" style={{ color: C.muted }}>
                {route.note}
              </p>
            </div>

            {route.emergency ? (
              // No link: the right destination is a local service, not a page
              // on this site.
              <span
                className="shrink-0 self-start rounded-lg bg-white px-3.5 py-2 text-xs font-semibold sm:self-auto"
                style={{ color: C.dangerInk, border: `1px solid ${C.dangerLine}` }}
              >
                {route.action}
              </span>
            ) : (
              <Link
                href={route.support ? APP_LINKS.docs : APP_LINKS.safety}
                className="shrink-0 self-start rounded-lg px-3.5 py-2 text-xs font-semibold transition hover:opacity-80 sm:self-auto"
                style={
                  route.support
                    ? { background: C.chip, color: C.ink }
                    : { background: "#fff", color: C.ink, border: `1px solid ${C.ink}` }
                }
              >
                {route.action}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
