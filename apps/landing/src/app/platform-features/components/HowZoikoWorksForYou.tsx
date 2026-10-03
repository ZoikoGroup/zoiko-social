import Image from "next/image";
import { C } from "./theme";

const AUDIENCES = [
  {
    icon: "/platform-features/icon-rescuers-shelters.webp",
    title: "Rescuers & Shelters",
    workflows: [
      "Coordinate rescue operations",
      "Share animal profiles & urgency",
      "Build foster networks",
      "Track impact & outcomes",
    ],
  },
  {
    icon: "/platform-features/icon-advocates-educators.webp",
    title: "Advocates & Educators",
    workflows: ["Build expert community", "Share research & evidence", "Host educational events", "Establish authority"],
  },
  {
    icon: "/platform-features/icon-passionate-supporters.webp",
    title: "Passionate Supporters",
    workflows: ["Discover causes to support", "Join relevant communities", "Attend local events", "Make a difference"],
  },
];

/** "How Zoiko Social Works for You" — 3 audience cards with workflow bullet lists. */
export default function HowZoikoWorksForYou() {
  return (
    <section className="w-full px-4 py-12 sm:px-8 sm:py-16 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 lg:gap-12">
        <h2
          className="text-center font-jakarta text-2xl font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl"
          style={{ color: C.ink }}
        >
          How Zoiko Social Works for You
        </h2>
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:gap-6">
          {AUDIENCES.map((audience) => (
            <div
              key={audience.title}
              className="flex flex-1 flex-col items-center gap-4 rounded-[20px] border bg-white px-6 pb-10 pt-8"
              style={{ borderColor: C.line }}
            >
              <Image src={audience.icon} alt="" width={48} height={48} />
              <h3 className="text-center text-xl font-bold" style={{ color: C.brand }}>
                {audience.title}
              </h3>
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-sm font-bold" style={{ color: C.muted }}>
                  Common workflows:
                </p>
                <ul className="flex list-disc flex-col gap-2 pl-5 text-sm" style={{ color: C.muted }}>
                  {audience.workflows.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
