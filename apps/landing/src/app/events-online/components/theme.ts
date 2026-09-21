/**
 * events-online design tokens.
 *
 * The same palette as the other landing pages, plus the event-status signals
 * this page adds: the warm fill behind "Starting soon", "Full" and
 * "Rescheduled", the orange "Live now" badge, and the grey "Canceled" badge.
 * Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Headings. */
  ink: "#073B47",
  /** Card titles and organizer names — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: RSVP, primary buttons, links. */
  brand: "#066879",
  /** Secondary copy and meta lines. */
  muted: "#5B7178",
  /** Hairline borders on cards, pills and dividers. */
  line: "#DCEAEE",
  /** Neutral chip fill: eyebrow, verification badges. */
  chip: "#EAF3F5",
  /** Soft panel fill: hero preview, search bar, table header, access tags. */
  panel: "#F7F9FA",
  /** Warm notice fill: canceled and rescheduled banners. */
  chipWarm: "#FDF3E7",
  /** Warm accent text: notices, "Donation-backed". */
  warm: "#C2700C",
  /** Badge fill for Starting soon, Full and Rescheduled. */
  warmBadge: "rgba(217, 119, 6, 0.9)",
  /** Solid fill of the Live now badge. */
  live: "#C2410C",
  /** Badge fill for Canceled. */
  canceled: "rgba(107, 114, 128, 0.9)",
  /** Translucent ink behind badges laid over a photo. */
  overlay: "rgba(7, 59, 71, 0.72)",
  /** Page background. */
  page: "#FFFFFF",
} as const;
