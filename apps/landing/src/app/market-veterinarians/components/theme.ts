/**
 * market-veterinarians design tokens.
 *
 * The same palette as the other landing pages, plus the warm emergency-care
 * callout. Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Card names and body text. */
  ink: "#073B47",
  /** Page heading and profile name — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: buttons, links, section headings, verified marks. */
  brand: "#066879",
  /** Secondary copy and meta lines. */
  muted: "#5B7178",
  /** Hairline borders on cards, inputs and dividers. */
  line: "#DCEAEE",
  /** Verified callouts, badges and active-filter chips. */
  chip: "#EEF8F9",
  /** Tag fill and the profile section background. */
  panel: "#F7F9FA",
  /** Species and care-type select fill. */
  select: "#EFEFEF",
  /** Emergency callout fill. */
  warmFill: "#FDF4EA",
  /** Emergency callout border, icon and link. */
  warm: "#E88924",
} as const;
