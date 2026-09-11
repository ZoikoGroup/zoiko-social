/**
 * discover-live-now design tokens.
 *
 * The same palette as the other landing pages, plus the live-video signals
 * this page adds: the solid red LIVE badge and the translucent ink used for
 * the duration and viewer-count badges laid over a video thumbnail.
 * Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Headings. */
  ink: "#073B47",
  /** Card titles and host names — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: Watch Live, active tab, links. */
  brand: "#066879",
  /** Secondary copy and meta lines. */
  muted: "#5B7178",
  /** Hairline borders on cards, pills and dividers. */
  line: "#DCEAEE",
  /** Neutral chip fill: eyebrow, verification badges, rail cards. */
  chip: "#EAF3F5",
  /** Warm chip fill: Advisory, New voice. */
  chipWarm: "#FBEEDF",
  /** Warm accent text and the advisory outline. */
  warm: "#C2700C",
  /** Warm accent: the safety banner's primary button. */
  warmBright: "#E8912F",
  /** Solid fill of the LIVE badge. */
  live: "#C62828",
  /** Translucent ink behind the duration and "watching" badges. */
  overlay: "rgba(7, 59, 71, 0.72)",
  /** Page background. */
  page: "#FFFFFF",
} as const;
