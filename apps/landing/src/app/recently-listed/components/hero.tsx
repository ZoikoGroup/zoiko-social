import Image from "next/image";
import { C } from "./theme";
import { IMAGES } from "./images";

const listings = [
  {
    image: IMAGES.hero1,
    published: "Published 2 hours ago",
    name: "Nova",
    type: "Dog",
  },
  {
    image: IMAGES.hero2,
    published: "Published 5 hours ago",
    name: "Juniper",
    type: "Rabbit",
  },
  {
    image: IMAGES.hero3,
    published: "Published 1 day ago",
    name: "Milo",
    type: "Cat",
  },
];

export default function Hero() {
  return (
    <section
  className="w-full"
  style={{ backgroundColor: C.page }}
>
      <div className="mx-auto flex w-full max-w-[1232px] flex-col gap-10 px-5 py-12 lg:flex-row lg:items-start lg:gap-12 lg:px-0">
        
        {/* LEFT COLUMN */}
        <div className="flex w-full flex-col items-start lg:w-1/2">
          
          {/* Eyebrow */}
          <div
            className="text-base font-normal leading-6"
            style={{ color: C.cyan13 }}
          >
            Recently Listed
          </div>

          {/* Heading */}
          <h1
            className="mt-0 text-3xl font-extrabold leading-[48px]"
            style={{ color: C.cyan15 }}
          >
            Meet the newest animals listed for adoption.
          </h1>

          {/* Description */}
          <p
            className="pt-3 text-base font-normal leading-6"
            style={{ color: C.cyan13 }}
          >
            Browse recently published adoption listings from verified rescues
            and shelters. Use filters to find animals that fit your household,
            location, and preferences.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              type="button"
              className="rounded-xl px-6 py-3.5 text-center text-base font-semibold leading-6"
              style={{
                backgroundColor: C.cyan25,
                color: C.white,
                border: `1px solid transparent`,
              }}
            >
              Browse New Listings
            </button>

            <button
              type="button"
              className="rounded-xl px-6 py-3.5 text-center text-base font-semibold leading-6"
              style={{
                backgroundColor: C.white,
                color: C.cyan15,
                border: `1px solid ${C.cyan89}`,
              }}
            >
              How Recent Listings Work
            </button>
          </div>

          {/* Disclaimer */}
          <div className="max-w-[640px] pt-4">
            <p
              className="text-xs font-normal leading-5"
              style={{ color: C.azure42 }}
            >
              &quot;Recently listed&quot; reflects publication timing. It does
              not indicate urgency, suitability, or priority. Always review
              the full adoption profile and rescue/shelter process.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div
          className="grid w-full grid-cols-2 gap-3 rounded-3xl bg-white p-4 lg:w-1/2"
          style={{
            boxShadow: C.shadow,
            border: `1px solid ${C.cyan89}`,
          }}
        >
          {/* HERO 1 - LARGE */}
          <div
            className="relative row-span-2 min-h-[324px] overflow-hidden rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${C.imageGradientStart}, ${C.imageGradientEnd})`,
              border: `1px solid ${C.cyan89}`,
            }}
          >
            <Image
              src={listings[0].image}
              alt={`${listings[0].name} - ${listings[0].type}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 280px"
            />

            {/* Published Badge */}
            <div
              className="absolute left-[9px] top-[9px] rounded-full px-2 py-[2.5px]"
              style={{ backgroundColor: C.badgeBackground }}
            >
              <span
                className="text-[9.5px] font-bold leading-4"
                style={{ color: C.cyan15 }}
              >
                {listings[0].published}
              </span>
            </div>

            {/* Animal Name */}
            <div className="absolute bottom-[9px] left-[9px]">
              <span
                className="text-xs font-bold leading-4 text-white"
                style={{
                  textShadow: "0px 1px 3px rgba(0,0,0,0.40)",
                }}
              >
                {listings[0].name} · {listings[0].type}
              </span>
            </div>
          </div>

          {/* HERO 2 */}
          <div
            className="relative min-h-[155px] overflow-hidden rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${C.imageGradientStart}, ${C.imageGradientEnd})`,
              border: `1px solid ${C.cyan89}`,
            }}
          >
            <Image
              src={listings[1].image}
              alt={`${listings[1].name} - ${listings[1].type}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 280px"
            />

            <div
              className="absolute left-[9px] top-[9px] rounded-full px-2 py-[2.5px]"
              style={{ backgroundColor: C.badgeBackground }}
            >
              <span
                className="text-[9.5px] font-bold leading-4"
                style={{ color: C.cyan15 }}
              >
                {listings[1].published}
              </span>
            </div>

            <div className="absolute bottom-[9px] left-[9px]">
              <span
                className="text-xs font-bold leading-4 text-white"
                style={{
                  textShadow: "0px 1px 3px rgba(0,0,0,0.40)",
                }}
              >
                {listings[1].name} · {listings[1].type}
              </span>
            </div>
          </div>

          {/* HERO 3 */}
          <div
            className="relative min-h-[155px] overflow-hidden rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${C.imageGradientStart}, ${C.imageGradientEnd})`,
              border: `1px solid ${C.cyan89}`,
            }}
          >
            <Image
              src={listings[2].image}
              alt={`${listings[2].name} - ${listings[2].type}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 280px"
            />

            <div
              className="absolute left-[9px] top-[9px] rounded-full px-2 py-[2.5px]"
              style={{ backgroundColor: C.badgeBackground }}
            >
              <span
                className="text-[9.5px] font-bold leading-4"
                style={{ color: C.cyan15 }}
              >
                {listings[2].published}
              </span>
            </div>

            <div className="absolute bottom-[9px] left-[9px]">
              <span
                className="text-xs font-bold leading-4 text-white"
                style={{
                  textShadow: "0px 1px 3px rgba(0,0,0,0.40)",
                }}
              >
                {listings[2].name} · {listings[2].type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}