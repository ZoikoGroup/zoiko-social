/**
 * support-developers-community-forums design tokens.
 *
 * Pulled from the Figma frame "zoiko-social-Support & Developers-Community
 * Forums" (desktop 1274:6154 / mobile 1274:7314). Duplicated rather than
 * imported so this route stays independent, matching the convention used by
 * platform-features/components/theme.ts.
 */
export const C = {
  /** Headings: Firefly. */
  ink: "#102A32",
  /** Primary brand teal: buttons, links, icon chips, active filter pill. */
  brand: "#066879",
  /** Deep teal used for headings and the dark report-band panel: Tarawera. */
  brandDeep: "#073B47",
  /** Secondary/body copy: Nevada. */
  muted: "#5E7076",
  /** Hairline borders on cards, inputs and dividers: Geyser. */
  line: "#DCE5E8",
  /** "Community" chip fill / icon chip background: Black Squeeze. */
  chip: "#EEF8F9",
  /** Alternate section background: Athens Gray. */
  panel: "#F7F9FA",
  /** Report-band and dark panel background: Tarawera (same as brandDeep). */
  panelDark: "#073B47",
  /** Report-band body copy on the dark panel: Botticelli. */
  onDarkMuted: "#CFE6EA",
  /** "Verified role" / orange accent border: Zest. */
  orange: "#E88924",
  /** Orange chip text (hash/key/home/chat/lock icons and "Only if approved"): Hot Cinnamon. */
  orangeText: "#C9701A",
  /** "Verified role" chip text: Cafe Royale. */
  orangeTextDark: "#7A430B",
  /** Orange chip fill: Serenade. */
  orangeFill: "#FFF5E8",
  /** Placeholder text: Boulder. */
  placeholder: "#757575",
} as const;
