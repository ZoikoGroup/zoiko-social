import Image from "next/image";
import { IMG, REPORT_URL } from "./content";
import { C } from "./theme";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-8 sm:py-20 lg:px-16 xl:px-28">
      <Image src={`${IMG}hero.webp`} alt="" fill priority sizes="100vw" className="object-cover" />
      {/* The photo ships with its overlay baked in; this extra wash keeps the
          copy readable where narrow screens crop into its lighter side. */}
      <div className="absolute inset-0 bg-[rgba(8,51,68,0.35)] md:bg-transparent" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Safety / Get Help</p>
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl sm:leading-[57.6px]">
          Animal welfare concerns
        </h1>
        <p className="max-w-[620px] pt-2.5 text-base leading-7 text-white/95">
          Report suspected mistreatment or neglect. Your report helps protect animals in our community. Reporting is
          free and available without an account.
        </p>
        <div className="flex flex-col gap-3 pt-5 min-[400px]:flex-row min-[400px]:flex-wrap sm:gap-4">
          <a
            href={REPORT_URL}
            className="rounded-xl bg-white px-5 py-3 text-center text-sm font-bold transition hover:bg-neutral-50"
            style={{ color: C.brand, border: `1px solid ${C.line}` }}
          >
            Report Now
          </a>
          <a
            href="#concern-types"
            className="rounded-xl border border-white px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
          >
            Learn what to report
          </a>
        </div>
      </div>
    </section>
  );
}
