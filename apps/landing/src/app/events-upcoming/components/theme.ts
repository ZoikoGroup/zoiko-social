/**
 * events-upcoming design tokens.
 *
 * The same palette as the other events landing pages. Duplicated rather than
 * imported so each route stays independent.
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
  /** Verified tags, region bar, digest card and the "everything" box. */
  chip: "#EEF8F9",
  /** Soft section fill between the white sections. */
  panel: "#F7F9FA",
  /** Fundraiser tag fill. */
  chipWarm: "#FBEEDF",
  /** Fundraiser tag text. */
  warm: "#C2700C",
  /** Eyebrow, count dot and the orange buttons. */
  warmBright: "#E88924",
} as const;

/** The teal-to-orange wash laid over every event photo in the design. */
export const PHOTO_TINT =
  "linear-gradient(70deg, rgba(6,104,121,0.38), rgba(232,145,47,0.14))";

/** Deep teal into sea-green with a faint warm glow, as on the closing CTA. */
export const CTA_GRADIENT =
  "radial-gradient(circle at 82% 20%, rgba(232,137,36,0.22) 0%, rgba(232,137,36,0) 45%), linear-gradient(100deg, #073B47 0%, #06505D 40%, #2C6D6B 100%)";
