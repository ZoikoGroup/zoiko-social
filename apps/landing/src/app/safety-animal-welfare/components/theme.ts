/**
 * safety-animal-welfare design tokens.
 *
 * The shared landing palette plus the urgency colours this page adds for the
 * immediate-danger and suspected-concern cards. Duplicated rather than
 * imported so each route stays independent.
 */
export const C = {
  /** Headings and body text. */
  ink: "#073B47",
  /** Primary brand teal: card titles, buttons and icons. */
  brand: "#066879",
  /** Secondary copy. */
  muted: "#5B7178",
  /** Hairline borders on cards. */
  line: "#DCEAEE",
  /** FAQ background. */
  panel: "#F7F9FA",
  /** Immediate-danger accent, and the ✕ marks in "Never do this". */
  danger: "#D92D20",
  /** Immediate-danger card fill. */
  dangerFill: "#FDECEC",
  /** Suspected-concern accent, the ✓ marks and the Start Report button. */
  warm: "#E88924",
  /** Suspected-concern card fill. */
  warmFill: "#FDF4EA",
  /** "Important" note fill. */
  noteFill: "#FFF9F2",
  /** "Never do this" card fill and border. */
  greyFill: "#FCFCFD",
  greyLine: "#E6E8EB",
} as const;
