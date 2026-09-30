/**
 * trust-safety-center design tokens. Duplicated rather than imported so each
 * route stays independent.
 */
export const C = {
  /** Headings and body text. */
  ink: "#102A32",
  /** Primary brand teal: buttons, stat numbers. */
  brand: "#066879",
  /** Deeper teal for the gradient panels. */
  brandDeep: "#045363",
  /** Green-teal end of the "This Is Trust" gradient. */
  brandGreen: "#1B8A6B",
  /** Secondary copy. */
  muted: "#5E7076",
  /** Hairline borders. */
  line: "#DCE5E8",
  /** Icon tiles. */
  chip: "#EEF8F9",
  /** Alternate section background. */
  panel: "#F7F9FA",
  /** Hero stats and the report-flow step rings. */
  warm: "#E88924",
} as const;
