"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const categories = [
  {
    label: "Professional Care",
    active: true,
  },
  {
    label: "Emergency Care",
    active: false,
  },
  {
    label: "Services & Supplies",
    active: false,
  },
  {
    label: "Insurance & Plans",
    active: false,
  },
];

export default function CategoryNav() {
  return (
    <section
      className={`
        ${plusJakartaSans.className}
        w-full
        bg-white
        px-5
        py-10
        sm:px-8
        sm:py-12
        lg:px-20
        lg:py-12
      `}
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1280px]
          flex-col
          items-start
          justify-start
          gap-4
        "
      >
        {/* Label */}
        <div className="flex w-full flex-col items-center justify-start pb-[0.75px]">
          <div
            className="
              text-center
              text-base
              font-normal
              leading-6
              text-[#287A8C]
            "
          >
            Jump to category:
          </div>
        </div>

        {/* Category Buttons */}
        <div
          className="
            flex
            w-full
            flex-wrap
            content-start
            items-start
            justify-center
            gap-3
          "
        >
          {categories.map((category) => (
            <button
              key={category.label}
              type="button"
              className={`
                rounded-[20px]
                px-6
                py-3
                text-center
                text-sm
                font-bold
                outline
                outline-2
                outline-offset-[-2px]
                transition-colors
                ${
                  category.active
                    ? "bg-[#087D8E] text-white outline-[#087D8E]"
                    : "bg-white text-[#123B45] outline-[#D9E5E8] hover:bg-[#F7FAFB]"
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}