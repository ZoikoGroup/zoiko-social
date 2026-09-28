import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

const LOCATIONS = [
  {
    flag: IMAGES.flags.us,
    flagAlt: "United States",
    name: "Sacramento, California",
    description:
      "North America headquarters. Product, engineering, operations, and partnerships teams based here. Open to remote and hybrid arrangements per role.",
  },
  {
    flag: IMAGES.flags.uk,
    flagAlt: "United Kingdom",
    name: "London, United Kingdom",
    description:
      "Europe operations and engineering hub. Trust & safety, content, and community teams based here. Remote roles available.",
  },
];

export default function GlobalLocationsSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-[800px]">
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-[1.2] tracking-[-0.01em]"
            style={{ color: C.firefly }}
          >
            Where we work
          </h2>
          <p
            className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Zoiko Social operates globally with headquarters and teams in North America
            and Europe. Not all roles are available in all locations — check the role
            listing for specifics.
          </p>
        </div>

        {/* 2 Locations Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.name}
              className="flex flex-col rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 pb-8 sm:pb-10 border transition hover:shadow-sm"
              style={{
                background: C.white,
                borderColor: C.geyser,
              }}
            >
              <div className="mb-3 sm:mb-4">
                <Image
                  src={loc.flag}
                  alt={loc.flagAlt}
                  width={40}
                  height={28}
                  className="w-8 sm:w-10 h-auto object-contain drop-shadow-sm"
                />
              </div>
              <h3
                className="text-lg sm:text-[20px] font-bold leading-[26px] mb-2 sm:mb-3"
                style={{ color: C.mosque }}
              >
                {loc.name}
              </h3>
              <p
                className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
                style={{ color: C.nevada }}
              >
                {loc.description}
              </p>
            </div>
          ))}
        </div>

        {/* Remote Eligibility Notice Box */}
        <div
          className="mt-6 sm:mt-8 rounded-[16px] sm:rounded-[20px] p-5 sm:p-7 border-l-4"
          style={{
            background: C.blackSqueeze,
            borderLeftColor: C.mosque,
          }}
        >
          <p
            className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            <span className="font-bold" style={{ color: C.nevada }}>
              Remote eligibility:
            </span>{" "}
            Many roles are fully remote globally. Some require presence in a
            specific region or office. Each job detail specifies location and
            work-model expectations. We do not infer your location; if remote, we
            show eligible countries/regions in the role.
          </p>
        </div>
      </div>
    </section>
  );
}
