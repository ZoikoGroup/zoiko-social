/**
 * events-fundraisers design tokens.
 *
 * The same palette as the other events landing pages, plus the status-badge
 * fills this page adds. Duplicated rather than imported so each route stays
 * independent.
 */
export const C = {
  /** Card titles and body text. */
  ink: "#073B47",
  /** Headings and verified tags — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: buttons, links, active chips, Goal reached. */
  brand: "#066879",
  /** Secondary copy and meta lines. */
  muted: "#5B7178",
  /** Hairline borders on cards, chips, inputs and table cells. */
  line: "#DCEAEE",
  /** Verified tags, eyebrow and the Contributed chip. */
  chip: "#EEF8F9",
  /** Soft panels: search bar, hero preview, table header, safety panel. */
  panel: "#F7F9FA",
  /** Under-review notice fill. */
  chipWarm: "#FBEEDF",
  /** Under-review notice text and the Sponsored badge. */
  warm: "#C2700C",
  /** Under review badge fill. */
  reviewBadge: "rgba(194, 112, 12, 0.88)",
  /** Closed and Canceled badge fill. */
  mutedBadge: "rgba(91, 113, 120, 0.90)",
  /** Dark translucent fill behind the hero's Verified beneficiary badge. */
  overlay: "rgba(6, 47, 57, 0.75)",
} as const;
