"use client";

import React from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Always free",
    features: [
      { available: false, text: "Ad-Free Feed" },
      { available: true, text: "Community access" },
      { available: true, text: "Basic features" },
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "$4.99",
    period: "per month",
    features: [
      { available: true, text: "Ad-Free Feed" },
      { available: true, text: "Premium benefits" },
      { available: true, text: "Priority support" },
    ],
    popular: true,
  },
  {
    name: "Premium+",
    price: "$9.99",
    period: "per month",
    features: [
      { available: true, text: "All Premium" },
      { available: true, text: "Extra features" },
      { available: true, text: "VIP support" },
    ],
    popular: false,
  },
];

export default function PremiumPlans() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 pb-16 pt-10 sm:px-8 sm:pb-20 md:px-12 lg:px-28">
        <div className="flex w-full flex-col items-start gap-6">

          {/* Heading */}
          <div className="flex w-full flex-col items-start pb-[0.8px]">
            <h2
              className="w-full font-['Plus_Jakarta_Sans'] text-2xl font-extrabold leading-8 sm:text-3xl sm:leading-10"
              style={{ color: "#102F38" }}
            >
              Choose your Premium plan
            </h2>
          </div>

          {/* Plans */}
          <div className="grid w-full grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative flex w-full flex-col overflow-hidden rounded-[20px] bg-white"
                style={{
                  border: plan.popular
                    ? "2px solid #087A8B"
                    : "1px solid #D6E3E6",
                }}
              >
                {/* Plan Header */}
                <div
                  className="flex w-full flex-col items-start gap-1 border-b px-6 py-6"
                  style={{
                    backgroundColor: "#F5F7F7",
                    borderColor: "#D6E3E6",
                  }}
                >
                  {/* Plan Name */}
                  <div className="flex w-full flex-col items-start">
                    <h3
                      className="w-full font-['Plus_Jakarta_Sans'] text-base font-bold leading-7"
                      style={{ color: "#102F38" }}
                    >
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex w-full flex-col items-start pb-[0.8px] pt-2.5">
                    <div
                      className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10"
                      style={{ color: "#087A8B" }}
                    >
                      {plan.price}
                    </div>
                  </div>

                  {/* Period */}
                  <div className="flex w-full flex-col items-start">
                    <p
                      className="w-full font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5"
                      style={{ color: "#607780" }}
                    >
                      {plan.period}
                    </p>
                  </div>
                </div>

                {/* Plan Content */}
                <div className="flex w-full flex-col items-start gap-6 p-6">

                  {/* Features */}
                  <div className="flex w-full flex-col items-start">
                    {plan.features.map((feature) => (
                      <div
                        key={feature.text}
                        className="flex w-full items-start gap-3 py-3"
                      >
                        <span
                          className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold leading-5"
                          style={{
                            color: feature.available
                              ? "#087A8B"
                              : "#607780",
                          }}
                        >
                          {feature.available ? "✓" : "—"}
                        </span>

                        <span
                          className="font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5"
                          style={{
                            color: feature.available
                              ? "#102F38"
                              : "#607780",
                          }}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    type="button"
                    className="min-h-10 w-full rounded-xl px-5 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-opacity hover:opacity-90"
                    style={
                      plan.popular
                        ? {
                            backgroundColor: "#087A8B",
                            color: "#FFFFFF",
                          }
                        : {
                            backgroundColor: "#FFFFFF",
                            color: "#087A8B",
                            border: "1px solid #D6E3E6",
                          }
                    }
                  >
                    Compare Plans
                  </button>
                </div>

                {/* Popular Badge */}
                {plan.popular && (
                  <div
                    className="absolute right-0 top-0 flex h-8 items-center rounded-bl-xl px-4 py-2"
                    style={{ backgroundColor: "#087A8B" }}
                  >
                    <span
                      className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-4"
                      style={{ color: "#FFFFFF" }}
                    >
                      POPULAR
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}