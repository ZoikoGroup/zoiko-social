import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

const PRINCIPLES = [
  {
    title: "Purpose with responsibility",
    description:
      "Advance useful, trusted animal-community infrastructure. Not attention for its own sake.",
  },
  {
    title: "Safety is quality",
    description:
      "Welfare, moderation, privacy, accessibility, and abuse resistance are product features, not afterthoughts.",
  },
  {
    title: "Cross-functional ownership",
    description:
      "Complex platform problems need product, engineering, trust, content and operations collaboration.",
  },
];

export default function WorkingPrinciplesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-[720px]">
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-[1.2] tracking-[-0.01em]"
            style={{ color: C.firefly }}
          >
            How we work
          </h2>
          <p
            className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            These principles shape every day at Zoiko Social:
          </p>
        </div>

        {/* 3 Principles Cards Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="flex flex-col rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 pb-8 sm:pb-12 border transition hover:shadow-sm"
              style={{
                background: C.white,
                borderColor: C.geyser,
              }}
            >
              <div
                className="pb-2 sm:pb-3 mb-3 sm:mb-4 border-b"
                style={{ borderColor: C.mosque }}
              >
                <h3
                  className="text-lg sm:text-[20px] font-bold leading-[26px]"
                  style={{ color: C.mosque }}
                >
                  {principle.title}
                </h3>
              </div>
              <p
                className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
                style={{ color: C.nevada }}
              >
                {principle.description}
              </p>
            </div>
          ))}
        </div>

        {/* Working Principles Team Image */}
        <div
          className="mt-8 sm:mt-10 overflow-hidden rounded-[20px] sm:rounded-[28px] shadow-[0_20px_48px_0_rgba(7,59,71,0.16)]"
          style={{ background: C.white }}
        >
          <Image
            src={IMAGES.workingPrinciples}
            alt="Cross-functional team meeting: designers and engineers discussing architecture on whiteboard"
            width={1280}
            height={430}
            className="w-full h-[200px] sm:h-[300px] lg:h-[430px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
