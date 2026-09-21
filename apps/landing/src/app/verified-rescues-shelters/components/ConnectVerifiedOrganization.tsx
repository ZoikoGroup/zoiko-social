import { C } from "./theme";

export default function ConnectVerifiedOrganization() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: C.page }}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1232px]
          px-5
          py-6

          sm:px-8
          sm:py-8

          lg:px-10
          lg:py-8
        "
      >
        <div
          className="
            relative
            flex
            min-h-[320px]
            w-full
            flex-col
            items-center
            overflow-hidden
            rounded-[32px]
            bg-cover
            bg-center
            bg-no-repeat
          "
          style={{
            backgroundImage:
              "url('/verified-rescues-shelters/bg.png')",
          }}
        >
          {/* Background overlay */}
          <div
            className="
              absolute
              inset-0
              bg-[rgba(6,104,121,0.72)]
            "
          />

          {/* CONTENT */}
          <div
            className="
              relative
              z-10
              flex
              w-full
              max-w-[620px]
              flex-col
              items-center
              px-5
              pt-12
              text-center

              sm:px-8
              sm:pt-[52px]
            "
          >
            {/* Heading */}
            <h2
              className="
                text-2xl
                font-extrabold
                leading-10
                text-white
              "
            >
              Ready to connect with a verified
              <br />
              organization?
            </h2>

            {/* Description */}
            <p
              className="
                mt-5
                max-w-[460px]
                text-sm
                font-normal
                leading-5
              "
              style={{
                color: "rgba(255, 255, 255, 0.90)",
              }}
            >
              Create a free Zoiko Social account to follow organizations, get
              new-listing alerts, and reach out through approved contact paths.
            </p>

            {/* CTA BUTTONS */}
            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
              "
            >
              {/* Join Free */}
              <button
                type="button"
                className="
                  inline-flex
                  min-h-[44px]
                  items-center
                  justify-center
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  leading-5
                  text-white
                  transition-opacity
                  hover:opacity-90
                "
                style={{
                  backgroundColor: "#F59A23",
                }}
              >
                Join Free
              </button>

              {/* Browse Animals */}
              <button
                type="button"
                className="
                  inline-flex
                  min-h-[44px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  leading-5
                  text-white
                  underline
                  transition-colors
                  hover:bg-white/10
                "
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderColor: "rgba(255, 255, 255, 0.50)",
                }}
              >
                Browse Animals for Adoption
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}