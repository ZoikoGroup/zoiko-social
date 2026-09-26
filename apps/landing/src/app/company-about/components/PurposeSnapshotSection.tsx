import { C } from "./theme";

const PILLARS = [
  {
    title: "Global Reach",
    description:
      "Available in multiple languages, operating across time zones and regions with local moderation and cultural awareness.",
  },
  {
    title: "Built on Trust",
    description:
      "Verification, profanity-free environment, anti-trafficking controls, and ethical governance are architectural, not afterthoughts.",
  },
  {
    title: "Purpose-Built",
    description:
      "Every feature — adoption, events, commerce, communities — designed around animal welfare and responsible stewardship.",
  },
];

export default function PurposeSnapshotSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:gap-4 max-w-[900px]">
          <h2
            className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]"
            style={{ color: C.firefly }}
          >
            Built for the relationship people have with animals
          </h2>
          <p
            className="text-sm font-normal leading-relaxed sm:text-base lg:text-[17px] sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Zoiko Social was designed specifically for animal life and the
            responsibilities around care, welfare, community, and trustworthy
            information. It&apos;s not a general-purpose social network adapted for
            animals — it&apos;s purpose-built from the ground up.
          </p>
        </div>

        {/* 3 Value Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col rounded-[18px] sm:rounded-[20px] p-6 sm:p-7 lg:p-8 shadow-sm transition hover:shadow-md"
              style={{
                background: C.white,
                border: `1px solid ${C.geyser}`,
              }}
            >
              <div
                className="pb-3.5 sm:pb-4"
                style={{ borderBottom: `1px solid ${C.mosque}` }}
              >
                <h3
                  className="text-lg font-bold leading-[26px] sm:text-[20px]"
                  style={{ color: C.mosque }}
                >
                  {pillar.title}
                </h3>
              </div>
              <p
                className="mt-3.5 sm:mt-4 text-sm font-normal leading-relaxed sm:text-[17px] sm:leading-[28px]"
                style={{ color: C.nevada }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
