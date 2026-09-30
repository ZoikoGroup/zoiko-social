/**
 * support&developers-contact-us design tokens.
 *
 * Pulled from the Figma frame "zoiko social-Support & Developers-contact-us"
 * (desktop 1274:2426 / mobile 1274:3285). Duplicated rather than imported so
 * this route stays independent, matching the convention used by
 * support&developers-community-forums/components/theme.ts.
 */
export const C = {
  /** Headings: Tarawera. */
  brandDeep: "#073B47",
  /** Primary brand teal: buttons, links, icon chips, active step. */
  brand: "#066879",
  /** Secondary/body copy: Nevada. */
  muted: "#5E7076",
  /** Hairline borders on cards, inputs and dividers: Geyser. */
  line: "#DCE5E8",
  /** Icon chip / "Community" style background: Black Squeeze. */
  chip: "#EEF8F9",
  /** Alternate section background: Athens Gray. */
  panel: "#F7F9FA",
  /** Dark panel background (Urgent / Safety band): Tarawera. */
  panelDark: "#073B47",
  /** Body copy on the dark panel: Botticelli. */
  onDarkMuted: "#CFE6EA",
  /** Heading text: Firefly. */
  ink: "#102A32",
  /** Orange accent border / dashed pill border: Zest. */
  orange: "#E88924",
  /** Orange chip fill ("Never include" cards, "approved route" pill): Serenade. */
  orangeFill: "#FFF5E8",
  /** Orange chip text: Cafe Royale. */
  orangeTextDark: "#7A430B",
  /** Placeholder / dashed-box border: Tower Gray. */
  placeholder: "#A9B8BD",
} as const;
