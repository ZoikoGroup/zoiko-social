import { createClient } from '@/lib/supabase/client'

/**
 * Typed client for the ZoikoSocial NestJS API.
 * Attaches the Supabase access token and unwraps the {success, data} envelope.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message)
  }
}

// ── Client-side GET cache (stale-while-revalidate) ─────────────────────────
// Fresh entries are served instantly with no network; stale entries are
// served instantly AND refreshed in the background. Any mutation clears the
// whole cache — simple and always-correct.

interface CacheEntry {
  data: unknown
  ts: number
}

const getCache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<unknown>>()

const DEFAULT_TTL_MS = 30_000
const STALE_MAX_MS = 5 * 60_000
const STORAGE_KEY = 'zk.apiCache.v1'
const PERSIST_MAX_ENTRIES = 60

// ── sessionStorage persistence — full page reloads paint from cache ────────
// (session-scoped: closes with the tab, never leaks across users because
// clearApiCache() runs on sign-out/auth-change and wipes storage too)

let persistTimer: ReturnType<typeof setTimeout> | null = null

function restoreCache(): void {
  if (typeof window === 'undefined') return
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const entries = JSON.parse(raw) as [string, CacheEntry][]
    const now = Date.now()
    for (const [key, entry] of entries) {
      if (now - entry.ts < STALE_MAX_MS) getCache.set(key, entry)
    }
  } catch { /* corrupt storage — start fresh */ }
}

function schedulePersist(): void {
  if (typeof window === 'undefined' || persistTimer) return
  persistTimer = setTimeout(() => {
    persistTimer = null
    try {
      const entries = Array.from(getCache.entries())
        .sort((a, b) => b[1].ts - a[1].ts)
        .slice(0, PERSIST_MAX_ENTRIES)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch { /* quota exceeded — skip silently */ }
  }, 500)
}

restoreCache()

export function clearApiCache(): void {
  getCache.clear()
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch { /* ignore */ }
  }
}

/**
 * GET with cache: fresh → instant, stale (<5m) → instant + background refresh,
 * expired/missing → network. Concurrent callers share one in-flight request.
 */
async function cachedGet<T>(path: string, ttlMs = DEFAULT_TTL_MS): Promise<T> {
  const entry = getCache.get(path)
  const age = entry ? Date.now() - entry.ts : Infinity

  if (entry && age < ttlMs) {
    return entry.data as T
  }

  const fetchFresh = (): Promise<T> => {
    const existing = inflight.get(path)
    if (existing) return existing as Promise<T>
    const p = request<T>(path)
      .then((data) => {
        getCache.set(path, { data, ts: Date.now() })
        schedulePersist()
        return data
      })
      .finally(() => inflight.delete(path))
    inflight.set(path, p)
    return p
  }

  // Stale-while-revalidate: serve old data now, refresh behind the scenes
  if (entry && age < STALE_MAX_MS) {
    void fetchFresh().catch(() => {})
    return entry.data as T
  }

  return fetchFresh()
}

/** Wrap a mutation: on success, all cached GETs are invalidated. */
async function mutate<T>(path: string, options: RequestInit): Promise<T> {
  const result = await request<T>(path, options)
  clearApiCache()
  return result
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: {
      // Fastify rejects an empty body when content-type is application/json,
      // so only declare it on requests that actually carry one
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...options.headers,
    },
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const err = json?.error ?? {}
    throw new ApiError(err.code ?? 'UNKNOWN', err.message ?? 'Request failed', res.status)
  }

  // Envelope: interceptor wraps as {success, data}; controllers return {data: result}
  return (json?.data?.data ?? json?.data) as T
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProfessionalProfile {
  id: string
  category: string
  businessName: string | null
  businessEmail: string | null
  businessPhone: string | null
  businessAddress: string | null
  description: string | null
  websiteUrl: string | null
  logoUrl: string | null
  serviceAreas: string[]
  businessHours: Record<string, unknown> | null
  isVerified: boolean
  verifiedAt: string | null
}

export interface Profile {
  id: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  websiteUrl: string | null
  state: string
  role: string
  verificationTier: string
  isPrivate: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  trustScore: number
  usernameChangedAt: string | null
  createdAt: string
  updatedAt: string
  professionalProfile: ProfessionalProfile | null
}

export interface FollowSuggestion {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  mutualConnections: number
  isVerified: boolean
  isProfessional: boolean
  professionalCategory: string | null
  /** Viewer context — initial follow-button state */
  isPrivate?: boolean
  viewerFollows?: boolean
  viewerRequested?: boolean
  followsViewer?: boolean
}

export interface FollowRequestItem {
  id: string
  sender: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
  }
  message: string | null
  createdAt: string
}

export interface Relationship {
  following: boolean
  followedBy: boolean
  followBack: boolean
  requested: boolean
  blocked: boolean
  blockedBy: boolean
  muted: boolean
}

export interface FollowerItem {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  isVerified: boolean
  isProfessional: boolean
  followedAt: string
  isMe: boolean
  viewerFollows: boolean
  viewerRequested: boolean
  followsViewer: boolean
  isPrivate: boolean
}

export const PROFESSIONAL_CATEGORY_LABELS: Record<string, string> = {
  verified_news_publisher: 'Verified News Publisher',
  product_seller: 'Product Seller',
  pet_care_service_provider: 'Pet Care Service Provider',
  veterinarian: 'Veterinarian',
}

// ── Profile API ────────────────────────────────────────────────────────────

export const profileApi = {
  getMe: () => request<Profile>('/profiles/me'),
  getById: (id: string) => cachedGet<Profile>(`/profiles/${id}`),
  getByUsername: (username: string) => cachedGet<Profile>(`/profiles/username/${username}`),
  /** Profile + viewer relationship in one round-trip. */
  getByUsernameWithViewer: (username: string) =>
    cachedGet<Profile & { viewer: Relationship | null }>(`/profiles/username/${username}?withViewer=1`),
  getByIdWithViewer: (id: string) =>
    cachedGet<Profile & { viewer: Relationship | null }>(`/profiles/${id}?withViewer=1`),
  update: (input: {
    displayName?: string
    bio?: string
    websiteUrl?: string | null
    avatarUrl?: string | null
    isPrivate?: boolean
    username?: string
  }) => mutate<Profile>('/profiles/me', { method: 'PUT', body: JSON.stringify(input) }),
  switchToProfessional: (input: { category: string; businessName?: string; description?: string }) =>
    mutate<ProfessionalProfile>('/profiles/me/professional', { method: 'POST', body: JSON.stringify(input) }),
  revertToPersonal: () => mutate<{ message: string }>('/profiles/me/professional', { method: 'DELETE' }),
  getRelationship: (id: string) => request<Relationship>(`/profiles/${id}/relationship`),
}

// ── Posts / Feed / Comments Types ───────────────────────────────────────────

export interface PostMediaItem {
  id: string
  position: number
  url: string
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  blurhash: string | null
}

export type PostKind = 'standard' | 'rescue_case' | 'vet_tip' | 'lost_found' | 'wildlife'

export interface PostMetadata {
  species?: string
  condition?: string
  supportNeeded?: string[]
  verifiedBy?: string
  petName?: string
  lastSeen?: string
  location?: string
}

export interface PostItem {
  id: string
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
    professionalCategory: string | null
  }
  community: { name: string; slug: string } | null
  kind: PostKind
  metadata: PostMetadata | null
  caption: string | null
  visibility: string
  media: PostMediaItem[]
  likesCount: number
  commentsCount: number
  savesCount: number
  sharesCount: number
  commentsDisabled: boolean
  createdAt: string
  viewerLiked: boolean
  viewerSaved: boolean
}

export interface PostPage {
  data: PostItem[]
  nextCursor: string | null
  hasMore: boolean
}

export interface CommentItem {
  id: string
  postId: string
  parentId: string | null
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }
  body: string
  likesCount: number
  repliesCount: number
  isPinned: boolean
  isEdited: boolean
  isDeleted: boolean
  viewerLiked: boolean
  createdAt: string
}

export interface CommentPage {
  data: CommentItem[]
  nextCursor: string | null
  hasMore: boolean
}

export interface NewPostMedia {
  url: string
  thumbnailUrl?: string
  width?: number
  height?: number
  fileSize?: number
  blurhash?: string
  position: number
}

// ── Posts API ────────────────────────────────────────────────────────────────

export const postsApi = {
  create: (input: {
    caption?: string
    visibility?: 'public' | 'followers'
    commentsDisabled?: boolean
    media?: NewPostMedia[]
    kind?: PostKind
    metadata?: PostMetadata
    communityId?: string
  }) =>
    mutate<PostItem>('/posts', { method: 'POST', body: JSON.stringify(input) }),
  get: (id: string) => cachedGet<PostItem>(`/posts/${id}`, 15_000),
  update: (id: string, input: { caption?: string; commentsDisabled?: boolean }) =>
    mutate<PostItem>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  delete: (id: string) => mutate<{ success: boolean }>(`/posts/${id}`, { method: 'DELETE' }),
  like: (id: string) => mutate<{ liked: boolean; likesCount: number }>(`/posts/${id}/like`, { method: 'POST' }),
  unlike: (id: string) => mutate<{ liked: boolean; likesCount: number }>(`/posts/${id}/like`, { method: 'DELETE' }),
  save: (id: string) => mutate<{ saved: boolean }>(`/posts/${id}/save`, { method: 'POST' }),
  unsave: (id: string) => mutate<{ saved: boolean }>(`/posts/${id}/save`, { method: 'DELETE' }),
  share: (id: string, type: 'link' | 'internal' | 'external', recipients?: string[]) =>
    mutate<{ url: string; sharesCount: number; sentTo: number }>(`/posts/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ type, ...(recipients?.length ? { recipients } : {}) }),
    }),
  likers: (id: string, cursor?: string | null) =>
    cachedGet<{ data: (FollowerItem & { likedAt: string })[]; nextCursor: string | null; hasMore: boolean }>(
      `/posts/${id}/likes${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      15_000,
    ),
}

// ── Pets ──────────────────────────────────────────────────────────────────
export interface Pet {
  id: string
  ownerId: string
  name: string
  species: string
  breed: string | null
  avatarUrl: string | null
  bio: string | null
  birthdate: string | null
  isPublic: boolean
  createdAt: string
}

export interface NewPet {
  name: string
  species: string
  breed?: string
  avatarUrl?: string
  bio?: string
  birthdate?: string
  isPublic?: boolean
}

export interface DiaryEntry {
  id: string
  petId: string
  kind: string
  title: string | null
  body: string | null
  photoUrl: string | null
  entryDate: string
  createdAt: string
}

export interface HealthRecord {
  id: string
  petId: string
  type: string
  title: string
  notes: string | null
  recordDate: string | null
  nextDue: string | null
  createdAt: string
}

export const petsApi = {
  mine: () => cachedGet<Pet[]>('/pets', 15_000),
  byProfile: (profileId: string) => cachedGet<Pet[]>(`/profiles/${profileId}/pets`, 30_000),
  create: (input: NewPet) => mutate<Pet>('/pets', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: Partial<NewPet>) => mutate<Pet>(`/pets/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: string) => mutate<{ success: boolean }>(`/pets/${id}`, { method: 'DELETE' }),
  // Diary
  diary: (petId: string) => cachedGet<DiaryEntry[]>(`/pets/${petId}/diary`, 15_000),
  addDiary: (petId: string, input: { kind?: string; title?: string; body?: string; photoUrl?: string; entryDate?: string }) =>
    mutate<DiaryEntry>(`/pets/${petId}/diary`, { method: 'POST', body: JSON.stringify(input) }),
  removeDiary: (petId: string, entryId: string) =>
    mutate<{ success: boolean }>(`/pets/${petId}/diary/${entryId}`, { method: 'DELETE' }),
  // Health
  health: (petId: string) => cachedGet<HealthRecord[]>(`/pets/${petId}/health`, 15_000),
  addHealth: (petId: string, input: { type: string; title: string; notes?: string; recordDate?: string; nextDue?: string }) =>
    mutate<HealthRecord>(`/pets/${petId}/health`, { method: 'POST', body: JSON.stringify(input) }),
  removeHealth: (petId: string, recordId: string) =>
    mutate<{ success: boolean }>(`/pets/${petId}/health/${recordId}`, { method: 'DELETE' }),
}

// ── Events ────────────────────────────────────────────────────────────────
export interface EventItem {
  id: string
  host: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  title: string
  description: string | null
  location: string | null
  isOnline: boolean
  coverUrl: string | null
  startsAt: string
  endsAt: string | null
  goingCount: number
  viewerGoing: boolean
}
export interface EventPage { data: EventItem[]; nextCursor: string | null; hasMore: boolean }

export const eventsApi = {
  upcoming: (cursor?: string | null, limit = 15) =>
    request<EventPage>(`/events?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  get: (id: string) => cachedGet<EventItem>(`/events/${id}`, 30_000),
  create: (input: {
    title: string; description?: string; location?: string; isOnline?: boolean
    coverUrl?: string; startsAt: string; endsAt?: string
  }) => mutate<EventItem>('/events', { method: 'POST', body: JSON.stringify(input) }),
  rsvp: (id: string, status: 'going' | 'interested' = 'going') =>
    mutate<{ going: boolean; goingCount: number }>(`/events/${id}/rsvp`, { method: 'POST', body: JSON.stringify({ status }) }),
  cancelRsvp: (id: string) =>
    mutate<{ going: boolean; goingCount: number }>(`/events/${id}/rsvp`, { method: 'DELETE' }),
  remove: (id: string) => mutate<{ success: boolean }>(`/events/${id}`, { method: 'DELETE' }),
}

export const feedApi = {
  home: (cursor?: string | null, limit = 15) =>
    request<PostPage>(`/feed?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  explore: (cursor?: string | null, limit = 15) =>
    request<PostPage>(`/feed/explore?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  community: (communityId: string, cursor?: string | null, limit = 15) =>
    request<PostPage>(`/communities/${communityId}/posts?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  profilePosts: (profileId: string, cursor?: string | null, mediaOnly = false, limit = 12) =>
    cachedGet<PostPage>(
      `/profiles/${profileId}/posts?limit=${limit}${mediaOnly ? '&mediaOnly=1' : ''}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
      15_000,
    ),
  saved: (cursor?: string | null, limit = 12) =>
    cachedGet<PostPage>(`/me/saved?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`, 15_000),
}

export const commentsApi = {
  list: (postId: string, cursor?: string | null, limit = 20) =>
    request<CommentPage>(`/posts/${postId}/comments?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  replies: (commentId: string, cursor?: string | null, limit = 10) =>
    request<CommentPage>(`/comments/${commentId}/replies?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  create: (postId: string, body: string, parentId?: string) =>
    mutate<CommentItem>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body, ...(parentId ? { parentId } : {}) }),
    }),
  edit: (id: string, body: string) =>
    mutate<CommentItem>(`/comments/${id}`, { method: 'PATCH', body: JSON.stringify({ body }) }),
  delete: (id: string) => mutate<{ success: boolean }>(`/comments/${id}`, { method: 'DELETE' }),
  like: (id: string) => mutate<{ liked: boolean; likesCount: number }>(`/comments/${id}/like`, { method: 'POST' }),
  unlike: (id: string) => mutate<{ liked: boolean; likesCount: number }>(`/comments/${id}/like`, { method: 'DELETE' }),
  pin: (postId: string, commentId: string) =>
    mutate<{ pinned: boolean }>(`/posts/${postId}/comments/${commentId}/pin`, { method: 'POST' }),
  unpin: (postId: string, commentId: string) =>
    mutate<{ pinned: boolean }>(`/posts/${postId}/comments/${commentId}/pin`, { method: 'DELETE' }),
}

// ── Communities Types ────────────────────────────────────────────────────────

export interface CommunityCategory {
  id: string
  slug: string
  label: string
  icon: string | null
}

export interface CommunityCard {
  id: string
  slug: string
  name: string
  description: string | null
  avatarUrl: string | null
  coverUrl: string | null
  category: string | null
  membersCount: number
  postsCount: number
  privacy: string
  isVerified: boolean
  viewerStatus: string | null
}

export interface CommunityRule {
  id: string
  position: number
  title: string
  body: string | null
}

export interface Community {
  id: string
  slug: string
  name: string
  description: string | null
  avatarUrl: string | null
  coverUrl: string | null
  category: { id: string; slug: string; label: string } | null
  tags: string[]
  privacy: string
  isVerified: boolean
  membersCount: number
  postsCount: number
  createdAt: string
  rules: CommunityRule[]
  viewerRole: string | null
  viewerStatus: string | null
}

export interface CommunityMember {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  role: string
  joinedAt: string
}

// ── Stories Types ────────────────────────────────────────────────────────────

export interface StoryAuthor {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
}

export interface StoryMediaItem {
  id: string
  type: string
  imageUrl: string | null
  hlsUrl: string | null
  thumbnailUrl: string | null
  previewUrl: string | null
  blurhash: string | null
  width: number | null
  height: number | null
  durationMs: number | null
}

export interface StoryItem {
  id: string
  author: StoryAuthor
  type: string
  status: string
  privacy: string
  caption: string | null
  background: Record<string, unknown> | null
  media: StoryMediaItem[]
  refType: string | null
  refId: string | null
  durationMs: number
  viewsCount: number
  reactionsCount: number
  repliesCount: number
  allowReplies: boolean
  allowReactions: boolean
  createdAt: string
  expiresAt: string | null
  viewerSeen: boolean
  viewerReacted: boolean
}

export interface UploadUrlResult {
  uploadUrl: string
  path: string
}

// ── Stories API ──────────────────────────────────────────────────────────────

export interface StoryRefCard {
  available: true
  type: 'feed_post' | 'profile' | 'community_post' | 'product'
  title: string
  subtitle: string
  thumbnailUrl: string | null
  avatarUrl: string | null
  deepLink: string
}

export interface UnavailableRefCard {
  available: false
  type: 'feed_post' | 'profile' | 'community_post' | 'product'
}

export type StoryRefResult = StoryRefCard | UnavailableRefCard

export const storiesApi = {
  uploadUrl: (kind: 'image' | 'video', mime: string) =>
    request<UploadUrlResult>(`/stories/upload-url?kind=${kind}&mime=${encodeURIComponent(mime)}`),
  create: (input: {
    type: 'photo' | 'video' | 'text' | 'shared_post' | 'shared_professional_profile' | 'shared_community_post'
    privacy?: 'public' | 'followers' | 'close_friends' | 'professional'
    media?: { path: string; width?: number; height?: number; blurhash?: string; durationMs?: number }[]
    caption?: string
    background?: { gradient?: string; color?: string; font?: string; align?: string }
    refType?: string
    refId?: string
    stickers?: { kind: string; payload: Record<string, unknown>; transform: { x: number; y: number } }[]
    mentions?: string[]
    hashtags?: string[]
    music?: { trackId: string; startMs?: number; durationMs?: number; volume?: number }
    allowReplies?: boolean
    allowReactions?: boolean
  }) => mutate<{ story: StoryItem; status: string }>('/stories', { method: 'POST', body: JSON.stringify(input) }),
  get: (id: string) => cachedGet<StoryItem>(`/stories/${id}`, 15_000),
  delete: (id: string) => mutate<{ success: boolean }>(`/stories/${id}`, { method: 'DELETE' }),
  resolveRef: (refType: string, refId: string) =>
    cachedGet<StoryRefResult>(`/stories/ref/${refType}/${refId}`, 30_000),
}

export interface TrayStorySummary {
  id: string
  type: string
  posterUrl: string | null
  blurhash: string | null
  durationMs: number
  seen: boolean
}

export interface TrayRing {
  author: StoryAuthor
  hasUnseen: boolean
  latestStoryAt: string
  stories: TrayStorySummary[]
}

export interface TrayResponse {
  rings: TrayRing[]
}

export interface ViewerItem {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
  completionPct: number
  viewedAt: string
}

export interface ViewerPage {
  data: ViewerItem[]
  nextCursor: string | null
  hasMore: boolean
}

export const trayApi = {
  get: () => cachedGet<TrayResponse>('/stories/tray', 15_000),
  getUserRing: (userId: string) => cachedGet<TrayRing>(`/stories/user/${userId}`, 15_000),
}

export interface StoryInsights {
  storyId: string
  viewsCount: number
  impressionsCount: number
  reactionsCount: number
  repliesCount: number
  shareCount: number
  profileVisitsCount: number
  completionPctAvg: number
  completionPctDistribution: { range: string; count: number }[]
  reach: number | null
  engagementRatePct: number | null
}

export interface ReactionItem {
  id: string
  kind: string
  emoji: string | null
  message: string | null
  user: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }
  createdAt: string
}

export interface ReactionPage {
  data: ReactionItem[]
  nextCursor: string | null
  hasMore: boolean
}

export interface ReactionCounts {
  emoji: number
  quickReply: number
  share: number
  total: number
}

export const reactionsApi = {
  react: (storyId: string, kind: string, options?: { emoji?: string; message?: string }) =>
    mutate<{ id: string }>(`/stories/${storyId}/react`, {
      method: 'POST',
      body: JSON.stringify({ kind, ...options }),
    }),
  report: (storyId: string, reason: string) =>
    mutate<{ id: string }>(`/stories/${storyId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  list: (storyId: string, cursor?: string | null, limit = 20, kind?: string) => {
    const p = new URLSearchParams()
    if (cursor) p.set('cursor', cursor)
    p.set('limit', String(limit))
    if (kind) p.set('kind', kind)
    const qs = p.toString()
    return cachedGet<ReactionPage>(
      `/stories/${storyId}/reactions${qs ? `?${qs}` : ''}`,
      15_000,
    )
  },
  counts: (storyId: string) =>
    cachedGet<ReactionCounts>(`/stories/${storyId}/reactions/counts`, 30_000),
}

export interface MentionItem {
  id: string
  storyId: string
  storyAuthor: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }
  caption: string | null
  type: string
  createdAt: string
}

export interface MentionPage {
  data: MentionItem[]
  nextCursor: string | null
  hasMore: boolean
}

export interface StoryMentionUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified: boolean
}

export interface StoryMentionItem {
  id: string
  mentionedUser: StoryMentionUser
  actor: { id: string; username: string; displayName: string; avatarUrl: string | null }
  createdAt: string
}

export interface StoryByTagItem {
  id: string
  type: string
  caption: string | null
  privacy: string
  durationMs: number
  posterUrl: string | null
  blurhash: string | null
  createdAt: string
  author: StoryAuthor
}

export interface StoryByTagPage {
  data: StoryByTagItem[]
  nextCursor: string | null
  hasMore: boolean
}

export const mentionsApi = {
  getStoryMentions: (storyId: string) =>
    cachedGet<StoryMentionItem[]>(`/stories/${storyId}/mentions`, 15_000),
  getMyMentions: (cursor?: string | null) => {
    const p = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
    return cachedGet<MentionPage>(`/me/story-mentions${p}`, 15_000)
  },
}

// Re-export under hashtagsApi for story tag browsing
export const hashtagsApi = {
  trending: () => cachedGet<{ tag: string; postsCount: number }[]>('/hashtags/trending', 60_000),
  search: (q: string) => cachedGet<{ tag: string; postsCount: number }[]>(`/hashtags/search?q=${encodeURIComponent(q)}`, 30_000),
  posts: (tag: string, cursor?: string | null) =>
    cachedGet<PostPage & { tag: string; postsCount: number }>(
      `/hashtags/${encodeURIComponent(tag)}/posts${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      30_000,
    ),
  stories: (tag: string, cursor?: string | null) =>
    cachedGet<StoryByTagPage>(
      `/hashtags/${encodeURIComponent(tag)}/stories${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      30_000,
    ),
}

export const viewsApi = {
  record: (storyId: string, completionPct: number) =>
    mutate<{ success: boolean }>(`/stories/${storyId}/view`, {
      method: 'POST',
      body: JSON.stringify({ completionPct }),
    }),
  list: (storyId: string, cursor?: string | null, limit = 20) =>
    cachedGet<ViewerPage>(
      `/stories/${storyId}/viewers${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}${!cursor ? `?limit=${limit}` : `&limit=${limit}`}`,
      15_000,
    ),
  insights: (storyId: string) =>
    cachedGet<StoryInsights>(`/stories/${storyId}/insights`, 30_000),
  recordProfileVisit: (storyId: string) =>
    mutate<{ success: boolean }>(`/stories/${storyId}/viewer/profile-visit`, { method: 'POST' }),
}

// ── Music API ───────────────────────────────────────────────────────────────

export interface MusicTrackMeta {
  id: string
  title: string
  artist: string
  album: string | null
  genre: string
  mood: string
  category: string
  durationMs: number
  coverUrl: string | null
  previewUrl: string | null
  audioUrl: string
  license: string
  attribution: string | null
  provider: string
  isActive: boolean
  createdAt: string
}

export interface MusicSearchResult {
  tracks: MusicTrackMeta[]
  total: number
}

export interface MusicBrowseResult {
  data: MusicTrackMeta[]
  total: number
  hasMore: boolean
  nextOffset: number | null
}

export interface MusicTrendingItem {
  track: MusicTrackMeta
  usageCount: number
}

export const musicApi = {
  /** Full-text search against title + artist with facet filters */
  search: (opts: { q?: string; mood?: string; category?: string; genre?: string; page?: number; limit?: number } = {}) => {
    const p = new URLSearchParams()
    if (opts.q) p.set('q', opts.q)
    if (opts.mood) p.set('mood', opts.mood)
    if (opts.category) p.set('category', opts.category)
    if (opts.genre) p.set('genre', opts.genre)
    if (opts.page) p.set('page', String(opts.page))
    if (opts.limit) p.set('limit', String(opts.limit))
    const qs = p.toString()
    return cachedGet<MusicSearchResult>(`/music/search${qs ? `?${qs}` : ''}`, 30_000)
  },
  /** Faceted browse without query text — offset-based cursor pagination */
  browse: (opts: { mood?: string; category?: string; genre?: string; offset?: number; limit?: number } = {}) => {
    const p = new URLSearchParams()
    if (opts.mood) p.set('mood', opts.mood)
    if (opts.category) p.set('category', opts.category)
    if (opts.genre) p.set('genre', opts.genre)
    if (opts.offset) p.set('offset', String(opts.offset))
    if (opts.limit) p.set('limit', String(opts.limit))
    const qs = p.toString()
    return cachedGet<MusicBrowseResult>(`/music/browse${qs ? `?${qs}` : ''}`, 60_000)
  },
  /** Trending tracks — most-used in stories */
  trending: (limit = 20) => cachedGet<MusicTrendingItem[]>(`/music/trending?limit=${limit}`, 60_000),
  /** Single track metadata (24h cached) */
  getTrack: (id: string) => cachedGet<MusicTrackMeta>(`/music/${id}`, 86_400_000),
  /** Signed stream URL for composer preview */
  streamUrl: (id: string) => request<{ url: string }>(`/music/${id}/stream`).then((r) => r.url),
  /** Preview clip URL (30s trimmed preview) */
  previewUrl: (id: string) => cachedGet<{ url: string }>(`/music/${id}/preview`, 86_400_000).then((r) => r.url),
  /** Cover artwork URL */
  coverUrl: (id: string) => cachedGet<{ url: string | null }>(`/music/${id}/cover`, 86_400_000).then((r) => r.url),
}

// ── Highlights API ──────────────────────────────────────────────────────────

export interface HighlightItem {
  id: string
  highlightId: string
  story: {
    id: string
    type: string
    media: { previewUrl: string | null; thumbnailUrl: string | null; blurhash: string | null }[]
    createdAt: string
  }
  position: number
  addedAt: string
}

export interface HighlightResponse {
  id: string
  title: string
  coverUrl: string | null
  position: number
  itemsCount: number
  createdAt: string
  updatedAt: string
  items: HighlightItem[]
}

export interface HighlightSummary {
  id: string
  title: string
  coverUrl: string | null
  position: number
  itemsCount: number
  createdAt: string
}

export const highlightsApi = {
  /** Create a new highlight collection */
  create: (title: string, coverUrl?: string) =>
    mutate<HighlightResponse>('/highlights', { method: 'POST', body: JSON.stringify({ title, coverUrl }) }),
  /** Get a single highlight with its items */
  get: (id: string) => cachedGet<HighlightResponse>(`/highlights/${id}`, 30_000),
  /** Update highlight title/cover */
  update: (id: string, data: { title?: string; coverUrl?: string | null }) =>
    mutate<HighlightResponse>(`/highlights/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  /** Delete a highlight collection */
  delete: (id: string) => mutate<{ success: boolean }>(`/highlights/${id}`, { method: 'DELETE' }),
  /** Add a story to a highlight */
  addItem: (id: string, archivedStoryId: string) =>
    mutate<HighlightResponse>(`/highlights/${id}/items`, {
      method: 'POST',
      body: JSON.stringify({ archivedStoryId }),
    }),
  /** Remove a story from a highlight */
  removeItem: (id: string, itemId: string) =>
    mutate<{ success: boolean }>(`/highlights/${id}/items/${itemId}`, { method: 'DELETE' }),
  /** Reorder items in a highlight */
  reorder: (id: string, itemIds: string[]) =>
    mutate<HighlightResponse>(`/highlights/${id}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ itemIds }),
    }),
  /** Public highlights list for a profile page */
  profileHighlights: (profileId: string) =>
    cachedGet<HighlightSummary[]>(`/profiles/${profileId}/highlights`, 60_000),
}

// ── Archive API ─────────────────────────────────────────────────────────────

export interface ArchiveItem {
  storyId: string
  story: {
    id: string
    type: string
    caption: string | null
    media: { previewUrl: string | null; thumbnailUrl: string | null; blurhash: string | null }[]
    createdAt: string
    expiresAt: string | null
  }
  archivedAt: string
  purgeAfter: string
}

export interface ArchivePage {
  data: ArchiveItem[]
  nextCursor: string | null
  hasMore: boolean
}

export const archiveApi = {
  /** Owner-only list of archived stories, newest-first */
  list: (cursor?: string | null, limit = 20) =>
    request<ArchivePage>(`/me/archive?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  /** Restore an archived story to a highlight */
  restore: (storyId: string, highlightId: string) =>
    mutate<{ success: boolean }>(`/me/archive/${storyId}/restore`, {
      method: 'POST',
      body: JSON.stringify({ highlightId }),
    }),
  /** Permanently delete an archived story */
  delete: (storyId: string) =>
    mutate<{ success: boolean }>(`/me/archive/${storyId}`, { method: 'DELETE' }),
}

export const communitiesApi = {
  browse: (opts: { q?: string | undefined; category?: string | undefined; sort?: string | undefined; cursor?: string | null } = {}) => {
    const p = new URLSearchParams()
    if (opts.q) p.set('q', opts.q)
    if (opts.category) p.set('category', opts.category)
    if (opts.sort) p.set('sort', opts.sort)
    if (opts.cursor) p.set('cursor', opts.cursor)
    const qs = p.toString()
    return cachedGet<{ data: CommunityCard[]; nextCursor: string | null; hasMore: boolean }>(
      `/communities${qs ? `?${qs}` : ''}`,
      opts.q ? 30_000 : 60_000,
    )
  },
  categories: () => cachedGet<CommunityCategory[]>('/communities/categories', 300_000),
  slugAvailable: (slug: string) =>
    request<{ slug: string; available: boolean; reason: string | null }>(
      `/communities/slug-available?slug=${encodeURIComponent(slug)}`,
    ),
  create: (input: {
    name: string; slug: string; description?: string | undefined; categoryId: string
    privacy?: 'public' | 'private' | 'invite_only' | undefined; tags?: string[]
    avatarUrl?: string; coverUrl?: string; rules?: { title: string; body?: string }[]
  }) => mutate<Community>('/communities', { method: 'POST', body: JSON.stringify(input) }),
  get: (slug: string) => cachedGet<Community>(`/communities/${slug}`, 30_000),
  update: (id: string, input: Record<string, unknown>) =>
    mutate<Community>(`/communities/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: string) => mutate<{ success: boolean }>(`/communities/${id}`, { method: 'DELETE' }),
  join: (id: string, acceptRules?: boolean) =>
    mutate<{ status: string }>(`/communities/${id}/join`, { method: 'POST', body: JSON.stringify({ acceptRules }) }),
  leave: (id: string) => mutate<{ success: boolean }>(`/communities/${id}/join`, { method: 'DELETE' }),
  members: (id: string, cursor?: string | null, role?: string) => {
    const p = new URLSearchParams()
    if (cursor) p.set('cursor', cursor)
    if (role) p.set('role', role)
    const qs = p.toString()
    return cachedGet<{ data: CommunityMember[]; nextCursor: string | null; hasMore: boolean }>(
      `/communities/${id}/members${qs ? `?${qs}` : ''}`,
      15_000,
    )
  },
  requests: (id: string, cursor?: string | null) =>
    cachedGet<{ data: (Omit<CommunityMember, 'role' | 'joinedAt'> & { requestedAt: string })[]; nextCursor: string | null; hasMore: boolean }>(
      `/communities/${id}/requests${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      15_000,
    ),
  approve: (id: string, userId: string) => mutate<{ success: boolean }>(`/communities/${id}/requests/${userId}/approve`, { method: 'POST' }),
  reject: (id: string, userId: string) => mutate<{ success: boolean }>(`/communities/${id}/requests/${userId}/reject`, { method: 'POST' }),
  mine: () => cachedGet<CommunityCard[]>('/me/communities', 30_000),
  // Invites
  inviteUser: (id: string, username: string) =>
    mutate<{ id: string; type: string; invitee: { username: string; displayName: string } | null; expiresAt: string | null }>(
      `/communities/${id}/invites`, { method: 'POST', body: JSON.stringify({ username }) },
    ),
  createInviteLink: (id: string, opts: { expiresInDays?: number; maxUses?: number } = {}) =>
    mutate<{ id: string; type: string; url: string; expiresAt: string | null }>(
      `/communities/${id}/invites`, { method: 'POST', body: JSON.stringify({ type: 'link', ...opts }) },
    ),
  listInvites: (id: string) =>
    request<{ id: string; type: string; invitee: { username: string; displayName: string; avatarUrl: string | null } | null; url?: string; uses: number; maxUses: number | null; expiresAt: string | null }[]>(
      `/communities/${id}/invites`,
    ),
  revokeInvite: (id: string, inviteId: string) =>
    mutate<{ success: boolean }>(`/communities/${id}/invites/${inviteId}`, { method: 'DELETE' }),
  invitePreview: (code: string) =>
    request<{ community: { id: string; slug: string; name: string; description: string | null; avatarUrl: string | null; membersCount: number; privacy: string }; inviteId: string }>(
      `/invites/${code}`,
    ),
  acceptInvite: (code: string, acceptRules?: boolean) =>
    mutate<{ status: string; slug: string }>(`/invites/${code}/accept`, { method: 'POST', body: JSON.stringify({ acceptRules }) }),
}

// ── Notifications API ──────────────────────────────────────────────────────

export interface NotificationItem {
  id: string
  type: string
  title: string
  body: string | null
  data: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}

export const notificationsApi = {
  // Short TTL — realtime pushes keep this fresh between fetches
  list: (page = 1, limit = 20, type?: string) =>
    cachedGet<{ data: NotificationItem[]; total: number; unreadCount: number }>(
      `/notifications?page=${page}&limit=${limit}${type ? `&type=${type}` : ''}`,
      15_000,
    ),
  unreadCount: () => request<{ count: number }>('/notifications/unread-count').then((r) => r.count),
  markRead: (id: string) => mutate<{ success: boolean }>(`/notifications/${id}/read`, { method: 'POST' }),
  markAllRead: () => mutate<{ updated: number }>('/notifications/read-all', { method: 'POST' }),
}

// ── Network API ────────────────────────────────────────────────────────────

export const networkApi = {
  follow: (userId: string) => mutate<{ status: string }>(`/network/follow/${userId}`, { method: 'POST' }),
  unfollow: (userId: string) => mutate<{ success: boolean }>(`/network/follow/${userId}`, { method: 'DELETE' }),
  removeFollower: (userId: string) => mutate<{ success: boolean }>(`/network/follow/${userId}/remove`, { method: 'POST' }),
  cancelRequest: (userId: string) => mutate<{ success: boolean }>(`/network/follow/${userId}/request`, { method: 'DELETE' }),
  /** One shared cache entry serves the network page AND the right panel. */
  getSuggestions: (limit = 18) => cachedGet<FollowSuggestion[]>(`/network/suggestions?limit=${limit}`, 60_000),
  search: (q: string, limit = 20) =>
    cachedGet<FollowSuggestion[]>(`/network/search?q=${encodeURIComponent(q)}&limit=${limit}`, 30_000),
  getRequests: (page = 1, limit = 20) =>
    cachedGet<{ data: FollowRequestItem[]; total: number }>(`/network/requests?page=${page}&limit=${limit}`),
  acceptRequest: (id: string) => mutate<{ success: boolean }>(`/network/requests/${id}/accept`, { method: 'POST' }),
  rejectRequest: (id: string) => mutate<{ success: boolean }>(`/network/requests/${id}/reject`, { method: 'POST' }),
  getFollowers: (userId: string, page = 1, limit = 20) =>
    cachedGet<{ data: FollowerItem[]; total: number }>(`/network/followers/${userId}?page=${page}&limit=${limit}`),
  getFollowing: (userId: string, page = 1, limit = 20) =>
    cachedGet<{ data: FollowerItem[]; total: number }>(`/network/following/${userId}?page=${page}&limit=${limit}`),
}
