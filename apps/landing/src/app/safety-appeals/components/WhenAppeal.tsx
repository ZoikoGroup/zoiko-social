interface AppealReason {
  title: string;
  description: string;
}

const appealReasons: AppealReason[] = [
  {
    title: "We made a mistake",
    description:
      "Our AI flagged content by accident. Context was misunderstood. We applied the wrong policy. A false positive happened. Appeal to fix our error.",
  },
  {
    title: "You have new context",
    description:
      "Your account was suspended, but you have new information. You can explain the context we might have missed. Give the review team the full picture.",
  },
  {
    title: "You disagree with the interpretation",
    description:
      "You believe the content or behavior doesn't actually violate our standards. You interpreted a policy differently. Make your case to a fresh reviewer.",
  },
  {
    title: "The punishment seems unfair",
    description:
      "The violation happened, but the penalty was too harsh. You're a first-time offender. Appeal the severity of the enforcement action.",
  },
];

export default function WhenAppeal() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20 lg:py-20 xl:px-28">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="w-full text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
              When should you appeal?
            </h2>
          </div>

          {/* Appeal Reasons */}
          <div className="flex w-full flex-col items-start gap-4 pt-2 sm:gap-5 sm:pt-4">
            {appealReasons.map((reason) => (
              <div
                key={reason.title}
                className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#BFE7E9] border-l-4 border-l-[#00AFC7] bg-white p-6 sm:p-8"
              >
                <div className="flex w-full flex-col items-start">
                  <h3 className="w-full text-lg font-bold text-[#00AFC7]">
                    {reason.title}
                  </h3>
                </div>

                <div className="flex w-full flex-col items-start">
                  <p className="w-full text-sm font-normal leading-6 text-[#46636A]">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}