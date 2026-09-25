import Image from "next/image";

interface DecisionCardProps {
  title: string;
  children: React.ReactNode;
  next: React.ReactNode;
}

function DecisionCard({
  title,
  children,
  next,
}: DecisionCardProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-3 rounded-[20px] border border-[#D5E7EA] border-l-4 border-l-[#00AFC7] bg-white px-6 py-7 sm:px-8 sm:pt-8 sm:pb-10">
      {/* Card Title */}
      <div className="flex w-full flex-col items-start">
        <h3 className="w-full text-lg font-bold text-[#00AFC7]">
          {title}
        </h3>
      </div>

      {/* Card Content */}
      <div className="flex w-full flex-col items-start gap-1">
        {children}
      </div>

      {/* Next */}
      <div className="mt-2 flex w-full flex-col items-start border-t border-[#D5E7EA] pt-5">
        <p className="text-sm leading-6 text-[#46636A]">
          {next}
        </p>
      </div>
    </div>
  );
}

export default function Decision() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20 lg:py-20 xl:px-28">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="w-full text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
              After we make a decision
            </h2>
          </div>

          {/* Image */}
          <div className="relative w-full overflow-hidden rounded-2xl">
            <Image
              src="/appeals/image.png"
              alt="Appeal decision process"
              width={1228}
              height={399}
              className="h-auto w-full rounded-2xl object-cover"
              priority
            />
          </div>

          {/* Decision Cards */}
          <div className="grid w-full grid-cols-1 gap-6 py-2 sm:py-6 lg:grid-cols-2 lg:gap-8">
            {/* Successful Appeal */}
            <DecisionCard
              title="✓ Your appeal succeeded"
              next={
                <>
                  <span className="font-bold text-[#46636A]">Next:</span>{" "}
                  You can continue using Zoiko. Keep our community standards
                  in mind going forward.
                </>
              }
            >
              <p className="text-base leading-7 text-[#46636A]">
                <span className="font-bold">Content removal overturned:</span>{" "}
                Your content is restored. You&apos;ll see it on your profile
                immediately.
              </p>

              <p className="pt-1 text-base leading-7 text-[#46636A]">
                <span className="font-bold">Suspension overturned:</span>{" "}
                Your account is active again. You can post, comment, and
                engage.
              </p>

              <p className="pt-1 text-base leading-7 text-[#46636A]">
                <span className="font-bold">Ban overturned:</span>{" "}
                Your account is fully reinstated. No restrictions.
              </p>
            </DecisionCard>

            {/* Appeal Not Upheld */}
            <DecisionCard
              title="⚠️ Your appeal was not upheld"
              next={
                <>
                  <span className="font-bold text-[#46636A]">Next:</span>{" "}
                  You can submit a second appeal if you have new evidence or
                  information. Or contact support for help.
                </>
              }
            >
              <p className="text-base leading-7 text-[#46636A]">
                <span className="font-bold">The decision:</span>{" "}
                We reviewed your case and believe the original enforcement was
                correct.
              </p>

              <p className="pt-1 text-base leading-7 text-[#46636A]">
                <span className="font-bold">Why:</span>{" "}
                You&apos;ll get a detailed explanation of our reasoning.
                We&apos;re always transparent about why we made a decision.
              </p>

              <p className="pt-1 text-base leading-7 text-[#46636A]">
                <span className="font-bold">What now:</span>{" "}
                The original action remains (content removed, account
                suspended/banned).
              </p>
            </DecisionCard>
          </div>

          {/* Different Issue */}
          <div className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#D5E7EA] bg-gradient-to-r from-[#F2F4F5] to-white p-6 sm:p-8">
            <div className="flex w-full flex-col items-start">
              <h3 className="w-full text-lg font-bold text-[#E28B24]">
                What if I have a different issue?
              </h3>
            </div>

            <div className="flex w-full flex-col items-start">
              <p className="w-full text-sm leading-6 text-[#46636A]">
                Appeals are for enforcement decisions. If you have a different
                issue (account hacked, billing question, etc.), contact
                support instead. Appeals are specifically for challenging
                moderation actions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}