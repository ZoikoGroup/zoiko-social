import Image from "next/image";
import Link from "next/link";

export default function JoinSaferCommunityBanner() {
  return (
    <section className="w-full bg-[#F8FAFA] pb-16 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-[#DF8220] px-5 py-12 text-center shadow-lg sm:rounded-3xl sm:bg-[#082E2B] sm:px-6 sm:py-20 md:py-24">
          {/* Desktop Background: zuaw6.png (Team hands stacked - hidden on mobile) */}
          <div className="absolute inset-0 z-0 hidden sm:block">
            <Image
              src="/zoiko Social-trust&Safety-animal-welfare/zuaw6.png"
              alt="Community advocates, veterinarians, and rescue team joining hands"
              fill
              sizes="(min-width: 1240px) 1240px, 100vw"
              className="object-cover object-center"
            />
            {/* Deep teal overlay matching reference */}
            <div className="absolute inset-0 bg-[#082E2B]/85" />
          </div>

          {/* Mobile Background: Amber Gradient (Hidden on desktop) */}
          <div className="absolute inset-0 z-0 sm:hidden bg-gradient-to-b from-[#DF8220] to-[#C9660E]" />

          {/* Banner Content */}
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <h2 className="max-w-[240px] text-2xl font-bold tracking-tight text-white sm:max-w-none sm:text-3xl md:text-4xl">
              Ready to Join a <br className="sm:hidden" />Safer <br className="sm:hidden" />Community?
            </h2>

            <p className="mt-3.5 max-w-[260px] text-xs font-normal leading-relaxed text-white/90 sm:mt-4 sm:max-w-[620px] sm:text-base">
              Become part of 2.4M+ animal lovers who trust Zoiko Social. Let&apos;s
              protect animals together.
            </p>

            <div className="mt-7 sm:mt-9">
              <Link
                href="/communities-all"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-3 text-xs font-semibold text-[#1B6F7D] shadow-sm transition hover:bg-gray-50 sm:rounded-full sm:px-8 sm:py-3 sm:text-sm sm:text-[#006D77]"
              >
                Create Your Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
