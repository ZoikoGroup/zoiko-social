// ── Chat themes ──────────────────────────────────────────────────────────────
// Instagram-style shared chat themes: picking one changes the conversation for
// BOTH participants (the theme lives on the conversation and is broadcast over
// the `conversation:theme` realtime event). Each theme defines an accent
// gradient for the sender's own bubbles plus a subtle background "wallpaper"
// painted behind the message list.
//
// Values are plain CSS so no Tailwind config changes are needed. Wallpapers are
// translucent tints/patterns layered over the list's base surface colour, so
// they read correctly in both light and dark mode without mode detection.

export interface ChatTheme {
  id: string
  label: string
  emoji: string
  /** CSS `background` for the sender's own bubbles. null → fall back to the app's default primary. */
  sentBubble: string | null
  /** Text colour inside the sender's own bubbles. */
  sentText: string
  /** CSS `background-image` layer(s) painted behind the message list. null → no wallpaper. */
  wallpaper: string | null
}

/** A dotted "wallpaper" pattern tinted with the theme's colours. */
function dotted(dot: string, tintTop: string, tintBottom: string): string {
  return (
    `radial-gradient(circle at 1px 1px, ${dot} 1.5px, transparent 0) 0 0 / 22px 22px, ` +
    `linear-gradient(180deg, ${tintTop}, ${tintBottom})`
  )
}

export const CHAT_THEMES: ChatTheme[] = [
  {
    id: 'default',
    label: 'Default',
    emoji: '💬',
    sentBubble: null,
    sentText: '#ffffff',
    wallpaper: null,
  },
  {
    id: 'sunset',
    label: 'Sunset',
    emoji: '🌅',
    sentBubble: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)',
    sentText: '#ffffff',
    wallpaper: dotted('rgba(219,39,119,0.12)', 'rgba(249,115,22,0.06)', 'rgba(219,39,119,0.10)'),
  },
  {
    id: 'ocean',
    label: 'Ocean',
    emoji: '🌊',
    sentBubble: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    sentText: '#ffffff',
    wallpaper: dotted('rgba(37,99,235,0.12)', 'rgba(14,165,233,0.06)', 'rgba(37,99,235,0.10)'),
  },
  {
    id: 'forest',
    label: 'Forest',
    emoji: '🌿',
    sentBubble: 'linear-gradient(135deg, #22c55e 0%, #047857 100%)',
    sentText: '#ffffff',
    wallpaper: dotted('rgba(4,120,87,0.12)', 'rgba(34,197,94,0.06)', 'rgba(4,120,87,0.10)'),
  },
  {
    id: 'lavender',
    label: 'Lavender',
    emoji: '💜',
    sentBubble: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    sentText: '#ffffff',
    wallpaper: dotted('rgba(139,92,246,0.12)', 'rgba(139,92,246,0.06)', 'rgba(217,70,239,0.10)'),
  },
  {
    id: 'bubblegum',
    label: 'Bubblegum',
    emoji: '🎀',
    sentBubble: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    sentText: '#ffffff',
    wallpaper: dotted('rgba(236,72,153,0.12)', 'rgba(236,72,153,0.06)', 'rgba(244,63,94,0.10)'),
  },
  {
    id: 'honey',
    label: 'Honey',
    emoji: '🍯',
    sentBubble: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    sentText: '#ffffff',
    wallpaper: dotted('rgba(217,119,6,0.14)', 'rgba(245,158,11,0.06)', 'rgba(217,119,6,0.10)'),
  },
  {
    id: 'midnight',
    label: 'Midnight',
    emoji: '🌙',
    sentBubble: 'linear-gradient(135deg, #475569 0%, #0f172a 100%)',
    sentText: '#ffffff',
    wallpaper: dotted('rgba(71,85,105,0.16)', 'rgba(71,85,105,0.08)', 'rgba(15,23,42,0.12)'),
  },
  {
    id: 'graphite',
    label: 'Graphite',
    emoji: '⚫',
    sentBubble: 'linear-gradient(135deg, #4b5563 0%, #111827 100%)',
    sentText: '#ffffff',
    wallpaper: dotted('rgba(75,85,99,0.16)', 'rgba(75,85,99,0.07)', 'rgba(17,24,39,0.11)'),
  },
]

export const DEFAULT_CHAT_THEME: ChatTheme = CHAT_THEMES[0]!

/** Resolve a stored theme id to a theme, falling back to Default for unknown/null ids. */
export function getChatTheme(id: string | null | undefined): ChatTheme {
  if (!id) return DEFAULT_CHAT_THEME
  return CHAT_THEMES.find((t) => t.id === id) ?? DEFAULT_CHAT_THEME
}
