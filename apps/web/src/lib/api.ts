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
  getById: (id: string) => request<Profile>(`/profiles/${id}`),
  getByUsername: (username: string) => request<Profile>(`/profiles/username/${username}`),
  update: (input: {
    displayName?: string
    bio?: string
    websiteUrl?: string | null
    avatarUrl?: string | null
    isPrivate?: boolean
    username?: string
  }) => request<Profile>('/profiles/me', { method: 'PUT', body: JSON.stringify(input) }),
  switchToProfessional: (input: { category: string; businessName?: string; description?: string }) =>
    request<ProfessionalProfile>('/profiles/me/professional', { method: 'POST', body: JSON.stringify(input) }),
  revertToPersonal: () => request<{ message: string }>('/profiles/me/professional', { method: 'DELETE' }),
  getRelationship: (id: string) => request<Relationship>(`/profiles/${id}/relationship`),
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
  list: (page = 1, limit = 20, type?: string) =>
    request<{ data: NotificationItem[]; total: number; unreadCount: number }>(
      `/notifications?page=${page}&limit=${limit}${type ? `&type=${type}` : ''}`,
    ),
  unreadCount: () => request<{ count: number }>('/notifications/unread-count').then((r) => r.count),
  markRead: (id: string) => request<{ success: boolean }>(`/notifications/${id}/read`, { method: 'POST' }),
  markAllRead: () => request<{ updated: number }>('/notifications/read-all', { method: 'POST' }),
}

// ── Network API ────────────────────────────────────────────────────────────

export const networkApi = {
  follow: (userId: string) => request<{ status: string }>(`/network/follow/${userId}`, { method: 'POST' }),
  unfollow: (userId: string) => request<{ success: boolean }>(`/network/follow/${userId}`, { method: 'DELETE' }),
  removeFollower: (userId: string) => request<{ success: boolean }>(`/network/follow/${userId}/remove`, { method: 'POST' }),
  cancelRequest: (userId: string) => request<{ success: boolean }>(`/network/follow/${userId}/request`, { method: 'DELETE' }),
  getSuggestions: (limit = 12) => request<FollowSuggestion[]>(`/network/suggestions?limit=${limit}`),
  search: (q: string, limit = 20) =>
    request<FollowSuggestion[]>(`/network/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  getRequests: (page = 1, limit = 20) =>
    request<{ data: FollowRequestItem[]; total: number }>(`/network/requests?page=${page}&limit=${limit}`),
  acceptRequest: (id: string) => request<{ success: boolean }>(`/network/requests/${id}/accept`, { method: 'POST' }),
  rejectRequest: (id: string) => request<{ success: boolean }>(`/network/requests/${id}/reject`, { method: 'POST' }),
  getFollowers: (userId: string, page = 1, limit = 20) =>
    request<{ data: FollowerItem[]; total: number }>(`/network/followers/${userId}?page=${page}&limit=${limit}`),
  getFollowing: (userId: string, page = 1, limit = 20) =>
    request<{ data: FollowerItem[]; total: number }>(`/network/following/${userId}?page=${page}&limit=${limit}`),
}
