"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import NewsCard, { NewsItem } from "./NewsCard";
import { C } from "./theme";
import { IMAGES } from "./images";

const news: NewsItem[] = [
  {
    id: 1,
    category: "Wildlife Crime",
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
  },

  {
    id: 2,
    category: "Animal Welfare",
    published: "Published 3 hours ago",
    source: "Regional Wildlife Gazette",
    rating: "Rating unavailable",
    ratingType: "unavailable",
    domain: "regionalwildlifegazette.example · North America",
    title: "County Shelter Reports Record Intake After Storm",
    description:
      "Local officials say the shelter is at capacity following severe weather, and are calling for emergency foster volunteers.",
    image: IMAGES.county,
  },

  {
    id: 3,
    category: "Veterinary Science",
    published: "Published 4 hours ago",
    source: "Veterinary Science Weekly",
    rating: "Source rated Tier 2",
    ratingType: "normal",
    domain: "vetsciweekly.example · Global",
    title: "New Research on Canine Cognitive Development",
    description:
      "A peer-reviewed study points to breakthrough findings on how early socialization affects long-term behavior in dogs.",
  },

  {
    id: 4,
    category: "Conservation",
    published: "Published 6 hours ago",
    source: "Conservation Today",
    rating: "Rating under review",
    ratingType: "warning",
    domain: "conservationtoday.example · Africa",
    title: "Community-Led Habitat Project Shows Early Results",
    description:
      "A regional rewilding initiative reports encouraging early signs of species recovery after its first full season.",
    image: IMAGES.community,
  },

  {
    id: 5,
    category: "Wildlife Crime",
    published: "Published 10 hours ago",
    source: "Wildlife Crime Watch",
    rating: "Source rated Tier 1",
    ratingType: "normal",
    domain: "wildlifecrimewatch.example · Asia",
    title: "Investigators Report Snow Leopard Poaching Ring Disrupted",
    description:
      "Authorities say a multi-agency operation has disrupted a suspected poaching network operating across a protected mountain region.",
    image: IMAGES.investigators,
    notice:
      "This report references an active anti-poaching investigation. Location details have been generalized for wildlife safety.",
  },

  {
    id: 6,
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
    id: 7,
    category: "Wildlife Crime",
    published: "Published 14 hours ago",
    source: "Global Wildlife Rescue Network",
    rating: "Source rated Tier 2",
    ratingType: "warning",
    domain: "globalwildliferescue.example · Global",
    title: "Rescue Teams Issue Updated Wildlife Safety Guidance",
    description:
      "Rescue organizations have issued updated guidance for responding to wildlife emergencies in areas affected by severe weather.",
    image: IMAGES.bg,
    warning: true,
  },

  {
    id: 8,
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

const filters = [
  "All",
  "Animal Welfare",
  "Conservation",
  "Wildlife Crime",
  "More",
];

/* ---------------------------------------
   REFRESH ICON
--------------------------------------- */

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

/* ---------------------------------------
   ARROW RIGHT ICON
--------------------------------------- */

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

/* ---------------------------------------
   INFO ICON
--------------------------------------- */

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

/* ---------------------------------------
   CHECK ICON
--------------------------------------- */

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 10.5L8.2 13.5L15 6.5"
        stroke={C.cyan25}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------
   SHIELD ICON
--------------------------------------- */

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 2.5L16 5V9.5C16 13.4 13.5 16.5 10 17.5C6.5 16.5 4 13.4 4 9.5V5L10 2.5Z"
        stroke={C.cyan25}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="M7.2 10L9 11.8L12.8 8"
        stroke={C.cyan25}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------
   UNAVAILABLE STORY
--------------------------------------- */

function UnavailableStory() {
  return (
    <div
      className="flex w-full flex-col items-center justify-start gap-2.5 rounded-[20px] border bg-white px-6 py-8"
      style={{
        borderColor: C.line,
      }}
    >
      <div
        className="flex size-10 items-center justify-center rounded-xl"
        style={{
          backgroundColor: C.grey97,
        }}
      >
        <InfoIcon />
      </div>

      <div className="flex w-full flex-col items-center">
        <div
          className="text-center text-sm font-semibold leading-5"
          style={{
            color: C.azure42,
          }}
        >
          This story is no longer available for distribution.
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------
   CAUGHT UP
--------------------------------------- */

function CaughtUpCard() {
  return (
    <div
      className="mt-1 flex w-full flex-col items-center rounded-[20px] border px-6 py-10"
      style={{
        borderColor: C.line,
        backgroundColor: C.page,
      }}
    >
      <div
        className="flex size-12 items-center justify-center rounded-xl"
        style={{
          backgroundColor: C.chip,
        }}
      >
        <CheckIcon />
      </div>

      <h3
        className="mt-4 text-base font-bold"
        style={{
          color: C.cyan13,
        }}
      >
        You&apos;re caught up on the latest news
      </h3>

      <p
        className="mt-2 max-w-[620px] text-center text-sm leading-6"
        style={{
          color: C.azure42,
        }}
      >
        That&apos;s every eligible story for this snapshot. New stories appear
        behind the &quot;New stories available&quot; control above rather than
        reordering while you browse.
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className="rounded-[10px] border bg-white px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: C.line,
            color: C.cyan15,
          }}
        >
          Browse by Topic
        </button>

        <button
          type="button"
          className="rounded-[10px] border bg-white px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: C.line,
            color: C.cyan15,
          }}
        >
          Set Your Region
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------
   COVERAGE HEALTH
--------------------------------------- */

function CoverageHealth() {
  return (
    <section
      className="w-full rounded-[20px] border bg-white p-6"
      style={{
        borderColor: C.line,
      }}
    >
      <h3
        className="text-base font-bold leading-5"
        style={{
          color: C.cyan13,
        }}
      >
        Coverage health
      </h3>

      {/* World Animal News */}
      <div className="mt-5 flex items-center gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${C.imageGradientStart}, ${C.imageGradientEnd})`,
          }}
        >
          <span className="text-xs font-bold text-white">
            W
          </span>
        </div>

        <div>
          <p
            className="text-sm font-bold leading-5"
            style={{
              color: C.cyan13,
            }}
          >
            World Animal News
          </p>

          <p
            className="text-sm leading-5"
            style={{
              color: C.azure42,
            }}
          >
            Tier 1 · 3 stories today
          </p>
        </div>
      </div>

      {/* Wildlife Crime Watch */}
      <div className="mt-7">
        <div className="relative h-[76px] w-[115px] overflow-hidden rounded-sm">
          <Image
            src={IMAGES.world}
            alt="Wildlife Crime Watch"
            fill
            className="object-cover"
            sizes="115px"
          />
        </div>

        <div className="mt-1">
          <p
            className="text-sm font-medium leading-5"
            style={{
              color: C.cyan13,
            }}
          >
            Wildlife Crime Watch
          </p>

          <p
            className="text-sm leading-5"
            style={{
              color: C.azure42,
            }}
          >
            Tier 1 · 1 story today
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------
   GLOBAL OR REGION
--------------------------------------- */

function GlobalRegion() {
  return (
    <section
      className="w-full rounded-[20px] border bg-white p-6"
      style={{
        borderColor: C.line,
      }}
    >
      <h3
        className="text-base font-bold leading-5"
        style={{
          color: C.cyan13,
        }}
      >
        Global or your region
      </h3>

      <p
        className="mt-5 text-sm leading-6"
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
        className="mt-4 h-11 w-full rounded-[10px] border bg-white text-sm font-bold"
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

/* ---------------------------------------
   DISCOVER MORE
--------------------------------------- */

function DiscoverMore() {
  const topics = [
    "Animal Welfare",
    "Conservation",
    "Wildlife Crime",
    "Wildlife & Conservation Communities",
  ];

  return (
    <section
      className="w-full rounded-[20px] border bg-white p-6"
      style={{
        borderColor: C.line,
      }}
    >
      <h3
        className="text-base font-bold"
        style={{
          color: C.cyan13,
        }}
      >
        Discover more
      </h3>

      <div className="mt-5 flex flex-col">
        {topics.map((topic, index) => (
          <button
            key={topic}
            type="button"
            className={`flex items-center justify-between py-3 text-left text-sm font-semibold ${
              index !== topics.length - 1 ? "border-b" : ""
            }`}
            style={{
              color: C.cyan13,
              borderColor: C.line,
            }}
          >
            <span>{topic}</span>

            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke={C.azure42}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------
   REPORTING STAYS TRUSTWORTHY
--------------------------------------- */

function ReportingTrustworthy() {
  return (
    <section
      className="w-full rounded-[20px] border p-5"
      style={{
        borderColor: C.line,
        backgroundColor: "#EFF8F9",
      }}
    >
      {/* Shield */}
      <div className="flex size-8 items-center justify-center rounded-lg bg-white">
        <ShieldIcon />
      </div>

      <h3
        className="mt-4 text-sm font-bold leading-5"
        style={{
          color: C.cyan13,
        }}
      >
        Reporting stays trustworthy
      </h3>

      <p
        className="mt-2 text-xs leading-5"
        style={{
          color: C.azure42,
        }}
      >
        Stories are checked for source eligibility, safety, and location
        protection before they can ever appear here.
      </p>

      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1 text-sm font-bold"
        style={{
          color: C.cyan25,
        }}
      >
        Report an Inaccuracy

        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 3L11 8L6 13"
            stroke={C.cyan25}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}

/* ---------------------------------------
   NEWS FEED
--------------------------------------- */

export default function NewsFeed() {
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleNews = useMemo(() => {
    if (activeFilter === "All" || activeFilter === "More") {
      return news;
    }

    return news.filter(
      (item) => item.category === activeFilter
    );
  }, [activeFilter]);

  return (
    <section className="w-full">
      {/* 
        Feed layout:
        720px left feed
        32px gap
        280px right sidebar
        Total = 1032px
      */}
      <div className="mx-auto w-full max-w-[1032px] px-4 pb-16 sm:px-6 lg:px-0">

        {/* ---------------------------------------
            FILTERS
        --------------------------------------- */}

        <div className="flex w-full items-center gap-2 overflow-x-auto pb-6">
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className="shrink-0 rounded-full border px-4 pb-2.5 pt-2 text-sm font-semibold leading-5"
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

        {/* ---------------------------------------
            REFRESH
        --------------------------------------- */}

        <div className="flex w-full justify-center pb-8">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold"
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

        {/* ---------------------------------------
            MAIN LAYOUT
        --------------------------------------- */}

        <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-[720px_280px]">

          {/* =====================================
              LEFT NEWS FEED
          ===================================== */}

          <div className="flex w-full flex-col gap-4">

            {visibleNews.map((item) => (
              <div key={item.id}>
                <NewsCard item={item} />

                {/* Corrected story → unavailable card */}
                {item.corrected && (
                  <div className="mt-4">
                    <UnavailableStory />
                  </div>
                )}
              </div>
            ))}

            {/* Caught Up */}
            {activeFilter === "All" && (
              <CaughtUpCard />
            )}
          </div>

          {/* =====================================
              RIGHT SIDEBAR
          ===================================== */}

          <aside className="flex w-full flex-col gap-5">

            {/* -----------------------------------
                SOURCE STANDARDS
            ----------------------------------- */}

            <section
              className="w-full rounded-[20px] border p-6"
              style={{
                borderColor: C.line,
                backgroundColor: "#EFF8F9",
              }}
            >
              <p
                className="text-sm leading-6"
                style={{
                  color: C.azure42,
                }}
              >
                Every rating reflects the publisher against Zoiko
                Social&apos;s published Source Standards. It is not a
                guarantee of every individual claim in a story —
                always verify the original source.
              </p>

              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold"
                style={{
                  color: C.cyan25,
                }}
              >
                Read Source Standards
                <ArrowRightIcon />
              </button>
            </section>

            {/* -----------------------------------
                COVERAGE HEALTH
            ----------------------------------- */}

            <CoverageHealth />

            {/* -----------------------------------
                GLOBAL OR YOUR REGION
            ----------------------------------- */}

            <GlobalRegion />

            {/* -----------------------------------
                DISCOVER MORE
            ----------------------------------- */}

            <DiscoverMore />

            {/* -----------------------------------
                REPORTING STAYS TRUSTWORTHY
            ----------------------------------- */}

            <ReportingTrustworthy />
          </aside>
        </div>
      </div>
    </section>
  );
}