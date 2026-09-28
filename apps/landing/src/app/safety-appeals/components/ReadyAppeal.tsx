import Link from "next/link";

export default function ReadyAppeal() {
  return (
    <section className="w-full px-6 py-8 sm:px-8 md:px-12 lg:px-20 xl:px-28">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-[#00AFC7] to-[#0097B2] p-8 sm:p-10 md:p-12">
        {/* Heading */}
        <div className="flex w-full flex-col items-center">
          <h2 className="text-center font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-white sm:text-4xl">
            Ready to appeal?
          </h2>
        </div>

        {/* Description */}
        <div className="flex w-full flex-col items-center pb-2">
          <p className="max-w-[850px] text-center font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-white/95">
            If you believe our decision was unfair, you deserve a fair review.
            Start your appeal now. It takes just 2 minutes to submit.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="#appeal"
          className="inline-flex items-center justify-center rounded-xl border border-[#D5E7EA] bg-white px-8 py-4 font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#00AFC7] transition-opacity duration-200 hover:opacity-90"
        >
          Start Appeal Now
        </Link>
      </div>
    </section>
  );
}