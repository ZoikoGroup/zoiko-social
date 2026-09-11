/**
 * discover-trending-now design tokens.
 *
 * The same palette as the home and about-us pages, plus the two signal colours
 * this page adds: the red of a live broadcast and the green "updated" dot.
 * Duplicated rather than imported so each route stays independent, and kept
 * out of the shared tailwind.config, which the older pages render with.
 */
export const C = {
  /** Headings. */
  ink: "#073B47",
  /** Card titles and post body — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: active tab, links, the top-trend card outline. */
  brand: "#066879",
  /** Secondary copy, meta lines, idle tabs. */
  muted: "#5B7178",
  /** Hairline borders on cards, chips and dividers. */
  line: "#DCEAEE",
  /** Neutral chip and rail-card fill. */
  chip: "#EAF3F5",
  /** Warm chip fill for trend signals ("Widely discussed"). */
  chipWarm: "#FBEEDF",
  /** Warm accent text and the top-trend flame. */
  warm: "#C2700C",
  /** Warm accent: the join banner's primary button. */
  warmBright: "#E8912F",
  /** Live-broadcast signal. */
  live: "#B42828",
  /** Fill behind the live signal. */
  liveWash: "#FBECEC",
  /** The "updated moments ago" freshness dot. */
  fresh: "#1EA863",
  /** Fill of the ⋯ "more options" box at the end of each action bar. */
  menuFill: "#F0F0F0",
  /** Page background, and the fill of the neutral type chips. */
  page: "#F7F9F9",
} as const;
