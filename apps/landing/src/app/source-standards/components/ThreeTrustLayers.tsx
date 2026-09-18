"use client";

export default function ThreeTrustLayers() {
  const layers = [
    {
      layer: "Layer 1",
      title: "Source rating",
      color: "#073B47",
      youSee: (
        <>
          Tier label/state, meaning, effective date, methodology
          <br />
          version.
        </>
      ),
      mustNotImply:
        "Every article is true; ideological approval; advertiser status.",
    },
    {
      layer: "Layer 2",
      title: "Story evidence",
      color: "#066879",
      youSee: "Evidence-type label, citations/links, correction state.",
      mustNotImply:
        "Evidence type alone determines the publisher's tier.",
    },
    {
      layer: "Layer 3",
      title: "Relevance",
      color: "#D88900",
      youSee: "Topic, region, freshness, followed interests.",
      mustNotImply: "Popularity or locality increases source trust.",
    },
  ];

  return (
    <section className="w-full bg-[#F5F8F8]">
      <div
        className="
          relative
          mx-auto
          h-[470px]
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
          Three trust layers — never collapsed into one
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
          A publisher&apos;s rating, a story&apos;s evidence, and a story&apos;s
          relevance to you are three separate signals. None
          <br />
          stands in for another.
        </p>

        {/* ========================================================= */}
        {/* TRUST LAYERS */}
        {/* ========================================================= */}

        <div
          className="
            absolute
            left-0
            top-[178.85px]
            flex
            w-full
            gap-[32px]
          "
        >
          {layers.map((layer) => (
            <div
              key={layer.layer}
              className="
                relative
                h-[208px]
                w-[384px]
                shrink-0
                rounded-[24px]
                text-white
              "
              style={{
                backgroundColor: layer.color,
              }}
            >
              {/* Layer label */}

              <span
                className="
                  absolute
                  left-[22px]
                  top-[22px]
                  whitespace-nowrap
                  text-[12px]
                  font-bold
                  uppercase
                  leading-4
                  tracking-[0.3px]
                  text-white/80
                "
              >
                {layer.layer}
              </span>

              {/* Title */}

              <h3
                className="
                  absolute
                  left-[22px]
                  top-[44.5px]
                  m-0
                  whitespace-nowrap
                  text-[16px]
                  font-extrabold
                  leading-6
                  text-white
                "
              >
                {layer.title}
              </h3>

              {/* You see */}

              <span
                className="
                  absolute
                  left-[22px]
                  top-[80.5px]
                  whitespace-nowrap
                  text-[12px]
                  font-bold
                  uppercase
                  leading-4
                  tracking-[0.3px]
                  text-white/70
                "
              >
                You see
              </span>

              {/* You see content */}

              <div
                className="
                  absolute
                  left-[22px]
                  top-[100.55px]
                  w-[340px]
                  text-[12px]
                  font-normal
                  leading-5
                  text-white/95
                "
              >
                {layer.youSee}
              </div>

              {/* Must not imply */}

              <span
                className="
                  absolute
                  left-[22px]
                  top-[130.92px]
                  whitespace-nowrap
                  text-[12px]
                  font-bold
                  uppercase
                  leading-4
                  tracking-[0.3px]
                  text-white/70
                "
              >
                Must not imply
              </span>

              {/* Must not imply content */}

              <div
                className="
                  absolute
                  left-[22px]
                  top-[150.97px]
                  w-[340px]
                  text-[12px]
                  font-normal
                  leading-5
                  text-white/95
                "
              >
                {layer.mustNotImply}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}