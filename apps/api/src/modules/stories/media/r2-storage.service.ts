import { Injectable, Logger } from '@nestjs/common'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import * as fs from 'fs'
import { ConfigService } from '../../config/config.service'
import type { MediaStorage, SignedUploadResult } from './media-storage.interface'

const SIGNED_READ_TTL = 3600 // 1 hour

/**
 * R2Storage — Cloudflare R2 implementation of MediaStorage (S3-compatible).
 *
 * Activated by StorageProvider when all R2_* env vars are present. Story/media
 * paths follow `{userId}/stories/…` so client-direct uploads stay scoped per
 * user. Reads are served from R2_PUBLIC_URL (CDN) or signed if the bucket is
 * private.
 *
 * @see docs/stories-architecture.md §4
 */
@Injectable()
export class R2Storage implements MediaStorage {
  private readonly logger = new Logger(R2Storage.name)
  private readonly client: S3Client
  private readonly bucket: string
  private readonly publicBase: string

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.env.R2_ACCOUNT_ID!
    this.bucket = this.config.env.R2_BUCKET!
    this.publicBase = (this.config.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: this.config.env.R2_SECRET_ACCESS_KEY!,
      },
    })
    this.logger.log('R2Storage active')
  }

  async createUploadUrl(userId: string, filename: string, mime: string): Promise<SignedUploadResult> {
    const ext = filename.includes('.') ? filename.split('.').pop()! : mime.split('/')[1] ?? 'bin'
    const path = `${userId}/stories/${crypto.randomUUID()}.${ext}`
    const uploadUrl = await getSignedUrl(
      this.client,
      new PutObjectCommand({ Bucket: this.bucket, Key: path, ContentType: mime }),
      { expiresIn: 900 },
    )
    return { uploadUrl, path, publicUrl: `${this.publicBase}/${path}` }
  }

  async uploadFile(
    localPath: string,
    destPath: string,
    contentType: string,
  ): Promise<{ path: string; publicUrl: string }> {
    const body = await fs.promises.readFile(localPath)
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: destPath,
        Body: body,
        ContentType: contentType,
        CacheControl: '31536000, immutable',
      }),
    )
    return { path: destPath, publicUrl: `${this.publicBase}/${destPath}` }
  }

  async createSignedReadUrl(path: string, ttlSeconds = SIGNED_READ_TTL): Promise<string> {
    // Public bucket (CDN) → return the public URL directly. Fall back to a
    // signed GET only if you serve from a private bucket.
    if (this.publicBase) return `${this.publicBase}/${path}`
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: path }),
      { expiresIn: ttlSeconds },
    )
  }

  async delete(paths: string[]): Promise<void> {
    if (paths.length === 0) return
    await this.client.send(
      new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: { Objects: paths.map((Key) => ({ Key })) },
      }),
    )
  }
}
