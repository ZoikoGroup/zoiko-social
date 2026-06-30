import { z } from 'zod'

// ── Pagination ────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export type Pagination = z.infer<typeof PaginationSchema>

// ── User ──────────────────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(300).optional(),
})

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>

// ── Post ──────────────────────────────────────────────────────────────────

export const CreatePostSchema = z.object({
  type: z.enum(['text', 'image', 'video', 'reel', 'story']),
  body: z.string().max(3000).optional(),
  mediaUrls: z.array(z.string().url()).max(10).default([]),
  visibility: z.enum(['public', 'followers', 'community', 'private']).default('public'),
  petProfileId: z.string().uuid().optional(),
})

export type CreatePost = z.infer<typeof CreatePostSchema>

// ── Pet ───────────────────────────────────────────────────────────────────

export const CreatePetProfileSchema = z.object({
  name: z.string().min(1).max(50),
  species: z.enum([
    'dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea_pig',
    'fish', 'reptile', 'horse', 'farm_animal', 'exotic', 'other',
  ]),
  breed: z.string().max(100).optional(),
  dateOfBirth: z.string().date().optional(),
  bio: z.string().max(500).optional(),
})

export type CreatePetProfile = z.infer<typeof CreatePetProfileSchema>

// ── Lost & Found ──────────────────────────────────────────────────────────

export const CreateLostFoundReportSchema = z.object({
  status: z.enum(['lost', 'found']),
  species: z.enum([
    'dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea_pig',
    'fish', 'reptile', 'horse', 'farm_animal', 'exotic', 'other',
  ]),
  description: z.string().min(10).max(1000),
  photoUrls: z.array(z.string().url()).max(5).default([]),
  lastSeenLocation: z.string().min(3).max(200),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  contactInfo: z.string().min(5).max(200),
})

export type CreateLostFoundReport = z.infer<typeof CreateLostFoundReportSchema>

// ── Messaging ─────────────────────────────────────────────────────────────

export const SendMessageSchema = z.object({
  body: z.string().max(4000).optional(),
  mediaUrls: z.array(z.string().url()).max(5).default([]),
}).refine(
  (data) => data.body !== undefined || data.mediaUrls.length > 0,
  { message: 'Message must have body or media' },
)

export type SendMessage = z.infer<typeof SendMessageSchema>
