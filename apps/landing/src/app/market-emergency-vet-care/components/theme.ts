/**
 * market-emergency-vet-care design tokens.
 *
 * The same palette as the other market landing pages, plus the warm
 * discovery-tool callout. Duplicated rather than imported so each route stays
 * independent.
 */
export const C = {
  /** Headings, provider names and body text. */
  ink: "#073B47",
  /** Primary brand teal: buttons, links, tags and section headings. */
  brand: "#066879",
  /** Secondary copy and meta lines. */
  muted: "#5B7178",
  /** Hairline borders on cards, inputs and dividers. */
  line: "#DCEAEE",
  /** Verified badges and tag fill. */
  chip: "#EEF8F9",
  /** Page panels and the profile's status box. */
  panel: "#F7F9FA",
  /** Discovery-tool callout fill. */
  warmFill: "#FDF4EA",
  /** Discovery-tool callout border. */
  warm: "#E88924",
} as const;
