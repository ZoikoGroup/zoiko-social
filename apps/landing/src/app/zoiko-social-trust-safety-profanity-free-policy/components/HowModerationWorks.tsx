interface StepItem {
  number: string;
  title: string;
  description: string;
  side: "left" | "right";
}

const STEPS: StepItem[] = [
  {
    number: "1.",
    title: "Clear Policies",
    description:
      "We publish transparent rules about language, conduct, and community standards. No surprises.",
    side: "left",
  },
  {
    number: "2.",
    title: "Smart Detection",
    description:
      "AI flags potential violations, but humans always review. Context matters.",
    side: "right",
  },
  {
    number: "3.",
    title: "Fair Enforcement",
    description:
      "Warnings, content removal, or account actions are proportionate to violations.",
    side: "left",
  },
  {
    number: "4.",
    title: "Transparent Appeals",
    description:
      "Disagree? Appeal our decisions. We re-review and explain our final decision.",
    side: "right",
  },
];

export default function HowModerationWorks() {
  return (
    <section className="w-full bg-[#F8FAFA] py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-8">
        <h2 className="text-left text-[26px] font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          How Our Moderation <br className="sm:hidden" />Works
        </h2>

        {/* Alternating Timeline with Center Vertical Line & Amber Nodes on Desktop | Single Column Stack on Mobile */}
        <div className="relative mt-8 sm:mt-12 lg:mt-16">
          {/* Vertical Center Connecting Line (Desktop Only) */}
          <div className="absolute bottom-6 left-1/2 top-6 hidden w-px -translate-x-1/2 bg-gray-200/90 md:block" />

          <div className="space-y-3.5 sm:space-y-6 md:space-y-10">
            {STEPS.map((step) => {
              const isLeft = step.side === "left";

              return (
                <div
                  key={step.title}
                  className="relative grid grid-cols-1 items-center gap-0 md:grid-cols-2 md:gap-12"
                >
                  {/* Left Column (Desktop) / Mobile Card */}
                  {isLeft ? (
                    <div className="flex w-full md:justify-end">
                      <div className="w-full max-w-[460px] rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md sm:border-gray-200/80 sm:p-7 md:text-right">
                        <h3 className="text-sm font-bold text-[#0F2422] sm:text-base">
                          {step.number} {step.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#5A7371] sm:mt-2 sm:text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:block" />
                  )}

                  {/* Center Amber Dot Node (Desktop Only) */}
                  <div className="absolute left-1/2 top-1/2 z-10 hidden size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EA8A1A] ring-4 ring-white md:block" />

                  {/* Right Column (Desktop) / Mobile Card */}
                  {!isLeft ? (
                    <div className="flex w-full md:justify-start">
                      <div className="w-full max-w-[460px] rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md sm:border-gray-200/80 sm:p-7 md:text-left">
                        <h3 className="text-sm font-bold text-[#0F2422] sm:text-base">
                          {step.number} {step.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#5A7371] sm:mt-2 sm:text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
