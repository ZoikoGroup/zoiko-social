const PLANS = [
  {
    name: "Free",
    price: "$0",
    priceNote: "Always free",
    features: [
      { text: "Enhanced Media", included: false },
      { text: "Standard quality uploads", included: true },
      { text: "Basic features", included: true },
    ],
    cta: "Current",
    ctaVariant: "outline" as const,
    highlight: false,
  },
  {
    name: "Premium",
    price: "$4.99",
    priceNote: "per month",
    features: [
      { text: "✓ Enhanced Media", included: true },
      { text: "✓ Higher-quality uploads", included: true },
      { text: "✓ Premium support", included: true },
    ],
    cta: "Compare",
    ctaVariant: "solid" as const,
    highlight: true,
  },
  {
    name: "Premium+",
    price: "$9.99",
    priceNote: "per month",
    features: [
      { text: "✓ All Premium", included: true },
      { text: "✓ Extra capabilities", included: true },
      { text: "✓ VIP support", included: true },
    ],
    cta: "Compare",
    ctaVariant: "solid" as const,
    highlight: false,
  },
];

/**
 * "Choose your Premium plan" — three pricing cards. Identical copy across
 * both breakpoints (confirmed desktop 732:5399 vs. mobile 732:5822/732:5825
 * carry the same plan names, prices, and feature lines); only layout
 * changes — a 3-column row on desktop vs. a stacked, full-width column on
 * mobile. The middle "Premium" card carries a `#066879` 2px highlight
 * border on both breakpoints.
 */
export default function PricingPlans() {
  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
        <h2 className="font-jakarta text-[28px] font-extrabold leading-[36.3px] text-[#102a32] lg:text-[36px] lg:leading-[45.8px]">
          Choose your Premium plan
        </h2>

        <div className="mt-8 flex flex-col gap-6 lg:mt-[46px] lg:flex-row lg:justify-center lg:gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex w-full flex-col overflow-hidden rounded-[20px] border bg-white lg:w-[395px] ${
                plan.highlight ? "border-2 border-[#066879]" : "border-[#dce5e8]"
              }`}
            >
              <div className="border-b border-[#dce5e8] bg-[#f7f9fa] px-6 pb-6 pt-[23px]">
                <p className="font-jakarta text-[17px] font-bold leading-[27.2px] text-[#102a32]">{plan.name}</p>
                <p className="pt-[15px] font-jakarta text-[28px] font-extrabold leading-[44.8px] text-[#066879]">
                  {plan.price}
                </p>
                <p className="font-jakarta text-[12px] font-normal leading-[19.2px] text-[#5e7076]">{plan.priceNote}</p>
              </div>
              <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col">
                  {plan.features.map((feature) => (
                    <div key={feature.text} className="flex items-start gap-3 py-3">
                      <span className="font-jakarta text-[13px] font-extrabold leading-[20.8px] text-[#066879]">
                        {feature.included ? "✓" : "—"}
                      </span>
                      <span
                        className={`font-jakarta text-[13px] font-normal leading-[20.8px] ${
                          feature.included ? "text-[#102a32]" : "text-[#5e7076]"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className={`flex min-h-[40px] w-full items-center justify-center rounded-xl px-5 py-[10px] text-center font-jakarta text-[14px] font-semibold ${
                    plan.ctaVariant === "solid"
                      ? "bg-[#066879] text-white"
                      : "border border-[#dce5e8] bg-white text-[#066879]"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center font-jakarta text-[14px] font-normal leading-[20px] text-[#5e7076] lg:mt-8">
          Pricing is representative. Exact quality capabilities sourced from your approved Premium catalog.
        </p>
      </div>
    </section>
  );
}
