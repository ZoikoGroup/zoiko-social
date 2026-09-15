/**
 * Animals-needing-foster design tokens — the shared landing palette, plus the
 * status colours the foster cards need for their availability badges.
 * Duplicated rather than imported so each route stays independent.
 */
export const C = {
  /** Section headings. */
  ink: "#073B47",
  /** Card titles and body copy on white. */
  inkDeep: "#0B2E37",
  /** The timing line and confirmed-support rows. */
  accent: "#0A4A57",
  /** Primary brand teal: buttons, active pill, links. */
  brand: "#066879",
  /** Secondary copy. */
  muted: "#5B7178",
  /** Placeholder text in the search and location fields. */
  placeholder: "#757575",
  /** Hairline borders. */
  line: "#DCEAEE",
  /** Neutral fill: the overflow button, disabled actions. */
  chip: "#EFF2F2",
  /** Page background. */
  page: "#F7F9F9",

  /** "Foster needed" — available now. */
  okFill: "#E9EEEC",
  okInk: "#2F6B4F",
  /** "Interest in review" — someone has already offered. */
  warnFill: "#F3EFE9",
  warnInk: "#A65E1B",
  /** "Placement arranged" and "Paused" — no longer open. */
  offFill: "#EFF2F2",
  offInk: "#5B7178",

  /** Warm accent: the closing band's primary button. */
  warm: "#E88924",
} as const;
