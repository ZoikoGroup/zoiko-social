/**
 * discover-near-you design tokens — the shared landing palette. Duplicated
 * rather than imported so each route stays independent.
 */
export const C = {
  /** Headings, and the dark end of the banner gradients. */
  ink: "#073B47",
  /** Card titles — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: buttons, the dashed panel outline, icons. */
  brand: "#066879",
  /** Secondary copy. */
  muted: "#5B7178",
  /** Hairline borders. */
  line: "#DCEAEE",
  /** Neutral fill: the eyebrow chip and the dashed panel. */
  chip: "#EAF3F5",
  /** Warm accent: the banners' primary buttons. */
  warm: "#E88924",
  /** Warm chip fill for "Location protected". */
  chipWarm: "#FBEEDF",
  /** Warm chip text. */
  warmText: "#C2700C",
  /** Page background. */
  page: "#FFFFFF",
} as const;

/** `ink` at a given opacity, for overlays and translucent buttons. */
export const inkAt = (alpha: number) => `rgba(7, 59, 71, ${alpha})`;
