import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "./images";
import { C } from "./theme";

const AUDIENCES = [
  {
    image: IMAGES.audiences.individuals,
    title: "For Individuals",
    description:
      "Share your life with animals, find communities, access trustworthy information, adopt responsibly, and connect with care resources.",
    buttonText: "Join Free",
    buttonHref: "/signup",
    linkText: "Explore Communities →",
    linkHref: "/communities-all",
  },
  {
    image: IMAGES.audiences.professionals,
    title: "For Professionals",
    description:
      "Build a verified professional presence, communicate with clients, participate in specialist communities, and use approved business tools.",
    buttonText: "Get Verified",
    buttonHref: "/premium-verified-organization",
    linkText: "Browse Directory →",
    linkHref: "/market-veterinarians",
  },
  {
    image: IMAGES.audiences.organizations,
    title: "For Organizations",
    description:
      "Coordinate rescue, shelter, nonprofit, research, and community activity at scale with dedicated organizational tools.",
    buttonText: "Verify Organization",
    buttonHref: "/premium-verified-organization",
    linkText: "Partner With Us →",
    linkHref: "/fundraising-toolkit",
  },
];

export default function BuiltForAudiencesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.white }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:gap-4 max-w-[850px]">
          <h2
            className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]"
            style={{ color: C.firefly }}
          >
            Built for individuals, professionals & organizations
          </h2>
          <p
            className="text-sm font-normal leading-relaxed sm:text-base lg:text-[17px] sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Zoiko Social serves three distinct audiences with tailored pathways and features:
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {AUDIENCES.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-[18px] sm:rounded-[20px] p-5 sm:p-7 lg:p-8 shadow-sm transition hover:shadow-md"
              style={{
                background: C.white,
                border: `1px solid ${C.geyser}`,
              }}
            >
              <div>
                {/* Top Image Banner */}
                <div className="relative h-[155px] sm:h-[150px] lg:h-[146px] w-full overflow-hidden rounded-[14px] sm:rounded-2xl bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Title */}
                <h3
                  className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-[20px] font-bold leading-snug sm:leading-[26px]"
                  style={{ color: C.mosque }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-2.5 sm:mt-3 text-xs sm:text-sm font-normal leading-relaxed sm:leading-[23.1px]"
                  style={{ color: C.nevada }}
                >
                  {item.description}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 sm:mt-8 flex flex-col gap-2.5 sm:gap-3">
                <Link
                  href={item.buttonHref}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 text-center active:scale-[0.99]"
                  style={{ background: C.mosque }}
                >
                  {item.buttonText}
                </Link>

                <Link
                  href={item.linkHref}
                  className="py-1 text-center text-xs font-normal transition hover:underline"
                  style={{ color: C.nevada }}
                >
                  {item.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
