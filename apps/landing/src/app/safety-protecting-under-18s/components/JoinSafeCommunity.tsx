import Image from "next/image";
import Link from "next/link";

export default function JoinSafeCommunity() {
  return (
    <section className="w-full bg-white py-12 sm:py-0 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Content */}
          <div className="max-w-[520px]">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px] lg:leading-[1.25]">
              Join a Safe Community
            </h2>

            <p className="mt-4 text-xs leading-relaxed text-[#5A7371] sm:mt-5 sm:text-base sm:leading-7">
              Young people deserve a platform where they can be themselves, make
              friends, and explore interests without fear of harassment,
              exploitation, or surveillance. That&apos;s what we&apos;re building at
              Zoiko Social.
            </p>

            <p className="mt-3 text-xs leading-relaxed text-[#5A7371] sm:mt-4 sm:text-base sm:leading-7">
              Our commitment to transparency, fairness, and human judgment sets us
              apart. We&apos;re not perfect—but we&apos;re constantly working to
              improve and listen to our community.
            </p>

            {/* CTAs: Stacked full-width with orange CTA on mobile; inline teal on desktop */}
            <div className="mt-7 flex flex-col items-center gap-0 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-6">
              <Link
                href="/communities-all"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#EA8A1A] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#D47B12] sm:w-auto sm:bg-[#006D77] sm:py-3 sm:hover:bg-[#005B63]"
              >
                Create Account Free
              </Link>

              <Link
                href="/safety-how-moderation-works"
                className="mt-4 block w-full text-center text-sm font-semibold text-[#006D77] transition hover:text-[#005B63] hover:underline sm:mt-0 sm:inline sm:w-auto"
              >
                Learn More
              </Link>
            </div>

            {/* Mobile Image: zupu7.jpg (Shown below CTAs on mobile) */}
            <div className="relative mt-8 h-[220px] w-full overflow-hidden rounded-2xl shadow-sm sm:hidden">
              <Image
                src="/zoiko Social-Trust&Safety-protecting-under-18s/zupu7.jpg"
                alt="Team collaborating around whiteboard with sticky notes"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Desktop Column: Community Image zupu5.png (Desktop only) */}
          <div className="relative hidden h-[320px] w-full overflow-hidden rounded-3xl shadow-sm sm:block sm:h-[380px] lg:h-[420px]">
            <Image
              src="/zoiko Social-Trust&Safety-protecting-under-18s/zupu5.png"
              alt="Diverse group of community members laughing and talking over coffee"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
