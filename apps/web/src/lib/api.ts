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

export interface PostItem {
  id: string
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    isVerified: boolean
  }
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
  create: (input: { caption?: string; visibility?: 'public' | 'followers'; commentsDisabled?: boolean; media?: NewPostMedia[] }) =>
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

export const feedApi = {
  home: (cursor?: string | null, limit = 15) =>
    request<PostPage>(`/feed?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
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

export const hashtagsApi = {
  trending: () => cachedGet<{ tag: string; postsCount: number }[]>('/hashtags/trending', 60_000),
  search: (q: string) => cachedGet<{ tag: string; postsCount: number }[]>(`/hashtags/search?q=${encodeURIComponent(q)}`, 30_000),
  posts: (tag: string, cursor?: string | null) =>
    cachedGet<PostPage & { tag: string; postsCount: number }>(
      `/hashtags/${encodeURIComponent(tag)}/posts${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      30_000,
    ),
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
