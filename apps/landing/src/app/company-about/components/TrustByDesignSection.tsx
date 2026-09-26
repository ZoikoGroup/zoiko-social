import Link from "next/link";
import { C } from "./theme";

const PILLARS = [
  {
    title: "Profanity-Free\nEnvironment",
    description:
      "Automated and human moderation enforcing respectful interaction and family-friendly standards.",
    linkText: "Learn about moderation →",
    linkHref: "/how-moderation-works",
  },
  {
    title: "Tiered Verification",
    description:
      "Different verification systems for news, professionals, and organizations — clear distinctions for different types of expertise.",
    linkText: "How verification works →",
    linkHref: "/verified-rescues-shelters",
  },
  {
    title: "Anti-Trafficking Controls",
    description:
      "Adoption, rescue, and commerce functions use identity-aware and jurisdiction-aware controls to prevent exploitation.",
    linkText: "Animal welfare policy →",
    linkHref: "/animal-welfare",
  },
  {
    title: "Ethical Advertising",
    description:
      "Animal-aligned professionals only; labeling and separation from news ensure authentic information.",
    linkText: "Advertising standards →",
    linkHref: "/community-standards",
  },
  {
    title: "Responsibility Over\nVirality",
    description:
      "Editorial and product principles favoring accuracy, welfare, and responsible community over raw engagement metrics.",
    linkText: "Community standards →",
    linkHref: "/community-standards",
  },
];

export default function TrustByDesignSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:gap-4 max-w-[850px]">
          <h2
            className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]"
            style={{ color: C.firefly }}
          >
            Trust by design
          </h2>
          <p
            className="text-sm font-normal leading-relaxed sm:text-base lg:text-[17px] sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Five architectural pillars ensure Zoiko Social remains a safe, verified, and
            responsible platform:
          </p>
        </div>

        {/* 5 Cards Row/Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-4 lg:gap-5">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col justify-between rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 shadow-sm transition hover:shadow-md min-h-[190px] sm:min-h-[220px] lg:min-h-[244px]"
              style={{
                background: C.white,
                border: `1px solid ${C.geyser}`,
              }}
            >
              <div>
                <h3
                  className="whitespace-pre-line text-sm sm:text-[15px] font-bold leading-snug"
                  style={{ color: C.firefly }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="mt-2.5 sm:mt-3 text-xs sm:text-[13px] font-normal leading-relaxed sm:leading-[21.45px]"
                  style={{ color: C.nevada }}
                >
                  {pillar.description}
                </p>
              </div>

              <div className="mt-5 pt-2">
                <Link
                  href={pillar.linkHref}
                  className="text-xs sm:text-[13px] font-semibold hover:underline"
                  style={{ color: C.mosque }}
                >
                  {pillar.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
