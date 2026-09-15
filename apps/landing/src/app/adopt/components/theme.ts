/**
 * Adopt-hub design tokens — the shared landing palette.
 * Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Section headings. */
  ink: "#073B47",
  /** Card titles — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: the Find Animals and View Profile buttons. */
  brand: "#066879",
  /** Secondary copy, and the uppercase highlight label. */
  muted: "#5B7178",
  /** Hairline borders on cards and the highlight panel. */
  line: "#DCEAEE",
  /** Neutral fill: the Adopt pill, shelter chips, icon tiles. */
  chip: "#EAF3F5",
  /** The highlight panel's own, slightly cooler fill. */
  panel: "#F5F8F9",
  /** Page background. */
  page: "#FFFFFF",
} as const;
