import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#064E52] py-14 sm:bg-[#0C2A28] sm:py-28 md:py-32 lg:py-36">
      {/* Background Image with Dark Overlay (Desktop only as shown in mobile design) */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src="/zoiko Social-Trust&Safety-protecting-under-18s/zupu1.png"
          alt="Young people standing together in a circle"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        {/* Dark tinted overlay for desktop image */}
        <div className="absolute inset-0 bg-[#061B1A]/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-[44px] lg:text-[48px] lg:leading-[1.2]">
          Safety is a Partnership
        </h1>

        <p className="mt-3.5 max-w-[720px] text-[13px] font-normal leading-relaxed text-white/90 sm:mt-4 sm:text-base sm:leading-7 md:text-[17px]">
          At Zoiko Social, we&apos;re committed to protecting young people through
          clear rules, accessible support, and transparent moderation. You
          belong here.
        </p>

        {/* Action Buttons: Stacked full-width with orange CTA on mobile; inline teal on desktop */}
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href="/communities-all"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#EA8A1A] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#D47B12] sm:w-auto sm:bg-[#006D77] sm:hover:bg-[#005B63]"
          >
            Explore Community
          </Link>

          <Link
            href="/safety-how-moderation-works"
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#006D77] shadow-sm transition hover:bg-gray-100 sm:w-auto"
          >
            Learn Our Approach
          </Link>
        </div>
      </div>
    </section>
  );
}
