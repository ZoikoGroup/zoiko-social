import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

const STEPS = [
  {
    step: "1",
    title: "Application review",
    description:
      "Your application is reviewed against role requirements. We read applications thoughtfully, not in bulk.",
  },
  {
    step: "2",
    title: "Recruiter conversation",
    description:
      "If it's a fit, a recruiter reaches out to discuss the role, your goals, and logistics.",
  },
  {
    step: "3",
    title: "Role interviews",
    description:
      "Interviews vary by role. We focus on job-relevant skills and working style fit.",
  },
  {
    step: "4",
    title: "Decision & offer",
    description:
      "Decisions come after interviews. If offered, we explain role details and support your transition.",
  },
];

export default function HowWeHireSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-[720px]">
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-[1.2] tracking-[-0.01em]"
            style={{ color: C.firefly }}
          >
            How we hire
          </h2>
          <p
            className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            We believe in fair, transparent hiring that respects your time and
            signals what working here is like.
          </p>
        </div>

        {/* 4 Steps Cards Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="flex flex-col items-center text-center rounded-[16px] sm:rounded-[20px] p-6 pb-8 sm:pb-11 border transition hover:shadow-sm"
              style={{
                background: C.white,
                borderColor: C.geyser,
              }}
            >
              <span
                className="text-2xl sm:text-[28px] font-extrabold mb-1"
                style={{ color: C.zest }}
              >
                {step.step}
              </span>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: C.mosque }}
              >
                {step.title}
              </h3>
              <p
                className="text-xs sm:text-sm leading-relaxed sm:leading-[23.1px]"
                style={{ color: C.nevada }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interview Image */}
        <div
          className="mt-8 sm:mt-10 overflow-hidden rounded-[20px] sm:rounded-[28px] shadow-[0_20px_48px_0_rgba(7,59,71,0.16)]"
          style={{ background: C.white }}
        >
          <Image
            src={IMAGES.howWeHire}
            alt="Interviewer and candidate having thoughtful discussion in modern office setting"
            width={1280}
            height={430}
            className="w-full h-[200px] sm:h-[300px] lg:h-[430px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
