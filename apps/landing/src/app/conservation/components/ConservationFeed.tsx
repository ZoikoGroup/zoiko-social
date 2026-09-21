"use client";

import Image from "next/image";
import { useState } from "react";

const COLORS = {
  ink: "#073B47",
  brand: "#066879",
  line: "#DCEAEE",
  page: "#F5F8F8",
  white: "#FFFFFF",
  azure: "#6B8790",
  orange: "#D97706",
  title: "#3F6972",
};

const filters = [
  "All Conservation",
  "Species & Recovery",
  "Habitats & Ecosystems",
  "Protected Areas",
  "Restoration & Rewilding",
  "Conservation Policy",
  "Science & Monitoring",
  "Human-Wildlife Coexistence",
];

type Story = {
  image: string;
  source: string;
  title: string;
  category: string;
  label: string;
  description: string;
  published: string;
  status?: string;
  showLinks?: boolean;
};

const stories: Story[] = [
  {
    image: "/conservation/image2.png",
    source:
      "Journal of Wildlife Ecology (via Verified Science Desk) · Tier 1",
    title:
      "California condor population passes milestone in latest survey",
    category: "Species & Recovery",
    label: "Peer-reviewed study",
    description:
      "A new field survey reports the wild condor population has crossed a notable threshold for the first time in decades, according to peer-reviewed monitoring data.",
    published: "Published 2 days ago · California, USA",
    showLinks: true,
  },

  {
    image: "/conservation/image3.png",
    source: "Coastal Times · Tier 2",
    title:
      "Mangrove restoration expands along Gulf coastline",
    category: "Habitats & Ecosystems",
    label: "Source-reported",
    description:
      "Local restoration groups report expanded mangrove planting efforts along a stretch of coastline, aiming to rebuild storm-buffering habitat.",
    published:
      "Published 1 day ago · Gulf Coast, USA",
    showLinks: true,
  },

  {
    image: "/conservation/image4.png",
    source:
      "National Ocean Authority (official notice) · Tier 1",
    title:
      "New marine protected area proposed off northern coastline",
    category: "Protected Areas",
    label: "Official document",
    status: "Planned",
    description:
      "A national ocean authority has issued an official notice proposing a new marine protected area, opening a public comment period.",
    published:
      "Published 5 hours ago · Northern coastal waters (national authority)",
    showLinks: true,
  },

  {
    image: "/conservation/image5.png",
    source: "Multiple outlets · Tier 1",
    title:
      "Reintroduced beavers show early success in wetland recovery",
    category: "Restoration & Rewilding",
    label: "Multiple-source reporting",
    description:
      "Multiple outlets report early wetland recovery indicators following a beaver reintroduction project in an upper watershed region.",
    published:
      "Published 3 days ago · Upper watershed region (state-level)",
    showLinks: false,
  },

  {
    image: "/conservation/image6.png",
    source:
      "State Wildlife Authority (guidance notice) · Tier 1",
    title:
      "Draft habitat protection policy enters public consultation",
    category: "Conservation Policy",
    label: "Authority guidance",
    status: "Under review",
    description:
      "A draft habitat protection policy has entered a formal public consultation period, according to the issuing wildlife authority.",
    published:
      "Published 6 hours ago · State-level authority",
    showLinks: false,
  },

  {
    image: "/conservation/image7.png",
    source:
      "Conservation Science Network · Tier 2",
    title:
      "New camera-trap study tracks elusive forest cat population",
    category: "Science & Monitoring",
    label: "Preprint · Not yet peer reviewed",
    description:
      "Researchers report early camera-trap results tracking a rarely seen forest cat species. The findings have not yet completed peer review.",
    published:
      "Published 4 days ago · Temperate forest region (broad)",
    showLinks: false,
  },

  {
    image: "/conservation/image8.png",
    source:
      "Regional Seabird Trust (organization statement) · Tier 2",
    title:
      "Rare seabird colony shows signs of recovery after rehabilitation effort",
    category: "Species & Recovery",
    label:
      "Advocacy / organization statement",
    description:
      "A wildlife organization reports early recovery signs at a rare seabird colony following a rehabilitation effort. The organization's own statement is presented as advocacy context, not independent reporting.",
    published:
      "Published 1 day ago · Location withheld for safety",
    showLinks: false,
  },

  {
    image: "/conservation/image9.png",
    source: "Regional Rural News · Tier 2",
    title:
      "Community fencing program reduces crop-raiding incidents",
    category: "Human-Wildlife Coexistence",
    label: "Source-reported",
    description:
      "A rural district reports fewer crop-raiding incidents following a community-run fencing and deterrent program.",
    published:
      "Published 2 days ago · Rural district (broad)",
    showLinks: false,
  },

  {
    image: "/conservation/image10.png",
    source:
      "National Parks Bulletin · Tier 1",
    title:
      "Historic reserve boundary expansion finalized",
    category: "Protected Areas",
    label: "Official document",
    status: "Completed",
    description:
      "Authorities have finalized a boundary expansion for a long-standing nature reserve, formally increasing its protected area.",
    published:
      "Published 6 days ago · National authority",
    showLinks: false,
  },
];

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold"
      style={{
        backgroundColor: active
          ? COLORS.brand
          : COLORS.white,
        color: active
          ? COLORS.white
          : COLORS.azure,
        border: `1px solid ${
          active ? COLORS.brand : COLORS.line
        }`,
      }}
    >
      {label}
    </button>
  );
}

function ReadStoryButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-xs font-semibold text-white"
      style={{
        backgroundColor: COLORS.brand,
      }}
    >
      <span>Read Story</span>

      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 9L9 3M9 3H4.5M9 3V7.5"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function SaveButton() {
  return (
    <button
      type="button"
      className="rounded-[10px] px-3 py-1.5 text-xs font-semibold"
      style={{
        backgroundColor: COLORS.white,
        color: COLORS.ink,
        border: `1px solid ${COLORS.line}`,
      }}
    >
      Save
    </button>
  );
}

function StoryCard({
  story,
}: {
  story: Story;
}) {
  return (
    <article
      className="flex h-[642px] flex-col overflow-hidden rounded-[20px]"
      style={{
        backgroundColor: COLORS.white,
        border: `1px solid ${COLORS.line}`,
      }}
    >
      {/* IMAGE */}
      <div
        className="relative h-[296px] w-full shrink-0 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #066879 0%, #F6C98B 100%)",
        }}
      >
        <Image
          src={story.image}
          alt={story.title}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 394px"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col px-4 pt-3.5 pb-4">

        {/* SOURCE */}
        <div className="min-h-[29px]">
          <span
            className="inline-block rounded-md px-2 py-[2.5px] text-xs font-bold leading-4"
            style={{
              backgroundColor: "#F5F7F7",
              color: COLORS.ink,
            }}
          >
            {story.source}
          </span>
        </div>

        {/* TITLE */}
        <h3
          className="mt-2 text-sm font-bold leading-5"
          style={{
            color: COLORS.title,
          }}
        >
          {story.title}
        </h3>

        {/* CATEGORY + STATUS */}
        <div className="mt-3 flex min-h-[26px] flex-wrap items-start gap-1.5">
          <span
            className="rounded-md px-2 py-[3px] text-xs font-semibold leading-4"
            style={{
              backgroundColor: "#F8FAFA",
              border: `1px solid ${COLORS.line}`,
              color: COLORS.azure,
            }}
          >
            {story.category}
          </span>

          {story.status && (
            <span
              className="rounded-md px-2 py-1 text-xs font-bold leading-4"
              style={{
                backgroundColor:
                  story.status === "Under review"
                    ? "#FFF6EA"
                    : "#F8FAFA",
                color:
                  story.status === "Under review"
                    ? COLORS.orange
                    : COLORS.azure,
              }}
            >
              {story.status}
            </span>
          )}
        </div>

        {/* LABEL */}
        <div className="mt-2.5 min-h-[22px]">
          <span
            className="rounded-md px-1.5 py-0.5 text-xs font-bold leading-4"
            style={{
              backgroundColor: "#F5F7F7",
              color: COLORS.orange,
            }}
          >
            {story.label}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p
          className="mt-3 text-xs leading-5"
          style={{
            color: COLORS.azure,
          }}
        >
          {story.description}
        </p>

        {/* PUBLISHED */}
        <p
          className="mt-2.5 text-xs leading-4"
          style={{
            color: COLORS.azure,
          }}
        >
          {story.published}
        </p>

        {/* CTA AREA */}
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2">
            <ReadStoryButton />
            <SaveButton />
          </div>

          {/* ONLY FIRST ROW */}
          {story.showLinks && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <button
                type="button"
                className="text-xs font-semibold underline"
                style={{
                  color: COLORS.azure,
                }}
              >
                Share
              </button>

              <button
                type="button"
                className="text-xs font-semibold underline"
                style={{
                  color: COLORS.azure,
                }}
              >
                Follow {story.category}
              </button>

              <button
                type="button"
                className="text-xs font-semibold underline"
                style={{
                  color: COLORS.azure,
                }}
              >
                Report an inaccuracy
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ConservationFeed() {
  const [activeFilter, setActiveFilter] =
    useState("All Conservation");

  const [showAll, setShowAll] = useState(false);

  const filteredStories =
    activeFilter === "All Conservation"
      ? stories
      : stories.filter(
          (story) =>
            story.category === activeFilter
        );

  const visibleStories = showAll
    ? filteredStories
    : filteredStories.slice(0, 3);

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: COLORS.page,
      }}
    >
      {/* ADDED BOTTOM PADDING HERE */}
      <div className="mx-auto w-full max-w-[1232px] px-4 pb-[56px] lg:px-0">

        {/* =====================================================
            FILTERS
        ===================================================== */}
        <div className="flex min-h-[96px] flex-wrap content-start gap-2 pt-2">
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              label={filter}
              active={
                activeFilter === filter
              }
              onClick={() => {
                setActiveFilter(filter);
                setShowAll(false);
              }}
            />
          ))}
        </div>

        {/* =====================================================
            FEATURED STORY
        ===================================================== */}
        <div
          className="overflow-hidden rounded-[20px]"
          style={{
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.line}`,
          }}
        >
          {/* CHANGE BAR */}
          <div
            className="flex h-10 items-center px-5"
            style={{
              backgroundColor: "#FFF6EA",
            }}
          >
            <div className="mr-2.5 flex h-3.5 w-3.5 items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke={COLORS.orange}
                  strokeWidth="1"
                />

                <path
                  d="M7 4.2V7.2L9 8.4"
                  stroke={COLORS.orange}
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span
              className="text-xs font-bold leading-5"
              style={{
                color: COLORS.orange,
              }}
            >
              What changed: Status moved from Approved /
              funded to Active / protected.
            </span>
          </div>

          {/* FEATURED GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[707px_1fr]">

            {/* FEATURED IMAGE */}
            <div className="relative h-[430px] w-full">
              <Image
                src="/conservation/image1.png"
                alt="Regional wildlife corridor connecting two forest reserves"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1023px) 100vw, 707px"
              />
            </div>

            {/* FEATURED CONTENT */}
            <div className="min-h-[430px] px-[26px] py-6">

              {/* TOP TAGS */}
              <div className="flex flex-wrap items-start gap-2">
                <span
                  className="rounded-lg px-2.5 py-1 text-xs font-bold leading-4"
                  style={{
                    backgroundColor: "#F5F7F7",
                    color: COLORS.ink,
                  }}
                >
                  ✓ Pacific Conservation Trust · Tier 1
                </span>

                <span
                  className="rounded-md px-2 py-[3px] text-xs font-semibold leading-4"
                  style={{
                    backgroundColor: "#F8FAFA",
                    border: `1px solid ${COLORS.line}`,
                    color: COLORS.azure,
                  }}
                >
                  Restoration & Rewilding
                </span>
              </div>

              {/* SECOND ROW TAGS */}
              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className="rounded-md px-2 py-[3px] text-xs font-semibold leading-4"
                  style={{
                    backgroundColor: "#F8FAFA",
                    border: `1px solid ${COLORS.line}`,
                    color: COLORS.azure,
                  }}
                >
                  Conservation action update
                </span>

                <span
                  className="rounded-md px-2 py-1 text-xs font-bold leading-4 text-white"
                  style={{
                    backgroundColor: COLORS.brand,
                  }}
                >
                  Active / protected
                </span>
              </div>

              {/* TITLE */}
              <h1
                className="mt-5 text-xl font-extrabold leading-7"
                style={{
                  color: COLORS.title,
                }}
              >
                Regional wildlife corridor moves to active
                <br className="hidden lg:block" />
                protection, connecting two forest reserves
              </h1>

              {/* DESCRIPTION */}
              <p
                className="mt-3 text-sm leading-6"
                style={{
                  color: COLORS.azure,
                }}
              >
                A wildlife corridor linking two state forest
                reserves has been designated active and protected,
                restricting new development along the route. The
                designation follows an approved-and-funded planning
                phase completed earlier this year.
              </p>

              {/* META */}
              <p
                className="mt-4 text-xs leading-4"
                style={{
                  color: COLORS.azure,
                }}
              >
                Published 3 days ago · Updated 34 minutes ago ·
                Region: Pacific Northwest, USA
                <br />
                (state-level)
              </p>

              {/* FEATURED CTA */}
              <div className="mt-5 flex items-center gap-2.5">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                  style={{
                    backgroundColor: COLORS.brand,
                  }}
                >
                  <span className="underline">
                    Read Story
                  </span>

                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 9L9 3M9 3H4.5M9 3V7.5"
                      stroke="white"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="rounded-[10px] px-3 py-3 text-xs font-semibold"
                  style={{
                    backgroundColor: COLORS.white,
                    color: COLORS.ink,
                    border: `1px solid ${COLORS.line}`,
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CURRENT CONSERVATION COVERAGE
        ===================================================== */}
        <div className="pb-1 pt-6">
          <h2
            className="text-xl font-extrabold leading-8"
            style={{
              color: COLORS.ink,
            }}
          >
            Current conservation coverage
          </h2>
        </div>

        {/* =====================================================
            STORY GRID
        ===================================================== */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleStories.map((story) => (
            <StoryCard
              key={story.title}
              story={story}
            />
          ))}
        </div>

        {/* =====================================================
            LOAD MORE
        ===================================================== */}
        {!showAll &&
          filteredStories.length > 3 && (
            <div className="flex justify-center py-7">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={{
                  backgroundColor: COLORS.white,
                  color: COLORS.ink,
                  border: `1px solid ${COLORS.line}`,
                }}
              >
                Load more stories
              </button>
            </div>
          )}

      </div>
    </section>
  );
}