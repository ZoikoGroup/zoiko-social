import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

const REASONS = [
  {
    title: "Mission with real impact",
    body: "Build systems around animal life, welfare, community, trustworthy information and responsible coordination.",
  },
  {
    title: "Trust as architecture",
    body: "Contribute to safety, moderation, verification, privacy, accessibility and responsible platform systems as core product features.",
  },
  {
    title: "Global + local complexity",
    body: "Design and operate for diverse regions, languages, laws and communities. Scale thoughtfully, not recklessly.",
  },
];

export default function WhyWorkHereSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-[720px]">
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-[1.2] tracking-[-0.01em]"
            style={{ color: C.firefly }}
          >
            Why work on Zoiko Social
          </h2>
          <p
            className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Beyond the product, here&apos;s what makes this work meaningful:
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {REASONS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 border transition hover:shadow-sm"
              style={{
                background: C.white,
                borderColor: C.geyser,
              }}
            >
              <div
                className="pb-2 mb-3 sm:mb-4 border-b"
                style={{ borderColor: C.mosque }}
              >
                <h3
                  className="text-lg sm:text-[20px] font-bold leading-[26px]"
                  style={{ color: C.mosque }}
                >
                  {item.title}
                </h3>
              </div>
              <p
                className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
                style={{ color: C.nevada }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* Brainstorming Team Image */}
        <div
          className="mt-8 sm:mt-10 overflow-hidden rounded-[20px] sm:rounded-[28px] shadow-[0_20px_48px_0_rgba(7,59,71,0.16)]"
          style={{ background: C.white }}
        >
          <Image
            src={IMAGES.whyWorkBrainstorming}
            alt="Team brainstorming session around whiteboard with sticky notes and design sketches"
            width={1280}
            height={430}
            className="w-full h-[200px] sm:h-[300px] lg:h-[430px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
