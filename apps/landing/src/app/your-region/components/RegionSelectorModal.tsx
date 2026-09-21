"use client";

import { useState } from "react";

type RegionSelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const regions = [
  { name: "Global", description: "No region filter" },
  { name: "United Kingdom" },
  { name: "United States" },
  { name: "Canada" },
  { name: "Australia" },
];

export default function RegionSelectorModal({
  isOpen,
  onClose,
}: RegionSelectorModalProps) {
  const [selectedRegion, setSelectedRegion] =
    useState("United Kingdom");

  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/35">
      {/* MODAL */}
      <div
        className="
          relative
          h-[783px]
          w-[523px]
          max-w-full
          bg-white
          shadow-2xl
        "
      >
        {/* ================= HEADER ================= */}
        <div className="relative h-[80px]">
          <h2
            className="
              absolute
              left-[32px]
              top-[23px]
              m-0
              text-[18px]
              font-extrabold
              leading-[28px]
              text-[#073B47]
            "
          >
            Set your region
          </h2>

          {/* CLOSE */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              absolute
              right-[20px]
              top-[20px]
              flex
              h-[32px]
              w-[32px]
              items-center
              justify-center
              rounded-[9px]
              border
              border-[#073B47]
              bg-[#F8F8F8]
            "
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4L11 11"
                stroke="#6B7280"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M11 4L4 11"
                stroke="#6B7280"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div
          className="
            absolute
            left-0
            right-0
            top-[80px]
            bottom-[119px]
            overflow-hidden
          "
        >
          {/* DESCRIPTION */}
          <div className="px-[24px]">
            <p
              className="
                m-0
                pt-[9px]
                text-[12px]
                font-normal
                leading-[20px]
                text-[#073B47]
              "
            >
              Region is used only to show coarse, regionally relevant stories
              first.
              <br />
              Zoiko Social never requires GPS or uses your precise location.
            </p>

            {/* SAVED REGION */}
            <div
              className="
                mt-[7px]
                flex
                h-[40px]
                w-full
                items-center
                justify-between
                rounded-[10px]
                bg-[#EAF3F5]
                px-[14px]
              "
            >
              <p
                className="
                  m-0
                  text-[12px]
                  leading-[20px]
                  text-[#073B47]
                "
              >
                <span className="font-semibold">
                  Saved region:{" "}
                </span>
                <span className="font-extrabold">
                  United Kingdom
                </span>
              </p>

              <button
                type="button"
                onClick={() =>
                  setSelectedRegion("United Kingdom")
                }
                className="
                  text-[12px]
                  font-bold
                  text-[#066879]
                "
              >
                Use saved region
              </button>
            </div>
          </div>

          {/* SEARCH SECTION */}
          <div className="px-[40px]">
            <p
              className="
                m-0
                mt-[18px]
                text-[12px]
                font-bold
                uppercase
                leading-[20px]
                tracking-[0.02em]
                text-[#6B7280]
              "
            >
              Search for a region
            </p>

            <div
              className="
                mt-[11px]
                h-[40px]
                w-full
                rounded-[10px]
                border
                border-[#DCEAEE]
                bg-white
              "
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. United Kingdom, California, Ontario"
                className="
                  h-full
                  w-full
                  rounded-[10px]
                  border-0
                  bg-transparent
                  px-[14px]
                  text-[14px]
                  font-normal
                  text-[#073B47]
                  outline-none
                  placeholder:text-[#8A969A]
                "
              />
            </div>

            {/* COMMON REGIONS */}
            <p
              className="
                m-0
                mt-[24px]
                text-[12px]
                font-bold
                uppercase
                leading-[20px]
                tracking-[0.02em]
                text-[#6B7280]
              "
            >
              Or choose from common regions
            </p>

            <div className="mt-[11px] flex flex-col gap-[10px]">
              {regions.map((region, index) => {
                const selected =
                  selectedRegion === region.name;

                return (
                  <button
                    key={region.name}
                    type="button"
                    onClick={() =>
                      setSelectedRegion(region.name)
                    }
                    className={`
                      relative
                      w-full
                      rounded-[12px]
                      border
                      border-[#DCEAEE]
                      bg-white
                      text-left
                      ${index === 0 ? "h-[64px]" : "h-[43px]"}
                    `}
                  >
                    {/* RADIO */}
                    <span
                      className={`
                        absolute
                        left-[14px]
                        top-[13px]
                        flex
                        h-[16px]
                        w-[16px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        ${
                          selected
                            ? "border-[#066879]"
                            : "border-[#DCEAEE]"
                        }
                      `}
                    >
                      {selected && (
                        <span
                          className="
                            h-[8px]
                            w-[8px]
                            rounded-full
                            bg-[#066879]
                          "
                        />
                      )}
                    </span>

                    {/* NAME */}
                    <span
                      className="
                        absolute
                        left-[42px]
                        top-[12px]
                        text-[14px]
                        font-bold
                        leading-[20px]
                        text-[#073B47]
                      "
                    >
                      {region.name}
                    </span>

                    {/* DESCRIPTION */}
                    {region.description && (
                      <span
                        className="
                          absolute
                          left-[42px]
                          top-[35px]
                          text-[12px]
                          font-normal
                          leading-[16px]
                          text-[#6B7280]
                        "
                      >
                        {region.description}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-[119px]
            border-t
            border-[#E5E7EB]
            bg-white
            px-[20px]
            pt-[16px]
          "
        >
          <div className="flex items-center justify-between gap-[8px]">
            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              className="
                h-[44px]
                w-[108px]
                rounded-[12px]
                border
                border-[#DCEAEE]
                bg-white
                text-[16px]
                font-semibold
                text-[#073B47]
              "
            >
              Cancel
            </button>

            {/* EXPLORE */}
            <button
              type="button"
              onClick={onClose}
              className="
                h-[44px]
                w-[204px]
                rounded-[12px]
                border
                border-[#DCEAEE]
                bg-white
                text-[16px]
                font-semibold
                text-[#073B47]
              "
            >
              Explore Temporarily
            </button>

            {/* SAVE */}
            <button
              type="button"
              onClick={onClose}
              className="
                h-[44px]
                w-[149px]
                rounded-[12px]
                bg-[#066879]
                text-[16px]
                font-semibold
                text-white
              "
            >
              Save Region
            </button>
          </div>

          {/* CLEAR */}
          <button
            type="button"
            className="
              mx-auto
              mt-[7px]
              block
              text-center
              text-[12px]
              font-bold
              text-[#6B7280]
              underline
            "
          >
            Clear my saved region
          </button>
        </div>
      </div>
    </div>
  );
}