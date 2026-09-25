import Image from "next/image";

const moderationSteps = [
  {
    title: "1. Report & Detection",
    description:
      "Content is flagged by users or detected by our automated systems. We receive 2.3 million reports monthly.",
    image: "/how-moderation-works/image1.png",
    imageFirst: false,
  },
  {
    title: "2. Initial Triage",
    description:
      "Our systems categorize reports by likely violation type and priority. Critical issues are escalated immediately.",
    image: "/how-moderation-works/image2.png",
    imageFirst: true,
  },
  {
    title: "3. Automated Review",
    description:
      "AI analyzes content against policies. For obvious violations, it recommends immediate action. For nuanced cases, it escalates to humans.",
    image: "/how-moderation-works/image3.png",
    imageFirst: false,
  },
  {
    title: "4. Human Review",
    description:
      "Trained moderators review context, cultural factors, and account history. This is where nuance and judgment matter most.",
    image: "/how-moderation-works/image4.png",
    imageFirst: true,
  },
  {
    title: "5. Enforcement",
    description:
      "We apply appropriate action: warning, content removal, account restriction, or ban. Decisions are consistent and documented.",
    image: "/how-moderation-works/image5.png",
    imageFirst: false,
  },
  {
    title: "6. Notification",
    description:
      "Users are notified with clear reasoning. 95% of decisions are appealable, giving people a path to challenge us.",
    image: "/how-moderation-works/image6.png",
    imageFirst: true,
  },
];

export default function ModerationProcess() {
  return (
    <section className="w-full bg-[#F7F9FA] px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 sm:gap-12">
        {/* Heading */}
        <div className="w-full">
          <h2 className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            The moderation process
          </h2>
        </div>

        {/* Process Steps */}
        <div className="flex w-full flex-col gap-10 sm:gap-12">
          {moderationSteps.map((step) => (
            <div
              key={step.title}
              className="flex w-full flex-col items-center gap-8 lg:flex-row lg:gap-12"
            >
              {/* Text */}
              {!step.imageFirst && (
                <div className="flex w-full flex-1 flex-col items-start gap-3 lg:pb-4">
                  <div className="flex w-full flex-col items-start pt-3">
                    <h3 className="w-full font-['Plus_Jakarta_Sans'] text-2xl font-bold leading-8 text-[#00AFC7]">
                      {step.title}
                    </h3>
                  </div>

                  <div className="flex w-full flex-col items-start">
                    <p className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A]">
                      {step.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Image */}
              <div className="relative h-[220px] w-full flex-1 overflow-hidden rounded-3xl sm:h-[260px] lg:h-[288px]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text for alternating rows */}
              {step.imageFirst && (
                <div className="flex w-full flex-1 flex-col items-start gap-3 lg:pb-4">
                  <div className="flex w-full flex-col items-start pt-3">
                    <h3 className="w-full font-['Plus_Jakarta_Sans'] text-2xl font-bold leading-8 text-[#00AFC7]">
                      {step.title}
                    </h3>
                  </div>

                  <div className="flex w-full flex-col items-start">
                    <p className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A]">
                      {step.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}