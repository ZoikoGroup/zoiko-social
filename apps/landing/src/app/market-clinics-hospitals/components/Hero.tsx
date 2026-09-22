import Image from "next/image";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";

export default function Hero() {
  return (
    <section className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16 xl:px-28" style={{ background: C.panel }}>
      <div className="relative mx-auto max-w-[1230px] overflow-hidden rounded-[32px]">
        <Image
          src="/market-clinics-hospitals/hero.webp"
          alt="A veterinarian examining a white cat in a bright clinic"
          fill
          priority
          sizes="(min-width: 1280px) 1230px, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(62deg, rgba(8,51,68,0.90) 35%, rgba(8,51,68,0.40) 85%)" }}
        />
        {/* Below lg the copy spans the whole card, including the light side of
            the photo, so darken it evenly to keep the text readable. */}
        <div className="absolute inset-0 bg-[rgba(8,51,68,0.35)] lg:hidden" />
        <div className="relative flex max-w-[811px] flex-col gap-4 px-5 py-10 sm:px-12 sm:py-16 lg:min-h-[624px] lg:justify-center lg:px-[114px]">
          <span className="self-start rounded-[20px] bg-white/20 px-3 py-1.5 text-xs font-semibold uppercase leading-5 tracking-wide text-white">
            Market / Professional Care
          </span>
          <div className="flex flex-col gap-2.5">
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl sm:leading-[51px]">
              Find clinics &amp; hospitals with clearer trust signals.
            </h1>
            <p className="max-w-[741px] text-base leading-6 text-slate-100">
              Explore clinic and hospital listings using source-approved
              facility details, multi-doctor teams, specialized services,
              verification status, and location context to find comprehensive
              pet care options in your area.
            </p>
          </div>
          <div className="grid max-w-[696px] gap-4 py-2 sm:grid-cols-2 sm:gap-6">
            <div className="flex flex-col gap-2 rounded-[20px] bg-white/10 px-4 pb-6 pt-4 sm:pb-10">
              <p className="text-xs font-bold leading-5 text-white">Verified facilities</p>
              <p className="text-xs leading-5 text-white">
                Clinics and hospitals are verified before listing.{" "}
                <a href={APP_LINKS.safety} className="underline-offset-2 hover:underline">
                  Learn about our verification standard.
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-[20px] bg-white/10 px-4 pb-6 pt-4 sm:pb-10">
              <p className="text-xs font-bold leading-5 text-white">Multi-doctor teams</p>
              <p className="text-xs leading-5 text-white">
                Explore the veterinarians and specialists on staff at each facility.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:flex-wrap">
            <a
              href={APP_LINKS.communities}
              className="flex min-h-10 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold leading-5 text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Explore communities
            </a>
            <Link
              href="/communities-all"
              className="flex min-h-10 items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold leading-5 transition hover:bg-neutral-50"
              style={{ color: C.brand, border: `1px solid ${C.line}` }}
            >
              Browse all communities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
