import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      {/* Mobile Hero (sm:hidden) */}
      <section className="w-full bg-[#F4F8F9] px-4 pt-4 pb-6 sm:hidden">
        <div className="w-full overflow-hidden rounded-[32px] bg-gradient-to-b from-[#EAF4F6] via-white to-[#FFF5EA] px-5 py-8 shadow-sm border border-gray-100/60">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2422] leading-tight">
            A Welcoming Home <br />
            for Respectful <br />
            Conversation
          </h1>

          <p className="mt-3.5 text-xs font-normal leading-relaxed text-[#5A7371]">
            Zoiko Social is family-friendly because we believe in thoughtful
            moderation, not censorship. Strong language has context. Rules are
            clear. Community thrives on respect.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/communities-all"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#EA8A1A] py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#D47B12]"
            >
              Explore Our Community
            </Link>

            <Link
              href="#policies"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-[#006D77] bg-white py-3 text-xs font-semibold text-[#006D77] shadow-sm transition hover:bg-gray-50"
            >
              Read Full Policy
            </Link>
          </div>

          {/* Floating White Card */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-3 text-3xl">👨‍👩‍👧‍👦</div>
            <h3 className="text-sm font-bold text-[#0F2422]">For All Ages</h3>
            <p className="mx-auto mt-2 max-w-[240px] text-[11px] leading-relaxed text-[#5A7371]">
              Zoiko Social is built for families, educators, and professionals
              who want a respectful online space.
            </p>
          </div>
        </div>
      </section>

      {/* Desktop Hero (hidden sm:block - 100% UNTOUCHED) */}
      <section className="relative hidden w-full overflow-hidden bg-[#061E21] py-16 sm:block sm:py-20 md:py-24 lg:py-28">
        {/* Background Image: zupfp1.png with dark teal overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/zoiko Social-Trust&Safety-profanity-free-policy/zupfp1.png"
            alt="Diverse people smiling together in a park"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#061E21]/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Headline, Description & CTAs */}
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[50px] lg:leading-[1.18]">
                A Welcoming Home <br />
                for Respectful <br />
                Conversation
              </h1>

              <p className="mt-5 max-w-[540px] text-xs font-normal leading-relaxed text-white/90 sm:text-sm md:text-base">
                Zoiko Social is family-friendly because we believe in thoughtful
                moderation, not censorship. Strong language has context. Rules are
                clear. Community thrives on respect.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/communities-all"
                  className="inline-flex items-center justify-center rounded-full bg-[#006D77] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#005B63]"
                >
                  Explore Our Community
                </Link>

                <Link
                  href="#policies"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#006D77] shadow-sm transition hover:bg-gray-100"
                >
                  Read Full Policy
                </Link>
              </div>
            </div>

            {/* Right Column: Floating White Card */}
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-[420px] rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="relative h-48 w-full overflow-hidden rounded-2xl sm:h-56">
                  <Image
                    src="/zoiko Social-Trust&Safety-profanity-free-policy/zupfp1.png"
                    alt="Multi-generational family and friends"
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover object-center"
                  />
                </div>

                <div className="pt-5 text-center">
                  <h3 className="text-base font-bold text-[#0F2422]">
                    For All Ages
                  </h3>
                  <p className="mx-auto mt-2 max-w-[280px] text-xs leading-relaxed text-[#5A7371]">
                    Zoiko Social is built for families, educators, and
                    professionals who want a respectful online space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
