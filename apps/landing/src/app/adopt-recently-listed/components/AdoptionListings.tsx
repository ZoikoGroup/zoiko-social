"use client";

import Image from "next/image";
import { useState } from "react";
import { C } from "./theme";
import { IMAGES } from "./images";

type Listing = {
  name: string;
  image: string;
  species: string;
  location: string;
  description: string;
  listed: string;
  updated?: string;
  organization: string;
  status:
    | "Available"
    | "Adoption pending"
    | "Inquiry in progress"
    | "Adopted";
  available: boolean;
  isNew?: boolean;
};

const listings: Listing[] = [
  {
    name: "Nova",
    image: IMAGES.nova,
    species: "Dog · Mixed Breed Puppy · Baby",
    location: "Sacramento, CA area",
    description:
      "Playful and curious. Still learning basic house manners.",
    listed: "Listed 2 hours ago",
    organization: "Sacramento Animal Rescue",
    status: "Available",
    available: true,
    isNew: true,
  },

  {
    name: "Juniper",
    image: IMAGES.juniper,
    species: "Rabbit · Mixed Breed · Young",
    location: "Bristol area",
    description:
      "Calm and litter-trained. Good for a first-time rabbit owner.",
    listed: "Listed 5 hours ago",
    organization: "Second Chance Animal Shelter",
    status: "Available",
    available: true,
    isNew: true,
  },

  {
    name: "Milo",
    image: IMAGES.milo,
    species: "Cat · Domestic Shorthair · Young Adult",
    location: "Sacramento, CA area",
    description:
      "Playful and affectionate. Gets along well with dogs.",
    listed: "Listed 1 day ago",
    updated: "Updated 2 hours ago",
    organization: "Sacramento Animal Rescue",
    status: "Available",
    available: true,
  },

  {
    name: "Willow",
    image: IMAGES.willow,
    species: "Dog · Labrador Mix · Adult",
    location: "Sacramento, CA area",
    description:
      "Friendly, house-trained, and great with kids.",
    listed: "Listed 3 days ago",
    organization: "Sacramento Animal Rescue",
    status: "Available",
    available: true,
  },

  {
    name: "Coco",
    image: IMAGES.coco,
    species: "Dog · Beagle Mix · Adult",
    location: "Davis, CA area",
    description:
      "Friendly with other dogs. Would suit an active household.",
    listed: "Listed 4 days ago",
    organization: "Golden State Rescue Alliance",
    status: "Available",
    available: true,
  },

  {
    name: "Pepper",
    image: IMAGES.pepper,
    species: "Cat · Domestic Shorthair · Senior",
    location: "Sacramento, CA area",
    description:
      "Calm and enjoys quiet company. Adoption is currently pending.",
    listed: "Listed 6 days ago",
    updated: "Updated 4 hours ago",
    organization: "Sacramento Animal Rescue",
    status: "Adoption pending",
    available: true,
  },

  {
    name: "Max",
    image: IMAGES.max,
    species: "Dog · Golden Retriever · Senior",
    location: "Elk Grove, CA area",
    description:
      "A gentle senior boy looking for a quiet home.",
    listed: "Listed 9 days ago",
    organization: "Golden State Rescue Alliance",
    status: "Inquiry in progress",
    available: true,
  },

  {
    name: "Bear",
    image: IMAGES.bear,
    species: "Dog · Mixed Breed · Adult",
    location: "Sacramento, CA area",
    description:
      "Recently adopted — no longer available.",
    listed: "Listed 12 days ago",
    updated: "Updated 18 hours ago",
    organization: "Sacramento Animal Rescue",
    status: "Adopted",
    available: false,
  },
];

const speciesFilters = [
  "All species",
  "Dogs",
  "Cats",
  "Rabbits",
  "Verified source",
];

/* --------------------------------------------------
   SEARCH ICON
-------------------------------------------------- */

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="7.5"
        cy="7.5"
        r="4.67"
        stroke={C.azure42}
        strokeWidth="1.42"
      />

      <path
        d="M11 11L13.17 13.17"
        stroke={C.azure42}
        strokeWidth="1.42"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* --------------------------------------------------
   LOCATION ICON
-------------------------------------------------- */

function LocationIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 10.5C6 10.5 9 7.47 9 4.75C9 3.09 7.66 1.75 6 1.75C4.34 1.75 3 3.09 3 4.75C3 7.47 6 10.5 6 10.5Z"
        stroke={C.azure42}
        strokeWidth="1"
      />

      <circle
        cx="6"
        cy="4.75"
        r="1"
        stroke={C.azure42}
        strokeWidth="1"
      />
    </svg>
  );
}

/* --------------------------------------------------
   CLOCK ICON
-------------------------------------------------- */

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="6"
        cy="6"
        r="4.4"
        stroke={C.cyan15}
        strokeWidth="0.9"
      />

      <path
        d="M6 3.8V6L7.45 6.85"
        stroke={C.cyan15}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* --------------------------------------------------
   FILTER ICON
-------------------------------------------------- */

function FilterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 4H11.5"
        stroke={C.cyan13}
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      <path
        d="M2.5 10H11.5"
        stroke={C.cyan13}
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      <circle
        cx="9.25"
        cy="3.75"
        r="1.38"
        fill={C.white}
        stroke={C.cyan13}
        strokeWidth="1.25"
      />

      <circle
        cx="4.75"
        cy="10"
        r="1.38"
        fill={C.white}
        stroke={C.cyan13}
        strokeWidth="1.25"
      />
    </svg>
  );
}

/* --------------------------------------------------
   MORE ICON
-------------------------------------------------- */

function MoreIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="3"
        cy="8"
        r="1"
        fill={C.azure42}
      />

      <circle
        cx="8"
        cy="8"
        r="1"
        fill={C.azure42}
      />

      <circle
        cx="13"
        cy="8"
        r="1"
        fill={C.azure42}
      />
    </svg>
  );
}

/* --------------------------------------------------
   VERIFIED ICON
-------------------------------------------------- */

function VerifiedIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="6"
        cy="6"
        r="5"
        fill={C.azure42}
      />

      <path
        d="M3.7 6.1L5.2 7.6L8.4 4.4"
        stroke={C.white}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------
   SAVED ICON
-------------------------------------------------- */

function SavedIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 2.5C3.5 1.95 3.95 1.5 4.5 1.5H10.5C11.05 1.5 11.5 1.95 11.5 2.5V13L7.5 10.5L3.5 13V2.5Z"
        fill={C.white}
        stroke={C.cyan13}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------
   AVAILABILITY BADGE
-------------------------------------------------- */

function AvailabilityBadge({
  listing,
}: {
  listing: Listing;
}) {
  if (listing.status === "Adoption pending") {
    return (
      <div
        className="
          absolute
          left-2.5
          top-2.5
          z-10
          rounded-full
          bg-white
          px-2.5
          py-1
          text-[10px]
          font-semibold
          leading-[13px]
          shadow-sm
        "
        style={{
          color: "#C77B22",
        }}
      >
        Adoption pending
      </div>
    );
  }

  if (listing.status === "Inquiry in progress") {
    return (
      <div
        className="
          absolute
          left-2.5
          top-2.5
          z-10
          rounded-full
          bg-white
          px-2.5
          py-1
          text-[10px]
          font-semibold
          leading-[13px]
          shadow-sm
        "
        style={{
          color: "#C77B22",
        }}
      >
        Inquiry in progress
      </div>
    );
  }

  if (listing.status === "Adopted") {
    return (
      <div
        className="
          absolute
          left-2.5
          top-2.5
          z-10
          rounded-full
          bg-white
          px-2.5
          py-1
          text-[10px]
          font-semibold
          leading-[13px]
          shadow-sm
        "
        style={{
          color: C.azure42,
        }}
      >
        Adopted
      </div>
    );
  }

  return (
    <div
      className="
        absolute
        right-2.5
        top-2.5
        z-10
        rounded-full
        bg-white
        px-2.5
        py-1
        text-[10px]
        font-semibold
        leading-[13px]
        shadow-sm
      "
      style={{
        color: "#3B996D",
      }}
    >
      Available
    </div>
  );
}

/* --------------------------------------------------
   LISTING CARD
-------------------------------------------------- */

function ListingCard({
  listing,
}: {
  listing: Listing;
}) {
  return (
    <article
      className="
        flex
        h-[400px]
        min-w-0
        flex-col
        overflow-hidden
        rounded-[16px]
        bg-white
      "
      style={{
        border: `1px solid ${C.cyan89}`,
      }}
    >
      {/* ==========================================
          IMAGE
      ========================================== */}

      <div
        className="
          relative
          h-[166px]
          w-full
          shrink-0
          overflow-hidden
        "
      >
        <Image
          src={listing.image}
          alt={`${listing.name} - ${listing.species}`}
          fill
          className="object-cover"
          sizes="
            (max-width: 639px) 100vw,
            (max-width: 1023px) 50vw,
            291px
          "
        />

        {/* NEW */}

        {listing.isNew && (
          <div
            className="
              absolute
              left-2.5
              top-2.5
              z-10
              rounded-full
              px-2.5
              py-1
              text-[10px]
              font-bold
              leading-[13px]
              text-white
            "
            style={{
              backgroundColor: C.cyan15,
            }}
          >
            NEW
          </div>
        )}

        {/* AVAILABLE / STATUS */}

        <AvailabilityBadge listing={listing} />

        {/* SAVED */}

        <button
          type="button"
          aria-label={`Save ${listing.name}`}
          className="
            absolute
            bottom-2.5
            right-2.5
            z-10
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-[6px]
            bg-white
            shadow-sm
          "
          style={{
            border: `1px solid ${C.cyan89}`,
          }}
        >
          <SavedIcon />
        </button>
      </div>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <div
        className="
          flex
          min-h-0
          flex-1
          flex-col
          px-3.5
          pb-3.5
          pt-3
        "
      >
        {/* NAME */}

        <div
          className="
            text-[15px]
            font-bold
            leading-[20px]
          "
          style={{
            color: C.cyan13,
          }}
        >
          {listing.name}
        </div>

        {/* SPECIES */}

        <div
          className="
            mt-0.5
            truncate
            text-[12px]
            font-normal
            leading-[17px]
          "
          style={{
            color: C.azure42,
          }}
        >
          {listing.species}
        </div>

        {/* LOCATION */}

        <div
          className="
            mt-1.5
            flex
            items-center
            gap-1
          "
        >
          <LocationIcon />

          <span
            className="
              truncate
              text-[12px]
              font-normal
              leading-[17px]
            "
            style={{
              color: C.azure42,
            }}
          >
            {listing.location}
          </span>
        </div>

        {/* DESCRIPTION */}

        <p
          className="
            mt-1.5
            line-clamp-2
            min-h-[34px]
            text-[12px]
            font-normal
            leading-[17px]
          "
          style={{
            color: C.azure42,
          }}
        >
          {listing.description}
        </p>

        {/* LISTED */}

        <div className="mt-2">
          <div
            className="
              inline-flex
              h-[23px]
              items-center
              gap-1.5
              rounded-full
              px-2.5
            "
            style={{
              backgroundColor: "#F1F4F3",
            }}
          >
            <ClockIcon />

            <span
              className="
                text-[11px]
                font-bold
                leading-[15px]
              "
              style={{
                color: C.cyan15,
              }}
            >
              {listing.listed}
            </span>
          </div>
        </div>

        {/* UPDATED */}

        <div className="mt-1 min-h-[17px]">
          {listing.updated && (
            <span
              className="
                text-[11px]
                font-semibold
                leading-[17px]
              "
              style={{
                color: C.azure42,
              }}
            >
              {listing.updated}
            </span>
          )}
        </div>

        {/* ORGANIZATION */}

        <div
          className="
            mt-1
            flex
            h-[18px]
            min-w-0
            items-center
            gap-1.5
          "
        >
          <span
            className="
              min-w-0
              truncate
              text-[12px]
              font-normal
              leading-[17px]
            "
            style={{
              color: C.azure42,
            }}
          >
            {listing.organization}
          </span>

          <VerifiedIcon />
        </div>

        {/* ========================================
            CTA

            mt-auto keeps every CTA at exactly
            the same vertical position.
        ======================================== */}

        <div
          className="
            mt-auto
            flex
            w-full
            items-center
            gap-2
            pt-3
          "
        >
          {/* VIEW ADOPTION PROFILE */}

          <button
            type="button"
            disabled={!listing.available}
            className="
              flex
              h-[32px]
              min-w-0
              flex-1
              items-center
              justify-center
              rounded-[7px]
              px-3
              text-[11px]
              font-bold
              leading-[15px]
              whitespace-nowrap
            "
            style={{
              backgroundColor: listing.available
                ? C.cyan25
                : "#F1F3F2",

              color: listing.available
                ? C.white
                : C.azure42,

              border: `1px solid ${
                listing.available
                  ? C.cyan25
                  : C.cyan89
              }`,
            }}
          >
            View Adoption Profile
          </button>

          {/* MORE */}

          <button
            type="button"
            aria-label={`More options for ${listing.name}`}
            className="
              flex
              h-[32px]
              w-[32px]
              shrink-0
              items-center
              justify-center
              rounded-[7px]
              bg-white
            "
            style={{
              border: `1px solid ${C.cyan89}`,
            }}
          >
            <MoreIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------- */

export default function AdoptionListings() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSpecies, setSelectedSpecies] =
    useState("All species");

  const filteredListings = listings.filter(
    (listing) => {
      const searchValue =
        search.toLowerCase().trim();

      const locationValue =
        location.toLowerCase().trim();

      /* SEARCH */

      const matchesSearch =
        !searchValue ||
        listing.name
          .toLowerCase()
          .includes(searchValue) ||
        listing.species
          .toLowerCase()
          .includes(searchValue) ||
        listing.organization
          .toLowerCase()
          .includes(searchValue);

      /* LOCATION */

      const matchesLocation =
        !locationValue ||
        listing.location
          .toLowerCase()
          .includes(locationValue);

      /* SPECIES */

      let matchesSpecies = true;

      if (selectedSpecies === "Dogs") {
        matchesSpecies =
          listing.species.startsWith("Dog");
      }

      if (selectedSpecies === "Cats") {
        matchesSpecies =
          listing.species.startsWith("Cat");
      }

      if (selectedSpecies === "Rabbits") {
        matchesSpecies =
          listing.species.startsWith("Rabbit");
      }

      if (
        selectedSpecies === "Verified source"
      ) {
        matchesSpecies = true;
      }

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSpecies
      );
    }
  );

  return (
    <section
      className="w-full"
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
          px-5
          pb-12
          lg:px-0
        "
        style={{
          backgroundColor: C.page,
        }}
      >
        {/* ==========================================
            FILTER ROW
        ========================================== */}

        <div className="flex w-full flex-wrap items-end gap-4">
          {/* SEARCH */}

          <div className="relative h-20 w-full lg:w-[560px]">
            <label
              htmlFor="listing-search"
              className="
                absolute
                left-0
                top-0
                text-xs
                font-bold
                leading-5
              "
              style={{
                color: C.cyan13,
              }}
            >
              Search
            </label>

            <div className="absolute left-0 top-7 w-full">
              <div
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  rounded-xl
                  bg-white
                  pl-11
                  pr-4
                "
                style={{
                  border: `1px solid ${C.cyan89}`,
                }}
              >
                <input
                  id="listing-search"
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by name, species, or organization"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    font-normal
                    outline-none
                    placeholder:text-[#767676]
                  "
                  style={{
                    color: C.cyan13,
                  }}
                />
              </div>

              <div
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-3.5
                "
              >
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* LOCATION */}

          <div className="relative h-20 w-full lg:w-[220px]">
            <label
              htmlFor="listing-location"
              className="
                absolute
                left-0
                top-0
                text-xs
                font-bold
                leading-5
              "
              style={{
                color: C.cyan13,
              }}
            >
              Location
            </label>

            <input
              id="listing-location"
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="City, region, or postal code"
              className="
                absolute
                left-0
                top-7
                h-12
                w-full
                rounded-xl
                bg-white
                px-3.5
                text-sm
                font-normal
                outline-none
                placeholder:text-[#767676]
              "
              style={{
                border: `1px solid ${C.cyan89}`,
                color: C.cyan13,
              }}
            />
          </div>

          {/* SORT */}

          <div className="flex h-20 flex-col gap-2">
            <label
              htmlFor="listing-sort"
              className="
                text-xs
                font-bold
                leading-5
              "
              style={{
                color: C.cyan13,
              }}
            >
              Sort
            </label>

            <div className="relative">
              <select
                id="listing-sort"
                defaultValue="newest"
                className="
                  h-12
                  appearance-none
                  rounded-xl
                  bg-white
                  pl-4
                  pr-10
                  text-sm
                  font-normal
                  outline-none
                "
                style={{
                  border: `1px solid ${C.cyan89}`,
                  color: C.cyan13,
                }}
              >
                <option value="newest">
                  Newest first
                </option>
              </select>

              <span
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  size-2
                  -translate-y-1/2
                  rotate-45
                "
                style={{
                  borderRight: `1px solid ${C.azure42}`,
                  borderBottom: `1px solid ${C.azure42}`,
                }}
              />
            </div>
          </div>

          {/* MORE FILTERS */}

          <button
            type="button"
            className="
              flex
              h-12
              items-center
              gap-1.5
              rounded-xl
              bg-white
              px-4
              text-sm
              font-bold
            "
            style={{
              border: `1px solid ${C.cyan89}`,
              color: C.cyan13,
            }}
          >
            <FilterIcon />

            <span>
              More filters
            </span>
          </button>
        </div>

        {/* ==========================================
            SORT DESCRIPTION
        ========================================== */}

        <div className="w-full pt-3">
          <p
            className="
              text-base
              font-normal
              leading-6
            "
            style={{
              color: C.cyan13,
            }}
          >
            Newest first is the default order, by
            original publish time. Payment, Premium,
            or popularity never change this order.
          </p>
        </div>

        {/* ==========================================
            SPECIES FILTERS
        ========================================== */}

        <div
          className="
            flex
            w-full
            flex-wrap
            items-center
            gap-2
            pt-4
          "
        >
          {speciesFilters.map((item) => {
            const active =
              selectedSpecies === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setSelectedSpecies(item)
                }
                className="
                  rounded-full
                  px-4
                  py-1.5
                  text-xs
                  font-semibold
                  leading-5
                "
                style={{
                  backgroundColor: active
                    ? C.cyan25
                    : C.white,

                  color: active
                    ? C.white
                    : C.azure42,

                  border: `1px solid ${
                    active
                      ? C.cyan25
                      : C.cyan89
                  }`,
                }}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* ==========================================
            SHOWING NEWEST
        ========================================== */}

        <div className="w-full pt-6">
          <p
            className="
              text-sm
              font-normal
              leading-5
            "
            style={{
              color: C.azure42,
            }}
          >
            Showing newest adoption listings first
          </p>
        </div>

        {/* ==========================================
            LISTING GRID
        ========================================== */}

        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-4
            pt-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.name}
              listing={listing}
            />
          ))}
        </div>

        {/* ==========================================
            NO RESULTS
        ========================================== */}

        {filteredListings.length === 0 && (
          <div
            className="
              flex
              min-h-[200px]
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-white
              p-8
              text-center
            "
            style={{
              border: `1px solid ${C.cyan89}`,
            }}
          >
            <p
              className="text-sm font-medium"
              style={{
                color: C.azure42,
              }}
            >
              No adoption listings match your
              search.
            </p>
          </div>
        )}

        {/* ==========================================
            LOAD MORE
        ========================================== */}

        <div
          className="
            flex
            w-full
            justify-center
            pt-6
          "
        >
          <button
            type="button"
            className="
              rounded-xl
              bg-white
              px-6
              py-3
              text-center
              text-base
              font-semibold
            "
            style={{
              color: C.cyan15,
              border: `1px solid ${C.cyan89}`,
            }}
          >
            Load more
          </button>
        </div>
      </div>
    </section>
  );
}