/**
 * Design tokens and constants for the Business Verification page.
 * Extracted precisely from Figma node 1449:3807 ("zoiko-social-buisness-verification").
 */

export const C = {
  /** Primary brand teal: headings, primary buttons, accents. */
  mosque: "#066879",
  brand: "#066879",

  /** Dark Tarawera teal: main headings, title text. */
  tarawera: "#073B47",
  title: "#073B47",

  /** Deep charcoal: secondary headings, label text, dark accents. */
  firefly: "#102A32",
  ink: "#102A32",

  /** Muted slate: descriptions, captions, secondary text. */
  nevada: "#5E7076",
  muted: "#5E7076",

  /** Border gray: cards, tables, inputs. */
  geyser: "#DCE5E8",
  border: "#DCE5E8",

  /** Dashed border gray. */
  towerGray: "#A9B8BD",

  /** Soft off-white page background and card fill. */
  athensGray: "#F7F9FA",
  pageBg: "#F7F9FA",

  /** Soft pale teal tint for pill badges and chips. */
  blackSqueeze: "#EEF8F9",
  chip: "#EEF8F9",

  /** Orange / Amber accent color. */
  zest: "#E88924",
  accent: "#E88924",

  /** Warm light cream / amber background for action cards. */
  serenade: "#FFF5E8",

  /** Deep amber brown for warning chip text. */
  cafeRoyale: "#7A430B",

  /** Subtle pale teal text. */
  botticelli: "#C5D8DE",
  jaggedIce: "#BFE3E8",

  /** Pure white. */
  white: "#FFFFFF",

  /** Status colors */
  status: {
    active: "#066879",
    expiring: "#E88924",
    lapsed: "#757575",
    suspended: "#D97706",
    revoked: "#DC2626",
    verified: "#059669",
  },
} as const;
