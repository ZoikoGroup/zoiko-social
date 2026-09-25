import Image from "next/image";
import Link from "next/link";

export default function Rights() {
  return (
    <section className="w-full bg-white px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-6">
        {/* Heading */}
        <div className="flex w-full flex-col items-start gap-8">
          <h2 className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            Your rights
          </h2>
        </div>

        {/* Image */}
        <div className="w-full overflow-hidden rounded-3xl">
          <Image
            src="/community-standards/image.png"
            alt="Your rights"
            width={1230}
            height={408}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* Appeal Cards */}
        <div className="grid w-full grid-cols-1 gap-6 pt-2 sm:gap-8 lg:grid-cols-2">
          {/* Content Removal */}
          <div className="flex w-full flex-col items-start gap-2.5 rounded-[20px] border border-[#D5E7EA] bg-white p-6 sm:p-8">
            <h3 className="w-full font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#00AFC7]">
              Appeal content removal
            </h3>

            <p className="w-full pb-2 font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A] sm:pb-5">
              If your content was removed, you can request a review. A fresh
              team will look at your case with fresh eyes, without bias from
              the original decision.
            </p>

            <Link
              href="#start-appeal"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#00AFC7] px-5 py-3 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              Start Appeal
            </Link>
          </div>

          {/* Account Actions */}
          <div className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#D5E7EA] bg-white p-6 sm:p-8">
            <div className="flex w-full flex-col items-start gap-2.5">
              <h3 className="w-full font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#00AFC7]">
                Appeal account actions
              </h3>

              <p className="w-full pb-2 font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A] sm:pb-5">
                Suspensions and bans can be appealed if you believe the
                decision was unfair, mistaken, or made without proper context.
              </p>
            </div>

            <Link
              href="#appeal-suspension"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#00AFC7] px-5 py-3 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              Appeal Suspension
            </Link>
          </div>
        </div>

        {/* Appeal Stats */}
        <div className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#D5E7EA] bg-white p-6 sm:p-8">
          <h3 className="w-full pb-px font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#00AFC7]">
            Our appeal stats
          </h3>

          <p className="w-full font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
            In Q3 2026, we received 44,200 appeals and overturned 929
            decisions (2.1%). This balanced rate shows we&apos;re making sound
            original judgments while remaining open to fixing mistakes.
          </p>
        </div>
      </div>
    </section>
  );
}