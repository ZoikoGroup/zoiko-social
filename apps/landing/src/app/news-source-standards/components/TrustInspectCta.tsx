"use client";

export default function TrustInspectCta() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div
        className="
          mx-auto
          w-full
          max-w-[1232px]
          px-4
          pt-[56px]
          pb-[46px]
          sm:px-6
          lg:px-0
        "
      >
        {/* CTA Box */}
        <div
          className="
            relative
            h-[288px]
            w-full
            overflow-hidden
            rounded-[32px]
          "
          style={{
            background:
              "linear-gradient(67deg, #073B47 0%, #066879 65%)",
          }}
        >
          {/* Heading */}
          <h2
            className="
              absolute
              left-1/2
              top-[55px]
              w-[480.76px]
              max-w-[calc(100%-40px)]
              -translate-x-1/2
              text-center
              text-[24px]
              font-extrabold
              leading-10
              tracking-[-0.3px]
              text-white
            "
          >
            Trust is something you can inspect, not
            <br />
            just take our word for.
          </h2>

          {/* Description */}
          <p
            className="
              absolute
              left-1/2
              top-[145px]
              w-[475.58px]
              max-w-[calc(100%-40px)]
              -translate-x-1/2
              text-center
              text-[14px]
              font-normal
              leading-5
              text-white/90
            "
          >
            Read verified-source animal news, or flag something that doesn&apos;t
            look
            <br className="hidden sm:block" />
            right — neither is ever gated behind sign-in or premium.
          </p>

          {/* Buttons */}
          <div
            className="
              absolute
              left-1/2
              top-[209.5px]
              flex
              -translate-x-1/2
              items-center
              gap-3
            "
          >
            {/* Read Animal News */}
            <button
              type="button"
              className="
                flex
                h-10
                w-40
                items-center
                justify-center
                rounded-xl
                bg-[#F97316]
                text-center
                text-sm
                font-semibold
                leading-5
                text-white
                transition-opacity
                hover:opacity-90
              "
            >
              Read Animal News
            </button>

            {/* Report an Inaccuracy */}
            <button
              type="button"
              className="
                flex
                h-10
                w-44
                items-center
                justify-center
                rounded-xl
                border
                border-white/50
                bg-transparent
                text-center
                text-sm
                font-semibold
                leading-5
                text-white
                transition-colors
                hover:bg-white/10
              "
            >
              Report an Inaccuracy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}