import Image from "next/image";
import { IMG } from "./content";

export default function CTA() {
  return (
    <section className="bg-white px-4 py-12 sm:px-8 sm:py-12 lg:px-16 xl:px-28">
      <div className="relative mx-auto max-w-[1230px] overflow-hidden rounded-3xl">
        <Image src={`${IMG}cta.webp`} alt="" fill sizes="(min-width: 1280px) 1230px, 100vw" className="object-cover" />
        {/* The photo ships with its overlay baked in; this extra wash keeps the
            copy readable where narrow screens crop into its lighter side. */}
        <div className="absolute inset-0 bg-[rgba(8,51,68,0.35)] md:bg-transparent" />
        <div className="relative flex max-w-[600px] flex-col items-start gap-4 px-6 py-12 sm:px-12 sm:py-16 md:min-h-[372px] md:justify-center">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-4xl">Start your healing journey today</h2>
          <p className="text-base leading-7 text-white/90">
            You deserve support. Whether professional therapy, community, self-care, or all of the above— there’s a path
            forward for you. Take the first step today.
          </p>
          <a
            href="#find-help-now"
            className="mt-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-cyan-800 transition hover:bg-neutral-50"
          >
            Find Support Now
          </a>
        </div>
      </div>
    </section>
  );
}
