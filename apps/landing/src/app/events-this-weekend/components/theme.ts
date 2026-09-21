/**
 * events-this-weekend design tokens.
 *
 * The same palette as the other landing pages, plus the warm orange this page
 * uses for its eyebrow, the eligible-count dot and fundraiser tags.
 * Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Headings and card titles. */
  ink: "#073B47",
  /** Verified tags and the region bar text — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: buttons, links, avatars, active chip. */
  brand: "#066879",
  /** Secondary copy and meta lines. */
  muted: "#5B7178",
  /** Hairline borders on cards, chips and dividers. */
  line: "#DCEAEE",
  /** Verified tag fill and the region bar. */
  chip: "#EEF8F9",
  /** Soft section fill: hero, day-by-day, safety, region CTA. */
  panel: "#F7F9FA",
  /** Fundraiser tag fill. */
  chipWarm: "#FBEEDF",
  /** Fundraiser tag text. */
  warm: "#C2700C",
  /** Eyebrow, count dot and the Join Free button. */
  warmBright: "#E88924",
  /** Page background. */
  page: "#FFFFFF",
} as const;

/** The teal-to-orange wash laid over every event photo in the design. */
export const PHOTO_TINT =
  "linear-gradient(70deg, rgba(6,104,121,0.38), rgba(232,145,47,0.14))";
