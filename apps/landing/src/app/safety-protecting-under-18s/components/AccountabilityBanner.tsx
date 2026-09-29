import Image from "next/image";
import Link from "next/link";

export default function AccountabilityBanner() {
  return (
    <section className="w-full bg-[#F8FAFA] py-10 sm:py-0 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#064E52] px-5 py-12 text-center shadow-lg sm:rounded-3xl sm:bg-[#082E2B] sm:px-6 sm:py-20 md:py-24">
          {/* Background Image: zupu6.png (Desktop only as shown in mobile design) */}
          <div className="absolute inset-0 z-0 hidden sm:block">
            <Image
              src="/zoiko Social-Trust&Safety-protecting-under-18s/zupu6.png"
              alt="Zoiko Social team members in discussion"
              fill
              sizes="(min-width: 1240px) 1240px, 100vw"
              className="object-cover object-center"
            />
            {/* Dark teal overlay matching desktop reference */}
            <div className="absolute inset-0 bg-[#082E2B]/85" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Accountability Matters
            </h2>

            <p className="mt-3 max-w-sm text-xs font-normal leading-relaxed text-white/90 sm:mt-4 sm:max-w-[680px] sm:text-base">
              We publish monthly transparency reports showing exactly how many
              reports we receive, how we enforce rules, and where we&apos;re
              improving. You can see our full data anytime.
            </p>

            <div className="mt-6 sm:mt-9">
              <Link
                href="/safety-how-moderation-works"
                className="inline-flex items-center justify-center rounded-full bg-[#EA8A1A] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#D47B12] sm:bg-white sm:px-8 sm:text-[#006D77] sm:hover:bg-gray-100"
              >
                View Our Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
