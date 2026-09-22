import Image from "next/image";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,632px)_minmax(0,528px)] lg:justify-between lg:gap-12 lg:px-16 xl:px-28">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase leading-5 tracking-wide" style={{ color: C.brand }}>
              Market / Professional Care
            </p>
            <h1 className="text-3xl font-extrabold leading-tight sm:leading-[48px]" style={{ color: C.inkDeep }}>
              Find veterinarians with clearer trust signals.
            </h1>
          </div>
          <p className="pt-3 text-base leading-6" style={{ color: C.ink }}>
            Explore veterinarian listings using source-approved provider
            details, verification status, location context, and care
            information so you can make a more informed next-step decision.
          </p>
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
            <a
              href="#search"
              className="flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Search veterinarians
            </a>
            <a
              href={APP_LINKS.safety}
              className="flex h-12 items-center justify-center rounded-xl bg-white px-6 text-base font-semibold transition hover:bg-neutral-50"
              style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
            >
              Understand verification
            </a>
          </div>
          <div
            className="flex flex-col gap-2 rounded-[20px] p-6"
            style={{ background: C.chip, border: `1px solid ${C.line}` }}
          >
            <p className="text-sm font-bold leading-6" style={{ color: C.brand }}>
              ✓ Verified care
            </p>
            <p className="text-sm leading-6" style={{ color: C.ink }}>
              Veterinarians are verified before they&apos;re listed on Zoiko
              Social.{" "}
              <a href={APP_LINKS.safety} className="underline-offset-2 hover:underline">
                Learn about our verification standard.
              </a>
            </p>
          </div>
        </div>

        <div className="relative aspect-[528/356] w-full overflow-hidden rounded-3xl shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)]">
          <Image
            src="/market-veterinarians/hero.webp"
            alt="A dog resting beside a basket of fresh vegetables while its owners unpack groceries"
            fill
            priority
            sizes="(min-width: 1024px) 528px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
