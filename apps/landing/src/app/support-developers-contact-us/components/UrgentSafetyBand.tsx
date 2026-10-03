import Image from "next/image";
import { C } from "./theme";
import Link from "next/link";

/** "07 · URGENT / SAFETY BAND" — dark teal panel: "Someone in danger?" + photo. */
export default function UrgentSafetyBand() {
  return (
    <section className="w-full bg-white px-5 py-8 lg:px-[105px] lg:py-12">
      <div
        className="mx-auto grid w-full max-w-[1280px] grid-cols-1 overflow-hidden rounded-[32px] lg:grid-cols-[1.1fr_0.9fr]"
        style={{ backgroundColor: C.panelDark }}
      >
        <div className="order-2 flex flex-col items-start gap-3.5 p-7 lg:order-1 lg:p-14">
          <span className="flex items-center justify-center rounded-xl bg-white/[0.12] p-2.5">
            <Image src="/support&developers-contact-us/icon-shield.webp" alt="" width={22} height={22} />
          </span>
          <h2 className="pt-1 text-2xl font-extrabold tracking-[-0.26px] text-white lg:text-4xl lg:tracking-[-0.36px]">
            Someone in danger?
          </h2>
          <p className="max-w-[498px] text-base leading-[27.2px]" style={{ color: C.onDarkMuted }}>
            Contact your local emergency services first. To report harmful content or behavior, use the safety route.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/safety-report-concern"
              className="flex h-11 items-center gap-2 rounded-xl border border-white/45 px-5 text-[15px] font-semibold text-white"
            >
              <Image src="/support&developers-contact-us/icon-flag.webp" alt="" width={20} height={20} />
              Report a concern
            </Link>
          </div>
        </div>

        <div className="relative order-1 h-[260px] w-full overflow-hidden lg:order-2 lg:h-auto lg:min-h-[260px]">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${C.brand} 0%, ${C.orange} 100%)` }}
          />
          <Image
            src="/support&developers-contact-us/urgent-safety-photo-mobile.webp"
            alt="French bulldog puppy in a yellow sweater against a blue background"
            fill
            sizes="100vw"
            className="object-cover lg:hidden"
          />
          <Image
            src="/support&developers-contact-us/urgent-safety-photo.webp"
            alt="Dog outdoors seen from behind"
            fill
            sizes="(min-width: 1024px) 553px, 100vw"
            className="hidden object-cover lg:block"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `linear-gradient(to right, ${C.panelDark} 0%, rgba(7,59,71,0) 40%)` }}
          />
        </div>
      </div>
    </section>
  );
}
