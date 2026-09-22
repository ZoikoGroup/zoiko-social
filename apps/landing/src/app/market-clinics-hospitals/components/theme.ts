/**
 * market-clinics-hospitals design tokens.
 *
 * The same palette as the other landing pages, plus the warm emergency-care
 * callout. Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Card names and body text. */
  ink: "#073B47",
  /** Profile name — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: buttons, links, section headings, verified marks. */
  brand: "#066879",
  /** Secondary copy and meta lines. */
  muted: "#5B7178",
  /** Hairline borders on cards, inputs and dividers. */
  line: "#DCEAEE",
  /** Verified badges, status boxes, team cards and active-filter chips. */
  chip: "#EEF8F9",
  /** Page background, tag fill and hours boxes. */
  panel: "#F7F9FA",
  /** Select fill in the search panel. */
  select: "#EFEFEF",
  /** Emergency callout fill. */
  warmFill: "#FDF4EA",
  /** Emergency callout border, icon and link; team-count badge. */
  warm: "#E88924",
} as const;
