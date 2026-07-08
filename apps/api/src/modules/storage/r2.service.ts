import { Injectable, Logger } from '@nestjs/common'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ConfigService } from '../config/config.service'

@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name)
  private readonly client: S3Client | null = null
  private readonly bucket: string

  constructor(private readonly config: ConfigService) {
    this.bucket = config.r2BucketName
    const accountId = config.r2AccountId
    const accessKeyId = config.r2AccessKeyId
    const secretAccessKey = config.r2SecretAccessKey

    if (!accountId || !accessKeyId || !secretAccessKey) {
      this.logger.warn('R2 credentials not configured — uploads disabled')
      return
    }

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    })
    this.logger.log('R2 storage client initialised')
  }

  get isEnabled(): boolean {
    return this.client !== null
  }

  async upload(key: string, body: Buffer, contentType: string): Promise<string> {
    if (!this.client) throw new Error('R2 not configured')
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    )
    const publicUrl = this.config.r2PublicUrl
    return publicUrl ? `${publicUrl}/${key}` : key
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    if (!this.client) throw new Error('R2 not configured')
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn },
    )
  }

  async getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
    if (!this.client) throw new Error('R2 not configured')
    return getSignedUrl(
      this.client,
      new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType }),
      { expiresIn },
    )
  }

  getPublicUrl(key: string): string {
    const publicUrl = this.config.r2PublicUrl
    if (publicUrl) return `${publicUrl}/${key}`
    return key
  }

  async delete(key: string): Promise<void> {
    if (!this.client) return
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }

  generateKey(userId: string, mimeType: string): string {
    const ext = mimeType.split('/')[1] ?? 'bin'
    const id = crypto.randomUUID()
    return `messaging/${userId}/${id}.${ext}`
  }
}
