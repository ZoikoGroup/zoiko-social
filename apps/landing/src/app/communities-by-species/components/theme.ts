/**
 * Popular-communities design tokens — the shared landing palette.
 * Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Headings. */
  ink: "#073B47",
  /** Card titles — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: buttons, links, the category chip outline. */
  brand: "#066879",
  /** Secondary copy. */
  muted: "#5B7178",
  /** Hairline borders. */
  line: "#DCEAEE",
  /** Neutral fill: the notice panel, icon tiles, category chips. */
  chip: "#EAF3F5",
  /** The activity dot and clock, which the comp sets in amber. */
  amber: "#C2700C",
  /** Warm accent: the closing panel's primary button. */
  warm: "#E88924",
  /** Page background. */
  page: "#FFFFFF",
} as const;
