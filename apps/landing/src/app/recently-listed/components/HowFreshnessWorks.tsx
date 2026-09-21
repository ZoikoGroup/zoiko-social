import { C } from "./theme";

/* --------------------------------------------------
   LISTED VS UPDATED ICON
-------------------------------------------------- */

function ListedUpdatedIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke={C.cyan15}
        strokeWidth="1.67"
      />

      <path
        d="M10 6.67V10.5L12.92 12"
        stroke={C.cyan15}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------
   VERIFIED SOURCE ICON
-------------------------------------------------- */

function VerifiedSourceIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="
          M10 1.67
          L16.67 4.17
          V9.58
          C16.67 13.75 13.92 16.5 10 18.33
          C6.08 16.5 3.33 13.75 3.33 9.58
          V4.17
          L10 1.67Z
        "
        stroke={C.cyan15}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M6.75 9.9L9 12.15L13.25 7.9"
        stroke={C.cyan15}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------
   NO PAID FRESHNESS ICON
-------------------------------------------------- */

function NoPaidFreshnessIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="
          M15.83 7.5
          C14.88 4.9 12.65 3.33 10 3.33
          C7.58 3.33 5.5 4.65 4.38 6.67
        "
        stroke={C.cyan15}
        strokeWidth="1.67"
        strokeLinecap="round"
      />

      <path
        d="M4.38 3.92V6.67H7.13"
        stroke={C.cyan15}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="
          M4.17 12.5
          C5.12 15.1 7.35 16.67 10 16.67
          C12.42 16.67 14.5 15.35 15.62 13.33
        "
        stroke={C.cyan15}
        strokeWidth="1.67"
        strokeLinecap="round"
      />

      <path
        d="M15.62 16.08V13.33H12.87"
        stroke={C.cyan15}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------
   ICON BOX
-------------------------------------------------- */

function IconBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-white
      "
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------
   ARROW RIGHT ICON
-------------------------------------------------- */

function ArrowRightIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.5 2.5L8 6L4.5 9.5"
        stroke={C.cyan25}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------- */

export default function HowFreshnessWorks() {
  return (
    <section
      className="
        w-full
        px-5
        py-12
        lg:px-0
        lg:py-16
      "
      style={{
        backgroundColor: C.page,
      }}
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1232px]
          flex-col
          items-center
        "
        style={{
          backgroundColor: C.page,
        }}
      >
        {/* ==========================================
            HEADING
        ========================================== */}

        <div
          className="
            flex
            w-full
            max-w-[640px]
            flex-col
            items-center
            gap-3
            text-center
          "
        >
          <h2
            className="
              text-3xl
              font-extrabold
              leading-[48px]
            "
            style={{
              color: C.cyan15,
            }}
          >
            How freshness works here
          </h2>

          <p
            className="
              text-base
              font-normal
              leading-6
            "
            style={{
              color: C.azure42,
            }}
          >
            Publication timing is transparent,
            resistant to manipulation, and never for
            sale.
          </p>
        </div>

        {/* ==========================================
            THREE INFORMATION COLUMNS
        ========================================== */}

        <div
          className="
            mt-16
            grid
            w-full
            grid-cols-1
            gap-6
            md:grid-cols-3
          "
        >
          {/* ========================================
              LISTED VS UPDATED
          ======================================== */}

          <div
            className="
              flex
              w-full
              flex-col
              items-start
              gap-1
              pb-8
            "
          >
            <IconBox>
              <ListedUpdatedIcon />
            </IconBox>

            <div
              className="
                w-full
                pt-1.5
                pb-[0.75px]
              "
            >
              <h3
                className="
                  text-sm
                  font-bold
                  leading-5
                "
                style={{
                  color: C.cyan13,
                }}
              >
                Listed vs. Updated
              </h3>
            </div>

            <div className="w-full">
              <p
                className="
                  text-xs
                  font-normal
                  leading-5
                "
                style={{
                  color: C.azure42,
                }}
              >
                &quot;Listed&quot; is the original,
                immutable publication time.
                &quot;Updated&quot; marks a later material
                change and never resets that original
                date.
              </p>
            </div>
          </div>

          {/* ========================================
              VERIFIED SOURCE
          ======================================== */}

          <div
            className="
              flex
              w-full
              flex-col
              items-start
              gap-1
            "
          >
            <IconBox>
              <VerifiedSourceIcon />
            </IconBox>

            <div
              className="
                w-full
                pt-1.5
                pb-[0.75px]
              "
            >
              <h3
                className="
                  text-sm
                  font-bold
                  leading-5
                "
                style={{
                  color: C.cyan13,
                }}
              >
                Verified source, always
              </h3>
            </div>

            <div className="w-full">
              <p
                className="
                  text-xs
                  font-normal
                  leading-5
                "
                style={{
                  color: C.azure42,
                }}
              >
                Every listing here retains verified
                rescue or shelter provenance.
                Verification is a trust signal, not a
                guarantee.
              </p>
            </div>

            <button
              type="button"
              className="
                flex
                items-center
                gap-1.5
                pt-[3.1px]
              "
            >
              <span
                className="
                  text-base
                  font-semibold
                  leading-6
                "
                style={{
                  color: C.cyan25,
                }}
              >
                How We Verify
              </span>

              <ArrowRightIcon />
            </button>
          </div>

          {/* ========================================
              NO PAID FRESHNESS
          ======================================== */}

          <div
            className="
              flex
              w-full
              flex-col
              items-start
              gap-1
              pb-8
            "
          >
            <IconBox>
              <NoPaidFreshnessIcon />
            </IconBox>

            <div
              className="
                w-full
                pt-1.5
                pb-[0.75px]
              "
            >
              <h3
                className="
                  text-sm
                  font-bold
                  leading-5
                "
                style={{
                  color: C.cyan13,
                }}
              >
                No paid freshness
              </h3>
            </div>

            <div className="w-full">
              <p
                className="
                  text-xs
                  font-normal
                  leading-5
                "
                style={{
                  color: C.azure42,
                }}
              >
                Payment, Premium status, or popularity
                can never move a listing up in Recently
                Listed order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}