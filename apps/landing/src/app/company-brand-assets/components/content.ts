import { appUrl } from "@/lib/app-links";

export const IMG = "/company-brand-assets/";

export const BRAND_EMAIL = "brand@zoiko.social";

/**
 * There is no media-kit archive to host yet, so the media-kit buttons open an
 * email request to the brand team instead of a download that would 404.
 */
export const MEDIA_KIT_REQUEST = `mailto:${BRAND_EMAIL}?subject=${encodeURIComponent("Media kit request")}`;
export const CONTACT_BRAND = `mailto:${BRAND_EMAIL}`;
export const TRADEMARK_POLICY = appUrl("/terms");
export const JAKARTA_FONT = "https://fonts.google.com/specimen/Plus+Jakarta+Sans";

export const CATEGORIES = ["Logos", "Icons", "Colors"] as const;
export const FORMATS = ["SVG", "PNG", "PDF", "ASE"] as const;

export type Asset = {
  title: string;
  description: string;
  category: (typeof CATEGORIES)[number];
  formats: readonly (typeof FORMATS)[number][];
  action: string;
  href: string;
  /** Downloads a real file (the header logo, the site icon) rather than navigating. */
  download?: string;
  image: string;
  imageAlt: string;
  /** Logos sit on white and are shown whole; photos fill the frame. */
  contain?: boolean;
};

export const ASSETS: readonly Asset[] = [
  {
    title: "Primary Logo",
    description: "Teal on white (recommended)",
    category: "Logos",
    formats: ["SVG", "PNG", "PDF"],
    action: "Download logo",
    href: "/header/logo.svg",
    download: "zoiko-social-logo.svg",
    image: "/header/logo.svg",
    imageAlt: "The Zoiko Social logo",
    contain: true,
  },
  {
    title: "Icon Mark",
    description: "Symbol only (apps, favicons)",
    category: "Icons",
    formats: ["SVG", "PNG"],
    action: "Download icon",
    href: "/icon.png",
    download: "zoiko-social-icon.png",
    image: `${IMG}icon-mark.webp`,
    imageAlt: "A grid of white app icons on black",
  },
  {
    title: "Color Palette",
    description: "Primary, accent, tints, neutral",
    category: "Colors",
    formats: ["PDF", "ASE"],
    action: "Download colors",
    // No palette file exists yet; the swatches below list every value.
    href: "#colors",
    image: `${IMG}color-palette.webp`,
    imageAlt: "Rows of painted colour sample cards",
  },
];

export const COLORS = [
  { swatch: "Teal", name: "Primary Teal", hex: "#066879", rgb: "6,104,121", dark: true },
  { swatch: "Orange", name: "Accent Orange", hex: "#E88924", rgb: "232,137,36", dark: true },
  { swatch: "Deep Teal", name: "Teal Deep", hex: "#045363", rgb: "4,83,99", dark: true },
  { swatch: "Tint Teal", name: "Teal Tint", hex: "#EEF8F9", rgb: "238,248,249", dark: false },
  { swatch: "Dark Text", name: "Text Color", hex: "#102A32", rgb: "16,42,50", dark: true },
  { swatch: "Background", name: "Background Light", hex: "#F7F9FA", rgb: "247,249,250", dark: false },
] as const;

export const TYPE_SCALE = [
  ["H1:", "48px / weight 800 / letter-spacing -0.02em"],
  ["H2:", "36px / weight 800 / letter-spacing -0.01em"],
  ["H3:", "20px / weight 700"],
  ["Body:", "17px / weight 400 / line-height 1.65"],
  ["Small:", "13–14px / weight 600"],
] as const;

export const PRINCIPLES = [
  {
    title: "Do",
    body: "Use approved logo files. Maintain clear space (minimum 1/4 logo width). Use teal or white on complementary backgrounds. Preserve aspect ratio. Follow color specifications exactly.",
  },
  {
    title: "Don't",
    body: "Rotate, skew, or stretch logos. Use unofficial colors. Remove or alter logo elements. Place on low-contrast backgrounds. Use logos smaller than 48px without approval.",
  },
  {
    title: "Color ratio",
    body: "Maintain 85% neutral tones, 15% brand color. Use teal (#066879) as primary brand color. Orange (#E88924) as accent (one per screen maximum).",
  },
] as const;

export const MEDIA_KIT_ITEMS = [
  "Company fact sheet",
  "Product overview & features",
  "Hi-res logo files (multiple formats)",
  "Executive team photos",
  "Product screenshots",
  "Press contacts & inquiries",
] as const;

export const RIGHTS = [
  {
    title: "Permitted Use",
    body: "Editorial mentions with accurate branding. Press coverage and news articles. Case studies and partner content. Academic and educational use. Links and references to Zoiko Social.",
  },
  {
    title: "Approval Required",
    body: "Commercial partnerships or co-branding. Product endorsements. Feature imitation or copying. Trademark registration or domain registration. Incorporation into product names.",
  },
  {
    title: "Not Permitted",
    body: "Registered trademark use without permission. Domain names similar to Zoiko Social. Misleading use or implied endorsement. Modification of logos without approval. Domain squatting or trademark confusion.",
  },
] as const;

export const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "Where can I download the official Zoiko Social logo?",
    a: "Use “Download logo” in Featured assets above. For other formats or hi-res files, request the media kit from the brand team.",
  },
  {
    q: "Can I use Zoiko Social logos on my website or in marketing?",
    a: "Editorial mentions, press coverage and links to Zoiko Social are permitted. Commercial use, co-branding or anything that implies endorsement needs written approval first — see Rights and permissions.",
  },
  {
    q: "What is the official Zoiko Social color?",
    a: "Primary Teal, #066879 / RGB(6,104,121). Accent Orange (#E88924) is used sparingly — at most one accent per screen.",
  },
  {
    q: "What typeface should I use for Zoiko Social content?",
    a: "Plus Jakarta Sans, which is open source and free to use, with -apple-system, BlinkMacSystemFont, sans-serif as the fallback stack.",
  },
  {
    q: "Can I modify the Zoiko Social logo?",
    a: "No. Don’t rotate, skew, stretch, recolor or remove elements of the logo. If you need a variation, contact the brand team.",
  },
  {
    q: "How do I request permission for commercial use?",
    a: `Email ${BRAND_EMAIL} with a description of how and where you’d like to use the brand. The team will reply with approval or guidance.`,
  },
];
