import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20 lg:py-20 xl:px-28">
        <div className="flex w-full flex-col items-center justify-center gap-10 lg:flex-row lg:gap-12">
          
          {/* Left Content */}
          <div className="flex w-full max-w-[591px] flex-col items-start justify-center gap-4">
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-[#073B47] sm:text-5xl lg:text-6xl lg:leading-[64.4px]">
              Appeal an
              <br />
              enforcement decision
            </h1>

            <p className="max-w-[591px] pb-2 text-base font-normal leading-7 text-[#46636A] sm:pb-4 sm:text-lg lg:pb-6">
              If we took action on your account or content, you have the
              right to appeal. Our review process is fair, transparent, and
              handled by a fresh team of moderators who will look at your
              case with fresh eyes.
            </p>

            <Link
              href="#start-appeal"
              className="inline-flex items-center justify-center rounded-xl bg-[#00AFC7] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Start an Appeal
            </Link>
          </div>

          {/* Direct Image — NO BOX / NO SHADOW */}
          <Image
            src="/appeals/hero.png"
            alt="Appeal an enforcement decision"
            width={591}
            height={480}
            priority
            className="block h-auto w-full max-w-[591px] rounded-3xl object-cover lg:h-[480px]"
          />
        </div>
      </div>
    </section>
  );
}