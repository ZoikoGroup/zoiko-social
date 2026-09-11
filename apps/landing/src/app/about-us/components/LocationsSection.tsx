import Image from "next/image";
import { C } from "./theme";
import { Band, SectionHeading } from "./primitives";

/*
  Placeholder photography for the locations grid: the nine Article*.png files
  in public/communities-all/, referenced by their original names. next/image
  URL-encodes the spaces and parentheses, so the paths need no escaping.
  Rename them to content-accurate slugs (like the rest of /public/about-us)
  once their final contents are decided.
*/
const IMAGE_DIR = "/communities-all";

const ARTICLE_IMAGES = [
  `${IMAGE_DIR}/Article.png`,
  `${IMAGE_DIR}/Article (1).png`,
  `${IMAGE_DIR}/Article (2).png`,
  `${IMAGE_DIR}/Article (3).png`,
  `${IMAGE_DIR}/Article (4).png`,
  `${IMAGE_DIR}/Article (5).png`,
  `${IMAGE_DIR}/Article (6).png`,
  `${IMAGE_DIR}/Article (7).png`,
  `${IMAGE_DIR}/Article (8).png`,
] as const;

/*
  The first two entries are the real offices; entries 3–9 are PLACEHOLDERS
  (generic city/address text) waiting for real location data.
*/
const LOCATIONS = [
  {
    label: "Headquarters",
    city: "Sacramento, California",
    address: "1607 21st Street, Suite 8, Sacramento, CA 95811, USA",
    image: ARTICLE_IMAGES[0],
  },
  {
    label: "European Headquarters",
    city: "London, United Kingdom",
    address:
      "107–109 Great Portland Street, 5th Floor, London W1W 6PP, United Kingdom",
    image: ARTICLE_IMAGES[1],
  },
  {
    // PLACEHOLDER — replace with a real office.
    label: "Regional Office",
    city: "City Name, Country",
    address: "Street address, postal code, city, country",
    image: ARTICLE_IMAGES[2],
  },
  {
    // PLACEHOLDER — replace with a real office.
    label: "Regional Office",
    city: "City Name, Country",
    address: "Street address, postal code, city, country",
    image: ARTICLE_IMAGES[3],
  },
  {
    // PLACEHOLDER — replace with a real office.
    label: "Regional Office",
    city: "City Name, Country",
    address: "Street address, postal code, city, country",
    image: ARTICLE_IMAGES[4],
  },
  {
    // PLACEHOLDER — replace with a real office.
    label: "Regional Office",
    city: "City Name, Country",
    address: "Street address, postal code, city, country",
    image: ARTICLE_IMAGES[5],
  },
  {
    // PLACEHOLDER — replace with a real office.
    label: "Regional Office",
    city: "City Name, Country",
    address: "Street address, postal code, city, country",
    image: ARTICLE_IMAGES[6],
  },
  {
    // PLACEHOLDER — replace with a real office.
    label: "Regional Office",
    city: "City Name, Country",
    address: "Street address, postal code, city, country",
    image: ARTICLE_IMAGES[7],
  },
  {
    // PLACEHOLDER — replace with a real office.
    label: "Regional Office",
    city: "City Name, Country",
    address: "Street address, postal code, city, country",
    image: ARTICLE_IMAGES[8],
  },
];

/** "Where we're based" — one card per office. */
export default function LocationsSection() {
  return (
    <Band>
      <SectionHeading
        title="Where we're based"
        subtitle="Zoiko Social operates from hubs around the world supporting our global community."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {LOCATIONS.map((location) => (
          <article
            key={location.image}
            className="overflow-hidden rounded-[20px] bg-white"
            style={{ border: `1px solid ${C.line}` }}
          >
            <div className="relative h-44">
              <Image
                src={location.image}
                alt={`Zoiko Social office — ${location.city}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
