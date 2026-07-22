import { processImage } from '@/lib/image'
import { createClient } from '@/lib/supabase/client'

/**
 * Uploads a community avatar or cover to storage under the uploader's own
 * folder (satisfies the post-media bucket owner-path RLS) and returns the
 * public URL. Reuses the resize→WebP pipeline used for post/profile images.
 */
export async function uploadCommunityImage(
  userId: string,
  file: File,
  kind: 'avatar' | 'cover',
): Promise<string> {
  const maxEdge = kind === 'cover' ? 1280 : 400
  const processed = await processImage(file, maxEdge)
  const supabase = createClient()
  const path = `${userId}/community-${kind}-${Date.now()}.webp`
  const { error } = await supabase.storage.from('post-media').upload(path, processed.blob, {
    contentType: 'image/webp',
    cacheControl: '31536000',
  })
  if (error) throw new Error(`Upload failed: ${error.message}`)
  return supabase.storage.from('post-media').getPublicUrl(path).data.publicUrl
}

/**
 * Uploads a short featured video (e.g. an event trailer) to storage under the
 * uploader's own folder and returns the public URL. Raw upload — no transcoding.
 * Caps at 50MB (Supabase default object limit) and accepts video/* only.
 */
export async function uploadEventVideo(userId: string, file: File): Promise<string> {
  if (!file.type.startsWith('video/')) throw new Error('Please choose a video file')
  if (file.size > 50 * 1024 * 1024) throw new Error('Video must be under 50MB')
  const supabase = createClient()
  const ext = (file.name.split('.').pop() ?? 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4'
  const path = `${userId}/event-video-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('post-media').upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
  })
  if (error) throw new Error(`Upload failed: ${error.message}`)
  return supabase.storage.from('post-media').getPublicUrl(path).data.publicUrl
}
