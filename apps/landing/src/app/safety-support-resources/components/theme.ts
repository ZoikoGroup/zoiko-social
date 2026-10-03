/**
 * safety-support-resources design tokens.
 *
 * The shared landing palette plus the two callout colours this page uses.
 * Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Headings and body text. */
  ink: "#073B47",
  /** Primary brand teal: card titles, buttons, active chips and tabs. */
  brand: "#066879",
  /** Deeper teal for the step-number gradient. */
  brandDeep: "#05505D",
  /** Secondary copy. */
  muted: "#5B7178",
  /** Hairline borders on cards, chips and tabs. */
  line: "#DCEAEE",
  /** Tag fill on the recommended-resource cards and icon tiles. */
  chip: "#EEF8F9",
  /** Alternate section background and the cost cards. */
  panel: "#F7F9FA",
  /** "What happens in your first session?" callout. */
  warm: "#E88924",
  warmFill: "#FDF4EA",
  /** Prices on the online-therapy cards. */
  price: "#16A34A",
} as const;
