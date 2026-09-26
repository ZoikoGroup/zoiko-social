import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

export default function InclusionAccessibilitySection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-[720px]">
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-[1.2] tracking-[-0.01em]"
            style={{ color: C.firefly }}
          >
            Inclusion and accessibility
          </h2>
          <p
            className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            We&apos;re committed to building a workplace where everyone can succeed.
          </p>
        </div>

        {/* Accommodations Box */}
        <div
          className="mt-8 sm:mt-10 rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 lg:p-10 border-2"
          style={{
            background: C.blackSqueeze,
            borderColor: C.mosque,
          }}
        >
          <h3
            className="text-base font-bold mb-2 sm:mb-3"
            style={{ color: C.mosque }}
          >
            Accommodations and accessibility
          </h3>
          <p
            className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            If you need an accommodation to apply, interview, or work, please let
            us know. We&apos;re happy to work with you to make the process accessible.{" "}
            <a
              href="mailto:careers@zoikosocial.com?subject=Accommodation%20Request"
              className="inline-block font-semibold underline transition hover:opacity-80 break-words"
              style={{ color: C.zest }}
            >
              Request an accommodation here →
            </a>
          </p>
          <p
            className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            You are never required to disclose a disability or accommodation need to
            access role information or apply. Your accommodation request will be
            handled privately.
          </p>
        </div>

        {/* Inclusive Workplace Team Image */}
        <div
          className="mt-8 sm:mt-10 overflow-hidden rounded-[20px] sm:rounded-[28px] shadow-[0_20px_48px_0_rgba(7,59,71,0.16)]"
          style={{ background: C.white }}
        >
          <Image
            src={IMAGES.inclusionWorkplace}
            alt="Inclusive workplace: diverse team of different ages, abilities, and backgrounds working collaboratively"
            width={1280}
            height={518}
            className="w-full h-[220px] sm:h-[340px] lg:h-[518px] object-cover"
          />
        </div>

        {/* Equal Opportunity & Feedback Card */}
        <div
          className="mt-6 sm:mt-8 rounded-[16px] sm:rounded-[20px] p-5 sm:p-7 border"
          style={{
            background: C.white,
            borderColor: C.geyser,
          }}
        >
          <p
            className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            We believe diverse perspectives make better decisions. We hire and
            promote based on qualifications and fit for the role, not
            demographics. If you have feedback on how we could improve our hiring,
            please reach out to{" "}
            <a
              href="mailto:careers@zoikosocial.com"
              className="font-semibold underline transition hover:opacity-80 break-all"
              style={{ color: C.zest }}
            >
              careers@zoikosocial.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
