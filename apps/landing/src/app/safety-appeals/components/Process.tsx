interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface ProcessStage {
  title: string;
  items: string[];
}

const steps: ProcessStep[] = [
  {
    number: "1",
    title: "Submit Appeal",
    description:
      "Click the appeal button in the notification. Tell us why you disagree.",
  },
  {
    number: "2",
    title: "Initial Review",
    description:
      "A fresh team reviews your case (2-4 business days).",
  },
  {
    number: "3",
    title: "Decision",
    description:
      "We uphold, overturn, or modify the original decision.",
  },
  {
    number: "4",
    title: "Notification",
    description:
      "You get an explanation of the decision, always.",
  },
];

const stages: ProcessStage[] = [
  {
    title: "Stage 1: Your Appeal",
    items: [
      'Click "Appeal" in the enforcement notice',
      "Write a clear explanation (250+ characters)",
      "Provide any context we might have missed",
      "Submit. You'll get a case number",
    ],
  },
  {
    title: "Stage 2: Fresh Review",
    items: [
      "A different team reviews your case",
      "They read your full appeal explanation",
      "They check the original content & decision",
      "No bias from the original moderator",
    ],
  },
  {
    title: "Stage 3: Decision",
    items: [
      "Overturn: We were wrong, action reversed",
      "Uphold: We confirm the original decision",
      "Modify: Adjust severity (e.g., warning instead of suspension)",
    ],
  },
  {
    title: "Stage 4: You're Informed",
    items: [
      "Get notification of the decision",
      "Read explanation (always provided)",
      "Know exactly why we decided",
      "No surprises, just clarity",
    ],
  },
];

export default function Process() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20 lg:py-20 xl:px-28">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">
          {/* Main Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="w-full text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
              How the appeal process works
            </h2>
          </div>

          {/* Intro */}
          <div className="flex w-full flex-col items-start">
            <p className="w-full text-base font-normal leading-7 text-[#46636A]">
              Four clear steps. Transparent. Fair. Handled by humans who will
              actually read your case.
            </p>
          </div>

          {/* Process Timeline */}
          <div className="relative flex w-full flex-col gap-10 pt-8 pb-4 md:pt-12 lg:flex-row lg:items-start lg:gap-0 lg:pt-20 lg:pb-8">
            {/* Desktop Connecting Line */}
            <div className="absolute left-1/2 top-[100px] hidden h-0.5 w-[74%] -translate-x-1/2 bg-gradient-to-r from-[#00AFC7] to-[#0097B2] lg:block" />

            {steps.map((step) => (
              <div
                key={step.number}
                className="relative z-10 flex flex-1 flex-col items-center gap-3"
              >
                {/* Number Circle */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00AFC7] to-[#0097B2] shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)]">
                  <span className="text-center text-3xl font-extrabold text-white">
                    {step.number}
                  </span>
                </div>

                {/* Step Title */}
                <div className="flex w-full flex-col items-center pt-1">
                  <h3 className="text-center text-base font-bold text-[#073B47]">
                    {step.title}
                  </h3>
                </div>

                {/* Step Description */}
                <div className="flex w-full flex-col items-center">
                  <p className="max-w-[240px] text-center text-xs font-normal leading-5 text-[#46636A]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stage Heading */}
          <div className="flex w-full flex-col items-start pt-6 sm:pt-10">
            <h3 className="text-lg font-bold text-[#073B47]">
              What happens at each stage
            </h3>
          </div>

          {/* Stage Cards - 2 Columns × 2 Rows */}
          <div className="grid w-full grid-cols-1 gap-6 pt-2 sm:pt-4 md:grid-cols-2">
            {stages.map((stage) => (
              <div
                key={stage.title}
                className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#0097B2] bg-[#EAF8FA] p-6 sm:p-8"
              >
                {/* Stage Title */}
                <div className="flex w-full flex-col items-start">
                  <h4 className="text-lg font-bold text-[#00AFC7]">
                    {stage.title}
                  </h4>
                </div>

                {/* Stage List */}
                <div className="flex w-full flex-col items-start">
                  {stage.items.map((item) => (
                    <div
                      key={item}
                      className="flex w-full items-center px-3 py-3 sm:pl-6"
                    >
                      <p className="text-sm font-normal leading-6 text-[#46636A]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}