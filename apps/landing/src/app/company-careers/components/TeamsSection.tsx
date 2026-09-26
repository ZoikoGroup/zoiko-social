import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

const TEAMS = [
  {
    icon: IMAGES.teamIcons.productDesign,
    title: "Product & Design",
    description:
      "Build usable, accessible, trust-aware product experiences for individuals, professionals, organizations and communities.",
  },
  {
    icon: IMAGES.teamIcons.engineering,
    title: "Engineering",
    description:
      "Build scalable communication, discovery, safety, identity and platform systems that serve millions responsibly.",
  },
  {
    icon: IMAGES.teamIcons.dataAi,
    title: "Data & AI",
    description:
      "Support ranking, safety, analytics and decision systems responsibly, with transparency and bias controls.",
  },
  {
    icon: IMAGES.teamIcons.trustSafety,
    title: "Trust, Safety & Welfare",
    description:
      "Develop policies and systems that protect people, animals and communities. Shape governance and operations.",
  },
  {
    icon: IMAGES.teamIcons.contentEditorial,
    title: "Content & Editorial",
    description:
      "Work on verified information, editorial operations and animal/public-interest content with editorial independence.",
  },
  {
    icon: IMAGES.teamIcons.communitySupport,
    title: "Community & Support",
    description:
      "Help members, communities and organizations succeed safely. Provide support at scale while maintaining quality.",
  },
  {
    icon: IMAGES.teamIcons.partnershipsGrowth,
    title: "Partnerships & Growth",
    description:
      "Build aligned professional and organization relationships while keeping growth responsible and welfare-focused.",
  },
  {
    icon: IMAGES.teamIcons.operationsCorporate,
    title: "Operations & Corporate",
    description:
      "Enable finance, legal, people, compliance and infrastructure. Keep operations clean and compliant.",
  },
];

export default function TeamsSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-[720px]">
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-[1.2] tracking-[-0.01em]"
            style={{ color: C.firefly }}
          >
            Teams and areas of work
          </h2>
          <p
            className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Explore the disciplines that make Zoiko Social possible:
          </p>
        </div>

        {/* 8 Cards Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TEAMS.map((team) => (
            <div
              key={team.title}
              className="flex flex-col rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 border transition hover:shadow-md"
              style={{
                background: C.white,
                borderColor: C.geyser,
              }}
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[20px] flex items-center justify-center mb-4 sm:mb-6 shrink-0"
                style={{ background: C.blackSqueeze }}
              >
                <Image
                  src={team.icon}
                  alt={team.title}
                  width={32}
                  height={32}
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                />
              </div>

              <h3
                className="text-lg sm:text-[20px] font-bold leading-[26px] mb-2 sm:mb-3"
                style={{ color: C.mosque }}
              >
                {team.title}
              </h3>

              <p
                className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
                style={{ color: C.nevada }}
              >
                {team.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
