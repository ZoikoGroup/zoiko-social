"use client";

export default function EditorialIndependence() {
  const prohibitedInputs = [
    "Ad spend or partnership status",
    "Subscription or premium status",
    "Story popularity, clicks, likes, shares, or controversy",
    "Political or ideological agreement",
    "Publisher pressure or threatened withdrawal",
    "Unverified anonymous complaints without evidence",
  ];

  const rows = [
    {
      role: "Editorial Standards Approver",
      rating: "Yes",
      influence: "None",
    },
    {
      role: "Editorial Standards Reviewer",
      rating: "No*",
      influence: "None",
    },
    {
      role: "Legal / Policy Reviewer",
      rating: "Policy scope only",
      influence: "None",
    },
    {
      role: "Publisher Relations / Support",
      rating: "No",
      influence: "None",
    },
    {
      role: "Commercial / Advertising",
      rating: "No",
      influence: "Prohibited",
    },
  ];

  return (
    <section className="w-full bg-[#F5F8F8]">
      <div
        className="
          relative
          mx-auto
          h-[493px]
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
          Editorial independence
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
            w-[634px]
            text-[14px]
            font-normal
            leading-6
            text-[#5B7178]
          "
        >
          Commercial relationships have zero write authority over source
          ratings, eligibility, corrections,
          <br />
          methodology, or ranking.
        </p>

        {/* ========================================================= */}
        {/* LEFT PANEL */}
        {/* ========================================================= */}

        <div
          className="
            absolute
            left-0
            top-[178.84px]
            h-[256px]
            w-[632.75px]
            rounded-[24px]
            bg-[#073B47]
          "
        >
          {/* Title */}

          <h3
            className="
              absolute
              left-[26px]
              top-[24px]
              m-0
              whitespace-nowrap
              text-[16px]
              font-extrabold
              leading-6
              text-white
            "
          >
            Prohibited rating inputs
          </h3>

          {/* Intro */}

          <p
            className="
              absolute
              left-[26px]
              top-[58px]
              m-0
              whitespace-nowrap
              text-[14px]
              font-normal
              leading-5
              text-white/90
            "
          >
            None of the following may ever influence a source rating:
          </p>

          {/* List */}

          <div
            className="
              absolute
              left-[26px]
              top-[91.59px]
              flex
              flex-col
              gap-[4.75px]
            "
          >
            {prohibitedInputs.map((item) => (
              <div
                key={item}
                className="
                  flex
                  h-5
                  items-center
                  text-[12px]
                  font-normal
                  leading-5
                  text-white/90
                "
              >
                <span
                  className="
                    mr-[8px]
                    w-[10px]
                    shrink-0
                    text-[12px]
                    leading-5
                    text-[#F97316]
                  "
                >
                  ✕
                </span>

                <span className="whitespace-nowrap">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT TABLE */}
        {/* ========================================================= */}

        <div
          className="
            absolute
            left-[656.75px]
            top-[178.84px]
            h-[224px]
            w-[575.25px]
          "
        >
          {/* TABLE HEADER */}

          <div className="flex h-9 w-[574.25px]">
            {/* Role */}

            <div
              className="
                flex
                h-9
                w-[208px]
                items-center
                border
                border-[#DCEAEE]
                bg-white
                px-[10px]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[12px]
                  font-bold
                  uppercase
                  leading-4
                  text-[#5B7178]
                "
              >
                Role
              </span>
            </div>

            {/* Approve / Publish */}

            <div
              className="
                ml-[2.67px]
                flex
                h-9
                w-[192px]
                items-center
                border
                border-[#DCEAEE]
                bg-white
                px-[10px]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[12px]
                  font-bold
                  uppercase
                  leading-4
                  text-[#5B7178]
                "
              >
                Approve/Publish rating
              </span>
            </div>

            {/* Commercial Influence */}

            <div
              className="
                ml-[-0.17px]
                flex
                h-9
                w-[176px]
                items-center
                border
                border-[#DCEAEE]
                bg-white
                px-[10px]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[12px]
                  font-bold
                  uppercase
                  leading-4
                  text-[#5B7178]
                "
              >
                Commercial influence
              </span>
            </div>
          </div>

          {/* TABLE BODY */}

          <div className="mt-[0px] w-[574.25px]">
            {rows.map((row, index) => (
              <div
                key={row.role}
                className="flex h-9 w-[574.25px]"
                style={{
                  marginTop: index === 0 ? 0 : 1.75,
                }}
              >
                {/* Role */}

                <div
                  className="
                    flex
                    h-9
                    w-[208px]
                    items-center
                    border
                    border-[#DCEAEE]
                    bg-white
                    px-[10px]
                  "
                >
                  <span
                    className="
                      whitespace-nowrap
                      text-[12px]
                      font-normal
                      leading-5
                      text-[#073B47]
                    "
                  >
                    {row.role}
                  </span>
                </div>

                {/* Rating */}

                <div
                  className="
                    ml-[2.67px]
                    flex
                    h-9
                    w-[192px]
                    items-center
                    border
                    border-[#DCEAEE]
                    bg-white
                    px-[10px]
                  "
                >
                  <span
                    className="
                      whitespace-nowrap
                      text-[12px]
                      font-normal
                      leading-5
                      text-[#073B47]
                    "
                  >
                    {row.rating}
                  </span>
                </div>

                {/* Commercial Influence */}

                <div
                  className="
                    ml-[-0.17px]
                    flex
                    h-9
                    w-[176px]
                    items-center
                    border
                    border-[#DCEAEE]
                    bg-white
                    px-[10px]
                  "
                >
                  <span
                    className={`
                      whitespace-nowrap
                      text-[12px]
                      leading-5
                      ${
                        row.influence === "Prohibited"
                          ? "font-bold text-[#073B47]"
                          : "font-normal text-[#073B47]"
                      }
                    `}
                  >
                    {row.influence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* FOOTNOTE */}
        {/* ========================================================= */}

        <p
          className="
            absolute
            left-[656.75px]
            top-[412.09px]
            m-0
            whitespace-nowrap
            text-[12px]
            font-normal
            leading-4
            text-[#5B7178]
          "
        >
          *Unless separately authorized under governance rules.
        </p>
      </div>
    </section>
  );
}