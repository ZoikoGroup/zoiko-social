/**
 * platform-features design tokens.
 *
 * Pulled from the Figma frame "zoiko Social-platform-features" (desktop
 * 1087:3102 / mobile 1087:3689). Duplicated rather than imported so this
 * route stays independent, matching the convention used by
 * safety-support-resources/components/theme.ts.
 */
export const C = {
  /** Headings: Firefly. */
  ink: "#102A32",
  /** Primary brand teal: buttons, links, stat numbers, active tab. */
  brand: "#066879",
  /** Deep teal used in the dark gradient panels (Trust & Safety, CTA). */
  brandDeep: "#073B47",
  /** Secondary/body copy: Nevada. */
  muted: "#5E7076",
  /** Hairline borders on cards, table cells and tabs: Geyser. */
  line: "#DCE5E8",
  /** "Included" chip fill and tab-panel background: Black Squeeze. */
  chip: "#EEF8F9",
  /** Alternate section background: Athens Gray. */
  panel: "#F7F9FA",
  /** Premium/orange accent border and heading: Zest. */
  orange: "#E88924",
  /** Premium "Available" chip text: Hot Cinnamon. */
  orangeText: "#C9701A",
  /** Premium chip fill: Serenade. */
  orangeFill: "#FFF5E8",
} as const;
