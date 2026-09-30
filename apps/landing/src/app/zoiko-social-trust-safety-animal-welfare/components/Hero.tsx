import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0C2A28] py-14 sm:py-28 md:py-32 lg:py-36">
      {/* Desktop Background: zuaw1.png (Hidden on mobile) */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src="/zoiko Social-trust&Safety-animal-welfare/zuaw1.png"
          alt="Woman with dogs and horse in a grassy field"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark tinted overlay for desktop image */}
        <div className="absolute inset-0 bg-[#061B1A]/70" />
      </div>

      {/* Mobile Background: zuaw7.jpg (Hidden on desktop) */}
      <div className="absolute inset-0 z-0 sm:hidden">
        <Image
          src="/zoiko Social-trust&Safety-animal-welfare/zuaw7.jpg"
          alt="Snowy mountain peaks landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Teal tinted gradient overlay matching mobile reference */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B8291]/80 via-[#2A6E7D]/85 to-[#145866]/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 text-center sm:px-6 lg:px-8">
        <h1 className="max-w-[280px] text-2xl font-bold tracking-tight text-white sm:max-w-3xl sm:text-4xl md:text-[44px] lg:text-[48px] lg:leading-[1.2]">
          Animal Welfare at the Heart of Everything
        </h1>

        <p className="mt-3.5 max-w-[300px] text-xs font-normal leading-relaxed text-white/90 sm:mt-4 sm:max-w-[640px] sm:text-base sm:leading-7 md:text-[17px]">
          Zoiko Social is built on trust. We protect animals and empower
          communities to make the difference in the world.
        </p>

        {/* Action Buttons: Stacked full-width with orange CTA on mobile; inline teal on desktop */}
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href="/communities-all"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#E88924] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#D47B12] sm:w-auto sm:rounded-full sm:bg-[#006D77] sm:py-3 sm:hover:bg-[#005B63]"
          >
            Join the Community
          </Link>

          <Link
            href="/safety-how-moderation-works"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-7 py-3 text-sm font-semibold text-[#145866] shadow-sm transition hover:bg-gray-100 sm:w-auto sm:rounded-full sm:text-[#006D77] sm:py-3"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
