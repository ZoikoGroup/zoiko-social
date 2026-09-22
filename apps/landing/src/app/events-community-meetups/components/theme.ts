/**
 * events-community-meetups design tokens.
 *
 * The same palette as the other events landing pages. Duplicated rather than
 * imported so each route stays independent.
 */
export const C = {
  /** Headings and card titles. */
  ink: "#073B47",
  /** Tag and card text — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: buttons, links, avatars, active chip. */
  brand: "#066879",
  /** Secondary copy and meta lines. */
  muted: "#5B7178",
  /** Hairline borders on cards, chips and dividers. */
  line: "#DCEAEE",
  /** Animal-attendance tags, the trust panel and its icon chips. */
  chip: "#EEF8F9",
  /** Page background. */
  panel: "#F7F9FA",
  /** Join Waitlist button fill. */
  chipWarm: "#FBEEDF",
  /** Join Waitlist text and the date badge month. */
  warm: "#C2700C",
  /** Warm accent. */
  warmBright: "#E88924",
} as const;

/** The teal-to-orange wash laid over every event photo in the design. */
export const PHOTO_TINT =
  "linear-gradient(70deg, rgba(6,104,121,0.38), rgba(232,145,47,0.14))";

