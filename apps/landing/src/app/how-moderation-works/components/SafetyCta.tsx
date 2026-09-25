import Image from "next/image";
import Link from "next/link";

export default function SafetyCta() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8 md:px-12 lg:px-20 xl:px-28">
      <div className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-3xl">
        {/* Background Image */}
        <Image
          src="/how-moderation-works/bg2.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-4 px-6 py-16 sm:px-10 lg:px-12">
          <h2 className="w-full text-center font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-white sm:text-4xl">
            Help us build better safety
          </h2>

          <p className="w-full max-w-[600px] text-center font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-white">
            Your feedback—reports, appeals, and ideas—makes our moderation
            better. We listen, learn, and improve.
          </p>

          <div className="flex w-full flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/report-a-concern"
              className="inline-flex items-center justify-center rounded-xl border border-[#D5E7EA] bg-white px-8 py-5 font-['Arial'] text-base font-bold text-[#00AFC7] transition-opacity hover:opacity-90"
            >
              Report a Problem
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}