import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Flag, Gauge, Lock, ShieldCheck } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { C } from "./theme";
import { ORGANIZATIONS, PRIVACY_SAFETY } from "./nearYou";

const SAFETY_ICONS = [Lock, Gauge, ShieldCheck, Flag] as const;

/** One labelled fact inside an organization card. */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-xs leading-5" style={{ color: C.muted }}>
      {label}: <span style={{ color: C.inkDeep }}>{value}</span>
    </p>
  );
}

/**
 * The two sections under the results: the verified organizations serving the
 * region, then the privacy and safety panel.
 */
export default function Organizations() {
  return (
    <>
      <section className="pt-16">
        <h2
          className="text-center text-xl font-extrabold leading-8 sm:text-2xl"
          style={{ color: C.ink }}
        >
          Verified organizations near you
        </h2>
        <p
          className="mx-auto max-w-[640px] pt-2 text-center text-sm leading-5"
          style={{ color: C.muted }}
        >
          A trusted local-source path when individual listings are limited.
        </p>

        <div className="grid grid-cols-1 gap-4 pt-8 md:grid-cols-2 xl:grid-cols-3">
          {ORGANIZATIONS.map((org) => (
            <div
              key={org.name}
              className="rounded-[20px] bg-white p-6"
              style={{ border: `1px solid ${C.line}` }}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={org.logo}
                  alt=""
                  aria-hidden
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <h3
                    className="flex items-center gap-1.5 text-[15.5px] font-bold"
                    style={{ color: C.inkDeep }}
                  >
                    {org.name}
                  </h3>
                  <p
                    className="flex items-center gap-1 pt-0.5 text-xs"
                    style={{ color: C.muted }}
                  >
                    <BadgeCheck size={12} strokeWidth={1.5} aria-hidden />
                    Verified Organization
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-4">
                <Fact label="Service area" value={org.serviceArea} />
                <Fact label="Species" value={org.species} />
                <Fact label="Active listings" value={org.activeListings} />
              </div>

              <div className="flex gap-2 pt-4">
                <Link
                  href={appUrl("/communities")}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-center text-xs font-bold"
                  style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
                >
                  Follow
                </Link>
                <Link
                  href={appUrl("/communities")}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-center text-xs font-bold"
                  style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mt-12 rounded-3xl p-6 sm:p-8"
        style={{ background: "#F1F7F8", border: `1px solid ${C.line}` }}
      >
        <h2
          className="flex items-center gap-2 text-base font-bold leading-6"
          style={{ color: C.ink }}
        >
          <ShieldCheck size={18} strokeWidth={1.5} aria-hidden />
          Privacy &amp; safety near you
        </h2>

        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-3">
          {PRIVACY_SAFETY.map(({ title, body }, i) => {
            const Icon = SAFETY_ICONS[i];
            const isReport = title === "Report a concern";
            return (
              <div
                key={title}
                className="flex flex-col gap-2 rounded-2xl bg-white p-4"
                style={{ border: `1px solid ${C.line}` }}
              >
                <Icon size={16} strokeWidth={1.5} style={{ color: C.brand }} aria-hidden />
                <h3 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                  {title}
                </h3>
                <p className="text-xs leading-5" style={{ color: C.muted }}>
                  {body}
                </p>
                {isReport ? (
                  <Link
                    href={APP_LINKS.safety}
                    className="text-xs font-bold"
                    style={{ color: C.brand }}
                  >
                    Report a Concern ›
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
