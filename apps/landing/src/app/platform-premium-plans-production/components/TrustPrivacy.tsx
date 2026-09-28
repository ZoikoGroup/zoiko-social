import Image from "next/image";

// Figma color tokens
const INK_COLOR = "#073B47";

/**
 * "Trust, Privacy & Security" — Closing banner matching Figma background & brightness.
 */
export default function TrustSecurityBanner() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-28 lg:py-20">
      <div className="relative mx-auto flex min-h-[340px] w-full max-w-[1280px] flex-col items-center justify-center overflow-hidden rounded-[32px] px-6 py-14 text-center sm:px-12 sm:py-16">
        {/* Background Photo */}
        <Image
          src="/platform-premium-plans-production/io.png"
          alt="Trust, Privacy & Security"
          fill
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover object-center"
        />

        {/* Lighter Gradient Overlay to reduce the heavy blue shade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#073B47]/50 via-[#073B47]/30 to-[#073B47]/50" />

        {/* Content */}
        <div className="relative z-10 flex max-w-2xl flex-col items-center gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Trust, Privacy & Security
          </h2>
          <p className="text-sm font-normal leading-6 text-white/95 sm:text-base sm:leading-7">
            All Premium transactions are secured with bank-level encryption. Your payment
            <br className="hidden sm:inline" />
            data is never stored on our servers.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <a
              href="/privacy"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-bold shadow-sm transition hover:bg-white/90"
              style={{ color: INK_COLOR }}
            >
              Privacy Policy
            </a>
            <a
              href="/security"
              className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Security Policy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}