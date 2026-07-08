import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class MessageRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async getPrivacySettings(userId: string) {
    let privacy = await this.prisma.userPrivacy.findUnique({
      where: { userId },
    })

    if (!privacy) {
      privacy = await this.prisma.userPrivacy.create({
        data: { userId },
      })
    }

    return {
      whoCanMessage: privacy.whoCanMessage,
      whoCanSendMessageRequest: privacy.whoCanSendMessageRequest,
      whoCanSeeOnlineStatus: privacy.whoCanSeeOnlineStatus,
      whoCanSeeLastSeen: privacy.whoCanSeeLastSeen,
      showReadReceipts: privacy.showReadReceipts,
      showTypingIndicator: privacy.showTypingIndicator,
      messageRequestExpiry: privacy.messageRequestExpiry,
    }
  }

  async updatePrivacySettings(userId: string, input: Record<string, unknown>) {
    await this.prisma.userPrivacy.upsert({
      where: { userId },
      create: { userId, ...input } as never,
      update: input as never,
    })

    return this.getPrivacySettings(userId)
  }
}
