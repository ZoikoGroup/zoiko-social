/**
 * platform-events design tokens.
 *
 * Colors from the Figma file. Duplicated rather than imported so each route
 * stays independent, as on the other event pages.
 */
export const C = {
  /** Headings and card titles. */
  ink: "#073B47",
  /** Primary brand teal: buttons, badges, active chips, links. */
  brand: "#066879",
  /** Secondary copy and meta lines. */
  muted: "#5B7178",
  /** Eyebrow and the "Host an event" subheading. */
  warm: "#E88924",
  /** Hairline borders on cards, chips and dividers. */
  line: "#DCEAEE",
  /** Soft section fill behind "Browse by category" and "Trust and transparency". */
  panel: "#F9FAFB",
  /** Card fill inside the trust cards. */
  card: "#F6FDFF",
  /** Filter select fill. */
  selectFill: "#F3F4F6",
  /** Hero photo wash start. */
  cyan: "#066879",
  /** Hero photo wash end. */
  orange: "#F68A4B",
} as const;

/** The teal-to-orange wash behind every event photo. */
export const PHOTO_TINT =
  "linear-gradient(70deg, rgba(6,104,121,0.45), rgba(246,138,75,0.25))";

/** Deep teal closing banner, per the design's cyan-950 gradient. */
export const CTA_GRADIENT =
  "linear-gradient(100deg, rgba(8,45,54,0.94) 35%, rgba(10,68,80,0.55) 85%)";

/** Shadow used on every floating photo card, from the design. */
export const CARD_SHADOW = "0px 20px 48px 0px rgba(7,59,71,0.16)";
