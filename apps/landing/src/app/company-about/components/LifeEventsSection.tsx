import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

const RITUALS = [
  {
    icon: IMAGES.rituals.adoptionsBirthdays,
    title: "Adoptions & Birthdays",
    description:
      "Celebrate milestones, share invitations, post photos, and let your community share in the joy.",
  },
  {
    icon: IMAGES.rituals.memorials,
    title: "Memorials",
    description:
      "Respectful tribute and remembrance experiences for beloved animals — community support when it matters most.",
  },
  {
    icon: IMAGES.rituals.learningTraining,
    title: "Learning & Training",
    description:
      "Workshops, specialist communities, and educational gatherings where knowledge is shared and skills develop.",
  },
  {
    icon: IMAGES.rituals.fundraisers,
    title: "Fundraisers",
    description:
      "Verified and approved fundraising for rescues, shelters, and animal welfare causes.",
  },
  {
    icon: IMAGES.rituals.professionalGrowth,
    title: "Professional Growth",
    description:
      "Communities of practice, mentorship, and collaboration for veterinarians, trainers, researchers, and advocates.",
  },
  {
    icon: IMAGES.rituals.remembrance,
    title: "Dignified Remembrance",
    description:
      "Celebrate lives lived, honor legacies, and find support from a community that understands the bond.",
  },
];

export default function LifeEventsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.white }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:gap-4 max-w-[850px]">
          <h2
            className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]"
            style={{ color: C.firefly }}
          >
            Life events & community rituals
          </h2>
          <p
            className="text-sm font-normal leading-relaxed sm:text-base lg:text-[17px] sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            The most meaningful platform features connect to moments that matter in
            people&apos;s relationships with animals:
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RITUALS.map((ritual) => (
            <div
              key={ritual.title}
              className="flex flex-col rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 lg:p-7 shadow-sm transition hover:shadow-md"
              style={{
                background: C.white,
                border: `1px solid ${C.geyser}`,
              }}
            >
              {/* Icon */}
              <div className="mb-3.5 sm:mb-4">
                <Image
                  src={ritual.icon}
                  alt={ritual.title}
                  width={38}
                  height={38}
                  className="size-9 sm:size-[38px] object-contain"
                />
              </div>

              {/* Title */}
              <h3
                className="text-base font-bold leading-snug sm:text-[16px]"
                style={{ color: C.firefly }}
              >
                {ritual.title}
              </h3>

              {/* Description */}
              <p
                className="mt-2 text-xs font-normal leading-relaxed sm:text-sm sm:leading-[23.1px]"
                style={{ color: C.nevada }}
              >
                {ritual.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
