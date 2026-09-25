import Image from "next/image";
import Link from "next/link";

export default function Commitment() {
  return (
    <section className="w-full px-6 py-8 sm:px-8 md:px-12 lg:px-20 xl:px-28">
      <div className="relative w-full overflow-hidden rounded-3xl">
        {/* Background Image */}
        <Image
          src="/community-standards/bg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#073B47]/20" />

        {/* Content */}
        <div className="relative flex w-full flex-col items-center gap-4 px-6 py-12 sm:px-10 sm:py-14 md:px-12 md:py-16">
          <h2 className="w-full text-center font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-white sm:text-4xl">
            Our commitment to you
          </h2>

          <p className="w-full max-w-[754px] pb-2 text-center font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-white/95">
            These standards aren&apos;t perfect, and we&apos;re always
            learning. We&apos;re committed to fairness, transparency, and
            listening to your feedback.
          </p>

          <Link
            href="#feedback"
            className="inline-flex items-center justify-center rounded-xl border border-[#D5E7EA] bg-white px-8 py-4 font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#00AFC7] transition-opacity hover:opacity-90"
          >
            Share Feedback
          </Link>
        </div>
      </div>
    </section>
  );
}