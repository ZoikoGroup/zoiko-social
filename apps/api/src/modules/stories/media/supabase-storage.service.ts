import { Injectable, Logger } from '@nestjs/common'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import { ConfigService } from '../../config/config.service'
import type { MediaStorage, SignedUploadResult } from './media-storage.interface'

const BUCKET = 'post-media'
const SIGNED_READ_TTL = 3600 // 1 hour

/**
 * SupabaseStorage — implements MediaStorage using Supabase Storage.
 *
 * Uses the service-role client so it bypasses RLS (the API is the authority).
 * Paths are prefixed with `{userId}/stories/` to satisfy the owner-path
 * convention used by the `post-media` bucket's RLS policies.
 *
 * When Cloudflare R2 replaces Supabase Storage, swap this class — the
 * MediaStorage interface and all callers stay the same.
 */
@Injectable()
export class SupabaseStorage implements MediaStorage {
  private readonly logger = new Logger(SupabaseStorage.name)
  private readonly supabase: SupabaseClient

  constructor(private readonly config: ConfigService) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })
  }

  async createUploadUrl(userId: string, filename: string, mime: string): Promise<SignedUploadResult> {
    const ext = filename.includes('.') ? filename.split('.').pop()! : mime.split('/')[1] ?? 'bin'
    const path = `${userId}/stories/${crypto.randomUUID()}.${ext}`

    // Create pre-signed upload URL for direct PUT
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path)

    if (error || !data) {
      this.logger.error(`Failed to create signed upload URL: ${error?.message}`)
      throw new Error('Failed to create upload URL')
    }

    return {
      uploadUrl: data.signedUrl,
      path,
      publicUrl: this.supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
    }
  }

  async uploadFile(
    localPath: string,
    destPath: string,
    contentType: string,
  ): Promise<{ path: string; publicUrl: string }> {
    const body = await fs.promises.readFile(localPath)

    const { error } = await this.supabase.storage
      .from(BUCKET)
      .upload(destPath, body, { contentType, upsert: true, cacheControl: '31536000' })

    if (error) {
      this.logger.error(`Failed to upload ${destPath}: ${error.message}`)
      throw new Error(`Failed to upload ${destPath}`)
    }

    return {
      path: destPath,
      publicUrl: this.supabase.storage.from(BUCKET).getPublicUrl(destPath).data.publicUrl,
    }
  }

  async createSignedReadUrl(path: string, ttlSeconds = SIGNED_READ_TTL): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, ttlSeconds)

    if (error || !data) {
      // Fall back to public URL if signed URL fails
      this.logger.warn(`Failed to create signed read URL, falling back: ${error?.message}`)
      return this.supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
    }

    return data.signedUrl
  }

  async delete(paths: string[]): Promise<void> {
    if (paths.length === 0) return

    const { error } = await this.supabase.storage.from(BUCKET).remove(paths)

    if (error) {
      this.logger.error(`Failed to delete storage objects: ${error.message}`)
      throw new Error('Failed to delete storage objects')
    }
  }
}
