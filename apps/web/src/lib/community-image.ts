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
