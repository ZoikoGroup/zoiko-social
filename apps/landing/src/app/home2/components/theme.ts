/**
 * Home2 design tokens.
 *
 * The home2 comps use a palette the shared tailwind.config does not define
 * (it only carries the older teal/amber/sage scale). Rather than edit the
 * global config — which would restyle every existing page — the values live
 * here and are applied through Tailwind arbitrary values, so this route is
 * self-contained.
 */
export const C = {
  /** Headings. */
  ink: "#073B47",
  /** Card titles — a shade deeper than `ink`. */
  inkDeep: "#062F39",
  /** Primary brand teal: buttons, links, active pills. */
  brand: "#066879",
  /** Body copy and secondary labels. */
  muted: "#5B7178",
  /** Hairline borders on cards, pills and dividers. */
  line: "#DCEAEE",
  /** Neutral chip fill. */
  chip: "#EAF3F5",
  /** Warm chip fill, for source/verification badges. */
  chipWarm: "#FBEEDF",
  /** Warm accent text. */
  warm: "#C2700C",
  /** Warm accent, used at the end of the hero and CTA gradients. */
  warmBright: "#E8912F",
  /** Page background. */
  page: "#F7F9F9",
} as const;
