const FEATURES_DESKTOP = [
  "Overnight supervision",
  "Medication support",
  "Transportation",
  "Outdoor time",
  "Special diet handling",
  "Group play available",
  "Single-pet only",
  "Photo updates",
];

const FEATURES_MOBILE = [
  { emoji: "🌙", label: "Overnight supervision" },
  { emoji: "💊", label: "Medication support" },
  { emoji: "🚗", label: "Transportation" },
  { emoji: "🏃", label: "Outdoor time" },
  { emoji: "🍽️", label: "Special diet handling" },
  { emoji: "🤝", label: "Group play available" },
  { emoji: "🚫", label: "Single-pet only" },
  { emoji: "📱", label: "Photo updates" },
];

/**
 * "Filter by care features" — a pill grid on desktop, a stacked list of
 * emoji-labeled buttons on mobile.
 *
 * Figma: desktop 637:12514 (6-column grid of centered text pills, no
 * emoji); mobile 637:12943 (full-width list rows, each prefixed with an
 * emoji) — reproduced as the design actually shows per breakpoint rather
 * than forcing one style onto both.
 */
export default function CareFeaturesFilter() {
  return (
    <div className="flex w-full flex-col items-start gap-6">
      <h3 className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#102a32] lg:text-[18px] lg:leading-[28.8px]">
        Filter by care features
      </h3>

      <div className="flex w-full flex-col items-start gap-2 lg:hidden">
        {FEATURES_MOBILE.map((feature) => (
          <button
            key={feature.label}
            type="button"
            className="flex min-h-[49px] w-full items-center justify-center gap-2 rounded-[20px] border border-[#dce5e8] bg-white px-4 py-4 font-jakarta text-[13px] font-bold text-[#102a32]"
          >
            <span>{feature.emoji}</span>
            <span>{feature.label}</span>
          </button>
        ))}
      </div>

      <div className="hidden w-full grid-cols-6 gap-4 lg:grid">
        {FEATURES_DESKTOP.map((feature) => (
          <button
            key={feature}
            type="button"
            className="flex items-center justify-center whitespace-nowrap rounded-lg border border-[#dce5e8] bg-white px-4 py-4 text-center font-jakarta text-[13px] font-bold text-[#102a32]"
          >
            {feature}
          </button>
        ))}
      </div>
    </div>
  );
}
