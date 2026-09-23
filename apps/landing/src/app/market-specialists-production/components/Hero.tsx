import Image from "next/image";

const HERO_IMAGE = "/market-specialists-production/hero-veterinary-specialist-with-dog.webp";

const SPECIALTIES = [
  "Dermatology",
  "Oncology",
  "Cardiology",
  "Orthopedics",
  "Surgery",
  "Internal Medicine",
  "Neurology",
  "Ophthalmology",
];

/**
 * Compact hero + "Explore specialty areas" cloud.
 *
 * Figma: desktop 584:23396, mobile 584:23829. The two frames use different
 * headline copy ("Find specialists for Professional Care" vs "Find
 * specialists with clearer trust signals.") and the desktop hero has a
 * photo beside the copy that the mobile frame omits entirely — both are
 * reproduced faithfully per breakpoint rather than approximated to one string.
 */
export default function Hero() {
  return (
    <section className="w-full bg-white pb-28 pt-20 lg:pb-14">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 lg:gap-12 lg:px-[105px]">
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <p className="font-jakarta text-[12px] font-semibold uppercase leading-[19.2px] tracking-[0.6px] text-[#066879]">
              Market / Professional Care
            </p>

            <h1 className="hidden font-jakarta text-[42px] font-extrabold leading-[50.4px] tracking-[-0.84px] text-[#073b47] lg:block">
              Find specialists for Professional Care
            </h1>
            <h1 className="font-jakarta text-[28px] font-extrabold leading-[33.6px] tracking-[-0.56px] text-[#073b47] lg:hidden">
              Find specialists with clearer trust signals.
            </h1>

            <p className="max-w-[820px] pb-6 font-jakarta text-[16px] font-normal leading-[27.2px] text-[#5e7076]">
              Explore veterinary specialists in dermatology, oncology, orthopedics, and other specialty areas.
              Discover verified specialists with clear expertise and trust signals from your area.
            </p>

            <div className="flex flex-wrap items-start gap-3">
              <button
                type="button"
                className="flex min-h-[40px] items-center justify-center rounded-xl bg-[#066879] px-4 py-[11px] font-jakarta text-[14px] font-semibold text-white"
              >
                Search specialists
              </button>
              <button
                type="button"
                className="flex min-h-[40px] items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-4 py-[10px] font-jakarta text-[14px] font-semibold text-[#066879]"
              >
                Learn about specialties
              </button>
            </div>
          </div>

          <div className="hidden h-[360px] w-[491px] shrink-0 overflow-hidden rounded-[28px] border border-[#dce5e8] shadow-[0px_8px_24px_0px_rgba(7,59,71,0.1)] lg:block">
            <Image
              src={HERO_IMAGE}
              alt="Veterinary specialist examining a dog"
              width={491}
              height={360}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        <div
          className="flex w-full flex-col items-center justify-center gap-6 rounded-[28px] border border-[#dce5e8] px-6 py-8 lg:px-12"
          style={{ backgroundImage: "linear-gradient(135deg, rgba(6, 104, 121, 0.05) 0%, rgba(232, 137, 36, 0.05) 100%)" }}
        >
          <h2 className="w-full font-jakarta text-[17px] font-bold leading-[27.2px] text-[#102a32] lg:hidden">
            🔍 Explore specialty areas
          </h2>
          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            {SPECIALTIES.map((specialty) => (
              <button
                key={specialty}
                type="button"
                className="rounded-[24px] border-2 border-[#dce5e8] bg-white px-4 py-[10px] font-jakarta text-[14px] font-bold text-[#102a32]"
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
