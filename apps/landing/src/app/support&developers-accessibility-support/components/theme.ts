/**
 * support&developers-accessibility-support design tokens.
 *
 * Pulled from the Figma frame "zoiko social-Support & Developers-accessibility-support"
 * (desktop 1274:4079 / mobile 1274:5143). Duplicated rather than imported so this route
 * stays independent, matching the convention used by
 * support&developers-community-forums/components/theme.ts and
 * support&developers-contact-us/components/theme.ts.
 */
export const C = {
  /** Headings: Firefly. */
  ink: "#102A32",
  /** Deep teal used for section headings: Tarawera. */
  brandDeep: "#073B47",
  /** Primary brand teal: buttons, links, icon chips, progress fill. */
  brand: "#066879",
  /** Secondary/body copy: Nevada. */
  muted: "#5E7076",
  /** Hairline borders on cards, inputs and dividers: Geyser. */
  line: "#DCE5E8",
  /** Icon chip / "Community" style background: Black Squeeze. */
  chip: "#EEF8F9",
  /** Alternate section background: Athens Gray. */
  panel: "#F7F9FA",
  /** Dark panel text on brand backgrounds: Iceberg. */
  onBrandMuted: "#D8EEF1",
  /** Orange accent border / dashed pill border: Zest. */
  orange: "#E88924",
  /** Orange chip fill ("known issue" icon chips, "approved route" pill): Serenade. */
  orangeFill: "#FFF5E8",
  /** Orange chip text: Cafe Royale. */
  orangeTextDark: "#7A430B",
  /** Orange chip text (filter/status labels): Hot Cinnamon. */
  orangeText: "#C9701A",
  /** Placeholder / dashed-box border: Tower Gray. */
  placeholder: "#A9B8BD",
  /** Search input placeholder text: Boulder. */
  inputPlaceholder: "#757575",
} as const;
