/**
 * Adopt near-you design tokens — the shared landing palette, plus the status
 * colours the listing cards need for their availability badges.
 * Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Section headings. */
  ink: "#073B47",
  /** Card titles and body copy on white. */
  inkDeep: "#0B2E37",
  /** Primary brand teal: buttons, active tab, links. */
  brand: "#066879",
  /** Secondary copy. */
  muted: "#5B7178",
  /** Placeholder text in the search field. */
  placeholder: "#757575",
  /** Hairline borders. */
  line: "#DCEAEE",
  /** Neutral fill: attribute chips, the segmented controls, overflow buttons. */
  chip: "#F3F7F8",
  /** Page background. */
  page: "#F7F9F9",

  /** "Available" and "Foster needed" — open to new interest. */
  okFill: "#E9EEEC",
  okInk: "#2F6B4F",
  /** "Application Pending" and "Paused" — no longer open. */
  warnFill: "#F3EFE9",
  warnInk: "#A65E1B",

  /** Warm accent: the closing band's primary button. */
  warm: "#E88924",
} as const;
