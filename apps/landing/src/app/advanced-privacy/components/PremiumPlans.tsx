"use client";

import React from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Always free",
    highlighted: false,
    features: [
      { type: "dash", text: "Advanced Privacy" },
      { type: "check", text: "Basic privacy controls" },
      { type: "check", text: "Standard features" },
    ],
    button: "Current",
  },
  {
    name: "Premium",
    price: "$4.99",
    period: "per month",
    highlighted: true,
    features: [
      { type: "check", text: "Advanced Privacy controls" },
      { type: "check", text: "Granular audience settings" },
      { type: "check", text: "Premium support" },
    ],
    button: "Compare",
  },
  {
    name: "Premium+",
    price: "$9.99",
    period: "per month",
    highlighted: false,
    features: [
      { type: "check", text: "All Premium" },
      { type: "check", text: "Enhanced controls" },
      { type: "check", text: "VIP support" },
    ],
    button: "Compare",
  },
];

export default function PremiumPlans() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-28 lg:py-20">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-12">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2
              className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10"
              style={{ color: "#102F38" }}
            >
              Premium plans
            </h2>
          </div>

          {/* Plans */}
          <div className="flex w-full flex-col items-start gap-12">
            <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className="flex w-full flex-col items-start overflow-hidden rounded-[20px] bg-white"
                  style={{
                    border: plan.highlighted
                      ? "2px solid #087A8B"
                      : "1px solid #D6E3E6",
                  }}
                >
                  {/* Plan Header */}
                  <div
                    className="flex w-full flex-col items-start border-b px-6 py-6"
                    style={{
                      backgroundColor: "#F5F7F7",
                      borderColor: "#D6E3E6",
                    }}
                  >
                    {/* Name */}
                    <div className="flex w-full flex-col items-start">
                      <div
                        className="w-full font-['Plus_Jakarta_Sans'] text-base font-bold leading-7"
                        style={{ color: "#102F38" }}
                      >
                        {plan.name}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex w-full flex-col items-start pb-[0.8px] pt-3.5">
                      <div
                        className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10"
                        style={{ color: "#087A8B" }}
                      >
                        {plan.price}
                      </div>
                    </div>

                    {/* Period */}
                    <div className="flex w-full flex-col items-start">
                      <div
                        className="w-full font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5"
                        style={{ color: "#607780" }}
                      >
                        {plan.period}
                      </div>
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
                          <div
                            className="shrink-0 font-['Plus_Jakarta_Sans'] text-xs font-extrabold leading-5"
                            style={{ color: "#087A8B" }}
                          >
                            {feature.type === "check" ? "✓" : "—"}
                          </div>

                          <div
                            className="font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5"
                            style={{
                              color:
                                feature.type === "dash"
                                  ? "#607780"
                                  : "#102F38",
                            }}
                          >
                            {feature.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      className="flex min-h-10 w-full items-center justify-center rounded-xl px-5 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold"
                      style={
                        plan.highlighted || plan.name === "Premium+"
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
                      {plan.button}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Note */}
            <div className="flex w-full flex-col items-center">
              <p
                className="text-center font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5"
                style={{ color: "#607780" }}
              >
                Pricing is representative. Current pricing sourced from your
                approved Premium catalog.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}