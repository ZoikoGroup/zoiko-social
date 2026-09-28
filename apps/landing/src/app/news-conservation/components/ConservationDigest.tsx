"use client";

export default function ConservationDigest() {
  return (
    <section className="w-full bg-[#F5F8F8] py-6">
      <div className="mx-auto w-full max-w-[1232px] px-4 lg:px-0">
        <div
          className="
            w-full
            rounded-[32px]
            bg-gradient-to-r
            from-[#073B47]
            to-[#066879]
            px-6
            py-8
            lg:px-10
            lg:py-10
          "
        >
          <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

            {/* LEFT CONTENT */}
            <div className="w-full max-w-[384px]">
              <h2 className="text-2xl font-extrabold leading-9 text-white">
                Stay updated on conservation,
                <br />
                calmly.
              </h2>

              <p className="mt-[27px] text-sm font-normal leading-5 text-white opacity-90">
                Follow Conservation and choose a restrained digest cadence.
            
                You&apos;ll only hear about material changes — not every reaction or
            
                comment.
              </p>
            </div>

            {/* RIGHT CONTROLS */}
            <div className="flex w-full flex-wrap items-center justify-start gap-2.5 lg:w-auto lg:justify-end">

              {/* WEEKLY DIGEST */}
              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  rounded-xl
                  border
                  border-white/40
                  bg-white/10
                  px-4
                  py-2.5
                  text-sm
                  font-normal
                  leading-4
                  text-white
                "
              >
                <span className="pr-12">
                  Weekly digest
                </span>
              </button>

              {/* SAVE PREFERENCE */}
              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#F59E0B]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#EA9708]
                "
              >
                Save preference
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}