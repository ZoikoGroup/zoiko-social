import { Injectable, Logger } from '@nestjs/common'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ConfigService } from '../config/config.service'

const CHAT_BUCKET = 'chat-media'

/**
 * SupabaseStorageService — chat media storage backed by Supabase Storage.
 *
 * Chat images/videos/documents are uploaded via Supabase signed upload URLs:
 * the API (service-role) mints a one-shot signed URL, the browser PUTs the file
 * straight to it, and the resulting public URL is stored on the attachment.
 *
 * Paths are `{userId}/chat/{uuid}.{ext}` so the first segment is the owner,
 * matching the owner-path RLS convention used across the storage buckets.
 */
@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name)
  private readonly client: SupabaseClient | null = null
  private readonly bucket = CHAT_BUCKET

  constructor(private readonly config: ConfigService) {
    if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
      this.logger.warn('Supabase credentials not configured — chat uploads disabled')
      return
    }
    this.client = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })
    this.logger.log(`Supabase storage client initialised (bucket: ${this.bucket})`)
  }

  get isEnabled(): boolean {
    return this.client !== null
  }

  generateKey(userId: string, mimeType: string): string {
    const ext = mimeType.split('/')[1] ?? 'bin'
    const id = crypto.randomUUID()
    return `${userId}/chat/${id}.${ext}`
  }

  async getPresignedUploadUrl(key: string): Promise<string> {
    if (!this.client) throw new Error('Supabase storage not configured')
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUploadUrl(key)

    if (error || !data) {
      this.logger.error(`Failed to create signed upload URL: ${error?.message}`)
      throw new Error('Failed to create upload URL')
    }
    return data.signedUrl
  }

  getPublicUrl(key: string): string {
    if (!this.client) return key
    return this.client.storage.from(this.bucket).getPublicUrl(key).data.publicUrl
  }

  async delete(key: string): Promise<void> {
    if (!this.client) return
    const { error } = await this.client.storage.from(this.bucket).remove([key])
    if (error) {
      this.logger.error(`Failed to delete ${key}: ${error.message}`)
    }
  }
}
