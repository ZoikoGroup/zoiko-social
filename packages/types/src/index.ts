// ── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin'
export type UserState = 'active' | 'suspended' | 'banned' | 'deleted'
export type VerificationTier = 'none' | 'email' | 'phone' | 'identity' | 'professional'

export interface UserProfile {
  id: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  role: UserRole
  state: UserState
  verificationTier: VerificationTier
  followersCount: number
  followingCount: number
  createdAt: string
}

// ── Pet ───────────────────────────────────────────────────────────────────

export type AnimalCategory =
  | 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'guinea_pig'
  | 'fish' | 'reptile' | 'horse' | 'farm_animal' | 'exotic' | 'other'

export interface PetProfile {
  id: string
  ownerId: string
  name: string
  species: AnimalCategory
  breed: string | null
  dateOfBirth: string | null
  avatarUrl: string | null
  bio: string | null
  createdAt: string
}

// ── Post ──────────────────────────────────────────────────────────────────

export type PostType = 'text' | 'image' | 'video' | 'reel' | 'story'
export type PostVisibility = 'public' | 'followers' | 'community' | 'private'

export interface Post {
  id: string
  authorId: string
  type: PostType
  body: string | null
  mediaUrls: string[]
  visibility: PostVisibility
  likesCount: number
  commentsCount: number
  sharesCount: number
  createdAt: string
}

// ── Messaging ─────────────────────────────────────────────────────────────

export type ConversationType = 'dm' | 'group' | 'community'

export interface Conversation {
  id: string
  type: ConversationType
  name: string | null
  participantIds: string[]
  lastMessageAt: string | null
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  body: string | null
  mediaUrls: string[]
  createdAt: string
  editedAt: string | null
  deletedAt: string | null
}

// ── Lost & Found ──────────────────────────────────────────────────────────

export type LostFoundStatus = 'lost' | 'found' | 'reunited'

export interface LostFoundReport {
  id: string
  reporterId: string
  status: LostFoundStatus
  species: AnimalCategory
  description: string
  photoUrls: string[]
  lastSeenLocation: string
  latitude: number | null
  longitude: number | null
  contactInfo: string
  createdAt: string
}

// ── Pet Care ──────────────────────────────────────────────────────────────

export type PetCareServiceType =
  | 'walking' | 'sitting' | 'boarding' | 'grooming' | 'training' | 'vet_escort'

export interface PetCareListing {
  id: string
  providerId: string
  serviceTypes: PetCareServiceType[]
  hourlyRate: number
  currency: string
  description: string
  acceptedSpecies: AnimalCategory[]
  isAvailable: boolean
  createdAt: string
}

// ── API Response wrappers ─────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    nextCursor?: string
  }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}
