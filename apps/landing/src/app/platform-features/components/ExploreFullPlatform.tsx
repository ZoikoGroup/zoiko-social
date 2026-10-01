import Image from "next/image";
import { C } from "./theme";

const EXPLORE_HREF: Record<string, string> = {
  Communities: "/discover-communities",
  Events: "/platform-events",
  "World Animal News": "/news-latest",
  "Adopt & Foster": "/platform-adopt-foster-production",
};

const LINKS = [
  {
    icon: "/platform-features/icon-communities.webp",
    title: "Communities",
    body: "Discover and join communities around your causes and interests",
  },
  {
    icon: "/platform-features/icon-events.webp",
    title: "Events",
    body: "Find adoption events, volunteer days, and educational workshops",
  },
  {
    icon: "/platform-features/icon-world-animal-news.webp",
    title: "World Animal News",
    body: "Stay informed with verified, curated animal welfare news",
  },
  {
    icon: "/platform-features/icon-adopt-foster.webp",
    title: "Adopt & Foster",
    body: "Browse adoptable animals and connect with rescue organizations",
  },
];

/** "Explore the Full Zoiko Social Platform" — 2x2 grid of cross-links to other areas. */
export default function ExploreFullPlatform() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 lg:gap-12">
        <h2
          className="text-center font-jakarta text-2xl font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl"
          style={{ color: C.ink }}
        >
          Explore the Full Zoiko Social Platform
        </h2>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {LINKS.map((link) => (
            <a
              key={link.title}
              href={EXPLORE_HREF[link.title] ?? "#"}
              className="flex items-center gap-6 rounded-[20px] border bg-white p-6 transition hover:bg-neutral-50/70 sm:p-8"
              style={{ borderColor: C.line }}
            >
              <Image src={link.icon} alt="" width={48} height={48} className="shrink-0" />
              <div className="flex flex-col gap-1.5">
                <h4 className="text-base font-bold" style={{ color: C.ink }}>
                  {link.title}
                </h4>
                <p className="text-sm leading-[23.1px]" style={{ color: C.muted }}>
                  {link.body}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
