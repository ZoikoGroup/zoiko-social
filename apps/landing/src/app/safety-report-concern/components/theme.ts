/**
 * safety-report-concern design tokens.
 *
 * The Figma tokens decode to the palette the other safety pages already use,
 * so the hexes are shared with /report-a-concern and /events-upcoming rather
 * than re-invented. Duplicated rather than imported so each route stays
 * independent.
 */
export const C = {
  /** Headings and card titles — `color-cyan-13`. */
  ink: "#073B47",
  /** Brand teal: buttons, stats, numbers, checkmarks — `color-cyan-25` and `text-cyan-800`. */
  brand: "#066879",
  /** Secondary copy — `color-azure-42`. */
  muted: "#5B7178",
  /** Hairline borders on cards and table rows — `outline-color-cyan-89`. */
  line: "#DCEAEE",
  /** Eyebrow, stars, checkmarks — `color-orange-53`. */
  orange: "#E88924",
  /** Alternating section fills — `color-grey-97`, `bg-color-grey-97-8`. */
  panel: "#F7F9FA",
  page: "#FFFFFF",
  white: "#FFFFFF",
  /** Table header strip — `bg-color-grey-95-7`. */
  tableHead: "#F1F4F5",
} as const;

/** Deep-teal wash over the hero photo, as on the other safety pages. */
export const HERO_TINT =
  "linear-gradient(90deg, rgba(3,31,37,0.85) 0%, rgba(4,36,43,0.55) 45%, rgba(6,47,57,0.25) 100%)";
