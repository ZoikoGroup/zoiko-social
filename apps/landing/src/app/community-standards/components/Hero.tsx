import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-white px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-10 lg:flex-row lg:gap-12">
        {/* Content */}
        <div className="flex w-full flex-col items-start gap-4 lg:w-[591px]">
          <div className="flex w-full flex-col items-start">
            <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold leading-tight text-[#073B47] sm:text-5xl lg:text-6xl lg:leading-[64.4px]">
              Community standards
            </h1>
          </div>

          <div className="flex w-full flex-col items-start pb-2 sm:pb-6">
            <p className="font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A] sm:text-lg">
              Everyone on Zoiko has agreed to follow these standards. They
              protect our members and keep our communities healthy, safe, and
              inclusive. These aren&apos;t rules meant to restrict—they&apos;re
              agreements we all make to build something better together.
            </p>
          </div>

          <Link
            href="#report-violation"
            className="inline-flex items-center justify-center rounded-xl bg-[#00AFC7] px-5 py-3 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
          >
            Report a Violation
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative w-full overflow-hidden rounded-3xl lg:h-[480px] lg:w-[591px]">
          <Image
            src="/community-standards/hero.png"
            alt="Zoiko community standards"
            width={591}
            height={480}
            priority
            className="h-auto w-full rounded-3xl object-cover lg:h-[480px]"
          />
        </div>
      </div>
    </section>
  );
}