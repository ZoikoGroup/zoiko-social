import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/how-moderation-works/bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      {/* Content */}
      <div className="relative flex min-h-[384px] w-full flex-col items-center justify-center bg-[#073B47]/20 px-6 py-16 sm:px-8 lg:px-20 xl:px-28">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-4">
          {/* Heading */}
          <h1 className="w-full text-center font-['Plus_Jakarta_Sans'] text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl lg:leading-[64.4px]">
            How moderation works
          </h1>

          {/* Description */}
          <p className="w-full max-w-[830px] pb-4 text-center font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-white sm:text-lg">
            Moderation is a human process supported by technology. We combine
            AI detection, expert judgment, appeals, and continuous improvement
            to keep Zoiko safe and fair.
          </p>

          {/* CTA */}
          <Link
            href="/community-standards"
            className="inline-flex items-center justify-center rounded-xl bg-[#00AFC7] px-5 py-3 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Read Community Standards
          </Link>
        </div>
      </div>
    </section>
  );
}