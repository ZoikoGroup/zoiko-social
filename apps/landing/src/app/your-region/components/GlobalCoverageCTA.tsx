"use client";

export default function GlobalCoverageCTA() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="mx-auto w-full max-w-[1232px] px-6 pb-8 lg:px-0">
        <div
          className="
            relative
            h-44
            w-full
            overflow-hidden
            rounded-[32px]
            bg-cyan-950
          "
        >
          {/* Orange radial glow */}
          <div
            className="
              absolute
              -right-[40px]
              -top-[140px]
              size-96
              rounded-[190px]
              bg-[radial-gradient(circle,_rgba(249,115,22,0.20)_0%,_rgba(249,115,22,0)_70%)]
            "
          />

          {/* Heading */}
          <h2
            className="
              absolute
              left-[40px]
              top-[48px]
              text-2xl
              font-extrabold
              leading-9
              text-white
            "
          >
            Stay updated on Global Coverage
          </h2>

          {/* Description */}
          <p
            className="
              absolute
              left-[40px]
              top-[93px]
              text-sm
              font-normal
              leading-5
              text-white/80
            "
          >
            Follow your region and topics you care about, and choose a Local
            Digest cadence that
            <br />
            works for you — restrained by default.
          </p>

          {/* Join Free Button */}
          <button
            type="button"
            className="
              absolute
              right-[40px]
              top-[66.67px]
              flex
              h-12
              w-64
              items-center
              justify-center
              rounded-xl
              bg-orange-500
              text-base
              font-semibold
              leading-6
              text-white
            "
          >
            Join Free
          </button>
        </div>
      </div>
    </section>
  );
}