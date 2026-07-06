/**
 * MediaStorage — adapter interface for story media storage.
 *
 * The active implementation uses Supabase Storage (matching the existing
 * `post-media` bucket and owner-path RLS conventions). When Cloudflare R2
 * is adopted, swap the provider via the `MediaStorage` token — no callers
 * change.
 *
 * @see docs/stories-architecture.md §4
 */

export interface SignedUploadResult {
  /** Pre-signed PUT URL the client uses to upload bytes directly. */
  uploadUrl: string
  /** Storage path (used as the key for subsequent reads / deletes). */
  path: string
  /** Public URL for immediate reads (or signed equivalent after upload). */
  publicUrl: string
}

export interface MediaStorage {
  /**
   * Create a pre-signed upload URL for direct client-to-storage upload.
   * The path follows `{userId}/stories/{uuid}.{ext}` to satisfy the
   * owner-path RLS convention.
   */
  createUploadUrl(userId: string, filename: string, mime: string): Promise<SignedUploadResult>

  /**
   * Upload a local file (produced by the transcode worker) to storage at the
   * given destination path. Returns the object's path and public URL.
   * Used to persist HLS renditions, mp4 fallback, poster and preview.
   */
  uploadFile(localPath: string, destPath: string, contentType: string): Promise<{ path: string; publicUrl: string }>

  /**
   * Create a signed read URL for a private object (or return the public
   * URL for public buckets). Used to serve renditions that shouldn't be
   * hot-linked.
   */
  createSignedReadUrl(path: string, ttlSeconds?: number): Promise<string>

  /**
   * Delete one or more objects from storage. Used when a story fails
   * processing or is deleted.
   */
  delete(paths: string[]): Promise<void>
}
