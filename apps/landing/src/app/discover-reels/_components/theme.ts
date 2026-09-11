/**
 * discover-reels design tokens.
 *
 * The shared landing palette, plus the near-black teal the reel player lays
 * over footage: at full strength for the top and bottom scrims, and at partial
 * strength behind the round player controls. Duplicated rather than imported
 * so each route stays independent.
 */
export const C = {
  /** Headings. */
  ink: "#073B47",
  /** Rail card titles — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: links, the verified mark. */
  brand: "#066879",
  /** Secondary copy and the "1 / 6" counter. */
  muted: "#5B7178",
  /** Hairline borders on cards, buttons and the player frame. */
  line: "#DCEAEE",
  /** Neutral fill: the safety card and the tune chips. */
  chip: "#EAF3F5",
  /** Warm accent: the playback progress bar. */
  warmBright: "#E8912F",
  /** The player's scrim colour, as an RGB triple for use at any opacity. */
  scrim: "3, 26, 31",
  /** Page background. */
  page: "#FFFFFF",
} as const;

/** The scrim colour at a given opacity. */
export const scrim = (alpha: number) => `rgba(${C.scrim}, ${alpha})`;
