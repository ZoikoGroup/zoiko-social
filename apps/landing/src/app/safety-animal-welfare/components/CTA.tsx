import Image from "next/image";
import { APP_LINKS } from "@/lib/app-links";
import { IMG, REPORT_URL } from "./content";

export default function CTA() {
  return (
    <section className="bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-28">
      <div className="relative mx-auto max-w-[1236px] overflow-hidden rounded-3xl">
        <Image src={`${IMG}cta.webp`} alt="" fill sizes="(min-width: 1280px) 1236px, 100vw" className="object-cover" />
        {/* Extra wash for narrow screens, where the crop lands on the lighter
            middle of the photo. */}
        <div className="absolute inset-0 bg-[rgba(8,51,68,0.35)] md:bg-transparent" />
        <div className="relative flex flex-col items-center gap-4 px-5 py-12 text-center sm:px-12 sm:py-16 md:min-h-[362px] md:justify-center">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            Help protect animals in our community
          </h2>
          <p className="max-w-[640px] text-base leading-7 text-white/90">
            Your report helps keep animals safe. All reports are reviewed by specialists trained in animal welfare
            concerns.
          </p>
          <div className="flex w-full flex-col gap-3 pt-3 min-[400px]:w-auto min-[400px]:flex-row sm:gap-4">
            <a
              href={REPORT_URL}
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-cyan-800 transition hover:bg-neutral-50"
            >
              Start Report
            </a>
            <a
              href={APP_LINKS.safety}
              className="rounded-xl border border-white px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
