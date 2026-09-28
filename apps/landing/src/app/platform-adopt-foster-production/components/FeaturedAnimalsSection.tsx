import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

interface FeaturedAnimal {
  id: string;
  name: string;
  breed: string;
  location: string;
  age: string;
  feature: string;
  image: string;
  badge?: string;
}

const FEATURED_ANIMALS: FeaturedAnimal[] = [
  {
    id: "max",
    name: "Max",
    breed: "Golden Retriever Mix",
    location: "Chicago, IL",
    age: "Age: 3 years",
    feature: "Vaccinated",
    image: IMAGES.featured.max,
    badge: "🆕 New",
  },
  {
    id: "luna",
    name: "Luna",
    breed: "Tabby Cat",
    location: "Boston, MA",
    age: "Age: 2 years",
    feature: "Good with kids",
    image: IMAGES.featured.luna,
    badge: "Urgent",
  },
  {
    id: "buddy",
    name: "Buddy",
    breed: "Beagle Mix",
    location: "Denver, CO",
    age: "Age: 1 year",
    feature: "Good with dogs",
    image: IMAGES.featured.buddy,
  },
  {
    id: "whiskers",
    name: "Whiskers",
    breed: "Orange Tabby",
    location: "Seattle, WA",
    age: "Age: 5 years",
    feature: "Calm & quiet",
    image: IMAGES.featured.whiskers,
  },
];

export default function FeaturedAnimalsSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <h2 className="text-2xl font-extrabold tracking-[-0.01em] text-[#102A32] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]">
          Meet Animals Looking for Homes
        </h2>

        {/* 4 Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_ANIMALS.map((animal) => (
            <div
              key={animal.id}
              className="group flex flex-col overflow-hidden rounded-[28px] border border-[#DCE5E8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image Container with Badge */}
              <div className="relative h-[220px] w-full overflow-hidden bg-slate-100">
                <Image
                  src={animal.image}
                  alt={animal.name}
                  fill
                  className="object-cover object-center transition duration-300 group-hover:scale-105"
                />
                {animal.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: C.zest }}
                    >
                      {animal.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="text-xl font-bold text-[#102A32]">
                    {animal.name}
                  </h3>
                  <p
                    className="mt-1 text-xs font-semibold"
                    style={{ color: C.zest }}
                  >
                    {animal.breed}
                  </p>

                  <div className="mt-3 space-y-2 text-xs text-[#5E7076]">
                    <div className="flex items-center gap-2">
                      <Image
                        src={IMAGES.featured.iconLocation}
                        alt="Location"
                        width={14}
                        height={14}
                        className="shrink-0 opacity-80"
                      />
                      <span>{animal.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Image
                        src={IMAGES.featured.iconCalendar}
                        alt="Age"
                        width={14}
                        height={14}
                        className="shrink-0 opacity-80"
                      />
                      <span>{animal.age}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 font-medium text-[#102A32]">
                      <span className="font-bold text-[#066879]">✓</span>
                      <span className="text-[#5E7076]">{animal.feature}</span>
                    </div>
                  </div>
                </div>

                {/* View Profile Button */}
                <button
                  type="button"
                  className="mt-5 w-full rounded-xl py-3 text-center text-[13.3px] font-bold transition hover:opacity-90 active:scale-[0.99]"
                  style={{
                    backgroundColor: C.blackSqueeze,
                    color: C.mosque,
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
