import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

const PILLARS = [
  {
    title: "Multi-Language",
    description:
      "Access Zoiko Social in your language with culturally appropriate content and support.",
  },
  {
    title: "Regional Compliance",
    description:
      "Local laws and regulations respected in adoption, commerce, and community features.",
  },
  {
    title: "Local Discovery",
    description:
      "Find communities, events, professionals, and resources in your geographic area while connecting globally.",
  },
];

export default function GlobalLocalSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.white }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:gap-4 max-w-[900px]">
          <h2
            className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]"
            style={{ color: C.firefly }}
          >
            Global perspective. Local care.
          </h2>
          <p
            className="text-sm font-normal leading-relaxed sm:text-base lg:text-[17px] sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Animal welfare is global but care, laws, language, moderation, and
            communities operate locally. Zoiko Social connects worldwide while
            respecting regional needs:
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col rounded-[18px] sm:rounded-[20px] p-5 sm:p-7 lg:p-8 shadow-sm transition hover:shadow-md"
              style={{
                background: C.white,
                border: `1px solid ${C.geyser}`,
              }}
            >
              <h3
                className="text-base sm:text-lg lg:text-[20px] font-bold leading-snug sm:leading-[26px]"
                style={{ color: C.mosque }}
              >
                {pillar.title}
              </h3>
              <p
                className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-[17px] font-normal leading-relaxed sm:leading-[28px]"
                style={{ color: C.nevada }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Wide Global Communities Banner Image */}
        <div className="mt-8 sm:mt-12 overflow-hidden rounded-[18px] sm:rounded-[24px] lg:rounded-[28px] shadow-[0_16px_36px_0_rgba(7,59,71,0.12)] sm:shadow-[0_20px_48px_0_rgba(7,59,71,0.16)]">
          <div className="relative h-[170px] sm:h-[240px] md:h-[290px] lg:h-[328px] w-full">
            <Image
              src={IMAGES.globalBanner}
              alt="Global communities connected through Zoiko Social, spanning multiple regions and cultures"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
