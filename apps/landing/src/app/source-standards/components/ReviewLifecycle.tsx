"use client";

export default function ReviewLifecycle() {
  const steps = [
    {
      number: "1",
      title: "Candidate",
      description: (
        <>
          Source record +<br />
          provenance created.
        </>
      ),
    },
    {
      number: "2",
      title: "Initial review",
      description: (
        <>
          Evidence collected per<br />
          methodology version.
        </>
      ),
    },
    {
      number: "3",
      title: "Approval",
      description: (
        <>
          Authorized role approves<br />
          label &amp; effective date.
        </>
      ),
    },
    {
      number: "4",
      title: "Publication",
      description: (
        <>
          Registry becomes<br />
          authoritative and visible.
        </>
      ),
    },
    {
      number: "5",
      title: "Monitoring",
      description: (
        <>
          Substantiated signals<br />
          tracked — never popularity.
        </>
      ),
    },
    {
      number: "6",
      title: "Re-review",
      description: (
        <>
          Triggered by ownership<br />
          change or material signals.
        </>
      ),
    },
    {
      number: "7",
      title: "Change / retire",
      description: (
        <>
          New state published with a<br />
          change note.
        </>
      ),
    },
  ];

  return (
    <section className="w-full bg-[#F5F8F8]">
      <div
        className="
          relative
          mx-auto
          h-[384px]
          w-full
          max-w-[1232px]
          px-4
          sm:px-6
          lg:px-0
        "
      >
        {/* ========================================================= */}
        {/* HEADING */}
        {/* ========================================================= */}

        <h2
          className="
            absolute
            left-0
            top-[56px]
            m-0
            whitespace-nowrap
            text-[24px]
            font-extrabold
            leading-10
            tracking-[-0.4px]
            text-[#073B47]
          "
        >
          How the review lifecycle works
        </h2>

        {/* ========================================================= */}
        {/* DESCRIPTION */}
        {/* ========================================================= */}

        <p
          className="
            absolute
            left-0
            top-[107px]
            m-0
            w-[700px]
            text-[14px]
            font-normal
            leading-6
            text-[#5B7178]
          "
        >
          Initial review → approval → publication → monitoring → re-review →
          change or retirement. Every step is
          <br />
          server-owned and audited.
        </p>

        {/* ========================================================= */}
        {/* TIMELINE */}
        {/* ========================================================= */}

        <div
          className="
            absolute
            left-0
            top-[180.85px]
            h-[112px]
            w-full
            overflow-hidden
          "
        >
          {/* ======================================================= */}
          {/* CONNECTING LINES */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[70px]
              top-[17px]
              z-0
              h-[2px]
              w-[140px]
              bg-[#E1E6E8]
            "
          />

          <div
            className="
              absolute
              left-[210px]
              top-[17px]
              z-0
              h-[2px]
              w-[140px]
              bg-[#E1E6E8]
            "
          />

          <div
            className="
              absolute
              left-[350px]
              top-[17px]
              z-0
              h-[2px]
              w-[140px]
              bg-[#E1E6E8]
            "
          />

          <div
            className="
              absolute
              left-[490px]
              top-[17px]
              z-0
              h-[2px]
              w-[140px]
              bg-[#E1E6E8]
            "
          />

          <div
            className="
              absolute
              left-[630px]
              top-[17px]
              z-0
              h-[2px]
              w-[140px]
              bg-[#E1E6E8]
            "
          />

          <div
            className="
              absolute
              left-[770px]
              top-[17px]
              z-0
              h-[2px]
              w-[140px]
              bg-[#E1E6E8]
            "
          />

          {/* ======================================================= */}
          {/* STEPS */}
          {/* ======================================================= */}

          <div className="relative flex h-full w-[980px]">
            {steps.map((step) => (
              <div
                key={step.number}
                className="
                  relative
                  h-[112px]
                  w-[140px]
                  shrink-0
                "
              >
                {/* Number Circle */}

                <div
                  className="
                    absolute
                    left-[54px]
                    top-0
                    z-10
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-[#073B47]
                  "
                >
                  <span
                    className="
                      text-[11px]
                      font-bold
                      leading-5
                      text-white
                    "
                  >
                    {step.number}
                  </span>
                </div>

                {/* Title */}

                <div
                  className="
                    absolute
                    left-[10px]
                    top-[44px]
                    flex
                    h-4
                    w-[120px]
                    items-center
                    justify-center
                    whitespace-nowrap
                    text-center
                    text-[11px]
                    font-bold
                    leading-4
                    text-[#073B47]
                  "
                >
                  {step.title}
                </div>

                {/* Description */}

                <div
                  className="
                    absolute
                    left-[10px]
                    top-[66px]
                    w-[120px]
                    text-center
                    text-[10px]
                    font-normal
                    leading-4
                    text-[#5B7178]
                  "
                >
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}