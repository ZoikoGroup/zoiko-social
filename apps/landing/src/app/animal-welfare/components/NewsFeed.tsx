"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import NewsCard, { NewsItem } from "./NewsCard";
import { C } from "./theme";
import { IMAGES } from "./images";

/* =========================================================
   NEWS DATA
========================================================= */

const news: NewsItem[] = [
  {
    id: 1,
    category: "Policy & Law",
    published: "Published 2 hours ago",
    source: "World Animal News",
    rating: "Source rated Tier 1",
    ratingType: "normal",
    domain: "worldanimalnews.example · Global",
    title: "Major Policy Update on Wildlife Trade Enforcement",
    description:
      "An international coalition has strengthened measures to combat illegal wildlife trafficking across 47 nations, according to a joint statement released Tuesday.",
    image: IMAGES.major,
    lead: true,
    status: "In effect",
    statusType: "green",
    region: "47 nations",
    moreCoverage:
      "More coverage: 4 verified sources reporting this story",
    followTopic: true,
    discuss: true,
  },

  {
    id: 2,
    category: "Rescue & Shelter",
    published: "Published 3 hours ago",
    source: "Regional Wildlife Gazette",
    rating: "Rating unavailable",
    ratingType: "unavailable",
    domain: "regionalwildlifegazette.example · North America",
    title: "County Shelter Reports Record Intake After Storm",
    description:
      "Local officials say the shelter is at capacity following severe weather, and are calling for emergency foster volunteers.",
    image: IMAGES.county,
    region: "United States",
  },

  {
    id: 3,
    category: "Welfare Science",
    published: "Published 4 hours ago",
    source: "Veterinary Science Weekly",
    rating: "Source rated Tier 2",
    ratingType: "normal",
    domain: "vetsciweekly.example · Global",
    title: "New Research on Canine Cognitive Development",
    description:
      "A single peer-reviewed study points to early findings on how socialization may affect long-term behavior in dogs; researchers caution further studies are needed before drawing broad conclusions.",
  },

  {
    id: 4,
    category: "Care & Standards",
    published: "Published 6 hours ago",
    source: "Conservation Today",
    rating: "Rating under review",
    ratingType: "warning",
    domain: "conservationtoday.example · United Kingdom",
    title:
      "Updated Minimum Space Standards Proposed for Boarding Kennels",
    description:
      "A working group has proposed revised minimum space and enrichment standards for licensed boarding facilities, citing new welfare research.",
    image: IMAGES.updated,
  },

  {
    id: 5,
    category: "Policy & Law",
    published: "Published 7 hours ago",
    source: "World Animal News",
    rating: "Source rated Tier 1",
    ratingType: "normal",
    domain: "worldanimalnews.example · Global",
    title: "Animal Shelter Capacity Initiative Launched Nationwide",
    description:
      "A newly announced program aims to expand shelter resources and support higher adoption rates across the country.",
    status: "Proposed",
    discuss: true,
  },

  {
    id: 6,
    category: "Enforcement & Accountability",
    published: "Published 10 hours ago",
    source: "Regional Wildlife Gazette",
    rating: "Rating unavailable",
    ratingType: "unavailable",
    domain: "regionalwildlifegazette.example · United States",
    title:
      "Breeding Facility Operator Convicted Under State Welfare Statute",
    description:
      "A state court has convicted a commercial breeding facility operator on multiple counts of animal neglect, following a multi-agency investigation.",
    region: "United States",
    notice:
      "This report covers a legal enforcement outcome. It is a difficult subject; no graphic imagery is shown.",
  },

  {
    id: 7,
    category: "Animal Welfare",
    published: "Published 12 hours ago",
    source: "Policy & Animals Bulletin",
    rating: "Source rated Tier 2",
    ratingType: "normal",
    domain: "policyandanimals.example · United Kingdom",
    title: "Policymakers Weigh New Farm Animal Welfare Standards",
    description:
      "A proposed set of minimum welfare standards is under public consultation, with agricultural groups and welfare organizations offering mixed responses.",
    image: IMAGES.policy,
  },

  {
    id: 8,
    category: "Animal Welfare",
    published: "Published 5 hours ago",
    source: "Global Wildlife Rescue Network",
    rating: "Source rated Tier 1",
    ratingType: "normal",
    domain: "globalwildliferescue.example · Global",
    title: "Wildlife Rescue Network Update",
    description:
      "An update from an active rescue operation — a summary is available; the image below carries a content warning.",
    warning: true,
  },

  {
    id: 9,
    category: "Animal Welfare",
    published: "Published 9 hours ago",
    source: "World Animal News",
    rating: "Source rated Tier 1",
    ratingType: "normal",
    domain: "worldanimalnews.example · Global",
    title: "Animal Shelter Capacity Initiative Figures Corrected",
    description:
      "A national program aims to increase shelter resources and adoption rates across the country.",
    corrected: true,
  },
];

/* =========================================================
   FILTERS
========================================================= */

const filters = [
  "All",
  "Care & Standards",
  "Rescue & Shelter",
  "Policy & Law",
  "Welfare Science",
  "Enforcement & Accountability",
];

/* =========================================================
   REFRESH ICON
========================================================= */

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.5 5.5A5.5 5.5 0 0 0 3.35 4.2L2 5.5"
        stroke={C.cyan25}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M2 2.75V5.5H4.75"
        stroke={C.cyan25}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M2.5 10.5A5.5 5.5 0 0 0 12.65 11.8L14 10.5"
        stroke={C.cyan25}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 13.25V10.5H11.25"
        stroke={C.cyan25}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   ARROW
========================================================= */

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8H13"
        stroke={C.cyan25}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M9 4L13 8L9 12"
        stroke={C.cyan25}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   MESSAGE BOX ICON
========================================================= */

function MessageBoxIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 5C4 3.89543 4.89543 3 6 3H14C15.1046 3 16 3.89543 16 5V11C16 12.1046 15.1046 13 14 13H9L5.5 16V13H6C4.89543 13 4 12.1046 4 11V5Z"
        stroke={C.cyan25}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M7 6.5H13"
        stroke={C.cyan25}
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      <path
        d="M7 9.5H11"
        stroke={C.cyan25}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   INFO ICON
========================================================= */

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="7.75"
        stroke={C.azure42}
        strokeWidth="1.5"
      />

      <path
        d="M10 9V13"
        stroke={C.azure42}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <circle
        cx="10"
        cy="6.5"
        r="0.75"
        fill={C.azure42}
      />
    </svg>
  );
}

/* =========================================================
   CHECK ICON
========================================================= */

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 10.5L8.2 13.5L15 6.5"
        stroke={C.cyan15}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   SHIELD ICON
========================================================= */

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 2.5L16 5V9.5C16 13.4 13.5 16.5 10 17.5C6.5 16.5 4 13.4 4 9.5V5L10 2.5Z"
        stroke={C.cyan15}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="M7.2 10L9 11.8L12.8 8"
        stroke={C.cyan15}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   POLICY TRACKER
========================================================= */

function PolicyTracker() {
  const steps = [
    {
      label: "Proposed",
      date: "Jan 2026",
      active: true,
    },
    {
      label: "Consultation",
      date: "Mar 2026",
      active: true,
    },
    {
      label: "Passed",
      date: "Jul 2026",
      active: true,
    },
    {
      label: "In effect",
      date: "Current",
      active: true,
      current: true,
    },
    {
      label: "Review",
      date: "Scheduled 2027",
      active: false,
    },
  ];

  return (
    <section
      className="
        w-full
        rounded-[20px]
        border
        bg-white
        p-5
      "
      style={{
        borderColor: C.line,
      }}
    >
      <h3
        className="text-base font-extrabold leading-6"
        style={{
          color: C.cyan15,
        }}
      >
        Policy Tracker: Wildlife Trade Enforcement Framework
      </h3>

      <p
        className="text-xs leading-5"
        style={{
          color: C.azure42,
        }}
      >
        Multilateral · 47 participating nations · Status last confirmed 2
        hours ago
      </p>

      <div className="mt-5 overflow-x-auto pb-1">
        <div className="flex min-w-[680px]">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="
                relative
                flex
                min-w-[136px]
                flex-1
                flex-col
                items-center
              "
            >
              {index < steps.length - 1 && (
                <div
                  className="
                    absolute
                    left-1/2
                    top-[11px]
                    h-0.5
                    w-full
                  "
                  style={{
                    backgroundColor:
                      index < 3 ? C.cyan25 : C.cyan89,
                  }}
                />
              )}

              <div
                className={`relative z-10 rounded-full ${
                  step.current
                    ? "h-7 w-7 border-2"
                    : "h-6 w-6 border-2"
                }`}
                style={{
                  backgroundColor: step.active
                    ? C.cyan25
                    : C.grey97,
                  borderColor: step.active
                    ? C.cyan25
                    : C.cyan89,
                  boxShadow: step.current
                    ? "0 0 0 3px #EEF8F9"
                    : undefined,
                }}
              />

              <p
                className="
                  mt-2
                  text-center
                  text-xs
                  font-bold
                  leading-4
                "
                style={{
                  color: C.cyan13,
                }}
              >
                {step.label}
              </p>

              <p
                className="
                  text-center
                  text-xs
                  leading-4
                "
                style={{
                  color: C.azure42,
                }}
              >
                {step.date}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="
          mt-4
          inline-flex
          items-center
          gap-1.5
          text-xs
          font-bold
        "
        style={{
          color: C.cyan25,
        }}
      >
        <MessageBoxIcon />
        <span>View official framework document &gt;</span>
      </button>
    </section>
  );
}

/* =========================================================
   UNAVAILABLE STORY
========================================================= */

function UnavailableStory() {
  return (
    <div
      className="
        flex
        w-full
        flex-col
        items-center
        justify-center
        rounded-[20px]
        border
        bg-white
        px-6
        py-8
      "
      style={{
        borderColor: C.line,
        minHeight: "118px",
      }}
    >
      <div
        className="
          mb-2
          flex
          size-9
          items-center
          justify-center
          rounded-xl
        "
        style={{
          backgroundColor: C.grey97,
        }}
      >
        <InfoIcon />
      </div>

      <p
        className="
          text-center
          text-xs
          font-semibold
          leading-5
        "
        style={{
          color: C.azure42,
        }}
      >
        This story is no longer available for distribution.
      </p>
    </div>
  );
}

/* =========================================================
   CAUGHT UP
========================================================= */

function CaughtUpCard() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        rounded-[20px]
        border
      "
      style={{
        borderColor: C.line,
        backgroundColor: C.grey97,
      }}
    >
      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          px-6
          py-12
        "
      >
        <div
          className="
            flex
            size-12
            items-center
            justify-center
            rounded-2xl
          "
          style={{
            backgroundColor: C.chip,
          }}
        >
          <CheckIcon />
        </div>

        <h3
          className="
            mt-3
            text-center
            text-lg
            font-extrabold
            leading-7
          "
          style={{
            color: C.cyan13,
          }}
        >
          You're caught up on Animal Welfare news
        </h3>

        <p
          className="
            mt-1
            max-w-[620px]
            text-center
            text-xs
            leading-5
          "
          style={{
            color: C.azure42,
          }}
        >
          That's every eligible story for this snapshot. New stories appear
          behind the "New stories available" control above rather than
          reordering while you read.
        </p>

        <div
          className="
            mt-4
            flex
            flex-wrap
            justify-center
            gap-2.5
          "
        >
          <button
            type="button"
            className="
              rounded-[10px]
              border
              bg-white
              px-4
              py-2.5
              text-xs
              font-bold
            "
            style={{
              borderColor: C.line,
              color: C.cyan15,
            }}
          >
            Browse by Topic
          </button>

          <button
            type="button"
            className="
              rounded-[10px]
              border
              bg-white
              px-4
              py-2.5
              text-xs
              font-bold
            "
            style={{
              borderColor: C.line,
              color: C.cyan15,
            }}
          >
            Set Your Region
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SOURCE STANDARDS
========================================================= */

function SourceStandards() {
  return (
    <section
      className="
        w-full
        rounded-[20px]
        border
        p-5
      "
      style={{
        borderColor: C.line,
        backgroundColor: C.grey95,
      }}
    >
      <h3
        className="text-sm font-bold leading-5"
        style={{
          color: C.cyan13,
        }}
      >
        How source ratings work
      </h3>

      <p
        className="mt-3 text-xs leading-5"
        style={{
          color: C.azure42,
        }}
      >
        Every rating reflects the publisher against Zoiko Social's published
        Source Standards. It is not a guarantee of every individual claim in
        a story — always review the original source.
      </p>

      <button
        type="button"
        className="
          mt-3
          inline-flex
          items-center
          gap-1.5
          text-sm
          font-bold
        "
        style={{
          color: C.cyan25,
        }}
      >
        Read Source Standards
        <ArrowRightIcon />
      </button>
    </section>
  );
}

/* =========================================================
   COVERAGE HEALTH
========================================================= */

function CoverageHealth() {
  return (
    <section
      className="
        w-full
        rounded-[20px]
        border
        bg-white
        p-5
      "
      style={{
        borderColor: C.line,
      }}
    >
      <h3
        className="text-sm font-bold leading-5"
        style={{
          color: C.cyan13,
        }}
      >
        Coverage health
      </h3>

      {/* World Animal News */}
      <div className="mt-4 flex items-center gap-2.5">
        <div
          className="size-9 shrink-0 rounded-[10px]"
          style={{
            background:
              "linear-gradient(135deg, #066879, #F59E0B)",
          }}
        />

        <div>
          <p
            className="text-xs font-bold leading-5"
            style={{
              color: C.cyan13,
            }}
          >
            World Animal News
          </p>

          <p
            className="text-xs leading-4"
            style={{
              color: C.azure42,
            }}
          >
            Tier 1 · 3 stories today
          </p>
        </div>
      </div>

      {/* Wildlife Crime Watch */}
      <div className="mt-5">
        <div
          className="
            relative
            h-[54px]
            w-[82px]
            overflow-hidden
            rounded-[5px]
          "
        >
          <Image
            src={IMAGES.world}
            alt="Wildlife Crime Watch"
            fill
            className="object-cover"
            sizes="82px"
          />
        </div>

        <p
          className="mt-1.5 text-xs font-bold leading-5"
          style={{
            color: C.cyan13,
          }}
        >
          Wildlife Crime Watch
        </p>

        <p
          className="text-xs leading-4"
          style={{
            color: C.azure42,
          }}
        >
          Tier 1 · 1 story today
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   GLOBAL / REGION
========================================================= */

function GlobalRegion() {
  return (
    <section
      className="
        w-full
        rounded-[20px]
        border
        bg-white
        p-5
      "
      style={{
        borderColor: C.line,
      }}
    >
      <h3
        className="text-sm font-bold leading-5"
        style={{
          color: C.cyan13,
        }}
      >
        Global or your region
      </h3>

      <p
        className="mt-3 text-xs leading-5"
        style={{
          color: C.azure42,
        }}
      >
        Coverage defaults to Global. Set a coarse region — country, state,
        or metro — to see relevant stories first. We never require GPS or
        expose your exact location.
      </p>

      <button
        type="button"
        className="
          mt-3
          w-full
          rounded-[10px]
          border
          bg-white
          px-4
          py-2
          text-xs
          font-bold
        "
        style={{
          borderColor: C.line,
          color: C.cyan15,
        }}
      >
        Set Your Region
      </button>
    </section>
  );
}

/* =========================================================
   DISCOVER MORE
========================================================= */

function DiscoverMore() {
  const topics = [
    "Animal Welfare",
    "Conservation",
    "Wildlife Crime",
    "Wildlife & Conservation Communities",
  ];

  return (
    <section
      className="
        w-full
        rounded-[20px]
        border
        bg-white
        p-5
      "
      style={{
        borderColor: C.line,
      }}
    >
      <h3
        className="text-sm font-bold leading-5"
        style={{
          color: C.cyan13,
        }}
      >
        Discover more
      </h3>

      <div className="mt-3">
        {topics.map((topic, index) => (
          <button
            key={topic}
            type="button"
            className={`
              flex
              min-h-10
              w-full
              items-center
              justify-between
              text-left
              text-xs
              font-semibold
              ${index !== topics.length - 1 ? "border-b" : ""}
            `}
            style={{
              color: C.cyan13,
              borderColor: C.line,
            }}
          >
            <span>{topic}</span>

            <span
              className="text-base"
              style={{
                color: C.azure42,
              }}
            >
              ›
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   REPORTING
========================================================= */

function ReportingTrustworthy() {
  return (
    <section
      className="
        w-full
        rounded-[20px]
        border
        p-5
      "
      style={{
        borderColor: C.line,
        backgroundColor: C.grey95,
      }}
    >
      <div
        className="
          flex
          size-9
          items-center
          justify-center
          rounded-[10px]
          bg-white
        "
      >
        <ShieldIcon />
      </div>

      <h3
        className="mt-2 text-sm font-bold leading-5"
        style={{
          color: C.cyan13,
        }}
      >
        Three ways to report
      </h3>

      <p
        className="text-xs leading-5"
        style={{
          color: C.azure42,
        }}
      >
        Factual corrections, and animal-welfare safety concerns, are always
        handled separately.
      </p>

      <button
        type="button"
        className="
          mt-2
          inline-flex
          items-center
          gap-1.5
          text-xs
          font-bold
        "
        style={{
          color: C.cyan25,
        }}
      >
        Report an Inaccuracy
        <ArrowRightIcon />
      </button>

      <button
        type="button"
        className="
          mt-2
          flex
          w-full
          items-center
          justify-between
          text-left
          text-xs
          font-bold
        "
        style={{
          color: C.cyan25,
        }}
      >
        <span>
          Report an Animal Welfare
          <br />
          Concern
        </span>

        <ArrowRightIcon />
      </button>
    </section>
  );
}

/* =========================================================
   NEWS FEED
========================================================= */

export default function NewsFeed() {
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleNews = useMemo(() => {
    if (activeFilter === "All") {
      return news;
    }

    return news.filter(
      (item) => item.category === activeFilter
    );
  }, [activeFilter]);

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: C.page,
      }}
    >
      {/* =====================================================
          SAME OUTER WIDTH AS HERO + WELFARE BRIEF
      ====================================================== */}
      <div
        className="
          mx-auto
          w-full
          max-w-[1232px]
          px-4
          pb-16
          sm:px-6
          lg:px-0
        "
      >
        {/* ===================================================
            FILTERS
        ==================================================== */}
        <div
          className="
            flex
            w-full
            items-center
            gap-2
            overflow-x-auto
            pt-4
            pb-6
          "
        >
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className="
                  shrink-0
                  rounded-full
                  border
                  px-4
                  pb-2.5
                  pt-2
                  text-sm
                  font-semibold
                  leading-5
                  transition-colors
                  duration-200
                "
                style={{
                  backgroundColor: active
                    ? C.cyan25
                    : C.white,
                  borderColor: active
                    ? C.cyan25
                    : C.cyan89,
                  color: active
                    ? C.white
                    : C.azure42,
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* ===================================================
            REFRESH
        ==================================================== */}
        <div
          className="
            flex
            w-full
            justify-center
            pb-8
            pt-2
          "
        >
          <button
            type="button"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2
              text-xs
              font-bold
              transition-opacity
              hover:opacity-80
            "
            style={{
              backgroundColor: C.grey95,
              borderColor: C.cyan25,
              color: C.cyan25,
            }}
          >
            <RefreshIcon />
            New stories available · Refresh
          </button>
        </div>

        {/* ===================================================
            MAIN LAYOUT
        ==================================================== */}
        <div
          className="
            grid
            w-full
            grid-cols-1
            items-start
            gap-8
            lg:grid-cols-[minmax(0,1fr)_320px]
          "
        >
          {/* =================================================
              LEFT — NEWS
          ================================================== */}
          <div
            className="
              flex
              w-full
              min-w-0
              flex-col
              gap-4
            "
          >
            {visibleNews.map((item) => (
              <div key={item.id}>
                <NewsCard item={item} />

                {item.lead && activeFilter === "All" && (
                  <div className="mt-2">
                    <PolicyTracker />
                  </div>
                )}
              </div>
            ))}

            {activeFilter === "All" && (
              <>
                <UnavailableStory />

                <CaughtUpCard />
              </>
            )}
          </div>

          {/* =================================================
              RIGHT — SIDEBAR
          ================================================== */}
          <aside
            className="
              flex
              w-full
              flex-col
              gap-5
            "
          >
            <SourceStandards />

            <CoverageHealth />

            <GlobalRegion />

            <DiscoverMore />

            <ReportingTrustworthy />
          </aside>
        </div>
      </div>
    </section>
  );
}