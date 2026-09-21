"use client";

export default function MethodologyVersionHistory() {
  const versions = [
    {
      version: "v2.3",
      date: "Aug 12, 2026",
      change:
        "Clarified domain-context evidence for specialist conservation and veterinary reporting.",
      active: true,
    },
    {
      version: "v2.2",
      date: "Feb 3, 2026",
      change:
        "Added explicit fairness guidance for local, nonprofit, and multilingual publishers.",
      active: false,
    },
    {
      version: "v2.1",
      date: "Jan 4, 2025",
      change:
        "Introduced Tier 1 / Tier 2 Source Verified public labels.",
      active: false,
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
        "
      >
        {/* Heading */}
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
          Methodology version history
        </h2>

        {/* Description */}
        <p
          className="
            absolute
            left-0
            top-[107px]
            m-0
            whitespace-nowrap
            text-[14px]
            font-normal
            leading-6
            text-[#5B7178]
          "
        >
          Every active and historic rating is bound to the methodology version
          used to assess it.
        </p>

        {/* Table */}
        <div
          className="
            absolute
            left-0
            top-[150.92px]
            w-full
            overflow-hidden
            rounded-none
            border
            border-[#DCEAEE]
          "
        >
          {/* ====================================================== */}
          {/* TABLE HEADER */}
          {/* ====================================================== */}

          <div className="grid h-[44px] grid-cols-[128.88px_193.28px_1fr]">
            {/* Version */}
            <div
              className="
                flex
                items-center
                border-r
                border-[#DCEAEE]
                bg-[#F5F8F8]
                px-[14px]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[12px]
                  font-bold
                  uppercase
                  leading-4
                  tracking-[0.3px]
                  text-[#5B7178]
                "
              >
                Version
              </span>
            </div>

            {/* Effective date */}
            <div
              className="
                flex
                items-center
                border-r
                border-[#DCEAEE]
                bg-[#F5F8F8]
                px-[14px]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[12px]
                  font-bold
                  uppercase
                  leading-4
                  tracking-[0.3px]
                  text-[#5B7178]
                "
              >
                Effective date
              </span>
            </div>

            {/* Material change summary */}
            <div
              className="
                flex
                items-center
                bg-[#F5F8F8]
                px-[14px]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[12px]
                  font-bold
                  uppercase
                  leading-4
                  tracking-[0.3px]
                  text-[#5B7178]
                "
              >
                Material change summary
              </span>
            </div>
          </div>

          {/* ====================================================== */}
          {/* DATA ROWS */}
          {/* ====================================================== */}

          {versions.map((item) => (
            <div
              key={item.version}
              className={`
                grid
                h-[44px]
                grid-cols-[128.88px_193.28px_1fr]
                border-t
                border-[#DCEAEE]
                ${
                  item.active
                    ? "bg-[#EAF3F5]"
                    : "bg-[#F5F8F8]"
                }
              `}
            >
              {/* Version */}
              <div
                className="
                  flex
                  items-center
                  border-r
                  border-[#DCEAEE]
                  px-[14px]
                "
              >
                <span
                  className={`
                    whitespace-nowrap
                    text-[12px]
                    leading-5
                    ${
                      item.active
                        ? "font-bold text-[#073B47]"
                        : "font-normal text-[#073B47]"
                    }
                  `}
                >
                  {item.version}
                </span>
              </div>

              {/* Date */}
              <div
                className="
                  flex
                  items-center
                  border-r
                  border-[#DCEAEE]
                  px-[14px]
                "
              >
                <span
                  className={`
                    whitespace-nowrap
                    text-[12px]
                    leading-5
                    ${
                      item.active
                        ? "font-bold text-[#073B47]"
                        : "font-normal text-[#073B47]"
                    }
                  `}
                >
                  {item.date}
                </span>
              </div>

              {/* Change */}
              <div className="flex items-center px-[14px]">
                <span
                  className={`
                    whitespace-nowrap
                    text-[12px]
                    leading-5
                    ${
                      item.active
                        ? "font-bold text-[#073B47]"
                        : "font-normal text-[#073B47]"
                    }
                  `}
                >
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}