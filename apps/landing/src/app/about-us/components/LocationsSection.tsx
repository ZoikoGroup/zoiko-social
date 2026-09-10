import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";
import { Band, SectionHeading } from "./primitives";

const LOCATIONS = [
  {
    label: "Headquarters",
    city: "Sacramento, California",
    address: "1607 21st Street, Suite 8, Sacramento, CA 95811, USA",
    image: IMAGES.sacramento,
    alt: "The Sacramento skyline at dusk",
  },
  {
    label: "European Headquarters",
    city: "London, United Kingdom",
    address:
      "107–109 Great Portland Street, 5th Floor, London W1W 6PP, United Kingdom",
    image: IMAGES.london,
    alt: "An aerial view of London and the Thames",
  },
];

/** "Where we're based" — one card per office. */
export default function LocationsSection() {
  return (
    <Band>
      <SectionHeading
        title="Where we're based"
        subtitle="Zoiko Social operates from two hubs supporting our global community."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {LOCATIONS.map((location) => (
          <article
            key={location.city}
            className="overflow-hidden rounded-[20px] bg-white"
            style={{ border: `1px solid ${C.line}` }}
          >
            <div className="relative h-44">
              <Image
                src={location.image}
                alt={location.alt}
                fill
                sizes="(max-width: 768px) 100vw, 602px"
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <p
                className="text-xs font-bold uppercase leading-4 tracking-wide"
                style={{ color: C.brand }}
              >
                {location.label}
              </p>
              <h3
                className="mt-1 text-lg font-bold leading-7"
                style={{ color: C.inkDeep }}
              >
                {location.city}
              </h3>
              <address
                className="mt-1 text-sm not-italic leading-5"
                style={{ color: C.muted }}
              >
                {location.address}
              </address>
            </div>
          </article>
        ))}
      </div>
    </Band>
  );
}
