"use client";

import React from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Always free",
    highlighted: false,
    features: [
      { available: false, text: "Larger Group Calls" },
      { available: true, text: "Up to 8 participants" },
      { available: true, text: "Basic features" },
    ],
    button: "Current",
  },
  {
    name: "Premium",
    price: "$4.99",
    period: "per month",
    highlighted: true,
    features: [
      { available: true, text: "Larger Group Calls (50+)" },
      { available: true, text: "Advanced host controls" },
      { available: true, text: "Premium support" },
    ],
    button: "Compare",
  },
  {
    name: "Premium+",
    price: "$9.99",
    period: "per month",
    highlighted: false,
    features: [
      { available: true, text: "All Premium features" },
      { available: true, text: "Enhanced call capacity" },
      { available: true, text: "VIP support" },
    ],
    button: "Compare",
  },
];

export default function PremiumPlans() {
  return (
    <section className="w-full bg-[#F7F9FA]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 py-12 sm:px-10 sm:py-16 lg:px-28 lg:py-20">
        <div className="flex w-full max-w-[1182px] flex-col gap-12">

          {/* Heading */}
          <div className="w-full">
            <h2 className="m-0 text-3xl font-extrabold leading-10 tracking-[-0.5px] text-[#102A32]">
              Choose your Premium plan
            </h2>
          </div>

          {/* Plans */}
          <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex w-full flex-col overflow-hidden rounded-[20px] bg-white ${
                  plan.highlighted
                    ? "border-2 border-[#066879]"
                    : "border border-[#DADFE1]"
                }`}
              >
                {/* Plan Header */}
                <div className="flex w-full flex-col items-start border-b border-[#DADFE1] bg-[#F7F9FA] px-6 py-6">
                  <div className="w-full">
                    <h3 className="m-0 text-base font-bold leading-7 text-[#102A32]">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="w-full pb-px pt-3.5">
                    <div className="text-3xl font-extrabold leading-10 text-[#066879]">
                      {plan.price}
                    </div>
                  </div>

                  <div className="w-full">
                    <p className="m-0 text-xs font-normal leading-5 text-[#5E7076]">
                      {plan.period}
                    </p>
                  </div>
                </div>

                {/* Plan Content */}
                <div className="flex w-full flex-col gap-6 p-6">

                  {/* Features */}
                  <div className="flex w-full flex-col">
                    {plan.features.map((feature) => (
                      <div
                        key={feature.text}
                        className="flex w-full items-start gap-3 py-3"
                      >
                        <span className="shrink-0 text-xs font-extrabold leading-5 text-[#066879]">
                          {feature.available ? "✓" : "—"}
                        </span>

                        <span
                          className={`text-xs font-normal leading-5 ${
                            feature.available
                              ? "text-[#102A32]"
                              : "text-[#5E7076]"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    type="button"
                    className={`min-h-10 w-full rounded-xl px-5 py-2.5 text-center text-sm font-semibold leading-5 transition-opacity duration-200 ${
                      plan.highlighted || plan.name === "Premium+"
                        ? "bg-[#066879] text-white hover:opacity-90"
                        : "border border-[#DADFE1] bg-white text-[#066879] hover:bg-[#F7F9FA]"
                    }`}
                  >
                    {plan.button}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="flex w-full flex-col items-center">
            <p className="m-0 text-center text-xs font-normal leading-5 text-[#5E7076]">
              Pricing is representative. Exact participant limits sourced from
              your approved Premium catalog.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}