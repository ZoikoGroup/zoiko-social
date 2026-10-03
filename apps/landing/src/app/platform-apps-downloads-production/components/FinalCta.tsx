import Image from "next/image";
import Link from "next/link";

/**
 * Closing CTA — "Ready to join the Zoiko Social community?" matching Figma.
 */
export default function FinalCta() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-28">
      <div className="relative mx-auto flex min-h-[340px] w-full max-w-[1230px] flex-col items-center justify-center overflow-hidden rounded-[32px] px-6 py-14 text-center sm:px-12 sm:py-20">
        {/* Background Photo */}
        <Image
          src="/platform-apps-downloads-production/Background+Shadow (2).png"
          alt="Ready to join the Zoiko Social community?"
          fill
          priority
          sizes="(min-width: 1230px) 1230px, 100vw"
          className="object-cover object-center"
        />

        {/* Content */}
        <div className="relative z-10 flex max-w-4xl flex-col items-center gap-4">
          {/* Heading — strictly 1 line only */}
          <h2 className="whitespace-normal text-2xl font-extrabold tracking-tight text-white sm:whitespace-nowrap sm:text-3xl lg:text-4xl">
            Ready to join the Zoiko Social community?
          </h2>

          {/* Subtitle with exact 2-line break */}
          <p className="max-w-[620px] text-sm font-normal leading-6 text-white/95 sm:text-base sm:leading-7">
            Download the official app now and start exploring communities, discovering
            <br />
            animal stories, and connecting with animal lovers worldwide.
          </p>

          {/* Download Button */}
          <div className="pt-3">
            <Link
              href="#official-apps"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-bold text-[#073B47] shadow-sm transition hover:bg-white/90"
            >
              Download Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}