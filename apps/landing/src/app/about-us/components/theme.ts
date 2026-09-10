/**
 * about-us design tokens.
 *
 * Same palette as the home page. It is duplicated rather than imported so
 * the two routes stay independent — neither can restyle the other by accident,
 * and neither depends on the other surviving. The shared tailwind.config is
 * deliberately left alone; it carries the older teal/amber scale that every
 * pre-existing page renders with.
 */
export const C = {
  /** Headings. */
  ink: "#073B47",
  /** Card titles — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: links, eyebrow pills, icon glyphs. */
  brand: "#066879",
  /** Body copy and secondary labels. */
  muted: "#5B7178",
  /** Hairline borders on cards, pills and dividers. */
  line: "#DCEAEE",
  /** Neutral chip and icon-tile fill. */
  chip: "#EAF3F5",
  /** Warm chip fill, used by the Press & Media tile. */
  chipWarm: "#FBEEDF",
  /** Warm accent text. */
  warm: "#C2700C",
  /** Warm accent: the CTA's primary button and its corner glow. */
  warmBright: "#E8912F",
  /** Page background. */
  page: "#F7F9F9",
} as const;
