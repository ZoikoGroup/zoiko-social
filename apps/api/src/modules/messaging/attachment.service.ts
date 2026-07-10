import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

@Injectable()
export class AttachmentService {
  private readonly logger = new Logger(AttachmentService.name)

  constructor(private readonly prisma: PrismaService) {}

  validateFile(mimeType: string, size: number): void {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException({
        code: 'INVALID_FILE_TYPE',
        message: `File type ${mimeType} is not supported`,
      })
    }
    if (size > MAX_FILE_SIZE) {
      throw new BadRequestException({
        code: 'FILE_TOO_LARGE',
        message: 'File exceeds maximum size of 100MB',
      })
    }
  }

  getTypeFromMime(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType === 'application/pdf' || mimeType.includes('document')) return 'document'
    if (mimeType === 'image/gif') return 'gif'
    return 'document'
  }

  async createAttachment(messageId: string, file: { url: string; type: string; fileName?: string; fileSize?: number; mimeType?: string; width?: number; height?: number; duration?: number; isVoiceNote?: boolean }) {
    return this.prisma.messageAttachment.create({
      data: {
        messageId,
        type: file.type,
        url: file.url,
        fileName: file.fileName ?? null,
        fileSize: file.fileSize ?? null,
        mimeType: file.mimeType ?? null,
        width: file.width ?? null,
        height: file.height ?? null,
        duration: file.duration ?? null,
        isVoiceNote: file.isVoiceNote ?? false,
      },
    })
  }
}
