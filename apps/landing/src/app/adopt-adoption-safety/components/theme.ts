/**
 * Adoption-safety design tokens — the shared landing palette, plus the
 * caution colours this page needs for its warning cards and callouts.
 * Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Section headings. */
  ink: "#073B47",
  /** Body copy on light cards, and card titles. */
  inkDeep: "#062F39",
  /** The small uppercase labels inside a stage panel. */
  label: "#095868",
  /** Primary brand teal: buttons, active stage, checked boxes. */
  brand: "#066879",
  /** Secondary copy. */
  muted: "#5B7178",
  /** Hairline borders. */
  line: "#DCEAEE",
  /** Neutral fill: icon tiles, chips, the active stage card. */
  chip: "#EAF3F5",
  /** Caution fill, for cards that describe a risk. */
  warnFill: "#FBEEDF",
  /** Caution border and callout rule. */
  warnLine: "#E8912F",
  /** Caution icon and text. */
  warnInk: "#C2700C",
  /** Emergency rows: fill, border, and text. */
  dangerFill: "#FDECEC",
  dangerLine: "#F0C9C9",
  dangerInk: "#B42828",
  /** Page background. */
  page: "#F7F9F9",
} as const;
