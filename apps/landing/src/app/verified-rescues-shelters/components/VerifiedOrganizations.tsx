"use client";

import { useMemo, useState } from "react";
import { C } from "./theme";
import { IMAGES } from "./images";

type Organization = {
  id: number;
  initials: string;
  name: string;
  type: "Shelter" | "Rescue";
  location: string;
  animals: number;
  fosterNeeds?: number;
  animalTypes: string[];
  status?: string;
  paused?: boolean;
  image: string;
};

const organizations: Organization[] = [
  {
    id: 1,
    initials: "DH",
    name: "Downtown Humane Society",
    type: "Shelter",
    location: "Sacramento, CA",
    animals: 12,
    fosterNeeds: 3,
    animalTypes: ["Dogs", "Cats"],
    image: IMAGES.dog,
  },
  {
    id: 2,
    initials: "FF",
    name: "Feline Foster Network",
    type: "Rescue",
    location: "Austin, TX",
    animals: 5,
    fosterNeeds: 8,
    animalTypes: ["Cats"],
    image: IMAGES.foster,
  },
  {
    id: 3,
    initials: "NA",
    name: "Northside Animal Shelter",
    type: "Shelter",
    location: "Portland, OR",
    animals: 9,
    fosterNeeds: 0,
    animalTypes: ["Dogs", "Cats"],
    image: IMAGES.park,
  },
  {
    id: 4,
    initials: "RF",
    name: "Regional Farm Sanctuary",
    type: "Shelter",
    location: "Seattle, WA",
    animals: 4,
    fosterNeeds: 2,
    animalTypes: ["Farm animals"],
    image: IMAGES.sanctuary,
  },
  {
    id: 5,
    initials: "CW",
    name: "Coastal Wildlife Shelter",
    type: "Rescue",
    location: "Manchester, UK",
    animals: 0,
    fosterNeeds: 0,
    animalTypes: ["Wildlife"],
    status: "Temporarily paused — no current listings",
    paused: true,
    image: IMAGES.shelter,
  },
  {
    id: 6,
    initials: "ER",
    name: "Equine Rescue & Rehabilitation",
    type: "Rescue",
    location: "Chicago, IL",
    animals: 3,
    fosterNeeds: 1,
    animalTypes: ["Horses"],
    image: IMAGES.rescue,
  },
  {
    id: 7,
    initials: "SV",
    name: "Sacramento Valley Wildlife Rescue",
    type: "Rescue",
    location: "Sacramento, CA",
    animals: 0,
    fosterNeeds: 0,
    animalTypes: ["Wildlife"],
    status: "No current adoption or foster listings",
    image: IMAGES.fox,
  },
  {
    id: 8,
    initials: "BL",
    name: "Backyard Litter Foster Circle",
    type: "Rescue",
    location: "Chicago, IL",
    animals: 6,
    fosterNeeds: 4,
    animalTypes: ["Rabbits", "Cats"],
    image: IMAGES.litter,
  },
  {
    id: 9,
    initials: "CS",
    name: "City Shelter Volunteers Network",
    type: "Shelter",
    location: "Manila, PH",
    animals: 7,
    fosterNeeds: 0,
    animalTypes: ["Dogs"],
    image: IMAGES.adoption,
  },
];

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="7"
        cy="7"
        r="4.5"
        stroke={C.muted}
        strokeWidth="1.25"
      />

      <path
        d="M10.5 10.5L13.25 13.25"
        stroke={C.muted}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M8 14C8 14 12 10.55 12 6.75C12 4.13 10.21 2 8 2C5.79 2 4 4.13 4 6.75C4 10.55 8 14 8 14Z"
        stroke={C.muted}
        strokeWidth="1.25"
      />

      <circle
        cx="8"
        cy="6.5"
        r="1.5"
        stroke={C.muted}
        strokeWidth="1.25"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2.5 3.25H11.5"
        stroke={C.brand}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <path
        d="M2.5 7H11.5"
        stroke={C.brand}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <path
        d="M2.5 10.75H11.5"
        stroke={C.brand}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <circle
        cx="4.4"
        cy="3.25"
        r="1"
        fill={C.white}
        stroke={C.brand}
        strokeWidth="1"
      />

      <circle
        cx="9.4"
        cy="7"
        r="1"
        fill={C.white}
        stroke={C.brand}
        strokeWidth="1"
      />

      <circle
        cx="6.4"
        cy="10.75"
        r="1"
        fill={C.white}
        stroke={C.brand}
        strokeWidth="1"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke={C.brand}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/*
 * Shield + check icon.
 */
function VerifiedIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 1.15L10 2.65V5.45C10 8.1 8.35 10.05 6 10.85C3.65 10.05 2 8.1 2 5.45V2.65L6 1.15Z"
        fill={C.brand}
      />

      <path
        d="M3.8 5.9L5.2 7.2L8.25 4.45"
        stroke={C.white}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Organization Card                                                          */
/* -------------------------------------------------------------------------- */

function OrganizationCard({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <article
      className="flex min-w-0 w-full flex-col overflow-hidden rounded-[20px] bg-white"
      style={{
        border: `1px solid ${C.line}`,
      }}
    >
      {/* Banner */}

      <div
        className="relative h-[110px] w-full overflow-hidden"
        style={{
          background: `linear-gradient(110deg, ${C.brand}, #E9A15D)`,
        }}
      >
        <img
          src={organization.image}
          alt={`${organization.name} banner`}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Avatar */}

        <div
          className="absolute left-4 top-[80px] flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#F4F7F7]"
          style={{
            border: `3px solid ${C.white}`,
            boxShadow: "0px 1px 2px rgba(7,59,71,0.06)",
          }}
        >
          <span
            className="text-base font-bold leading-6"
            style={{
              color: C.ink,
            }}
          >
            {organization.initials}
          </span>
        </div>
      </div>

      {/* Card content */}

      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-6 pt-7">
        {/* Organization name + verified */}

        <div className="flex w-full items-start justify-between gap-3">
          <h3
            className="min-w-0 flex-1 text-base font-bold leading-6"
            style={{
              color: C.brand,
            }}
          >
            {organization.name}
          </h3>

          <div
            className="flex shrink-0 items-center gap-1 rounded-md px-2 py-[3px]"
            style={{
              backgroundColor: "#F4F7F7",
            }}
          >
            <VerifiedIcon />

            <span
              className="text-xs font-bold"
              style={{
                color: C.ink,
              }}
            >
              Verified
            </span>
          </div>
        </div>

        {/* Organization type */}

        <div className="flex w-full">
          <span
            className="text-xs font-semibold leading-5"
            style={{
              color: C.muted,
            }}
          >
            {organization.type}
          </span>
        </div>

        {/* Location */}

        <div className="flex w-full items-center gap-[5px]">
          <LocationIcon />

          <span
            className="text-xs font-normal leading-4"
            style={{
              color: C.muted,
            }}
          >
            {organization.location}
          </span>
        </div>

        {/* Stats */}

        {!organization.paused && (
          <div className="flex flex-wrap items-start gap-2">
            <div
              className="rounded-md px-2 pb-1 pt-0.5"
              style={{
                backgroundColor: "#F4F7F7",
              }}
            >
              <span
                className="text-xs font-semibold leading-4"
                style={{
                  color: C.ink,
                }}
              >
                {organization.animals} animals available
              </span>
            </div>

            {organization.fosterNeeds !== undefined && (
              <div
                className="rounded-md px-2 pb-1 pt-0.5"
                style={{
                  backgroundColor: "#F8F1EB",
                }}
              >
                <span
                  className="text-xs font-semibold leading-4"
                  style={{
                    color: "#B36B32",
                  }}
                >
                  {organization.fosterNeeds} foster needs
                </span>
              </div>
            )}
          </div>
        )}

        {/* Paused / no listing status */}

        {organization.status && (
          <div
            className="w-fit max-w-full rounded-md px-2 pb-[2.75px] pt-[2.5px]"
            style={{
              backgroundColor: "#F8F1EB",
            }}
          >
            <span
              className="text-xs font-semibold leading-4"
              style={{
                color: "#B36B32",
              }}
            >
              {organization.status}
            </span>
          </div>
        )}

        {/* Animal types */}

        <div className="flex flex-wrap items-start gap-1.5">
          {organization.animalTypes.map((animalType) => (
            <span
              key={animalType}
              className="rounded-md px-2 pb-1 pt-0.5 text-xs font-semibold leading-4"
              style={{
                color: C.muted,
                backgroundColor: "#F8FAFA",
                border: `1px solid ${C.line}`,
              }}
            >
              {animalType}
            </span>
          ))}
        </div>

        {/* Buttons */}

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-[10px] px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: C.brand,
              color: C.white,
            }}
          >
            View Organization
          </button>

          <button
            type="button"
            className="rounded-[10px] px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#F5F8F8]"
            style={{
              backgroundColor: C.white,
              color: C.brand,
              border: `1px solid ${C.line}`,
            }}
          >
            {organization.paused ? "Follow" : "View Animals"}
          </button>
        </div>

        {/* Report concern */}

        <div className="pt-1.5">
          <button
            type="button"
            className="text-xs font-semibold underline underline-offset-2"
            style={{
              color: C.muted,
            }}
          >
            Report a concern
          </button>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function VerifiedOrganizations() {
  const [organizationQuery, setOrganizationQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [sort, setSort] = useState("Relevance");
  const [showFilters, setShowFilters] = useState(false);

  /*
   * Start with 9 because there are currently 9 organizations.
   * The Load More button below is intentionally always visible.
   */
  const [visibleCount, setVisibleCount] = useState(9);

  /* ------------------------------------------------------------------------ */
  /* Search + sorting                                                         */
  /* ------------------------------------------------------------------------ */

  const filteredOrganizations = useMemo(() => {
    let result = organizations.filter((organization) => {
      const name = organization.name.toLowerCase();
      const location = organization.location.toLowerCase();

      const searchName = organizationQuery.toLowerCase().trim();
      const searchLocation = locationQuery.toLowerCase().trim();

      const matchesName =
        searchName === "" || name.includes(searchName);

      const matchesLocation =
        searchLocation === "" ||
        location.includes(searchLocation);

      return matchesName && matchesLocation;
    });

    if (sort === "Name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sort === "Animals available") {
      result = [...result].sort(
        (a, b) => b.animals - a.animals
      );
    }

    return result;
  }, [organizationQuery, locationQuery, sort]);

  const visibleOrganizations = filteredOrganizations.slice(
    0,
    visibleCount
  );

  /* ------------------------------------------------------------------------ */
  /* Use My Location                                                          */
  /* ------------------------------------------------------------------------ */

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(
          "Current location:",
          position.coords.latitude,
          position.coords.longitude
        );

        /*
         * The design only provides the location button.
         * You can connect these coordinates to your API later
         * to find organizations near the user.
         */
      },
      () => {
        alert(
          "Unable to access your location. Please check your browser permissions."
        );
      }
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Clear filters                                                            */
  /* ------------------------------------------------------------------------ */

  const clearFilters = () => {
    setOrganizationQuery("");
    setLocationQuery("");
    setSort("Relevance");
    setVisibleCount(9);
    setShowFilters(false);
  };

  return (
    <section
      className="w-full overflow-hidden"
      style={{
        backgroundColor: C.page,
      }}
    >
      <div className="mx-auto w-full max-w-[1232px] px-4 sm:px-6 lg:px-0">
        {/* ================================================================= */}
        {/* SEARCH                                                            */}
        {/* ================================================================= */}

        <div className="flex w-full flex-wrap items-center gap-2.5 pb-1.5 pt-5">
          {/* Organization name */}

          <div
            className="flex h-[45px] min-w-[220px] flex-1 items-center gap-2 rounded-xl bg-white px-3.5 py-2.5"
            style={{
              border: `1px solid ${C.line}`,
            }}
          >
            <SearchIcon />

            <input
              type="text"
              value={organizationQuery}
              onChange={(event) =>
                setOrganizationQuery(event.target.value)
              }
              placeholder="Organization name"
              aria-label="Organization name"
              className="min-w-0 flex-1 bg-transparent px-0.5 py-px text-sm font-normal outline-none"
              style={{
                color: C.ink,
              }}
            />
          </div>

          {/* City / region */}

          <div
            className="flex h-[45px] min-w-[220px] flex-1 items-center gap-2 rounded-xl bg-white px-3.5 py-2.5"
            style={{
              border: `1px solid ${C.line}`,
            }}
          >
            <LocationIcon />

            <input
              type="text"
              value={locationQuery}
              onChange={(event) =>
                setLocationQuery(event.target.value)
              }
              placeholder="City or region"
              aria-label="City or region"
              className="min-w-0 flex-1 bg-transparent px-0.5 py-px text-sm font-normal outline-none"
              style={{
                color: C.ink,
              }}
            />
          </div>

          {/* Use My Location */}

          <button
            type="button"
            onClick={handleUseLocation}
            className="flex h-[45px] shrink-0 items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold transition-colors hover:bg-[#F5F8F8]"
            style={{
              color: C.brand,
              border: `1px solid ${C.line}`,
            }}
          >
            Use My Location
          </button>
        </div>

        {/* ================================================================= */}
        {/* FILTER / SORT BAR                                                 */}
        {/* ================================================================= */}

        <div
          className="relative flex min-h-20 w-full flex-wrap items-center gap-4 border-b border-t py-4"
          style={{
            borderColor: C.line,
          }}
        >
          {/* Filters button */}

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-[#F5F8F8]"
            style={{
              color: C.brand,
              border: `1px solid ${C.line}`,
            }}
          >
            <FilterIcon />
            Filters
          </button>

          {/* Sort */}

          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold leading-5"
              style={{
                color: C.muted,
              }}
            >
              Sort
            </span>

            <div className="relative">
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setVisibleCount(9);
                }}
                className="h-10 appearance-none rounded-xl bg-white pl-4 pr-9 text-sm font-semibold outline-none"
                style={{
                  color: C.brand,
                  border: `1px solid ${C.line}`,
                }}
              >
                <option value="Relevance">Relevance</option>
                <option value="Name">Name</option>
                <option value="Animals available">
                  Animals available
                </option>
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {/* Count */}

          <div className="ml-auto">
            <span
              className="text-sm font-semibold leading-5"
              style={{
                color: C.muted,
              }}
            >
              {filteredOrganizations.length} verified organizations
            </span>
          </div>

          {/* Filter dropdown */}

          {showFilters && (
            <div
              className="absolute left-0 top-[72px] z-30 w-full rounded-xl bg-white p-4 shadow-lg"
              style={{
                border: `1px solid ${C.line}`,
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: C.ink,
                    }}
                  >
                    Filters
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: C.muted,
                    }}
                  >
                    Use the search fields above to narrow organizations.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg px-3 py-2 text-xs font-semibold"
                  style={{
                    color: C.brand,
                    backgroundColor: C.chip,
                  }}
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* HEADING                                                           */}
        {/* ================================================================= */}

        <div className="flex w-full items-end pb-1 pt-5">
          <h2
            className="text-xl font-extrabold leading-8"
            style={{
              color: C.ink,
            }}
          >
            Verified organizations
          </h2>
        </div>

        {/* ================================================================= */}
        {/* ORGANIZATION CARDS                                                */}
        {/* ================================================================= */}

        <div className="grid w-full grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleOrganizations.map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>

        {/* ================================================================= */}
        {/* EMPTY STATE                                                       */}
        {/* ================================================================= */}

        {visibleOrganizations.length === 0 && (
          <div
            className="mt-4 rounded-[20px] bg-white px-6 py-12 text-center"
            style={{
              border: `1px solid ${C.line}`,
            }}
          >
            <h3
              className="text-base font-bold"
              style={{
                color: C.ink,
              }}
            >
              No organizations found
            </h3>

            <p
              className="mt-1 text-sm"
              style={{
                color: C.muted,
              }}
            >
              Try changing the organization name or location.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-[10px] px-3 py-2 text-xs font-semibold"
              style={{
                backgroundColor: C.brand,
                color: C.white,
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* LOAD MORE                                                         */}
        {/* ================================================================= */}

        <div className="flex w-full flex-col items-center pb-8 pt-7">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((count) => count + 3)
            }
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F5F8F8]"
            style={{
              color: C.brand,
              border: `1px solid ${C.line}`,
            }}
          >
            Load more organizations
          </button>
        </div>
      </div>
    </section>
  );
}