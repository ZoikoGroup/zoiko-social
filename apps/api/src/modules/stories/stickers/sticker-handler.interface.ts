/**
 * StickerHandler — extensible handler for each StickerType.
 *
 * The core Stories module knows nothing about individual sticker semantics.
 * Each sticker type registers a handler that validates its payload, hydrates
 * render-time data, and optionally handles user interactions.
 *
 * Adding `weather`/`poll`/`question`/`countdown` = new handler + enum value.
 * The stories table, upload flow, viewer, and analytics are UNCHANGED.
 *
 * @see docs/stories-architecture.md §12
 */

/** Sticker type discriminant — mirrors Prisma's StickerType enum. */
export type StickerKind =
  | 'emoji'
  | 'text'
  | 'gif'
  | 'mention'
  | 'hashtag'
  | 'time'
  | 'date'
  | 'weather'
  | 'poll'
  | 'question'
  | 'countdown'

/** Positional transform shared by all stickers. */
export interface StickerTransform {
  x: number
  y: number
  scale?: number
  rotation?: number
  z?: number
}

/** Validated sticker payload — type-specific data. */
export type StickerPayload = Record<string, unknown>

/** Render-ready data returned by `hydrate`. */
export type RenderData = Record<string, unknown>

export interface StickerHandler {
  /** The sticker type this handler services. */
  readonly kind: StickerKind

  /**
   * Validate the type-specific payload at publish time.
   * Should throw on invalid data.
   */
  validate(payload: StickerPayload): StickerPayload

  /**
   * Hydrate render-time data for the viewer.
   * e.g. weather → fetch current conditions; countdown → remaining time;
   * mention → resolve displayName/avatarUrl.
   */
  hydrate(payload: StickerPayload, viewerId?: string): Promise<RenderData>

  /**
   * Handle user interaction with the sticker (poll vote, question answer, etc.).
   * Optional — most sticker types are display-only.
   */
  onInteract?(storyId: string, viewerId: string, action: string, payload?: Record<string, unknown>): Promise<void>
}

/**
 * Registry keyed by StickerKind.
 * Adding a new sticker type = register a handler here.
 */
export interface StickerRegistry {
  get(kind: StickerKind): StickerHandler | undefined
  register(handler: StickerHandler): void
}

/**
 * Shape returned to the API consumer after hydration.
 * Attached to the story response for the viewer player.
 */
export interface StickerRenderItem {
  id: string
  kind: StickerKind
  /** Validated payload. */
  payload: StickerPayload
  /** Hydrated render data (fetched at view time). */
  renderData: RenderData
  transform: StickerTransform
}
