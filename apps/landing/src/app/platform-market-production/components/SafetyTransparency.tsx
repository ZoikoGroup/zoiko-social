"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const safetyItems = [
  {
    title: "Provider Verification",
    description:
      "All providers are verified before listing. Learn what verification means for different categories.",
  },
  {
    title: "How to Evaluate Providers",
    description:
      "Review qualifications, check credentials, and understand how to assess whether a provider is right for your needs.",
  },
  {
    title: "Emergency Care Note",
    description:
      "Emergency vet care listings are informational only. In a true emergency, call 911 or your nearest emergency clinic immediately.",
  },
  {
    title: "External Services",
    description:
      "Zoiko Market connects you with external providers. Review their terms and privacy policies before booking or purchasing.",
  },
];

export default function SafetyTransparency() {
  return (
    <section
      className={`
        ${plusJakartaSans.className}
        w-full
        bg-[#F5F7F8]
        px-5
        py-12
        sm:px-8
        sm:py-16
        lg:px-28
        lg:py-20
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
        "
      >
        {/* Safety & Transparency Card */}
        <div
          className="
            flex
            w-full
            flex-col
            items-start
            justify-center
            gap-6
            rounded-3xl
            border
            border-[#D9E5E8]
            bg-gradient-to-br
            from-[#F1F8F9]
            to-white
            p-6
            sm:p-8
            lg:p-12
          "
        >
          {/* Heading */}
          <div className="flex w-full flex-col items-start pb-px">
            <h2
              className="
                w-full
                text-xl
                font-bold
                leading-7
                text-[#087D8E]
              "
            >
              🛡️ Safety &amp; Transparency
            </h2>
          </div>

          {/* Safety Items */}
          <div
            className="
              flex
              w-full
              flex-col
              items-start
              gap-3
              sm:px-6
              lg:px-16
            "
          >
            {safetyItems.map((item) => (
              <div
                key={item.title}
                className="
                  flex
                  w-full
                  items-start
                  gap-3
                  pt-3
                  first:pt-0
                "
              >
                {/* Bullet */}
                <span
                  className="
                    mt-[7px]
                    shrink-0
                    text-base
                    font-bold
                    leading-5
                    text-[#123B45]
                  "
                >
                  •
                </span>

                {/* Content */}
                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    items-start
                    gap-1.5
                  "
                >
                  <h3
                    className="
                      w-full
                      text-base
                      font-bold
                      leading-6
                      text-[#123B45]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      w-full
                      px-0
                      text-xs
                      font-normal
                      leading-5
                      text-[#52717A]
                      sm:px-0
                    "
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}