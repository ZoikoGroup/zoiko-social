import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

export default function ShelterSpotlightSection() {
  return (
    <section id="shelter-spotlight" className="w-full bg-[#F7F9FA] pb-16 lg:pb-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <h2 className="text-center text-2xl font-extrabold tracking-[-0.01em] text-[#102A32] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]">
          Featured Shelter Partner
        </h2>

        {/* Spotlight Card */}
        <div className="mt-8 overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#DCE5E8] bg-white p-5 sm:p-8 lg:p-10 shadow-sm">
          <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:gap-12">
            {/* Left: Facility Image (541x350) */}
            <div className="relative h-[220px] sm:h-[300px] lg:h-[350px] w-full shrink-0 overflow-hidden rounded-[20px] sm:rounded-[24px] lg:w-[48%]">
              <Image
                src={IMAGES.shelterSpotlight}
                alt="Happy Dog Rescue shelter facility"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Right: Shelter Details */}
            <div className="flex w-full flex-1 flex-col justify-center">
              <h3
                className="text-2xl font-extrabold tracking-[-0.01em] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]"
                style={{ color: C.mosque }}
              >
                Happy Dog Rescue
              </h3>

              <p className="mt-3 text-sm sm:text-base font-normal leading-relaxed text-[#5E7076] sm:text-[17px] sm:leading-[28px]">
                A 501(c)(3) nonprofit dedicated to rescuing and rehoming dogs from shelters and the streets. Since 2015, we&apos;ve found forever homes for over 5,000 dogs.
              </p>

              {/* 3 Key Stats */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-y border-[#DCE5E8] py-4 text-center sm:gap-6 sm:py-5">
                <div>
                  <div
                    className="text-xl sm:text-2xl font-extrabold sm:text-3xl lg:text-[28px]"
                    style={{ color: C.mosque }}
                  >
                    5K+
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs text-[#5E7076]">
                    Dogs adopted
                  </div>
                </div>

                <div>
                  <div
                    className="text-xl sm:text-2xl font-extrabold sm:text-3xl lg:text-[28px]"
                    style={{ color: C.mosque }}
                  >
                    99%
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs text-[#5E7076]">
                    Success rate
                  </div>
                </div>

                <div>
                  <div
                    className="text-xl sm:text-2xl font-extrabold sm:text-3xl lg:text-[28px]"
                    style={{ color: C.mosque }}
                  >
                    15
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs text-[#5E7076]">
                    Locations
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 sm:mt-8">
                <button
                  type="button"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: C.mosque }}
                >
                  Visit Their Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
